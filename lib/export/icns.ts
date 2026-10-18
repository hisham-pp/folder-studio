/**
 * Apple ICNS (macOS Icon) format export utilities
 * Wraps PNG icon representations into the standard Apple ICNS binary format.
 */

export interface ICNSChunk {
  type: string; // 4-char ostype, e.g. 'ic07', 'ic08', 'ic09', 'ic10'
  data: Uint8Array;
}

const ICNS_SIZE_MAP: { [size: number]: string } = {
  16: 'icp4',   // 16x16 PNG
  32: 'icp5',   // 32x32 PNG
  64: 'icp6',   // 64x64 PNG
  128: 'ic07',  // 128x128 PNG
  256: 'ic08',  // 256x256 PNG
  512: 'ic09',  // 512x512 PNG
  1024: 'ic10', // 1024x1024 / 512@2x PNG
};

/**
 * Converts a canvas to macOS .icns format
 */
export async function canvasToICNS(
  canvas: HTMLCanvasElement,
  sizes: number[] = [1024, 512, 256, 128, 64, 32, 16]
): Promise<Blob> {
  const chunks: ICNSChunk[] = [];

  for (const size of sizes) {
    const ostype = ICNS_SIZE_MAP[size];
    if (!ostype) continue;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) continue;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(canvas, 0, 0, size, size);

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      tempCanvas.toBlob((b) => resolve(b), 'image/png');
    });
    if (!pngBlob) continue;

    const arrayBuffer = await pngBlob.arrayBuffer();
    chunks.push({
      type: ostype,
      data: new Uint8Array(arrayBuffer),
    });
  }

  // Calculate total size: 8 bytes ICNS header + (8 bytes header + data.length) per chunk
  let totalSize = 8;
  for (const chunk of chunks) {
    totalSize += 8 + chunk.data.length;
  }

  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  // Magic header: 'icns' (Big-endian)
  bytes[0] = 0x69; // 'i'
  bytes[1] = 0x63; // 'c'
  bytes[2] = 0x6e; // 'n'
  bytes[3] = 0x73; // 's'
  view.setUint32(4, totalSize, false); // File length (Big-endian)

  let offset = 8;
  for (const chunk of chunks) {
    // 4-byte chunk type
    for (let c = 0; c < 4; c++) {
      bytes[offset + c] = chunk.type.charCodeAt(c);
    }
    // 4-byte chunk length (including 8-byte chunk header)
    view.setUint32(offset + 4, 8 + chunk.data.length, false);
    offset += 8;

    // Chunk PNG payload
    bytes.set(chunk.data, offset);
    offset += chunk.data.length;
  }

  return new Blob([bytes as BlobPart], { type: 'image/x-icns' });
}
