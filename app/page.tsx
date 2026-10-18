"use client";

import FolderGenerator from "@/components/FolderGenerator";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-[1680px]">
        {/* Hero Header */}
        <header className="text-center mb-8 sm:mb-10 pt-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4 backdrop-blur-md">
            <span>✨</span> Professional Folder Icon Studio &bull; Multi-Resolution .ICO Generator
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            Folder Studio
          </h1>
          <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Create authentic Windows 11 Fluent folder icons, Movie & Anime poster folders, vector emblem badges, and download multi-resolution <span className="text-cyan-400 font-semibold">.ico</span> files ready for your desktop.
          </p>
        </header>

        {/* Core Generator Dashboard */}
        <FolderGenerator />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
