/**
 * High-performance, standards-compliant ICO file generator
 * Conforms to the Microsoft Windows Icon (.ICO) format specification.
 * Supports multi-resolution mipmaps (16x16 up to 256x256) embedded in a single file,
 * which is required for proper Windows folder icon customization.
 */

export interface ICOImage {
  size: number;
  data: Uint8Array;
}

/**
 * Standard Windows icon sizes for complete shell integration
 * (Desktop, Explorer large/medium/small/details, Start menu, taskbar)
 */
export const WINDOWS_STANDARD_ICO_SIZES = [256, 128, 64, 48, 32, 24, 16] as const;

/**
 * Converts a canvas into a multi-resolution Windows ICO Blob.
 * If a custom renderFn is provided, each resolution is rendered natively
 * at that resolution for pixel-perfect sharpness. Otherwise, canvas is downscaled.
 */
export async function canvasToMultiResolutionICO(
  canvas: HTMLCanvasElement,
  sizes: number[] = [...WINDOWS_STANDARD_ICO_SIZES],
  renderFn?: (targetCanvas: HTMLCanvasElement, size: number) => void | Promise<void>
): Promise<Blob> {
  const images: ICOImage[] = [];

  // Sort descending by size (256 down to 16) - standard practice for Windows ICO
  const sortedSizes = [...sizes].filter((s) => s <= 256).sort((a, b) => b - a);

  for (const size of sortedSizes) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) continue;

    // Enable high-quality downsampling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (renderFn) {
      await renderFn(tempCanvas, size);
    } else {
      ctx.drawImage(canvas, 0, 0, size, size);
    }

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      tempCanvas.toBlob((b) => resolve(b), 'image/png');
    });

    if (!pngBlob) continue;

    const arrayBuffer = await pngBlob.arrayBuffer();
    const pngData = new Uint8Array(arrayBuffer);

    images.push({ size, data: pngData });
  }

  if (images.length === 0) {
    throw new Error('Failed to generate any images for ICO');
  }

  const icoData = createICOFile(images);
  return new Blob([icoData as BlobPart], { type: 'image/x-icon' });
}

/**
 * Converts a canvas to a single-resolution ICO file
 */
export async function canvasToICO(
  canvas: HTMLCanvasElement,
  size: number = 256
): Promise<Blob> {
  const clampedSize = Math.min(256, Math.max(16, size));
  return canvasToMultiResolutionICO(canvas, [clampedSize]);
}

/**
 * Builds the binary ICO file buffer from an array of PNG images
 *
 * Structure:
 * - ICONDIR (6 bytes):
 *     - reserved (WORD, 2 bytes) = 0
 *     - type (WORD, 2 bytes) = 1 (1 = icon, 2 = cursor)
 *     - count (WORD, 2 bytes) = number of images
 * - ICONDIRENTRY (16 bytes per image):
 *     - width (BYTE, 1 byte) = 0 for 256px
 *     - height (BYTE, 1 byte) = 0 for 256px
 *     - colorCount (BYTE, 1 byte) = 0
 *     - reserved (BYTE, 1 byte) = 0
 *     - planes (WORD, 2 bytes) = 1
 *     - bitCount (WORD, 2 bytes) = 32
 *     - bytesInRes (DWORD, 4 bytes) = size of image data
 *     - imageOffset (DWORD, 4 bytes) = offset from file start
 * - IMAGE DATA (PNG streams)
 */
export function createICOFile(images: ICOImage[]): Uint8Array {
  const HEADER_SIZE = 6;
  const DIR_ENTRY_SIZE = 16;
  const totalDirSize = HEADER_SIZE + images.length * DIR_ENTRY_SIZE;

  // Calculate total file size
  let totalDataSize = 0;
  for (const img of images) {
    totalDataSize += img.data.length;
  }

  const buffer = new ArrayBuffer(totalDirSize + totalDataSize);
  const view = new DataView(buffer);
  const byteBuffer = new Uint8Array(buffer);

  // Write ICONDIR Header
  view.setUint16(0, 0, true);              // Reserved
  view.setUint16(2, 1, true);              // Type: 1 = ICO
  view.setUint16(4, images.length, true);  // Number of images

  // Write ICONDIRENTRY list
  let currentOffset = totalDirSize;
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const entryOffset = HEADER_SIZE + i * DIR_ENTRY_SIZE;

    // In ICO specification: 0 means 256px
    const widthByte = img.size >= 256 ? 0 : img.size;
    const heightByte = img.size >= 256 ? 0 : img.size;

    view.setUint8(entryOffset + 0, widthByte);        // Width
    view.setUint8(entryOffset + 1, heightByte);       // Height
    view.setUint8(entryOffset + 2, 0);                // Color count (0 = no palette)
    view.setUint8(entryOffset + 3, 0);                // Reserved
    view.setUint16(entryOffset + 4, 1, true);         // Color planes (1)
    view.setUint16(entryOffset + 6, 32, true);        // Bits per pixel (32-bit RGBA)
    view.setUint32(entryOffset + 8, img.data.length, true); // Size of image data
    view.setUint32(entryOffset + 12, currentOffset, true);  // Image data offset

    // Copy PNG image data into place
    byteBuffer.set(img.data, currentOffset);
    currentOffset += img.data.length;
  }

  return byteBuffer;
}
