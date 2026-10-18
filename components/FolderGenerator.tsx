"use client";

import { useRef, useState } from "react";
import { useImageUpload, useFolderConfig, useExport } from "@/hooks";
import FolderPreview from "./FolderPreview";
import ControlPanel from "./ControlPanel";
import HowToApplyModal from "./HowToApplyModal";
import { FolderConfig, ExportFormat } from "@/types/folder";

export default function FolderGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Use custom hooks for state management
  const { image, uploadImage, pasteImage, loadImageFromUrl, clearImage } = useImageUpload();

  const {
    config,
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

  const handleExportWrapper = (format: ExportFormat, size?: number) => {
    handleExport(format, size);
  };

  return (
    <div>
      <div className="grid lg:grid-cols-[1fr,620px] xl:grid-cols-[1fr,680px] gap-8 items-start">
        {/* Scrollable Control Panel */}
        <div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
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
              // Also clear from config if present
              activeConfig.image = null;
            }}
            onImagePlacementChange={setImagePlacement}
            onImageAdjustmentsChange={updateImageAdjustments}
            onEmblemChange={updateEmblem}
            onEffectsChange={updateEffects}
            onExportFormatChange={setExportFormat}
            onExport={handleExportWrapper}
            onReset={resetConfig}
            onRandomize={randomize}
          />
        </div>

        {/* Sticky Preview Panel */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <FolderPreview
            canvasRef={canvasRef}
            config={activeConfig}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        </div>
      </div>

      {/* "How to Apply" Modal */}
      <HowToApplyModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
