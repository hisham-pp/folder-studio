/**
 * Custom hook for image upload, drag-and-drop, and clipboard handling
 */

import { useState, useCallback, useEffect } from 'react';
import { handleFileUpload } from '@/lib/image/upload';
import { readImageFromClipboard } from '@/lib/image/clipboard';

const IMAGE_STORAGE_KEY = 'folder_studio_cached_image';

export function useImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cached image on mount
  useEffect(() => {
    try {
      const cached = sessionStorage.getItem(IMAGE_STORAGE_KEY) || localStorage.getItem(IMAGE_STORAGE_KEY);
      if (cached) {
        setImage(cached);
      }
    } catch {}
  }, []);

  const saveImageToCache = (dataUrl: string | null) => {
    try {
      if (dataUrl) {
        // Only cache in localStorage if under 2MB to avoid quota issues
        if (dataUrl.length < 2 * 1024 * 1024) {
          localStorage.setItem(IMAGE_STORAGE_KEY, dataUrl);
        } else {
          sessionStorage.setItem(IMAGE_STORAGE_KEY, dataUrl);
        }
      } else {
        localStorage.removeItem(IMAGE_STORAGE_KEY);
        sessionStorage.removeItem(IMAGE_STORAGE_KEY);
      }
    } catch {}
  };

  const uploadImage = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setError(null);

    try {
      const dataUrl = await handleFileUpload(event);
      if (dataUrl) {
        setImage(dataUrl);
        saveImageToCache(dataUrl);
      } else {
        setError('Failed to upload image');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFileDrop = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please drop an image file (PNG, JPG, WebP, SVG)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        saveImageToCache(result);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError('Failed to read dropped file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to process image');
      setIsLoading(false);
    }
  }, []);

  const pasteImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const dataUrl = await readImageFromClipboard();
      if (dataUrl) {
        setImage(dataUrl);
        saveImageToCache(dataUrl);
      } else {
        setError('No image found in clipboard. Copy an image and click Paste or press Ctrl+V.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to paste image');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadImageFromUrl = useCallback(async (url: string) => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      new URL(url);

      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error('Failed to get canvas context'));
              return;
            }

            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/png');
            setImage(dataUrl);
            saveImageToCache(dataUrl);
            resolve();
          } catch (err) {
            reject(err);
          }
        };

        img.onerror = () => {
          reject(new Error('Failed to load image from URL. Make sure CORS is enabled or use file upload.'));
        };

        img.src = url;
      });
    } catch (err) {
      if (err instanceof TypeError) {
        setError('Invalid URL format');
      } else {
        setError(err instanceof Error ? err.message : 'Failed to load image from URL');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setImage(null);
    saveImageToCache(null);
    setError(null);
  }, []);

  return {
    image,
    isLoading,
    error,
    uploadImage,
    handleFileDrop,
    pasteImage,
    loadImageFromUrl,
    clearImage,
    setImage,
  };
}
