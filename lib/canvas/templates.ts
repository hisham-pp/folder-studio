/**
 * Core Folder Geometry and Template Renderers
 * Implements authentic Windows 11 Fluent folder vectors, Media Poster folders,
 * macOS squircle folders, Neon cyberpunk folders, and Minimalist folders.
 */

import { FolderConfig, FolderColors } from '@/types/folder';

// 256x256 Coordinate space for accurate vector scaling
export const REF_SIZE = 256;

// Authentic Windows 11 Fluent Folder Path Data (viewBox 0 0 256 256)
export const WIN11_PATHS = {
  // Back cover with tab
  BACK_COVER: 'M104.425 42.3784C100.056 37.0733 93.5437 34 86.6712 34H29C22.3726 34 17 39.3726 17 46V58.1371V68.2V160C17 166.627 22.3726 172 29 172H229C235.627 172 241 166.627 241 160V70.1371C241 63.5097 235.627 58.1371 229 58.1371H117.404L104.425 42.3784Z',
  
  // Front cover with signature Windows 11 top dip
  FRONT_COVER: 'M92.789 74C97.7642 74 102.605 72.3868 106.586 69.4024L116.459 62H229C235.627 62 241 67.3726 241 74V108V198C241 204.627 235.627 210 229 210H29C22.3726 210 17 204.627 17 198L17 108V86C17 79.3726 22.3726 74 29 74H87H92.789Z',

  // Inner flap shadow between back and front
  INNER_SHADOW: 'M92.789 74C97.7642 74 102.605 72.3868 106.586 69.4024L116.459 62H229C235.627 62 241 67.3726 241 74V108V160C241 166.627 235.627 172 229 172H29C22.3726 172 17 166.627 17 160L17 108V86C17 79.3726 22.3726 74 29 74H87H92.789Z',

  // Border seam dividing top tab from bottom front cover
  FRONT_SEAM: 'M17 86C17 79.3726 22.3726 74 29 74H87H92.789C97.7642 74 102.605 72.3868 106.586 69.4024L116.459 62H229C235.627 62 241 67.3726 241 74',
};

/**
 * Scale factor for arbitrary canvas sizes
 */
export function getScale(size: number): number {
  return size / REF_SIZE;
}

/**
 * Windows 11 Fluent Folder Renderer
 */
export function drawWindows11Base(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: FolderColors,
  effects: FolderConfig['effects']
): void {
  const s = getScale(size);

  ctx.save();
  ctx.scale(s, s);

  // 1. Ambient Drop Shadow under entire folder
  if (effects.dropShadow) {
    ctx.save();
    ctx.shadowColor = colors.shadow || 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = colors.base;
    const backPath = new Path2D(WIN11_PATHS.BACK_COVER);
    ctx.fill(backPath);
    ctx.restore();
  }

  // 2. Draw Back Cover with Tab
  const backCoverPath = new Path2D(WIN11_PATHS.BACK_COVER);
  const backGrad = ctx.createLinearGradient(17, 34, 198, 172);
  backGrad.addColorStop(0, colors.top || colors.base);
  backGrad.addColorStop(1, colors.base);
  ctx.fillStyle = backGrad;
  ctx.fill(backCoverPath);

  // Back cover top edge highlight
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.2;
  ctx.stroke(backCoverPath);
  ctx.restore();

  // 3. Optional Paper / Documents Sheet Peek inside the folder
  if (effects.paperPeek) {
    drawPaperSheet(ctx);
  }

  // 4. Inner Shadow between back cover and front flap
  const innerShadowPath = new Path2D(WIN11_PATHS.INNER_SHADOW);
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.filter = 'blur(6px)';
  ctx.fill(innerShadowPath);
  ctx.restore();

  // 5. Front Flap Drop Shadow onto background
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  const frontCoverPath = new Path2D(WIN11_PATHS.FRONT_COVER);
  ctx.fillStyle = colors.front || colors.base;
  ctx.fill(frontCoverPath);
  ctx.restore();

  // 6. Front Flap Gradient
  const frontGrad = ctx.createLinearGradient(17, 62, 241, 210);
  frontGrad.addColorStop(0, colors.front || colors.top);
  frontGrad.addColorStop(1, colors.base);
  ctx.fillStyle = frontGrad;
  ctx.fill(frontCoverPath);

  // 7. Subtle inner top highlight on front flap (Signature Windows 11 bevel)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.2;
  ctx.stroke(frontCoverPath);
  ctx.restore();

  // 8. Bottom shadow rim on front flap
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(29, 210);
  ctx.lineTo(229, 210);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

/**
 * Draws a clean paper / document sheet peeking from inside the folder opening
 */
function drawPaperSheet(ctx: CanvasRenderingContext2D): void {
  ctx.save();
  
  // Paper sheet drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  // Paper body
  const paperGrad = ctx.createLinearGradient(40, 48, 215, 120);
  paperGrad.addColorStop(0, '#ffffff');
  paperGrad.addColorStop(1, '#e8ecf2');
  ctx.fillStyle = paperGrad;

  // Rounded paper sheet
  drawRoundedRectPath(ctx, 42, 48, 172, 70, 6);
  ctx.fill();

  // Paper lines (document appearance)
  ctx.strokeStyle = 'rgba(180, 195, 215, 0.6)';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';

  ctx.beginPath();
  ctx.moveTo(56, 62);
  ctx.lineTo(130, 62);

  ctx.moveTo(56, 72);
  ctx.lineTo(165, 72);

  ctx.moveTo(56, 82);
  ctx.lineTo(145, 82);
  ctx.stroke();

  ctx.restore();
}

/**
 * Media / Entertainment Poster Folder Renderer
 * Tailored for Movie, Series, Anime, Games folders with glossy reflection
 */
export function drawPosterFolderBase(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: FolderColors,
  effects: FolderConfig['effects']
): void {
  const s = getScale(size);

  ctx.save();
  ctx.scale(s, s);

  // Outer shadow
  if (effects.dropShadow) {
    ctx.shadowColor = colors.shadow || 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 14;
  }

  // Folder Back / Shell
  const shellGrad = ctx.createLinearGradient(16, 26, 240, 230);
  shellGrad.addColorStop(0, colors.top);
  shellGrad.addColorStop(1, colors.base);
  ctx.fillStyle = shellGrad;

  // Outer tab + body shape
  ctx.beginPath();
  // Tab top-left
  ctx.moveTo(28, 28);
  ctx.lineTo(120, 28);
  // Tab slant
  ctx.arcTo(134, 28, 142, 46, 8);
  ctx.lineTo(142, 46);
  ctx.lineTo(230, 46);
  ctx.arcTo(242, 46, 242, 58, 10);
  ctx.lineTo(242, 220);
  ctx.arcTo(242, 232, 230, 232, 12);
  ctx.lineTo(26, 232);
  ctx.arcTo(14, 232, 14, 220, 12);
  ctx.lineTo(14, 40);
  ctx.arcTo(14, 28, 28, 28, 10);
  ctx.closePath();
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';

  // Embossed border around tab
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Front Poster Inset / Frame (Screen / Canvas recess)
  const frameGrad = ctx.createLinearGradient(20, 56, 236, 224);
  frameGrad.addColorStop(0, 'rgba(0, 0, 0, 0.45)');
  frameGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
  ctx.fillStyle = frameGrad;
  drawRoundedRectPath(ctx, 22, 54, 212, 170, 8);
  ctx.fill();

  ctx.restore();
}

/**
 * macOS Sonoma / Big Sur Squircle Folder Renderer
 */
export function drawMacOSFolderBase(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: FolderColors,
  effects: FolderConfig['effects']
): void {
  const s = getScale(size);

  ctx.save();
  ctx.scale(s, s);

  if (effects.dropShadow) {
    ctx.shadowColor = colors.shadow || 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 10;
  }

  // macOS Tab Back
  const backGrad = ctx.createLinearGradient(20, 36, 236, 218);
  backGrad.addColorStop(0, colors.top);
  backGrad.addColorStop(1, colors.base);
  ctx.fillStyle = backGrad;

  // Back flap path
  ctx.beginPath();
  ctx.moveTo(34, 38);
  ctx.lineTo(108, 38);
  ctx.bezierCurveTo(118, 38, 122, 52, 134, 52);
  ctx.lineTo(224, 52);
  ctx.arcTo(238, 52, 238, 66, 12);
  ctx.lineTo(238, 170);
  ctx.arcTo(238, 184, 224, 184, 12);
  ctx.lineTo(32, 184);
  ctx.arcTo(18, 184, 18, 170, 12);
  ctx.lineTo(18, 52);
  ctx.arcTo(18, 38, 34, 38, 12);
  ctx.closePath();
  ctx.fill();

  // macOS Front Flap (with lower horizontal groove)
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 4;

  const frontGrad = ctx.createLinearGradient(18, 68, 238, 218);
  frontGrad.addColorStop(0, colors.front || colors.top);
  frontGrad.addColorStop(1, colors.base);
  ctx.fillStyle = frontGrad;

  drawRoundedRectPath(ctx, 18, 70, 220, 148, 12);
  ctx.fill();

  ctx.shadowColor = 'transparent';

  // Signature Apple Debossed Horizontal Ridge
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(24, 82);
  ctx.lineTo(232, 82);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(24, 83.5);
  ctx.lineTo(232, 83.5);
  ctx.stroke();

  ctx.restore();
}

/**
 * Neon Cyberpunk Folder Renderer
 */
export function drawNeonFolderBase(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: FolderColors,
  effects: FolderConfig['effects']
): void {
  const s = getScale(size);

  ctx.save();
  ctx.scale(s, s);

  // Glow
  const glowColor = colors.glow || colors.accent || '#22d3ee';
  if (effects.neonGlow) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 25;
  }

  // Dark body
  ctx.fillStyle = colors.base || '#070b14';
  const folderPath = new Path2D(WIN11_PATHS.BACK_COVER);
  ctx.fill(folderPath);

  const frontPath = new Path2D(WIN11_PATHS.FRONT_COVER);
  ctx.fillStyle = colors.front || '#0b1329';
  ctx.fill(frontPath);

  // Neon glowing contours
  ctx.strokeStyle = glowColor;
  ctx.lineWidth = 2.2;
  ctx.stroke(frontPath);

  // Tab accent line
  ctx.strokeStyle = colors.accent || '#a855f7';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(22, 42);
  ctx.lineTo(88, 42);
  ctx.stroke();

  // Futuristic tech corner brackets
  drawTechBracket(ctx, 28, 80, 16, glowColor);
  drawTechBracket(ctx, 228, 80, -16, glowColor);

  ctx.restore();
}

/**
 * Draw tech corner decoration
 */
function drawTechBracket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dx: number,
  color: string
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + dx, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + 16);
  ctx.stroke();
  ctx.restore();
}

/**
 * Clean Minimalist Folder Renderer
 */
export function drawMinimalFolderBase(
  ctx: CanvasRenderingContext2D,
  size: number,
  colors: FolderColors,
  tabPos: FolderConfig['tabPosition'],
  effects: FolderConfig['effects']
): void {
  const s = getScale(size);

  ctx.save();
  ctx.scale(s, s);

  if (effects.dropShadow) {
    ctx.shadowColor = colors.shadow || 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 8;
  }

  const tabWidth = 84;
  let tabX = 22;
  if (tabPos === 'center') tabX = (256 - tabWidth) / 2;
  if (tabPos === 'right') tabX = 234 - tabWidth;

  // Tab
  ctx.fillStyle = colors.top;
  drawRoundedRectPath(ctx, tabX, 36, tabWidth, 40, 8);
  ctx.fill();

  // Back
  ctx.fillStyle = colors.base;
  drawRoundedRectPath(ctx, 22, 54, 212, 160, 12);
  ctx.fill();

  // Front Flap
  const frontGrad = ctx.createLinearGradient(22, 76, 234, 218);
  frontGrad.addColorStop(0, colors.front || colors.top);
  frontGrad.addColorStop(1, colors.base);
  ctx.fillStyle = frontGrad;
  drawRoundedRectPath(ctx, 22, 78, 212, 136, 12);
  ctx.fill();

  ctx.restore();
}

/**
 * Helper to draw a rounded rectangle path
 */
export function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/**
 * Draws glossy light streak reflection across the front cover
 */
export function drawGlossyReflection(
  ctx: CanvasRenderingContext2D,
  size: number
): void {
  const s = getScale(size);

  ctx.save();
  ctx.scale(s, s);

  ctx.beginPath();
  ctx.moveTo(22, 64);
  ctx.lineTo(190, 64);
  ctx.lineTo(80, 208);
  ctx.lineTo(22, 208);
  ctx.closePath();

  const gloss = ctx.createLinearGradient(22, 64, 180, 208);
  gloss.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
  gloss.addColorStop(0.5, 'rgba(255, 255, 255, 0.08)');
  gloss.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

  ctx.fillStyle = gloss;
  ctx.fill();

  ctx.restore();
}
