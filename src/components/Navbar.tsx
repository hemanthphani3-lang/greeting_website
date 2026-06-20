'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 bg-white/75 backdrop-blur-md border-b border-white/20 shadow-apple'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-[1120px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-primary">
            Memory<span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">Verse</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#how-it-works"
            className="text-sm font-semibold tracking-wide text-primary/80 hover:text-primary transition-colors font-sans uppercase text-[12px]"
          >
            How It Works
          </Link>
          <Link
            href="/#templates"
            className="text-sm font-semibold tracking-wide text-primary/80 hover:text-primary transition-colors font-sans uppercase text-[12px]"
          >
            Templates
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-wide text-primary/80 hover:text-primary transition-colors font-sans uppercase text-[12px]"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 bg-primary text-white text-[12px] font-bold tracking-wider uppercase px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 hover:shadow-lg"
          >
            Login <LogIn className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-primary hover:bg-white/40 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-xl py-6 px-8 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-200">
          <Link
            href="/#how-it-works"
            onClick={() => setIsOpen(false)}
            className="text-sm font-bold uppercase tracking-wider text-primary/80 hover:text-primary py-2 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/#templates"
            onClick={() => setIsOpen(false)}
            className="text-sm font-bold uppercase tracking-wider text-primary/80 hover:text-primary py-2 transition-colors"
          >
            Templates
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setIsOpen(false)}
            className="text-sm font-bold uppercase tracking-wider text-primary/80 hover:text-primary py-2 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white text-[13px] font-bold tracking-wider uppercase py-3.5 rounded-2xl transition-all duration-200"
          >
            Login <LogIn className="w-4 h-4" />
          </Link>
        </div>
      )}
    </nav>
  );
};
