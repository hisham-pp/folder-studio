/**
 * Core type definitions for Folder Studio
 */

export type FolderTemplate = 'windows11' | 'poster' | 'macos' | 'neon' | 'minimal';
export type ImagePlacement = 'full' | 'poster' | 'emblem' | 'insert' | 'framed';
export type TabPosition = 'left' | 'center' | 'right';
export type LabelPosition = 'tab' | 'front-bottom' | 'front-center' | 'none';

/**
 * Folder style color scheme
 */
export interface FolderColors {
  base: string;     // Back cover / base color
  top: string;      // Tab color
  front: string;    // Front flap color / highlight
  accent: string;   // Outline or badge accent
  shadow: string;   // Drop shadow color
  glow?: string;    // Neon glow color
}

/**
 * Folder style configuration
 */
export interface FolderStyle {
  name: string;
  value: string;
  category?: 'windows' | 'macos' | 'neon' | 'anime' | 'film' | 'minimal';
  colors: FolderColors;
}

/**
 * Font weight configuration
 */
export interface FontWeight {
  name: string;
  value: string;
}

/**
 * Image adjustments
 */
export interface ImageAdjustments {
  scale: number;        // 0.5 to 2.5
  offsetX: number;      // -100 to 100
  offsetY: number;      // -100 to 100
  borderRadius: number; // 0 to 40
  opacity: number;      // 0 to 1
  brightness: number;   // 50 to 150 (%)
  contrast: number;     // 50 to 150 (%)
  coverTopTab: boolean; // Cover both top tab and bottom cover
  tabBorderWidth: number; // Border thickness between top and bottom (1 to 8px)
  tabBorderColor: string; // Border color between top and bottom
  tabDimming: number;   // 0 to 60% dimming of tab for 3D depth separation
}

/**
 * Built-in or custom emblem configuration
 */
export interface EmblemConfig {
  enabled: boolean;
  icon: string;         // e.g. 'code', 'terminal', 'gamepad', 'film', etc.
  customImage: string | null; // User custom emblem upload
  size: number;         // 20 to 160
  color: string;
  offsetX: number;
  offsetY: number;
}

/**
 * Visual effects on folder
 */
export interface FolderEffects {
  glossyReflection: boolean;
  paperPeek: boolean;
  neonGlow: boolean;
  dropShadow: boolean;
  texture: 'none' | 'dots' | 'grid' | 'stripes';
}

/**
 * Export format types
 * - 'ico-bundle': Multi-resolution Windows ICO (16, 24, 32, 48, 64, 128, 256) [Standard for Windows folders]
 * - 'ico': Single size ICO
 * - 'png': Standard PNG
 * - 'icns': Apple icon format
 */
export type ExportFormat = 'ico-bundle' | 'ico' | 'png' | 'icns';

/**
 * Export size configuration
 */
export interface ExportSize {
  name: string;
  value: number;
}

/**
 * Folder configuration state
 */
export interface FolderConfig {
  template: FolderTemplate;
  image: string | null;
  imagePlacement: ImagePlacement;
  imageAdjustments: ImageAdjustments;
  emblem: EmblemConfig;
  effects: FolderEffects;
  tabPosition: TabPosition;
  title: string;
  labelPosition: LabelPosition;
  style: FolderStyle;
  fontWeight: string;
  titleBgColor: string;
  titleTextColor: string;
  exportFormat: ExportFormat;
}

/**
 * Geometric point
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * Canvas rendering configuration
 */
export interface CanvasConfig {
  size: number;
  folderWidth: number;
  folderHeight: number;
  tabWidth: number;
  tabHeight: number;
  cornerRadius: number;
}

/**
 * Folder geometry points
 */
export interface FolderGeometry {
  P1: Point;
  P2: Point;
  P3: Point;
  P4: Point;
  P5: Point;
  P6: Point;
  P7: Point;
  P8: Point;
  folderX: number;
  folderY: number;
}
