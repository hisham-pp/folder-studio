/**
 * File saving utilities for Folder Studio
 */

import { saveAs } from 'file-saver';
import { ExportFormat } from '@/types/folder';
import { canvasToMultiResolutionICO, canvasToICO } from './ico';
import { canvasToPNGWithSize } from './png';
import { canvasToICNS } from './icns';

/**
 * Clean title for filename usage
 */
export function sanitizeFilename(name: string): string {
  const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, '-');
  return sanitized || 'folder-icon';
}

/**
 * Export canvas to chosen format and size
 */
export async function exportCanvas(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  size: number = 256,
  title: string = 'folder',
  renderFn?: (targetCanvas: HTMLCanvasElement, targetSize: number) => void | Promise<void>
): Promise<void> {
  const safeName = sanitizeFilename(title);

  try {
    let blob: Blob;
    let filename: string;

    if (format === 'ico-bundle') {
      // Standard Windows Multi-Resolution ICO Bundle (16, 24, 32, 48, 64, 128, 256)
      blob = await canvasToMultiResolutionICO(canvas, undefined, renderFn);
      filename = `${safeName}.ico`;
    } else if (format === 'ico') {
      // Single size ICO
      const clampedSize = Math.min(256, Math.max(16, size));
      blob = await canvasToICO(canvas, clampedSize);
      filename = `${safeName}-${clampedSize}x${clampedSize}.ico`;
    } else if (format === 'icns') {
      // macOS Apple ICNS format
      blob = await canvasToICNS(canvas);
      filename = `${safeName}.icns`;
    } else {
      // PNG format (supports 16 to 1024)
      blob = await canvasToPNGWithSize(canvas, size);
      filename = `${safeName}-${size}x${size}.png`;
    }

    saveAs(blob, filename);
  } catch (error) {
    console.error('Export failed:', error);
    throw new Error('Failed to export icon. Please try again.');
  }
}
