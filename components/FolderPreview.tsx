"use client";

import { useState, useCallback } from "react";
import { FolderConfig, ExportFormat } from "@/types/folder";
import { useFolderCanvas } from "@/hooks/useFolderCanvas";

interface FolderPreviewProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  config: FolderConfig;
  onOpenGuide: () => void;
  onFileDrop: (file: File) => void;
  onQuickExport: (format: ExportFormat, size?: number) => void;
  onShowToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

type PreviewTab = 'canvas' | 'desktop' | 'explorer' | 'grid';
type BackgroundTheme = 'dark' | 'transparent' | 'win11' | 'light';

export default function FolderPreview({
  canvasRef,
  config,
  onOpenGuide,
  onFileDrop,
  onQuickExport,
  onShowToast,
}: FolderPreviewProps) {
  const [activeTab, setActiveTab] = useState<PreviewTab>('canvas');
  const [bgTheme, setBgTheme] = useState<BackgroundTheme>('dark');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isCopying, setIsCopying] = useState<boolean>(false);

  // Sync canvas with state
  useFolderCanvas(config, canvasRef, 512);

  const getBackgroundClass = () => {
    switch (bgTheme) {
      case 'transparent':
        return 'bg-[linear-gradient(45deg,#1f2937_25%,transparent_25%),linear-gradient(-45deg,#1f2937_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#1f2937_75%),linear-gradient(-45deg,transparent_75%,#1f2937_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0] bg-gray-950';
      case 'win11':
        return 'bg-gradient-to-tr from-[#003865] via-[#0575E6] to-[#00F260]';
      case 'light':
        return 'bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800';
      case 'dark':
      default:
        return 'bg-gradient-to-b from-gray-950 via-gray-900 to-black';
    }
  };

  // Drag & drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDraggingOver(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        onFileDrop(file);
        onShowToast(`Loaded image "${file.name}"`, 'success');
      }
    },
    [onFileDrop, onShowToast]
  );

  // Copy PNG to clipboard
  const handleCopyClipboard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsCopying(true);
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          onShowToast('Copied PNG icon to clipboard!', 'success');
        } catch {
          onShowToast('Clipboard copy not supported in this browser context', 'warning');
        } finally {
          setIsCopying(false);
        }
      }, 'image/png');
    } catch {
      setIsCopying(false);
    }
  }, [canvasRef, onShowToast]);

  return (
    <div className="bg-gradient-to-br from-gray-900/95 to-gray-950/95 backdrop-blur-2xl rounded-2xl p-5 sm:p-6 border border-gray-800/80 shadow-2xl space-y-4 relative">
      {/* Top Bar with Title and Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-md shadow-cyan-500/20">
            📁
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Preview Studio
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h2>
            <p className="text-[11px] text-gray-400">Drag & drop images anywhere on canvas</p>
          </div>
        </div>

        {/* Preview Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-gray-950/80 rounded-xl border border-gray-800 text-xs">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'canvas'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Canvas
          </button>
          <button
            onClick={() => setActiveTab('desktop')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'desktop'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            🪟 Windows Desktop
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'explorer'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            📂 Explorer
          </button>
          <button
            onClick={() => setActiveTab('grid')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'grid'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            📏 Mipmaps
          </button>
        </div>
      </div>

      {/* Main Preview Screen with Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative rounded-xl min-h-[480px] flex items-center justify-center overflow-hidden border transition-all duration-300 ${
          isDraggingOver
            ? 'border-cyan-400 ring-4 ring-cyan-400/30 scale-[0.99]'
            : 'border-gray-800'
        } ${getBackgroundClass()}`}
      >
        {/* Drop Overlay */}
        {isDraggingOver && (
          <div className="absolute inset-0 z-30 bg-cyan-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center text-cyan-200 border-2 border-dashed border-cyan-400 rounded-xl animate-fadeIn">
            <div className="text-5xl mb-3 animate-bounce">📥</div>
            <div className="text-lg font-bold text-white">Drop Image to Apply</div>
            <div className="text-xs text-cyan-300/80 mt-1">PNG, JPG, WebP, or SVG</div>
          </div>
        )}

        {/* Tab 1: Clean Canvas View */}
        {activeTab === 'canvas' && (
          <div className="flex flex-col items-center justify-center p-6 w-full h-full relative">
            <div
              style={{
                transform: `scale(${zoomLevel / 100})`,
                transition: 'transform 0.2s cubic-bezier(0.2, 0, 0, 1)',
              }}
            >
              <canvas
                ref={canvasRef}
                className="max-w-[340px] sm:max-w-[420px] h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)]"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Windows 11 Desktop Mockup */}
        {activeTab === 'desktop' && (
          <div className="relative w-full h-[480px] p-6 flex flex-col justify-between select-none">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#002244] via-[#094074] to-[#1d2d44] opacity-90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(65,105,225,0.4),transparent_60%)]"></div>

            {/* Desktop Icons Grid */}
            <div className="relative z-10 grid grid-cols-2 gap-6 w-fit text-center text-xs text-white drop-shadow-md">
              <div className="w-20 p-2 rounded-lg hover:bg-white/10 flex flex-col items-center gap-1.5 cursor-pointer transition-colors">
                <div className="w-12 h-12 flex items-center justify-center text-2xl">
                  🗑️
                </div>
                <span className="leading-tight drop-shadow">Recycle Bin</span>
              </div>

              {/* USER'S CUSTOM FOLDER ICON */}
              <div className="w-20 p-2 rounded-lg bg-blue-500/25 border border-blue-400/50 ring-2 ring-blue-400/40 flex flex-col items-center gap-1.5 cursor-pointer shadow-lg animate-pulse">
                <div className="w-12 h-12 flex items-center justify-center">
                  <MockupFolderIcon canvasRef={canvasRef} size={48} />
                </div>
                <span className="font-semibold leading-tight drop-shadow truncate max-w-[70px]">
                  {config.title || 'Folder'}
                </span>
              </div>

              <div className="w-20 p-2 rounded-lg hover:bg-white/10 flex flex-col items-center gap-1.5 cursor-pointer transition-colors">
                <div className="w-12 h-12 flex items-center justify-center text-2xl">
                  📄
                </div>
                <span className="leading-tight drop-shadow">Notes.txt</span>
              </div>
            </div>

            {/* Windows 11 Taskbar Mockup */}
            <div className="relative z-10 w-full h-11 bg-gray-900/80 backdrop-blur-md rounded-xl border border-white/10 px-4 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-4 mx-auto">
                <span className="text-base cursor-pointer hover:scale-110 transition-transform">🪟</span>
                <span className="text-base cursor-pointer hover:scale-110 transition-transform">🔍</span>
                <span className="text-base cursor-pointer hover:scale-110 transition-transform">📂</span>
                <span className="text-base cursor-pointer hover:scale-110 transition-transform">🌐</span>
              </div>
              <div className="text-[10px] text-gray-300 font-mono">11:42 AM</div>
            </div>
          </div>
        )}

        {/* Tab 3: Windows 11 Explorer Mockup */}
        {activeTab === 'explorer' && (
          <div className="w-full h-[480px] bg-gray-900 border border-gray-700/60 flex flex-col text-xs text-gray-200 select-none">
            {/* Explorer Header */}
            <div className="h-10 bg-gray-950 border-b border-gray-800 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                  <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                </div>
                <span className="ml-3 font-medium text-gray-400">File Explorer - This PC</span>
              </div>
              <span className="text-gray-500">✕</span>
            </div>

            {/* Address Bar */}
            <div className="h-9 bg-gray-900/90 border-b border-gray-800 px-4 flex items-center gap-2 text-gray-400 text-xs">
              <span>←</span>
              <span>→</span>
              <div className="flex-1 bg-gray-950/70 border border-gray-800 rounded px-2.5 py-1 text-gray-300">
                This PC &gt; Documents &gt; {config.title || 'Folder'}
              </div>
            </div>

            {/* Explorer Main Content */}
            <div className="flex-1 flex overflow-hidden">
              <div className="w-36 bg-gray-950/60 border-r border-gray-800/80 p-3 space-y-2 text-gray-400 hidden sm:block">
                <div className="font-semibold text-gray-300 text-[11px]">Quick access</div>
                <div className="pl-2 space-y-1.5 text-[11px]">
                  <div>⭐ Desktop</div>
                  <div>📥 Downloads</div>
                  <div>📄 Documents</div>
                  <div>🖼️ Pictures</div>
                </div>
              </div>

              <div className="flex-1 p-6 grid grid-cols-3 sm:grid-cols-4 gap-6 items-start overflow-y-auto">
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-center cursor-pointer shadow-md">
                  <MockupFolderIcon canvasRef={canvasRef} size={64} />
                  <span className="font-semibold text-cyan-300 truncate max-w-[85px]">
                    {config.title || 'Folder'}
                  </span>
                </div>

                <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-800/50 text-center cursor-pointer">
                  <div className="w-16 h-16 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-3xl">
                    📁
                  </div>
                  <span className="text-gray-400 truncate max-w-[85px]">Downloads</span>
                </div>

                <div className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-800/50 text-center cursor-pointer">
                  <div className="w-16 h-16 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-3xl">
                    📁
                  </div>
                  <span className="text-gray-400 truncate max-w-[85px]">Pictures</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Multi-Resolution Sharpness Grid */}
        {activeTab === 'grid' && (
          <div className="w-full h-full p-6 flex flex-col justify-center items-center gap-6 overflow-y-auto">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-white">Windows ICO Mipmaps</h3>
              <p className="text-xs text-gray-400">
                All 6 standard resolutions baked into your .ico file
              </p>
            </div>

            <div className="flex flex-wrap items-end justify-center gap-6 p-4 bg-gray-950/60 rounded-xl border border-gray-800">
              <div className="flex flex-col items-center gap-2">
                <MockupFolderIcon canvasRef={canvasRef} size={128} />
                <span className="text-[11px] text-gray-400 font-mono">256x256 (Jumbo)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MockupFolderIcon canvasRef={canvasRef} size={64} />
                <span className="text-[11px] text-gray-400 font-mono">128x128 (Large)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MockupFolderIcon canvasRef={canvasRef} size={48} />
                <span className="text-[11px] text-cyan-400 font-mono font-semibold">48x48 (Desktop)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MockupFolderIcon canvasRef={canvasRef} size={32} />
                <span className="text-[11px] text-gray-400 font-mono">32x32 (Small)</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <MockupFolderIcon canvasRef={canvasRef} size={16} />
                <span className="text-[11px] text-gray-400 font-mono">16x16 (List)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Floating Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-950/70 rounded-xl border border-gray-800">
        <div className="flex items-center gap-2">
          {/* Quick Copy PNG */}
          <button
            onClick={handleCopyClipboard}
            disabled={isCopying}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Copy high-res PNG directly to your clipboard"
          >
            <span>📋</span> {isCopying ? 'Copying...' : 'Copy PNG'}
          </button>

          {/* Quick Download Windows ICO */}
          <button
            onClick={() => onQuickExport('ico-bundle')}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all active:scale-95"
            title="Download Windows Multi-Resolution .ico"
          >
            <span>⬇️</span> Download .ICO
          </button>
        </div>

        {/* Backdrop Selector & Zoom */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>Backdrop:</span>
            <button
              onClick={() => setBgTheme('dark')}
              className={`w-4 h-4 rounded-full bg-gray-950 border ${
                bgTheme === 'dark' ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-gray-700'
              }`}
              title="Dark"
            />
            <button
              onClick={() => setBgTheme('win11')}
              className={`w-4 h-4 rounded-full bg-blue-600 border ${
                bgTheme === 'win11' ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-gray-700'
              }`}
              title="Windows 11 Bloom"
            />
            <button
              onClick={() => setBgTheme('transparent')}
              className={`w-4 h-4 rounded-full bg-gray-700 border ${
                bgTheme === 'transparent' ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-gray-700'
              }`}
              title="Checkerboard Transparent"
            />
            <button
              onClick={() => setBgTheme('light')}
              className={`w-4 h-4 rounded-full bg-gray-200 border ${
                bgTheme === 'light' ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-gray-700'
              }`}
              title="Light"
            />
          </div>

          {activeTab === 'canvas' && (
            <div className="flex items-center gap-1.5 pl-2 border-l border-gray-800 text-xs text-gray-400">
              <button
                onClick={() => setZoomLevel(Math.max(60, zoomLevel - 20))}
                className="w-5 h-5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center justify-center font-bold"
              >
                -
              </button>
              <span className="font-mono text-gray-300 w-8 text-center text-[11px]">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(180, zoomLevel + 20))}
                className="w-5 h-5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 flex items-center justify-center font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Helper Footer Link */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span className="text-[11px] text-gray-500">
          💡 Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 text-[10px]">Ctrl+V</kbd> anywhere to paste an image
        </span>
        <button
          onClick={onOpenGuide}
          className="font-medium text-cyan-400 hover:text-cyan-300 underline transition-colors"
        >
          How to apply .ico on Windows
        </button>
      </div>
    </div>
  );
}

function MockupFolderIcon({
  canvasRef,
  size,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  size: number;
}) {
  const canvas = canvasRef.current;
  if (!canvas) {
    return <div style={{ width: size, height: size }} className="bg-cyan-500/20 rounded" />;
  }

  const dataUrl = canvas.toDataURL('image/png');

  return (
    <img
      src={dataUrl}
      alt="Folder Icon"
      style={{ width: size, height: size }}
      className="object-contain drop-shadow"
    />
  );
}
