"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useImageUpload, useFolderConfig, useExport } from "@/hooks";
import FolderPreview from "./FolderPreview";
import ControlPanel from "./ControlPanel";
import HowToApplyModal from "./HowToApplyModal";
import { ToastContainer, ToastMessage } from "./ui/Toast";
import { FolderConfig, ExportFormat, FolderTemplate } from "@/types/folder";

export default function FolderGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      setToasts((prev) => [...prev, { id, text, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Use custom hooks for state management
  const {
    image,
    uploadImage,
    handleFileDrop,
    pasteImage,
    loadImageFromUrl,
    clearImage,
    setImage,
  } = useImageUpload();

  const {
    config,
    isHydrated,
    setTemplate,
    setStyle,
    setCustomColors,
    setTitle,
    setLabelPosition,
    setFontWeight,
    setTitleTextColor,
    setTitleBgColor,
    setTabPosition,
    setImagePlacement,
    updateImageAdjustments,
    updateEmblem,
    updateEffects,
    setExportFormat,
    resetConfig,
    randomize,
  } = useFolderConfig();

  // Combine image from upload hook with folder configuration
  const activeConfig: FolderConfig = {
    ...config,
    image: image ?? config.image,
  };

  const { isExporting, lastExported, handleExport } = useExport(canvasRef, activeConfig);

  const handleExportWrapper = useCallback(
    (format: ExportFormat, size?: number) => {
      handleExport(format, size);
      addToast(`Exporting ${activeConfig.title || 'folder'} as ${format.toUpperCase()}...`, 'info');
    },
    [handleExport, activeConfig.title, addToast]
  );

  // Global Keyboard Shortcuts (Ctrl+V to paste image, Ctrl+S / Ctrl+E to export)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleExportWrapper('ico-bundle');
      }
    };

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            handleFileDrop(file);
            addToast('Pasted image from clipboard!', 'success');
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
    };
  }, [handleExportWrapper, handleFileDrop, addToast]);

  // Quick Preset Demos
  const applyDemo = (type: 'win11' | 'game' | 'anime' | 'cinema' | 'cyber') => {
    switch (type) {
      case 'win11':
        setTemplate('windows11');
        setStyle('win11-yellow');
        setTitle('PROJECTS');
        setImagePlacement('poster');
        updateImageAdjustments({ coverTopTab: true, tabBorderWidth: 2.5, tabBorderColor: '#ffffff' });
        updateEmblem({ enabled: true, icon: 'folder-icon', color: '#b58100' });
        addToast('Applied Windows 11 Fluent preset', 'info');
        break;
      case 'game':
        setTemplate('windows11');
        setStyle('win11-cobalt');
        setTitle('GENSHIN');
        setImagePlacement('full');
        updateImageAdjustments({ coverTopTab: true, tabBorderWidth: 3, tabBorderColor: '#22d3ee', tabDimming: 15 });
        updateEmblem({ enabled: true, icon: 'gamepad', color: '#22d3ee' });
        addToast('Applied Gaming Folder preset', 'info');
        break;
      case 'cinema':
        setTemplate('poster');
        setStyle('netflix-red');
        setTitle('CINEMA');
        setImagePlacement('poster');
        updateImageAdjustments({ coverTopTab: true, tabBorderWidth: 2, tabBorderColor: '#ef4444' });
        updateEmblem({ enabled: true, icon: 'film', color: '#ef4444' });
        addToast('Applied Cinema / Movie Box preset', 'info');
        break;
      case 'anime':
        setTemplate('windows11');
        setStyle('anime-sakura');
        setTitle('ANIME');
        setImagePlacement('full');
        updateImageAdjustments({ coverTopTab: true, tabBorderWidth: 2.5, tabBorderColor: '#fbcfe8' });
        updateEmblem({ enabled: true, icon: 'sparkles', color: '#ffa6c9' });
        addToast('Applied Anime Sakura preset', 'info');
        break;
      case 'cyber':
        setTemplate('neon');
        setStyle('neon-cyan');
        setTitle('CYBER');
        setImagePlacement('full');
        updateImageAdjustments({ coverTopTab: true, tabBorderWidth: 3, tabBorderColor: '#22d3ee' });
        updateEmblem({ enabled: true, icon: 'cpu', color: '#22d3ee' });
        addToast('Applied Cyberpunk Neon preset', 'info');
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Demo Inspirations Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gray-900/60 backdrop-blur-md rounded-2xl border border-gray-800">
        <div className="flex items-center gap-2 text-xs text-gray-300 font-medium">
          <span className="text-sm">⚡</span>
          <span>Quick Themes:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => applyDemo('win11')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>🪟</span> Win 11 Yellow
          </button>
          <button
            onClick={() => applyDemo('game')}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>🎮</span> Gaming Folder
          </button>
          <button
            onClick={() => applyDemo('cinema')}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>🎬</span> Movie Cinema
          </button>
          <button
            onClick={() => applyDemo('anime')}
            className="px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>🌸</span> Anime Sakura
          </button>
          <button
            onClick={() => applyDemo('cyber')}
            className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>⚡</span> Cyberpunk
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid lg:grid-cols-[1fr,620px] xl:grid-cols-[1fr,680px] gap-8 items-start">
        {/* Scrollable Control Panel */}
        <div className="max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          <ControlPanel
            config={activeConfig}
            isExporting={isExporting}
            lastExported={lastExported}
            onTemplateChange={setTemplate}
            onStyleChange={setStyle}
            onCustomColorsChange={setCustomColors}
            onTitleChange={setTitle}
            onLabelPositionChange={setLabelPosition}
            onFontWeightChange={setFontWeight}
            onTitleTextColorChange={setTitleTextColor}
            onTitleBgColorChange={setTitleBgColor}
            onTabPositionChange={setTabPosition}
            onImageUpload={uploadImage}
            onImagePaste={pasteImage}
            onImageUrlLoad={loadImageFromUrl}
            onImageRemove={() => {
              clearImage();
              activeConfig.image = null;
              addToast('Image removed', 'info');
            }}
            onImagePlacementChange={setImagePlacement}
            onImageAdjustmentsChange={updateImageAdjustments}
            onEmblemChange={updateEmblem}
            onEffectsChange={updateEffects}
            onExportFormatChange={setExportFormat}
            onExport={handleExportWrapper}
            onReset={() => {
              resetConfig();
              clearImage();
              addToast('Reset to default settings & cleared storage', 'info');
            }}
            onRandomize={() => {
              randomize();
              addToast('Generated random folder style!', 'info');
            }}
          />
        </div>

        {/* Sticky Preview Panel */}
        <div className="lg:sticky lg:top-4 space-y-4">
          <FolderPreview
            canvasRef={canvasRef}
            config={activeConfig}
            onOpenGuide={() => setIsGuideOpen(true)}
            onFileDrop={handleFileDrop}
            onQuickExport={handleExportWrapper}
            onShowToast={addToast}
          />
        </div>
      </div>

      {/* "How to Apply" Guide Modal */}
      <HowToApplyModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
