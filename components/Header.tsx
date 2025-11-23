"use client";

import { Link as LinkIcon, Github } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
              <div className="relative w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <LinkIcon className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                TinyLink
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <a
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200"
            >
              Dashboard
            </a>
            <a
              href="/healthz"
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200"
            >
              Health
            </a>
            <div className="w-px h-6 bg-slate-200 mx-2"></div>
            <a
              href="https://github.com/Ajay7548/Linkey"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all duration-200"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
