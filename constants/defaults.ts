/**
 * Default values and configurations for Folder Studio
 */

import { FOLDER_STYLES, FONT_WEIGHTS } from './styles';
import {
  FolderConfig,
  FolderTemplate,
  ImagePlacement,
  TabPosition,
  LabelPosition,
  ExportFormat,
} from '@/types/folder';
import packageJson from '../package.json';

/**
 * Default folder configuration state
 */
export const DEFAULT_FOLDER_CONFIG: FolderConfig = {
  template: 'windows11' as FolderTemplate,
  image: null,
  imagePlacement: 'poster' as ImagePlacement,
  imageAdjustments: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    borderRadius: 8,
    opacity: 1,
    brightness: 100,
    contrast: 100,
    coverTopTab: true,
    tabBorderWidth: 2.5,
    tabBorderColor: '#ffffff',
    tabDimming: 15,
  },
  emblem: {
    enabled: false,
    icon: 'code',
    customImage: null,
    size: 64,
    color: '#ffffff',
    offsetX: 0,
    offsetY: 0,
  },
  effects: {
    glossyReflection: true,
    paperPeek: true,
    neonGlow: false,
    dropShadow: true,
    texture: 'none',
  },
  tabPosition: 'left' as TabPosition,
  title: 'PROJECTS',
  labelPosition: 'tab' as LabelPosition,
  style: FOLDER_STYLES[0], // Windows 11 Yellow default
  fontWeight: FONT_WEIGHTS[3].value, // Bold (700)
  titleBgColor: '#000000',
  titleTextColor: '#ffffff',
  exportFormat: 'ico-bundle' as ExportFormat,
};

export const DEFAULTS = {
  ...DEFAULT_FOLDER_CONFIG,
  STYLE: FOLDER_STYLES[0],
  FONT_WEIGHT: FONT_WEIGHTS[3].value,
  TITLE_BG_COLOR: '#000000',
  TITLE_TEXT_COLOR: '#ffffff',
  EXPORT_FORMAT: 'ico-bundle' as ExportFormat,
} as const;

/**
 * Application metadata
 */
export const APP_METADATA = {
  NAME: 'Folder Studio',
  VERSION: packageJson.version,
  DESCRIPTION: 'Professional Windows & macOS Folder ICO Generator',
  AUTHOR: 'Folder Studio Team',
} as const;
