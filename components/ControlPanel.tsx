"use client";

import { useState } from "react";
import {
  FolderConfig,
  FolderTemplate,
  FolderStyle,
  ImagePlacement,
  TabPosition,
  LabelPosition,
  ExportFormat,
  ImageAdjustments,
  EmblemConfig,
  FolderEffects,
} from "@/types/folder";
import {
  FOLDER_STYLES,
  FONT_WEIGHTS,
  EXPORT_SIZES,
} from "@/constants/styles";
import { EMBLEMS } from "@/lib/canvas/emblems";
import {
  SectionCard,
  ColorPicker,
  Input,
  Select,
  Button,
  Slider,
  Toggle,
} from "@/components/ui";

interface ControlPanelProps {
  config: FolderConfig;
  isExporting: boolean;
  lastExported: string | null;
  onTemplateChange: (template: FolderTemplate) => void;
  onStyleChange: (styleValue: string) => void;
  onCustomColorsChange: (colors: Partial<FolderStyle['colors']>) => void;
  onTitleChange: (title: string) => void;
  onLabelPositionChange: (pos: LabelPosition) => void;
  onFontWeightChange: (weight: string) => void;
  onTitleTextColorChange: (color: string) => void;
  onTitleBgColorChange: (color: string) => void;
  onTabPositionChange: (pos: TabPosition) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImagePaste: () => void;
  onImageUrlLoad: (url: string) => void;
  onImageRemove: () => void;
  onImagePlacementChange: (placement: ImagePlacement) => void;
  onImageAdjustmentsChange: (adj: Partial<ImageAdjustments>) => void;
  onEmblemChange: (emblem: Partial<EmblemConfig>) => void;
  onEffectsChange: (effects: Partial<FolderEffects>) => void;
  onExportFormatChange: (format: ExportFormat) => void;
  onExport: (format: ExportFormat, size?: number) => void;
  onReset: () => void;
  onRandomize: () => void;
}

type SectionTab = 'all' | 'style' | 'artwork' | 'emblem' | 'typography' | 'effects' | 'export';

export default function ControlPanel({
  config,
  isExporting,
  lastExported,
  onTemplateChange,
  onStyleChange,
  onCustomColorsChange,
  onTitleChange,
  onLabelPositionChange,
  onFontWeightChange,
  onTitleTextColorChange,
  onTitleBgColorChange,
  onTabPositionChange,
  onImageUpload,
  onImagePaste,
  onImageUrlLoad,
  onImageRemove,
  onImagePlacementChange,
  onImageAdjustmentsChange,
  onEmblemChange,
  onEffectsChange,
  onExportFormatChange,
  onExport,
  onReset,
  onRandomize,
}: ControlPanelProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<SectionTab>('all');
  const [emblemSearch, setEmblemSearch] = useState('');
  const [selectedEmblemCategory, setSelectedEmblemCategory] = useState<'all' | 'dev' | 'media' | 'system' | 'creative'>('all');

  const handleUrlLoad = () => {
    if (imageUrl.trim()) {
      onImageUrlLoad(imageUrl);
      setImageUrl('');
    }
  };

  const filteredEmblems = EMBLEMS.filter((e) => {
    const matchesCategory = selectedEmblemCategory === 'all' || e.category === selectedEmblemCategory;
    const matchesSearch = !emblemSearch || e.name.toLowerCase().includes(emblemSearch.toLowerCase()) || e.id.toLowerCase().includes(emblemSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const shouldShow = (section: SectionTab) => activeTab === 'all' || activeTab === section;

  return (
    <div className="space-y-5 pb-16">
      {/* Studio Header Toolbar & Category Filter Tabs */}
      <div className="sticky top-0 z-20 bg-gray-950/95 backdrop-blur-xl p-3 rounded-2xl border border-gray-800 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
              Studio Controls
            </span>
            <span className="text-[10px] text-gray-500 font-mono hidden sm:inline">&bull; Auto-saved</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onRandomize}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/15 hover:bg-purple-500/25 text-purple-300 border border-purple-500/30 transition-all flex items-center gap-1 shadow-sm active:scale-95"
              title="Generate a random cool folder style"
            >
              <span>🎲</span> Randomize
            </button>
            <button
              onClick={onReset}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 transition-all shadow-sm active:scale-95"
              title="Reset configuration to defaults and clear saved state"
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Controls', icon: '⚡' },
            { id: 'style', label: 'Style & Color', icon: '🎨' },
            { id: 'artwork', label: 'Artwork & Poster', icon: '🖼️' },
            { id: 'emblem', label: 'Emblems', icon: '🏷️' },
            { id: 'typography', label: 'Text & Label', icon: '✍️' },
            { id: 'effects', label: 'Effects', icon: '✨' },
            { id: 'export', label: 'Export', icon: '💾' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SectionTab)}
              className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                  : 'bg-gray-900/60 border border-gray-800/80 text-gray-400 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. FOLDER TEMPLATE & SHAPE */}
      {shouldShow('style') && (
        <SectionCard title="Folder Template & Geometry" titleColor="text-cyan-400">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'windows11', name: 'Windows 11 Fluent', icon: '🪟', badge: 'Official Fluent' },
              { id: 'poster', name: 'Media Poster / Box', icon: '🎬', badge: 'Movies & Games' },
              { id: 'macos', name: 'macOS Style', icon: '🍎', badge: 'Apple Squircle' },
              { id: 'neon', name: 'Cyberpunk Neon', icon: '⚡', badge: 'Glowing Edge' },
              { id: 'minimal', name: 'Minimalist Vector', icon: '📁', badge: 'Clean Flat' },
            ].map((tmpl) => {
              const isSelected = config.template === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => onTemplateChange(tmpl.id as FolderTemplate)}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/40'
                      : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                  }`}
                >
                  <div>
                    <div className="text-xl mb-1">{tmpl.icon}</div>
                    <div className="font-semibold text-xs text-white leading-tight">
                      {tmpl.name}
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-400/90 mt-2 font-mono">
                    {tmpl.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {config.template === 'minimal' && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Tab Position
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['left', 'center', 'right'] as TabPosition[]).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => onTabPositionChange(pos)}
                    className={`py-1.5 rounded-lg text-xs font-medium border capitalize ${
                      config.tabPosition === pos
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-gray-900/60 border-gray-800 text-gray-400'
                    }`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* 2. COLOR PALETTES & THEMES */}
      {shouldShow('style') && (
        <SectionCard title="Colors & Presets" titleColor="text-purple-400">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Curated Preset Palettes
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FOLDER_STYLES.map((style) => {
                  const isSelected = config.style.value === style.value;
                  return (
                    <button
                      key={style.value}
                      onClick={() => onStyleChange(style.value)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-400 text-white shadow-md shadow-purple-500/20 ring-1 ring-purple-400/40'
                          : 'bg-gray-900/60 border-gray-800 text-gray-300 hover:border-gray-700'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-white/20 flex-shrink-0 shadow-inner"
                        style={{
                          background: `linear-gradient(135deg, ${style.colors.top}, ${style.colors.base})`,
                        }}
                      />
                      <span className="text-xs font-medium truncate">
                        {style.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Overrides */}
            <div className="pt-3 border-t border-gray-800">
              <span className="block text-xs font-medium text-gray-400 mb-3">
                Fine-tune Custom Colors
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <ColorPicker
                  label="Base Cover"
                  value={config.style.colors.base}
                  onChange={(base) => onCustomColorsChange({ base })}
                />
                <ColorPicker
                  label="Tab Color"
                  value={config.style.colors.top}
                  onChange={(top) => onCustomColorsChange({ top })}
                />
                <ColorPicker
                  label="Front Flap"
                  value={config.style.colors.front}
                  onChange={(front) => onCustomColorsChange({ front })}
                />
                <ColorPicker
                  label="Accent / Border"
                  value={config.style.colors.accent}
                  onChange={(accent) => onCustomColorsChange({ accent })}
                />
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* 3. IMAGE / POSTER / ARTWORK */}
      {shouldShow('artwork') && (
        <SectionCard title="Artwork & Poster" titleColor="text-pink-400">
          <div className="space-y-4">
            {/* Upload and Paste */}
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-2">
                Upload Image (Poster, Game Screenshot, Anime Art, Logo)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="w-full text-xs px-3 py-2 bg-gray-900/80 border border-gray-700 rounded-lg text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-pink-500/20 file:text-pink-400 hover:file:bg-pink-500/30 file:font-semibold cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Or Load from URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlLoad()}
                  placeholder="https://example.com/poster.jpg"
                  className="flex-1 px-3 py-2 text-xs bg-gray-900/80 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
                <Button onClick={handleUrlLoad} variant="accent" className="text-xs py-1.5">
                  Load
                </Button>
              </div>
            </div>

            <Button onClick={onImagePaste} variant="secondary" fullWidth className="text-xs py-2">
              📋 Paste Image from Clipboard (or Ctrl+V)
            </Button>

            {/* If Image Loaded: Options & Sliders */}
            {config.image && (
              <div className="p-4 bg-gray-950/70 rounded-xl border border-gray-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                  <span className="text-xs font-semibold text-pink-300">
                    Image Placement & Adjustments
                  </span>
                  <button
                    onClick={onImageRemove}
                    className="text-xs text-red-400 hover:text-red-300 font-medium"
                  >
                    Remove Image
                  </button>
                </div>

                {/* Placement Mode */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Placement Mode
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'full', label: 'Full Folder (Top + Bottom)', desc: 'Spans tab & cover with border' },
                      { id: 'poster', label: 'Front Flap Only', desc: 'Cover below tab' },
                      { id: 'emblem', label: 'Emblem Stamp', desc: 'Centered logo' },
                      { id: 'framed', label: 'Framed Card', desc: 'Polaroid border' },
                      { id: 'insert', label: 'Doc Slot Peek', desc: 'Inside slot' },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => {
                          onImagePlacementChange(mode.id as ImagePlacement);
                          if (mode.id === 'full') {
                            onImageAdjustmentsChange({ coverTopTab: true });
                          }
                        }}
                        className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                          (config.imagePlacement === mode.id || (mode.id === 'full' && config.imageAdjustments.coverTopTab && config.imagePlacement === 'poster'))
                            ? 'bg-pink-500/20 border-pink-400 text-pink-200 shadow-sm ring-1 ring-pink-400/40'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                        }`}
                      >
                        <div className="font-semibold text-white">{mode.label}</div>
                        <div className="text-[10px] text-gray-400 leading-tight mt-0.5">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Top Tab & Border Controls */}
                <div className="p-3.5 bg-gray-900/90 rounded-xl border border-gray-800 space-y-3">
                  <Toggle
                    label="Extend Image to Top Tab"
                    description="Cover both top tab and bottom cover with a separating border"
                    checked={config.imageAdjustments.coverTopTab || config.imagePlacement === 'full'}
                    onChange={(coverTopTab) => onImageAdjustmentsChange({ coverTopTab })}
                  />

                  {(config.imageAdjustments.coverTopTab || config.imagePlacement === 'full') && (
                    <div className="pt-2 border-t border-gray-800 space-y-3">
                      <span className="block text-xs font-semibold text-pink-300 uppercase tracking-wider">
                        Top & Bottom Divider Border
                      </span>
                      <div className="grid grid-cols-2 gap-3">
                        <Slider
                          label="Border Width"
                          value={config.imageAdjustments.tabBorderWidth}
                          min={0}
                          max={8}
                          step={0.5}
                          unit="px"
                          onChange={(tabBorderWidth) => onImageAdjustmentsChange({ tabBorderWidth })}
                        />
                        <Slider
                          label="Tab 3D Depth"
                          value={config.imageAdjustments.tabDimming}
                          min={0}
                          max={50}
                          step={5}
                          unit="%"
                          onChange={(tabDimming) => onImageAdjustmentsChange({ tabDimming })}
                        />
                      </div>
                      <div>
                        <ColorPicker
                          label="Border Line Color"
                          value={config.imageAdjustments.tabBorderColor}
                          onChange={(tabBorderColor) => onImageAdjustmentsChange({ tabBorderColor })}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Adjustment Sliders */}
                <div className="space-y-3 pt-2">
                  <Slider
                    label="Zoom / Scale"
                    value={Math.round(config.imageAdjustments.scale * 100)}
                    min={50}
                    max={250}
                    step={5}
                    unit="%"
                    onChange={(val) => onImageAdjustmentsChange({ scale: val / 100 })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Slider
                      label="Pan X"
                      value={config.imageAdjustments.offsetX}
                      min={-60}
                      max={60}
                      unit="px"
                      onChange={(offsetX) => onImageAdjustmentsChange({ offsetX })}
                    />
                    <Slider
                      label="Pan Y"
                      value={config.imageAdjustments.offsetY}
                      min={-60}
                      max={60}
                      unit="px"
                      onChange={(offsetY) => onImageAdjustmentsChange({ offsetY })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Slider
                      label="Brightness"
                      value={config.imageAdjustments.brightness}
                      min={50}
                      max={150}
                      unit="%"
                      onChange={(brightness) => onImageAdjustmentsChange({ brightness })}
                    />
                    <Slider
                      label="Contrast"
                      value={config.imageAdjustments.contrast}
                      min={50}
                      max={150}
                      unit="%"
                      onChange={(contrast) => onImageAdjustmentsChange({ contrast })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* 4. VECTOR EMBLEMS & BADGES */}
      {shouldShow('emblem') && (
        <SectionCard title="Emblems & Badges" titleColor="text-amber-400">
          <div className="space-y-4">
            <Toggle
              label="Enable Emblem Icon"
              description="Stamp a vector symbol or logo onto the folder"
              checked={config.emblem.enabled}
              onChange={(enabled) => onEmblemChange({ enabled })}
            />

            {config.emblem.enabled && (
              <div className="p-4 bg-gray-950/70 rounded-xl border border-gray-800 space-y-4">
                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={emblemSearch}
                    onChange={(e) => setEmblemSearch(e.target.value)}
                    placeholder="Search emblem icons..."
                    className="flex-1 px-3 py-1.5 text-xs bg-gray-900 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                  <div className="flex gap-1 p-1 bg-gray-900 rounded-lg text-xs overflow-x-auto">
                    {(['all', 'dev', 'media', 'system', 'creative'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedEmblemCategory(cat)}
                        className={`px-2.5 py-1 rounded font-medium capitalize whitespace-nowrap transition-all ${
                          selectedEmblemCategory === cat
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Icon Grid */}
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 max-h-52 overflow-y-auto p-1 scrollbar-thin">
                  {filteredEmblems.map((emblem) => {
                    const isSelected = config.emblem.icon === emblem.id;
                    return (
                      <button
                        key={emblem.id}
                        onClick={() => onEmblemChange({ icon: emblem.id, customImage: null })}
                        className={`p-2 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected
                            ? 'bg-amber-500/30 border-amber-400 text-amber-300 ring-1 ring-amber-400/40'
                            : 'bg-gray-900/80 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                        }`}
                        title={emblem.name}
                      >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d={emblem.path} />
                        </svg>
                        <span className="text-[9px] truncate max-w-full font-mono">{emblem.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Emblem Adjustments */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Slider
                    label="Emblem Size"
                    value={config.emblem.size}
                    min={24}
                    max={120}
                    unit="px"
                    onChange={(size) => onEmblemChange({ size })}
                  />
                  <Slider
                    label="Vertical Offset"
                    value={config.emblem.offsetY}
                    min={-40}
                    max={40}
                    unit="px"
                    onChange={(offsetY) => onEmblemChange({ offsetY })}
                  />
                </div>

                <div className="pt-2">
                  <ColorPicker
                    label="Emblem Color"
                    value={config.emblem.color}
                    onChange={(color) => onEmblemChange({ color })}
                  />
                </div>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* 5. TITLE & TYPOGRAPHY */}
      {shouldShow('typography') && (
        <SectionCard title="Folder Label & Typography" titleColor="text-emerald-400">
          <div className="space-y-4">
            <Input
              label="Folder Name / Title"
              value={config.title}
              onChange={onTitleChange}
              placeholder="e.g. MOVIES, CODE, GAMES, 2026"
            />

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Label Position
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'tab', label: 'On Tab' },
                  { id: 'front-bottom', label: 'Bottom Pill' },
                  { id: 'front-center', label: 'Front Center' },
                  { id: 'none', label: 'Hidden / Off' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => onLabelPositionChange(pos.id as LabelPosition)}
                    className={`py-2 px-3 rounded-lg border text-xs font-medium ${
                      config.labelPosition === pos.id
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/40'
                        : 'bg-gray-900 border-gray-800 text-gray-400'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Font Weight"
                value={config.fontWeight}
                onChange={onFontWeightChange}
                options={FONT_WEIGHTS}
              />
              <ColorPicker
                label="Text Color"
                value={config.titleTextColor}
                onChange={onTitleTextColorChange}
              />
            </div>
          </div>
        </SectionCard>
      )}

      {/* 6. SURFACE EFFECTS & DETAILS */}
      {shouldShow('effects') && (
        <SectionCard title="Effects & Lighting" titleColor="text-blue-400">
          <div className="space-y-3">
            <Toggle
              label="Glossy Light Reflection"
              description="Adds diagonal plastic sheen / glare reflection across cover"
              checked={config.effects.glossyReflection}
              onChange={(glossyReflection) => onEffectsChange({ glossyReflection })}
            />
            <Toggle
              label="Paper / Document Sheet Peek"
              description="Shows authentic Windows documents peeking inside folder slot"
              checked={config.effects.paperPeek}
              onChange={(paperPeek) => onEffectsChange({ paperPeek })}
            />
            <Toggle
              label="Ambient Drop Shadow"
              description="Depth shadow behind the folder body"
              checked={config.effects.dropShadow}
              onChange={(dropShadow) => onEffectsChange({ dropShadow })}
            />
            <Toggle
              label="Neon Edge Glow"
              description="High-tech glowing outline effect"
              checked={config.effects.neonGlow}
              onChange={(neonGlow) => onEffectsChange({ neonGlow })}
            />
          </div>
        </SectionCard>
      )}

      {/* 7. EXPORT CENTER */}
      {shouldShow('export') && (
        <SectionCard title="Export Icon" titleColor="text-cyan-400">
          <div className="space-y-5">
            {/* PRIMARY RECOMMENDED BUTTON: WINDOWS MULTI-RES ICO */}
            <div className="p-4 bg-gradient-to-r from-cyan-950/70 to-blue-950/70 rounded-xl border border-cyan-500/50 shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⭐</span>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      Windows Folder Icon (.ico)
                    </h4>
                    <p className="text-xs text-cyan-300/80">
                      All-in-One Multi-Resolution Bundle (16, 24, 32, 48, 64, 128, 256)
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
                  RECOMMENDED
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                The official standard format for Windows folders. Crystal clear on Desktop, Start Menu, Taskbar, and Explorer!
              </p>
              <Button
                onClick={() => onExport('ico-bundle')}
                disabled={isExporting}
                variant="primary"
                fullWidth
                className="py-3 font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-98"
              >
                {isExporting ? 'Generating Multi-Res ICO...' : '⬇️ Download Windows Icon (.ico)'}
              </Button>
            </div>

            {/* Alternative Formats */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Individual Resolutions & Other Formats
              </label>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Button
                  onClick={() => onExport('png', 512)}
                  disabled={isExporting}
                  variant="secondary"
                  className="text-xs py-2"
                >
                  🖼️ High-Res PNG (512x512)
                </Button>
                <Button
                  onClick={() => onExport('icns')}
                  disabled={isExporting}
                  variant="secondary"
                  className="text-xs py-2"
                >
                  🍎 Apple macOS (.icns)
                </Button>
              </div>

              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Export Specific Single Size:
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {EXPORT_SIZES.slice(0, 6).map((sz) => (
                  <button
                    key={sz.value}
                    onClick={() => onExport('ico', sz.value)}
                    disabled={isExporting}
                    className="py-2 px-2 bg-gray-900 hover:bg-gray-800 border border-gray-700/80 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all text-center"
                  >
                    {sz.value}x{sz.value} ICO
                  </button>
                ))}
              </div>
            </div>

            {lastExported && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
                <span>✓</span> Successfully exported <strong>{lastExported}</strong>
              </div>
            )}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
