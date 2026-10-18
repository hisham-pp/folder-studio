/**
 * Custom hook for folder configuration state management with LocalStorage persistence
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  FolderConfig,
  FolderStyle,
  FolderTemplate,
  ImagePlacement,
  TabPosition,
  LabelPosition,
  ExportFormat,
  ImageAdjustments,
  EmblemConfig,
  FolderEffects,
} from '@/types/folder';
import { DEFAULT_FOLDER_CONFIG } from '@/constants/defaults';
import { FOLDER_STYLES } from '@/constants/styles';
import { EMBLEMS } from '@/lib/canvas/emblems';

const STORAGE_KEY = 'folder_studio_config_v2';

export function useFolderConfig() {
  const [config, setConfig] = useState<FolderConfig>({ ...DEFAULT_FOLDER_CONFIG });
  const [isHydrated, setIsHydrated] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Hydrate from localStorage on initial client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge stored values with defaults to guarantee all fields exist
        setConfig((prev) => ({
          ...DEFAULT_FOLDER_CONFIG,
          ...parsed,
          imageAdjustments: {
            ...DEFAULT_FOLDER_CONFIG.imageAdjustments,
            ...(parsed.imageAdjustments || {}),
          },
          emblem: {
            ...DEFAULT_FOLDER_CONFIG.emblem,
            ...(parsed.emblem || {}),
          },
          effects: {
            ...DEFAULT_FOLDER_CONFIG.effects,
            ...(parsed.effects || {}),
          },
          style: {
            ...DEFAULT_FOLDER_CONFIG.style,
            ...(parsed.style || {}),
            colors: {
              ...DEFAULT_FOLDER_CONFIG.style.colors,
              ...(parsed.style?.colors || {}),
            },
          },
        }));
      }
    } catch (e) {
      console.warn('Failed to load configuration from localStorage:', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Persist to localStorage whenever config changes (debounced)
  useEffect(() => {
    if (!isHydrated) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      try {
        // Do not persist huge base64 image strings in config storage to avoid quota limits
        const configToSave = {
          ...config,
          image: null, // Image is managed separately
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
      } catch (e) {
        console.warn('Failed to save configuration to localStorage:', e);
      }
    }, 400);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [config, isHydrated]);

  const setTemplate = useCallback((template: FolderTemplate) => {
    setConfig((prev) => ({
      ...prev,
      template,
      effects: {
        ...prev.effects,
        neonGlow: template === 'neon',
        paperPeek: template === 'windows11',
      },
    }));
  }, []);

  const setStyle = useCallback((styleValue: string) => {
    const style = FOLDER_STYLES.find((s) => s.value === styleValue);
    if (style) {
      setConfig((prev) => ({
        ...prev,
        style,
        titleBgColor: style.colors.base,
      }));
    }
  }, []);

  const setCustomColors = useCallback((colors: Partial<FolderStyle['colors']>) => {
    setConfig((prev) => ({
      ...prev,
      style: {
        ...prev.style,
        colors: {
          ...prev.style.colors,
          ...colors,
        },
      },
    }));
  }, []);

  const setTitle = useCallback((title: string) => {
    setConfig((prev) => ({ ...prev, title }));
  }, []);

  const setLabelPosition = useCallback((labelPosition: LabelPosition) => {
    setConfig((prev) => ({ ...prev, labelPosition }));
  }, []);

  const setFontWeight = useCallback((fontWeight: string) => {
    setConfig((prev) => ({ ...prev, fontWeight }));
  }, []);

  const setTitleTextColor = useCallback((titleTextColor: string) => {
    setConfig((prev) => ({ ...prev, titleTextColor }));
  }, []);

  const setTitleBgColor = useCallback((titleBgColor: string) => {
    setConfig((prev) => ({ ...prev, titleBgColor }));
  }, []);

  const setTabPosition = useCallback((tabPosition: TabPosition) => {
    setConfig((prev) => ({ ...prev, tabPosition }));
  }, []);

  const setImagePlacement = useCallback((imagePlacement: ImagePlacement) => {
    setConfig((prev) => ({ ...prev, imagePlacement }));
  }, []);

  const updateImageAdjustments = useCallback(
    (adjustments: Partial<ImageAdjustments>) => {
      setConfig((prev) => ({
        ...prev,
        imageAdjustments: {
          ...prev.imageAdjustments,
          ...adjustments,
        },
      }));
    },
    []
  );

  const updateEmblem = useCallback((emblemUpdates: Partial<EmblemConfig>) => {
    setConfig((prev) => ({
      ...prev,
      emblem: {
        ...prev.emblem,
        ...emblemUpdates,
      },
    }));
  }, []);

  const updateEffects = useCallback((effectsUpdates: Partial<FolderEffects>) => {
    setConfig((prev) => ({
      ...prev,
      effects: {
        ...prev.effects,
        ...effectsUpdates,
      },
    }));
  }, []);

  const setExportFormat = useCallback((exportFormat: ExportFormat) => {
    setConfig((prev) => ({ ...prev, exportFormat }));
  }, []);

  const resetConfig = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setConfig({ ...DEFAULT_FOLDER_CONFIG });
  }, []);

  const randomize = useCallback(() => {
    const randomStyle =
      FOLDER_STYLES[Math.floor(Math.random() * FOLDER_STYLES.length)];
    const templates: FolderTemplate[] = [
      'windows11',
      'poster',
      'macos',
      'neon',
      'minimal',
    ];
    const randomTemplate =
      templates[Math.floor(Math.random() * templates.length)];
    const randomEmblem =
      EMBLEMS[Math.floor(Math.random() * EMBLEMS.length)];

    setConfig((prev) => ({
      ...prev,
      template: randomTemplate,
      style: randomStyle,
      titleBgColor: randomStyle.colors.base,
      emblem: {
        ...prev.emblem,
        enabled: true,
        icon: randomEmblem.id,
        color: randomStyle.colors.accent,
      },
      effects: {
        ...prev.effects,
        neonGlow: randomTemplate === 'neon',
        paperPeek: randomTemplate === 'windows11',
      },
    }));
  }, []);

  return {
    config,
    setConfig,
    isHydrated,
    setTemplate,
    setStyle,
    setCustomColors,
    setTitle,
    setLabelPosition,
    setFontWeight,
    setTitleTextColor,
    setTitleBgColor,
    setTabPosition,
    setImagePlacement,
    updateImageAdjustments,
    updateEmblem,
    updateEffects,
    setExportFormat,
    resetConfig,
    randomize,
  };
}
