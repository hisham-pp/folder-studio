"use client";

import { useState } from "react";
import { Button } from "./ui/Button";

interface HowToApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToApplyModal({ isOpen, onClose }: HowToApplyModalProps) {
  const [activeOs, setActiveOs] = useState<'windows' | 'mac'>('windows');
  const [copiedIni, setCopiedIni] = useState(false);

  if (!isOpen) return null;

  const desktopIniCode = `[.ShellClassInfo]
IconResource=folder.ico,0
[ViewState]
Mode=
Vid=
FolderType=Generic`;

  const copyDesktopIni = () => {
    navigator.clipboard.writeText(desktopIniCode);
    setCopiedIni(true);
    setTimeout(() => setCopiedIni(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-700/60 rounded-2xl p-6 sm:p-8 shadow-2xl text-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-lg">
              ?
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">How to Apply Folder Icons</h2>
              <p className="text-xs text-gray-400">Step-by-step instructions for Windows and macOS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* OS Tabs */}
        <div className="grid grid-cols-2 gap-2 my-5 p-1 bg-gray-950/80 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveOs('windows')}
            className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              activeOs === 'windows'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-base">🪟</span> Windows 11 / 10
          </button>
          <button
            onClick={() => setActiveOs('mac')}
            className={`py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              activeOs === 'mac'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 shadow-md shadow-purple-500/20'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <span className="text-base">🍎</span> macOS Finder
          </button>
        </div>

        {/* Content */}
        {activeOs === 'windows' ? (
          <div className="space-y-4 text-sm text-gray-300">
            <div className="p-3 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-cyan-200 text-xs">
              💡 <strong>Pro Tip:</strong> Always use the <strong>Windows Multi-Res Bundle (.ico)</strong> option. It packs 16px, 32px, 48px, 64px, 128px, and 256px resolutions into one file so your folder stays razor-sharp in List view, Desktop, and Large Icons view!
            </div>

            <ol className="space-y-3 pl-2">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div>
                  <strong>Download your icon:</strong> Click <strong>"Download Windows Icon (.ico)"</strong> and save the file. Keep it in a permanent place (e.g. inside the target folder or in an <code>Icons</code> directory).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div>
                  <strong>Open Folder Properties:</strong> Right-click the folder you want to customize on Windows and click <strong>Properties</strong> (or press <code>Alt + Enter</code>).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <div>
                  <strong>Go to Customize:</strong> In the Properties dialog, click the <strong>Customize</strong> tab at the top right.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <div>
                  <strong>Change Icon:</strong> At the bottom, click the <strong>Change Icon...</strong> button.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
                  5
                </span>
                <div>
                  <strong>Browse & Apply:</strong> Click <strong>Browse...</strong>, select your downloaded <code>.ico</code> file, click <strong>OK</strong>, then click <strong>Apply</strong>!
                </div>
              </li>
            </ol>

            {/* Advanced desktop.ini Section */}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Power Users: Portable Folder (desktop.ini)
                </span>
                <button
                  onClick={copyDesktopIni}
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline"
                >
                  {copiedIni ? 'Copied!' : 'Copy snippet'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-2">
                Want icons that stay attached when moving folders to external drives or sharing? Put your <code>folder.ico</code> inside the folder and create a hidden <code>desktop.ini</code> file:
              </p>
              <pre className="p-3 bg-black/60 rounded-lg text-xs font-mono text-cyan-300/90 overflow-x-auto border border-gray-800">
                {desktopIniCode}
              </pre>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-gray-300">
            <div className="p-3 bg-purple-950/30 border border-purple-800/40 rounded-xl text-purple-200 text-xs">
              💡 <strong>macOS Quick Method:</strong> macOS allows setting custom folder icons directly via copy-paste in the Get Info inspector!
            </div>

            <ol className="space-y-3 pl-2">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div>
                  <strong>Export icon:</strong> Download either the <strong>High-Res PNG</strong> or <strong>Apple ICNS</strong> format.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div>
                  <strong>Copy image to clipboard:</strong> Double-click the downloaded PNG to open in <strong>Preview</strong>. Press <code>Cmd + A</code> (Select All), then <code>Cmd + C</code> (Copy).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <div>
                  <strong>Open Get Info:</strong> In Finder, right-click the folder you want to customize and select <strong>Get Info</strong> (or press <code>Cmd + I</code>).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <div>
                  <strong>Paste Icon:</strong> Click the small folder icon in the top-left corner of the Get Info window (it will highlight with a blue glow). Then press <code>Cmd + V</code> (Paste).
                </div>
              </li>
            </ol>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
          <Button onClick={onClose} variant="primary">
            Got it, thanks!
          </Button>
        </div>
      </div>
    </div>
  );
}
