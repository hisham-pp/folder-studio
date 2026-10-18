/**
 * Built-in vector emblems library for Folder Studio
 * Standardized on 24x24 viewBox coordinates
 */

export interface EmblemItem {
  id: string;
  name: string;
  category: 'dev' | 'media' | 'system' | 'creative';
  path: string; // SVG path data (24x24 box)
}

export const EMBLEMS: EmblemItem[] = [
  // Developer
  {
    id: 'code',
    name: 'Code Brackets',
    category: 'dev',
    path: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  },
  {
    id: 'terminal',
    name: 'Terminal',
    category: 'dev',
    path: 'M4 17l6-5-6-5M12 19h8',
  },
  {
    id: 'git-branch',
    name: 'Git Branch',
    category: 'dev',
    path: 'M6 3v12M18 9a3 3 0 100-6 3 3 0 000 6zm-12 12a3 3 0 100-6 3 3 0 000 6zm0-12a3 3 0 100-6 3 3 0 000 6zm12 3a9 9 0 01-9 9',
  },
  {
    id: 'database',
    name: 'Database',
    category: 'dev',
    path: 'M4 6c0 1.657 3.582 3 8 3s8-1.343 8-3-3.582-3-8-3-8 1.343-8 3zm0 6c0 1.657 3.582 3 8 3s8-1.343 8-3M4 18c0 1.657 3.582 3 8 3s8-1.343 8-3M4 6v12c0 1.657 3.582 3 8 3s8-1.343 8-3V6',
  },
  {
    id: 'bug',
    name: 'Bug',
    category: 'dev',
    path: 'M8 2l2 2m4-2l-2 2M3 13h4m10 0h4M4 8l3 2m10-2l-3 2M4 18l3-2m10 2l-3-2M9 9h6a3 3 0 013 3v4a3 3 0 01-3 3H9a3 3 0 01-3-3v-4a3 3 0 013-3z',
  },
  {
    id: 'cpu',
    name: 'Processor',
    category: 'dev',
    path: 'M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zm2 4h6v6H9V9z',
  },
  {
    id: 'server',
    name: 'Server',
    category: 'dev',
    path: 'M4 4h16a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 9h16a2 2 0 012 2v3a2 2 0 01-2 2H4a2 2 0 01-2-2v-3a2 2 0 012-2zm2-7h.01M6 15h.01',
  },

  // Media & Entertainment
  {
    id: 'film',
    name: 'Film Strip',
    category: 'media',
    path: 'M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm0 4h16M4 16h16M8 4v4m0 8v4M16 4v4m0 8v4',
  },
  {
    id: 'play',
    name: 'Play Media',
    category: 'media',
    path: 'M5 3l14 9-14 9V3z',
  },
  {
    id: 'music',
    name: 'Music Note',
    category: 'media',
    path: 'M9 19V6l12-3v13M9 19a3 3 0 11-6 0 3 3 0 016 0zm12-3a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    id: 'headphones',
    name: 'Headphones',
    category: 'media',
    path: 'M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z',
  },
  {
    id: 'gamepad',
    name: 'Gaming',
    category: 'media',
    path: 'M6 11h4m-2-2v4m7-2h.01M17 13h.01M2 12a5 5 0 015-5h10a5 5 0 015 5v3a4 4 0 01-7.5 1.8l-1.5-2.8h-2l-1.5 2.8A4 4 0 012 15v-3z',
  },
  {
    id: 'camera',
    name: 'Photos / Camera',
    category: 'media',
    path: 'M3 7h3l2-3h8l2 3h3a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2zm9 11a4 4 0 100-8 4 4 0 000 8z',
  },
  {
    id: 'tv',
    name: 'TV / Series',
    category: 'media',
    path: 'M2 7h20a1 1 0 011 1v11a1 1 0 01-1 1H2a1 1 0 01-1-1V8a1 1 0 011-1zm6-4l4 4 4-4',
  },

  // Creative & Anime
  {
    id: 'star',
    name: 'Star',
    category: 'creative',
    path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  },
  {
    id: 'sparkles',
    name: 'Sparkles',
    category: 'creative',
    path: 'M12 2v4m0 12v4M2 12h4m12 0h4m-3.17-6.83l-2.83 2.83m-8 8l-2.83 2.83m13.66 0l-2.83-2.83m-8-8L4.83 5.17',
  },
  {
    id: 'heart',
    name: 'Heart',
    category: 'creative',
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
  {
    id: 'sword',
    name: 'Sword',
    category: 'creative',
    path: 'M14.5 17.5L3 6V3h3l11.5 11.5m-3 3l3 3M19 14l2 2-3 3-2-2',
  },
  {
    id: 'fire',
    name: 'Fire',
    category: 'creative',
    path: 'M12 2c0 4-4 6-4 10 0 3.31 2.69 6 6 6s6-2.69 6-6c0-6-8-8-8-10zm0 16c-1.66 0-3-1.34-3-3 0-2 2-3 3-5 1 2 3 3 3 5 0 1.66-1.34 3-3 3z',
  },
  {
    id: 'crown',
    name: 'Crown',
    category: 'creative',
    path: 'M2 18h20v2H2zm1-14l4 7 5-7 5 7 4-7v12H3z',
  },
  {
    id: 'palette',
    name: 'Art Palette',
    category: 'creative',
    path: 'M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.4-.45-.64-1.04-.64-1.66 0-1.38 1.12-2.5 2.5-2.5H18c3.31 0 6-2.69 6-6 0-4.96-4.49-8.67-12-7.67z',
  },

  // System & Office
  {
    id: 'folder-icon',
    name: 'Folder',
    category: 'system',
    path: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z',
  },
  {
    id: 'download',
    name: 'Downloads',
    category: 'system',
    path: 'M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5M12 4v12',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    category: 'system',
    path: 'M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z',
  },
  {
    id: 'lock',
    name: 'Private / Lock',
    category: 'system',
    path: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
  },
  {
    id: 'shield',
    name: 'Security Shield',
    category: 'system',
    path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  },
  {
    id: 'archive',
    name: 'Archive / Box',
    category: 'system',
    path: 'M3 3h18v4H3zm1 5h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V8zm6 3h4',
  },
  {
    id: 'briefcase',
    name: 'Work / Briefcase',
    category: 'system',
    path: 'M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2m4 0H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zm-8 4v2m-4-2v2m8-2v2',
  },
];

/**
 * Draw an SVG emblem path onto an HTML5 canvas context
 */
export function drawEmblem(
  ctx: CanvasRenderingContext2D,
  emblemId: string,
  centerX: number,
  centerY: number,
  size: number,
  color: string
): void {
  const emblem = EMBLEMS.find((e) => e.id === emblemId);
  if (!emblem) return;

  ctx.save();
  ctx.translate(centerX, centerY);

  // Normalized scale from 24x24 viewBox
  const scale = size / 24;
  ctx.scale(scale, scale);
  // Center the 24x24 box
  ctx.translate(-12, -12);

  const path = new Path2D(emblem.path);

  // Draw clean line stroke or fill
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 2;
  ctx.strokeStyle = color;
  ctx.stroke(path);

  // If star, heart, or fire, fill with a soft semi-transparent tint
  if (['star', 'heart', 'fire', 'shield', 'crown', 'play', 'folder-icon'].includes(emblemId)) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.25;
    ctx.fill(path);
  }

  ctx.restore();
}
