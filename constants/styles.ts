/**
 * Folder style presets and configurations
 */

import { FolderStyle, FontWeight, ExportSize } from '@/types/folder';

/**
 * Curated Preset Themes for Folder Studio
 */
export const FOLDER_STYLES: FolderStyle[] = [
  // Windows 11 Fluent Presets
  {
    name: "Windows 11 Yellow",
    value: "win11-yellow",
    category: "windows",
    colors: {
      base: "#e5a700",
      top: "#f5c324",
      front: "#ffd74a",
      accent: "#b58100",
      shadow: "rgba(180, 130, 0, 0.45)",
      glow: "rgba(255, 215, 74, 0.3)",
    },
  },
  {
    name: "Windows 11 Cobalt",
    value: "win11-cobalt",
    category: "windows",
    colors: {
      base: "#0f52ba",
      top: "#1966d2",
      front: "#2979ff",
      accent: "#0b3c8a",
      shadow: "rgba(15, 82, 186, 0.45)",
      glow: "rgba(41, 121, 255, 0.3)",
    },
  },
  {
    name: "Windows 11 Dark",
    value: "win11-dark",
    category: "windows",
    colors: {
      base: "#1a1f2c",
      top: "#242b3d",
      front: "#313a52",
      accent: "#4d5b7c",
      shadow: "rgba(0, 0, 0, 0.6)",
      glow: "rgba(77, 91, 124, 0.2)",
    },
  },

  // macOS Styles
  {
    name: "macOS Sky Blue",
    value: "macos-blue",
    category: "macos",
    colors: {
      base: "#0288d1",
      top: "#29b6f6",
      front: "#4fc3f7",
      accent: "#01579b",
      shadow: "rgba(2, 136, 209, 0.4)",
      glow: "rgba(41, 182, 246, 0.3)",
    },
  },
  {
    name: "macOS Graphite",
    value: "macos-graphite",
    category: "macos",
    colors: {
      base: "#374151",
      top: "#4b5563",
      front: "#6b7280",
      accent: "#1f2937",
      shadow: "rgba(0, 0, 0, 0.5)",
      glow: "rgba(107, 114, 128, 0.2)",
    },
  },

  // Neon & Cyberpunk
  {
    name: "Cyberpunk Cyan",
    value: "neon-cyan",
    category: "neon",
    colors: {
      base: "#083344",
      top: "#0e7490",
      front: "#06b6d4",
      accent: "#22d3ee",
      shadow: "rgba(6, 182, 212, 0.55)",
      glow: "rgba(34, 211, 238, 0.8)",
    },
  },
  {
    name: "Neon Purple",
    value: "neon-purple",
    category: "neon",
    colors: {
      base: "#3b0764",
      top: "#7e22ce",
      front: "#a855f7",
      accent: "#c084fc",
      shadow: "rgba(168, 85, 247, 0.55)",
      glow: "rgba(192, 132, 252, 0.8)",
    },
  },
  {
    name: "Neon Pink",
    value: "neon-pink",
    category: "neon",
    colors: {
      base: "#500724",
      top: "#be185d",
      front: "#ec4899",
      accent: "#f472b6",
      shadow: "rgba(236, 72, 153, 0.55)",
      glow: "rgba(244, 114, 182, 0.8)",
    },
  },
  {
    name: "Vaporwave Sunset",
    value: "vaporwave",
    category: "neon",
    colors: {
      base: "#c026d3",
      top: "#f43f5e",
      front: "#fb923c",
      accent: "#fde047",
      shadow: "rgba(244, 63, 94, 0.5)",
      glow: "rgba(251, 146, 60, 0.7)",
    },
  },

  // Film & Media Poster Styles
  {
    name: "Netflix Crimson",
    value: "netflix-red",
    category: "film",
    colors: {
      base: "#450a0a",
      top: "#991b1b",
      front: "#dc2626",
      accent: "#ef4444",
      shadow: "rgba(220, 38, 38, 0.55)",
      glow: "rgba(239, 68, 68, 0.5)",
    },
  },
  {
    name: "Film Noir Gold",
    value: "film-gold",
    category: "film",
    colors: {
      base: "#1c1917",
      top: "#78350f",
      front: "#d97706",
      accent: "#fbbf24",
      shadow: "rgba(217, 119, 6, 0.45)",
      glow: "rgba(251, 191, 36, 0.4)",
    },
  },
  {
    name: "Emerald Cinema",
    value: "emerald-cinema",
    category: "film",
    colors: {
      base: "#022c22",
      top: "#065f46",
      front: "#059669",
      accent: "#34d399",
      shadow: "rgba(5, 150, 105, 0.5)",
      glow: "rgba(52, 211, 153, 0.5)",
    },
  },

  // Anime Styles
  {
    name: "Anime Sakura",
    value: "anime-sakura",
    category: "anime",
    colors: {
      base: "#831843",
      top: "#db2777",
      front: "#f472b6",
      accent: "#fbcfe8",
      shadow: "rgba(244, 114, 182, 0.5)",
      glow: "rgba(251, 207, 232, 0.6)",
    },
  },
  {
    name: "Anime Violet",
    value: "anime-violet",
    category: "anime",
    colors: {
      base: "#4c1d95",
      top: "#6d28d9",
      front: "#8b5cf6",
      accent: "#ddd6fe",
      shadow: "rgba(139, 92, 246, 0.5)",
      glow: "rgba(221, 214, 254, 0.6)",
    },
  },

  // Minimal / Clean
  {
    name: "Clean Slate",
    value: "clean-slate",
    category: "minimal",
    colors: {
      base: "#1e293b",
      top: "#334155",
      front: "#475569",
      accent: "#94a3b8",
      shadow: "rgba(0, 0, 0, 0.4)",
      glow: "rgba(148, 163, 184, 0.2)",
    },
  },
  {
    name: "Pure Orange",
    value: "pure-orange",
    category: "minimal",
    colors: {
      base: "#7c2d12",
      top: "#c2410c",
      front: "#ea580c",
      accent: "#fdba74",
      shadow: "rgba(234, 88, 12, 0.45)",
      glow: "rgba(253, 186, 116, 0.4)",
    },
  },
];

export const MODERN_NEON_STYLES = FOLDER_STYLES.filter(
  (s) => s.category === 'windows' || s.category === 'neon'
);
export const ANIME_STYLES = FOLDER_STYLES.filter((s) => s.category === 'anime');
export const FILM_STYLES = FOLDER_STYLES.filter((s) => s.category === 'film');

/**
 * Font weight options
 */
export const FONT_WEIGHTS: FontWeight[] = [
  { name: "Normal", value: "400" },
  { name: "Medium", value: "500" },
  { name: "Semi Bold", value: "600" },
  { name: "Bold", value: "700" },
  { name: "Extra Bold", value: "800" },
  { name: "Black", value: "900" },
];

/**
 * Standard Export Sizes
 */
export const EXPORT_SIZES: ExportSize[] = [
  { name: "16x16 (Taskbar)", value: 16 },
  { name: "32x32 (Small)", value: 32 },
  { name: "48x48 (Desktop)", value: 48 },
  { name: "64x64 (Medium)", value: 64 },
  { name: "128x128 (Large)", value: 128 },
  { name: "256x256 (Jumbo)", value: 256 },
  { name: "512x512 (HD PNG)", value: 512 },
  { name: "1024x1024 (Ultra HD)", value: 1024 },
];
