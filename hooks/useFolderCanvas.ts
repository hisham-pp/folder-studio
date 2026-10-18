/**
 * Custom hook for folder canvas rendering
 */

import { useRef, useEffect } from 'react';
import { FolderConfig } from '@/types/folder';
import { renderFolderIconToCanvas } from '@/lib/canvas/renderer';

export function useFolderCanvas(
  config: FolderConfig,
  externalRef?: React.RefObject<HTMLCanvasElement | null>,
  size: number = 512
) {
  const internalRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = externalRef || internalRef;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    renderFolderIconToCanvas(canvas, {
      config,
      size,
    });
  }, [config, size, canvasRef]);

  return canvasRef;
}
