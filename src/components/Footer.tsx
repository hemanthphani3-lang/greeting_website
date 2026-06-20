import React from 'react';
import Link from 'next/link';
import { Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-16 bg-white border-t border-gray-100 z-10 relative">
      <div className="max-w-[1120px] mx-auto px-6 md:px-12 flex flex-col items-center gap-6 text-center">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-primary">
            Memory<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Verse</span>
          </span>
        </Link>

        <nav className="flex gap-8 my-4">
          <Link
            href="/#how-it-works"
            className="text-[11px] font-bold uppercase tracking-wider text-primary/60 hover:text-primary transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#templates"
            className="text-[11px] font-bold uppercase tracking-wider text-primary/60 hover:text-primary transition-colors"
          >
            Templates
          </Link>
          <Link
            href="/create"
            className="text-[11px] font-bold uppercase tracking-wider text-primary/60 hover:text-primary transition-colors"
          >
            Create
          </Link>
          <Link
            href="/dashboard"
            className="text-[11px] font-bold uppercase tracking-wider text-primary/60 hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
        </nav>

        <p className="text-xs text-primary/40 flex items-center gap-1.5">
          © {new Date().getFullYear()} MemoryVerse. Crafted with{' '}
          <Heart className="w-3.5 h-3.5 text-accent fill-accent" /> for your special moments.
        </p>
      </div>
    </footer>
  );
};
