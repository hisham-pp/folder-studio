/**
 * Unified Canvas Folder Renderer
 * Orchestrates template rendering, image compositing, vector emblems,
 * typography labels, and surface lighting effects.
 */

import { FolderConfig } from '@/types/folder';
import {
  REF_SIZE,
  getScale,
  drawWindows11Base,
  drawPosterFolderBase,
  drawMacOSFolderBase,
  drawNeonFolderBase,
  drawMinimalFolderBase,
  drawRoundedRectPath,
  drawGlossyReflection,
  WIN11_PATHS,
} from './templates';
import { drawEmblem } from './emblems';

export interface RenderFolderOptions {
  config: FolderConfig;
  size?: number;
  onComplete?: () => void;
}

// In-memory image cache to prevent flickers during real-time slider adjustments
const imageElementCache = new Map<string, HTMLImageElement>();

function getImage(src: string): Promise<HTMLImageElement> {
  if (imageElementCache.has(src)) {
    const cached = imageElementCache.get(src)!;
    if (cached.complete) return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementCache.set(src, img);
      resolve(img);
    };
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

/**
 * Main render function
 */
export async function renderFolderIconToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderFolderOptions
): Promise<void> {
  const { config, size = 512, onComplete } = options;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set physical dimensions
  canvas.width = size;
  canvas.height = size;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Setup high-quality smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const s = getScale(size);

  // 1. Draw Folder Template Base
  switch (config.template) {
    case 'windows11':
      drawWindows11Base(ctx, size, config.style.colors, config.effects);
      break;
    case 'poster':
      drawPosterFolderBase(ctx, size, config.style.colors, config.effects);
      break;
    case 'macos':
      drawMacOSFolderBase(ctx, size, config.style.colors, config.effects);
      break;
    case 'neon':
      drawNeonFolderBase(ctx, size, config.style.colors, config.effects);
      break;
    case 'minimal':
      drawMinimalFolderBase(
        ctx,
        size,
        config.style.colors,
        config.tabPosition,
        config.effects
      );
      break;
    default:
      drawWindows11Base(ctx, size, config.style.colors, config.effects);
      break;
  }

  // 2. Draw Texture Pattern if selected
  if (config.effects.texture !== 'none') {
    drawTextureOverlay(ctx, size, config.effects.texture);
  }

  // 3. Composite Image / Artwork if provided
  if (config.image) {
    try {
      const img = await getImage(config.image);
      renderCompositedImage(ctx, img, config, size);
    } catch (e) {
      console.warn('Failed to render folder image:', e);
    }
  }

  // 4. Draw Vector Emblem or Custom Emblem Logo
  if (config.emblem.enabled) {
    if (config.emblem.customImage) {
      try {
        const emblemImg = await getImage(config.emblem.customImage);
        renderCustomEmblemImage(ctx, emblemImg, config, size);
      } catch (e) {
        console.warn('Failed to load custom emblem:', e);
      }
    } else if (config.emblem.icon) {
      // Draw built-in vector emblem
      const centerX = (REF_SIZE / 2 + config.emblem.offsetX) * s;
      const centerY = (142 + config.emblem.offsetY) * s;
      const emblemSize = config.emblem.size * s;
      const emblemColor = config.emblem.color || config.style.colors.accent;

      drawEmblem(ctx, config.emblem.icon, centerX, centerY, emblemSize, emblemColor);
    }
  }

  // 5. Draw Surface Gloss Reflection
  if (config.effects.glossyReflection) {
    drawGlossyReflection(ctx, size);
  }

  // 6. Draw Title / Typography Label
  if (config.title && config.labelPosition !== 'none') {
    renderFolderLabel(ctx, config, size);
  }

  onComplete?.();
}

/**
 * Composite the uploaded image according to placement mode
 */
function renderCompositedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  config: FolderConfig,
  size: number
): void {
  const s = getScale(size);
  const adj = config.imageAdjustments;

  ctx.save();

  // Apply filters (brightness, contrast, opacity)
  ctx.filter = `brightness(${adj.brightness}%) contrast(${adj.contrast}%)`;
  ctx.globalAlpha = adj.opacity;

  if (config.imagePlacement === 'poster' || config.imagePlacement === 'full' || config.template === 'poster') {
    // Cover/Poster with support for top tab + bottom cover and separator border
    ctx.save();
    ctx.scale(s, s);

    const isFullSkin = adj.coverTopTab || config.imagePlacement === 'full';

    // Total folder reference bounds: x: 17 to 241 (w=224), y: 34 to 210 (h=176)
    const totalW = 224;
    const totalH = isFullSkin ? 176 : 148;
    const coverScale = Math.max(totalW / img.width, totalH / img.height) * adj.scale;
    const sw = img.width * coverScale;
    const sh = img.height * coverScale;
    const sx = 128 - sw / 2 + adj.offsetX;
    const sy = (isFullSkin ? 122 : 138) - sh / 2 + adj.offsetY;

    if (isFullSkin) {
      // 1. TOP TAB & BACK COVER PORTION
      ctx.save();
      if (config.template === 'windows11' || config.template === 'neon') {
        ctx.clip(new Path2D(WIN11_PATHS.BACK_COVER));
      } else if (config.template === 'macos') {
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
        ctx.clip();
      } else if (config.template === 'poster') {
        ctx.beginPath();
        ctx.moveTo(28, 28);
        ctx.lineTo(120, 28);
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
        ctx.clip();
      } else {
        drawRoundedRectPath(ctx, 22, 36, 212, 178, 12);
        ctx.clip();
      }

      // Draw image onto top tab & back
      ctx.drawImage(img, sx, sy, sw, sh);

      // Subtle dimming on the top tab for authentic 3D depth separation
      if (adj.tabDimming > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${adj.tabDimming / 100})`;
        ctx.fill();
      }
      ctx.restore();

      // Shadow cast under the tab onto front flap
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.filter = 'blur(6px)';
      ctx.fill(new Path2D(WIN11_PATHS.INNER_SHADOW));
      ctx.restore();
    }

    // 2. BOTTOM / FRONT FLAP PORTION
    ctx.save();
    if (config.template === 'windows11' || config.template === 'neon') {
      const clip = new Path2D(WIN11_PATHS.FRONT_COVER);
      ctx.clip(clip);
    } else if (config.template === 'macos') {
      drawRoundedRectPath(ctx, 18, 70, 220, 148, 12);
      ctx.clip();
    } else if (config.template === 'poster') {
      drawRoundedRectPath(ctx, 22, 54, 212, 170, 8);
      ctx.clip();
    } else {
      drawRoundedRectPath(ctx, 22, 78, 212, 136, 12);
      ctx.clip();
    }

    // Draw seamlessly aligned image on front flap
    ctx.drawImage(img, sx, sy, sw, sh);
    ctx.restore();

    // 3. THE BORDER BETWEEN TOP AND BOTTOM
    if (isFullSkin) {
      renderTabFrontBorder(ctx, config, adj);
    }

    ctx.restore();
  } else if (config.imagePlacement === 'framed') {
    // Framed Polaroid / Card style inside front cover
    ctx.save();
    ctx.scale(s, s);

    const frameX = 40;
    const frameY = 82;
    const frameW = 176;
    const frameH = 116;

    // Card shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    // Card border
    ctx.fillStyle = '#ffffff';
    drawRoundedRectPath(ctx, frameX, frameY, frameW, frameH, adj.borderRadius || 6);
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // Image inset inside card
    drawRoundedRectPath(ctx, frameX + 4, frameY + 4, frameW - 8, frameH - 8, 4);
    ctx.clip();

    const coverScale = Math.max((frameW - 8) / img.width, (frameH - 8) / img.height) * adj.scale;
    const sw = img.width * coverScale;
    const sh = img.height * coverScale;
    const sx = frameX + frameW / 2 - sw / 2 + adj.offsetX;
    const sy = frameY + frameH / 2 - sh / 2 + adj.offsetY;

    ctx.drawImage(img, sx, sy, sw, sh);
    ctx.restore();
  } else if (config.imagePlacement === 'insert') {
    // Document / Photo peeking from inside folder opening
    ctx.save();
    ctx.scale(s, s);

    const sheetX = 44;
    const sheetY = 46;
    const sheetW = 168;
    const sheetH = 80;

    drawRoundedRectPath(ctx, sheetX, sheetY, sheetW, sheetH, 6);
    ctx.clip();

    const coverScale = Math.max(sheetW / img.width, sheetH / img.height) * adj.scale;
    const sw = img.width * coverScale;
    const sh = img.height * coverScale;
    const sx = sheetX + sheetW / 2 - sw / 2 + adj.offsetX;
    const sy = sheetY + sheetH / 2 - sh / 2 + adj.offsetY;

    ctx.drawImage(img, sx, sy, sw, sh);
    ctx.restore();
  } else {
    // Emblem placement (centered stamp on front cover)
    ctx.save();
    ctx.scale(s, s);

    const targetDim = 72 * adj.scale;
    const centerX = 128 + adj.offsetX;
    const centerY = 142 + adj.offsetY;

    drawRoundedRectPath(
      ctx,
      centerX - targetDim / 2,
      centerY - targetDim / 2,
      targetDim,
      targetDim,
      adj.borderRadius || 12
    );
    ctx.clip();

    ctx.drawImage(
      img,
      centerX - targetDim / 2,
      centerY - targetDim / 2,
      targetDim,
      targetDim
    );
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Render stylish border separating top tab from bottom front cover
 */
function renderTabFrontBorder(
  ctx: CanvasRenderingContext2D,
  config: FolderConfig,
  adj: FolderConfig['imageAdjustments']
): void {
  ctx.save();

  const borderWidth = adj.tabBorderWidth ?? 2.5;
  const borderColor = adj.tabBorderColor || config.style.colors.accent || '#ffffff';

  if (config.template === 'windows11' || config.template === 'neon') {
    const seamPath = new Path2D(WIN11_PATHS.FRONT_SEAM);

    // Deep drop shadow behind the border line to clearly separate top from bottom
    ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 3;

    // Outer prominent border stroke
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke(seamPath);

    // High-contrast inner highlight bevel along the border
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = Math.max(1, borderWidth * 0.4);
    ctx.stroke(seamPath);
  } else if (config.template === 'poster') {
    // Media poster border line separating tab from poster
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.moveTo(14, 46);
    ctx.lineTo(242, 46);
    ctx.stroke();

    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(14, 47.5);
    ctx.lineTo(242, 47.5);
    ctx.stroke();
  } else if (config.template === 'macos') {
    // macOS border seam
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.moveTo(18, 70);
    ctx.lineTo(238, 70);
    ctx.stroke();
  } else {
    // Minimal border seam
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    ctx.beginPath();
    ctx.moveTo(22, 78);
    ctx.lineTo(234, 78);
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Render custom uploaded emblem logo
 */
function renderCustomEmblemImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  config: FolderConfig,
  size: number
): void {
  const s = getScale(size);
  const emblem = config.emblem;

  ctx.save();
  ctx.scale(s, s);

  const dim = emblem.size;
  const cx = 128 + emblem.offsetX;
  const cy = 142 + emblem.offsetY;

  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 2;

  ctx.drawImage(img, cx - dim / 2, cy - dim / 2, dim, dim);

  ctx.restore();
}

/**
 * Render typography label on tab or front
 */
function renderFolderLabel(
  ctx: CanvasRenderingContext2D,
  config: FolderConfig,
  size: number
): void {
  const s = getScale(size);

  ctx.save();
  ctx.scale(s, s);

  const title = config.title.trim().toUpperCase();
  const textColor = config.titleTextColor || '#ffffff';
  const fontWeight = config.fontWeight || '700';

  if (config.labelPosition === 'tab') {
    // Label on Folder Tab
    let tabCenterX = 64;
    let tabCenterY = 44;

    if (config.template === 'poster') {
      tabCenterX = 78;
      tabCenterY = 38;
    } else if (config.template === 'minimal') {
      if (config.tabPosition === 'center') tabCenterX = 128;
      if (config.tabPosition === 'right') tabCenterX = 192;
      tabCenterY = 56;
    }

    ctx.font = `${fontWeight} 13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text shadow for contrast
    ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;

    ctx.fillStyle = textColor;
    ctx.fillText(title, tabCenterX, tabCenterY);
  } else if (config.labelPosition === 'front-bottom') {
    // Embossed pill badge at bottom of front flap
    ctx.font = `${fontWeight} 12px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(title).width;
    const pillW = Math.max(textWidth + 24, 60);
    const pillH = 22;
    const pillX = 128 - pillW / 2;
    const pillY = 192;

    // Pill background
    ctx.fillStyle = config.titleBgColor || 'rgba(0, 0, 0, 0.6)';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;
    drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, 11);
    ctx.fill();

    // Text
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = textColor;
    ctx.fillText(title, 128, pillY + pillH / 2);
  } else if (config.labelPosition === 'front-center') {
    // Bold front banner
    ctx.font = `${fontWeight} 16px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    ctx.fillStyle = textColor;
    ctx.fillText(title, 128, 142);
  }

  ctx.restore();
}

/**
 * Draws pattern overlay
 */
function drawTextureOverlay(
  ctx: CanvasRenderingContext2D,
  size: number,
  texture: FolderConfig['effects']['texture']
): void {
  const s = getScale(size);

  ctx.save();
  ctx.scale(s, s);

  if (texture === 'grid') {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 20; x <= 240; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 60);
      ctx.lineTo(x, 210);
      ctx.stroke();
    }
    for (let y = 60; y <= 210; y += 16) {
      ctx.beginPath();
      ctx.moveTo(20, y);
      ctx.lineTo(240, y);
      ctx.stroke();
    }
  } else if (texture === 'dots') {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    for (let x = 30; x <= 230; x += 14) {
      for (let y = 70; y <= 200; y += 14) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  ctx.restore();
}
