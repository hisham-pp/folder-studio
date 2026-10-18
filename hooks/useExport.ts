/**
 * Custom hook for exporting folder icons
 */

import { useState, useCallback } from 'react';
import { ExportFormat, FolderConfig } from '@/types/folder';
import { exportCanvas } from '@/lib/export/saver';
import { renderFolderIconToCanvas } from '@/lib/canvas/renderer';

export function useExport(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  config?: FolderConfig
) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [lastExported, setLastExported] = useState<string | null>(null);

  const handleExport = useCallback(
    async (format: ExportFormat, size: number = 256) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setExportError('Canvas not ready');
        return;
      }

      setIsExporting(true);
      setExportError(null);

      try {
        const title = config?.title || 'folder';
        await exportCanvas(
          canvas,
          format,
          size,
          title,
          config
            ? async (targetCanvas, targetSize) => {
                await renderFolderIconToCanvas(targetCanvas, {
                  config,
                  size: targetSize,
                });
              }
            : undefined
        );
        setLastExported(`${title} (${format.toUpperCase()})`);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Export failed';
        setExportError(message);
        console.error('Export error:', error);
      } finally {
        setIsExporting(false);
      }
    },
    [canvasRef, config]
  );

  return {
    isExporting,
    exportError,
    lastExported,
    handleExport,
  };
}
