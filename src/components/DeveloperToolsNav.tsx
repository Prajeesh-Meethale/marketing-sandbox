"use client";

import { useState } from "react";
import Link from "next/link";

export function DeveloperToolsNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs font-mono text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
      >
        <span>🔧 Developer Tools</span>
        <span className="text-[10px]">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-xl rounded-xl p-2 font-mono text-xs space-y-1 text-gray-700">
          <div className="px-3 py-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider border-b border-gray-100">
            Internal Debug Views
          </div>
          <Link 
            href="/evidence" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
          >
            📄 Evidence Explorer
          </Link>
          <Link 
            href="/forensics" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
          >
            🔬 Technical Forensics
          </Link>
          <Link 
            href="/synthesis" 
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-800 font-medium"
          >
            🧩 Synthesis Debug View
          </Link>
        </div>
      )}
    </div>
  );
}
