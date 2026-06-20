'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Camera, 
  Heart, 
  Share2, 
  Monitor, 
  Smartphone, 
  Layers, 
  Music, 
  Zap 
} from 'lucide-react';
import { ShaderBackground } from '@/components/ShaderBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export default function Home() {
  return (
    <>
      <ShaderBackground opacity={0.5} />
      <Navbar />

      <main className="flex-1 w-full relative z-10 pt-28">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-6 overflow-hidden">
          <div className="max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side text */}
            <motion.div 
              className="space-y-8 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.span 
                variants={itemVariants}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-secondary-light/40 text-secondary font-sans font-bold tracking-widest text-[11px] uppercase shadow-sm border border-secondary-light/30"
              >
                <Sparkles className="w-3.5 h-3.5" /> Turn Memories Into Magic
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="font-sans font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-none text-primary"
              >
                Turn Your Memories Into{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent font-serif italic font-normal">
                  Beautiful Surprise Websites
                </span>
              </motion.h1>
              
              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg text-primary-light/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Upload photos, write a message, and create a magical animated website for someone special in seconds. Instant sharing, infinite emotional connection.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
              >
                <Link
                  href="/create"
                  className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2 group text-sm uppercase tracking-wider"
                >
                  Create Memory <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#templates"
                  className="px-8 py-4 bg-white/70 backdrop-blur-md border border-gray-200/80 text-primary rounded-2xl font-bold hover:bg-white/95 transition-all duration-300 inline-flex items-center justify-center gap-2 text-sm uppercase tracking-wider shadow-sm"
                >
                  View Demo
                </Link>
              </motion.div>
            </motion.div>

            {/* Right side floating previews */}
            <motion.div 
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Main Card */}
              <div className="glass-panel p-6 rounded-[2.5rem] shadow-apple border-white/60 backdrop-blur-3xl animate-float max-w-[360px] sm:max-w-[420px] w-full relative z-20">
                <div className="aspect-[4/5] rounded-[1.8rem] overflow-hidden bg-primary-light/5 relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 opacity-80" />
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt="Happy Family Portrait"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJXb9w5_lZ3EKwSxJkthIWx6iZqQGpBlr4RBOLOY6lGO4O-oK1ZyH06OWQIG4lwq1obADQi2KO_JgUcqTntdHgv7wKmvowd9Un8vaw89J5QjbsJwGjeEX9cMdWZnUfAmLk5NB7NKVLbQK7pLih8i6dIvC65N8BOv9i1h7Rvc6-e-3VF8Yt95HRf6CN32u9CZVtfxhjPvXc6_rAgoI28vnn8IT2ecXbQf-hLWBt98OzbbmbNw41mLxK9NYuKb36U9PFgCPSWSr5co8"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <span className="px-3 py-1 rounded-full bg-secondary-light text-secondary font-bold text-[10px] tracking-widest uppercase">
                      BIRTHDAY
                    </span>
                    <h4 className="text-white font-serif italic text-2xl mt-2">Happy Birthday, Dad!</h4>
                  </div>
                </div>
              </div>

              {/* Back Decor Card */}
              <div className="absolute -top-6 -right-6 w-72 aspect-[4/3] glass-panel p-4 rounded-[2rem] shadow-apple border-white/40 rotate-[6deg] -z-10 opacity-70 hidden sm:block">
                <div className="w-full h-full rounded-[1.2rem] overflow-hidden bg-gray-100">
                  <img 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtgiz2QthNew42UDoedWs7V5sHJtaXLXdighBJKlEncl0507mdf0qn6e2bypr7Eqz9PNLn5jQwRRj_qPtCepCD0uSatYFiua96J_07yRx_A6caV4ncJLDfc3VvOoa4ET4Jc5bZMLFyyPnMdKoQyNZhR8Vqu9sSsEutzQyWkawizq5X1ieisa1oX5eGFnYulmP9zBYYr_HMlQduWGuHtOjAfb7Fo5CVn4yON1iPIW-rA-cl4nbkn3j6y5Hqb1CMcvVYt_cAK0yHXJk"
                    alt="Family Dinner Memory"
                  />
                </div>
              </div>

              {/* Bottom Decor Card */}
              <div className="absolute -bottom-8 -left-6 w-64 aspect-square glass-panel p-4 rounded-[2rem] shadow-apple border-white/40 -rotate-[8deg] -z-10 opacity-80 hidden sm:block">
                <div className="w-full h-full rounded-[1.2rem] overflow-hidden bg-gray-100">
                  <img 
                    className="w-full h-full object-cover" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBkibqM9omQQ4zeeWDrCzERqEGBW4JNIZGflXiU1cbJe_kxdUFtAsuqsV-h_EcQZvvf3Pv1gTGoXMmBEwpuyzw46xraQuXDUzF1e1UG2nkV8W9IQnK_gahiPzcrIeqUW5Qy6XW9BHQSOuWgXyhTSwD_TpnEip6DtdnB1fnv7U2Z7KglfZAqsMKOOya23_jjPdbExcVq0eHufOJSYHgmvnNt8TUWnonnEHqU6pHOY-xc0Hi75EKaawS7E60eBbT6DHPos4mN6lRb6c"
                    alt="Child Memory"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 bg-white/40 backdrop-blur-sm relative">
          <div className="max-w-[1120px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-sans font-bold text-3xl sm:text-4xl text-primary">
                How It Works
              </h2>
              <p className="text-sm uppercase font-bold tracking-widest text-secondary mt-2">
                Create a surprise in 4 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Upload Photos',
                  desc: 'Pick 1–5 cherished photos. Drop them right in to create a beautiful memory flow.',
                  icon: Camera,
                  color: 'from-blue-500/10 to-indigo-500/10 text-blue-600',
                },
                {
                  step: '02',
                  title: 'Write Message',
                  desc: 'Add a deeply personal message and optional background music for ambient emotion.',
                  icon: Heart,
                  color: 'from-pink-500/10 to-rose-500/10 text-rose-600',
                },
                {
                  step: '03',
                  title: 'Choose Template',
                  desc: 'Pick a layout style that suits them, from interactive star constellations to luxury glass blocks.',
                  icon: Layers,
                  color: 'from-violet-500/10 to-purple-500/10 text-purple-600',
                },
                {
                  step: '04',
                  title: 'Share the Link',
                  desc: 'Generate a unique magic web link instantly. Send it to surprise and wow them.',
                  icon: Share2,
                  color: 'from-amber-500/10 to-orange-500/10 text-orange-600',
                },
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="glass-panel p-8 rounded-3xl border-gray-100 flex flex-col justify-between hover:shadow-apple transition-all duration-300 group hover:-translate-y-1"
                >
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center`}>
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="font-serif italic text-4xl text-primary/10 group-hover:text-primary/20 transition-colors font-bold">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-sans font-bold text-lg text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-primary-light/70 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Showcase */}
        <section id="templates" className="py-24">
          <div className="max-w-[1120px] mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
              <div>
                <h2 className="font-sans font-bold text-3xl sm:text-4xl text-primary">
                  Premium Templates
                </h2>
                <p className="text-primary-light/70 mt-2 max-w-lg">
                  Every template is crafted to trigger a unique emotional response, adapting seamlessly to any screen size.
                </p>
              </div>
              <Link 
                href="/create"
                className="font-bold tracking-wider text-[11px] uppercase border-b-2 border-primary pb-1 text-primary hover:text-secondary hover:border-secondary transition-colors inline-flex items-center gap-1.5"
              >
                Start Crafting <Sparkles className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  id: 'reveal',
                  title: 'Memory Wall',
                  desc: 'A stunning glassmorphic Bento-grid gallery showcasing floating Polaroid cards with an elegant inline letter and animated floating hearts. Perfect for capturing archives of shared moments.',
                  theme: 'Glassmorphism Bento-grid, floating Polaroids, animated hearts, lightbox zoom.',
                  image: '/stitch_dad_s_memory_wall/screen.png',
                },
                {
                  id: 'legacy',
                  title: 'Legacy Timeline',
                  desc: 'An editorial timeline layout with luxury gold accents. Showcases memories sequentially as chapters in a premium digital memoir book.',
                  theme: 'Editorial layouts, luxury gold accents, scroll animation.',
                  image: '/stitch_father_s_legacy_timeline/screen.png',
                },
                {
                  id: 'scrapbook',
                  title: 'Constellation of Memories',
                  desc: 'A cinematic interactive cosmic journey. Memories are plotted as golden stars in a rotating 3D galaxy constellation. Users navigate the space to discover floating memory nodes before revealing a premium glass letter card.',
                  theme: 'Deep midnight navy, pulsing gold stars, constellation paths, final letter.',
                  image: '/stitch_constellation_of_memories/screen.png',
                },
                {
                  id: 'glass',
                  title: 'Heritage Letter',
                  desc: 'An elegant editorial-style tribute layout. Features alternating full-screen photo narrative blocks, premium typography, and a glassmorphic parchment letter card.',
                  theme: 'Editorial design, alternating layouts, custom parchment cards, scrolling reveals.',
                  image: '/stitch_paternal_heritage_letter_experience/screen.png',
                },
              ].map((template) => (
                <div 
                  key={template.id}
                  className="glass-panel p-6 rounded-[2rem] border-gray-100 flex flex-col justify-between hover:shadow-apple transition-all duration-300 group"
                >
                  <div className="space-y-6">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden relative bg-gray-50 border border-gray-100">
                      <img 
                        src={template.image} 
                        alt={template.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
                      />
                    </div>
                    <div>
                      <h3 className="font-sans font-bold text-xl text-primary">{template.title}</h3>
                      <p className="text-secondary text-[11px] font-bold tracking-widest uppercase mt-1 mb-3">{template.theme}</p>
                      <p className="text-sm text-primary-light/75 leading-relaxed">{template.desc}</p>
                    </div>
                  </div>
                  <div className="pt-6">
                    <Link
                      href={`/create?template=${template.id}`}
                      className="w-full py-3 bg-primary/5 hover:bg-primary hover:text-white text-primary rounded-xl text-xs font-bold uppercase tracking-wider text-center block transition-all duration-300"
                    >
                      Choose this template
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white/40 backdrop-blur-sm">
          <div className="max-w-[1120px] mx-auto px-6 md:px-12">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="font-sans font-bold text-3xl sm:text-4xl text-primary">
                Exceptional Product Features
              </h2>
              <p className="text-primary-light/70 mt-2">
                MemoryVerse combines emotion with state-of-the-art web technology
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Magic Share Links',
                  desc: 'Generate a short, pretty URL like memoryverse.app/m/a7d9f2x that you can easily share via text or chat.',
                  icon: Share2,
                },
                {
                  title: 'Mobile Optimized',
                  desc: 'Fully responsive pages designed to deliver the optimal emotional experience on phones and tablets.',
                  icon: Smartphone,
                },
                {
                  title: 'Beautiful Animations',
                  desc: 'Powered by Framer Motion and WebGL shaders for buttery-smooth visual reveals and premium micro-interactions.',
                  icon: Sparkles,
                },
                {
                  title: 'Custom Soundtrack',
                  desc: 'Optionally embed a background music URL (like a YouTube or MP3 link) to set the mood when the website opens.',
                  icon: Music,
                },
                {
                  title: 'Fast Generation',
                  desc: 'No long signup forms or configuration. Upload your images and get a live link in less than a minute.',
                  icon: Zap,
                },
                {
                  title: 'Visitor Analytics',
                  desc: 'Dashboard to track view counts, share platforms, and device types to see how they reacted.',
                  icon: Monitor,
                },
              ].map((feat, index) => (
                <div key={index} className="glass-panel p-8 rounded-3xl border-gray-100 flex gap-4 hover:shadow-apple transition-shadow duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
                    <feat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-primary mb-1">{feat.title}</h3>
                    <p className="text-primary-light/75 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Section */}
        <section className="py-24 bg-primary text-white overflow-hidden relative">
          {/* Floating glass elements for background depth */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-10 left-10 w-96 h-96 bg-secondary-light rounded-full blur-[120px]" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-[120px]" />
          </div>
          <div className="max-w-[1120px] mx-auto px-6 md:px-12 text-center relative z-10 space-y-8">
            <h2 className="font-sans font-extrabold text-3xl sm:text-5xl tracking-tight max-w-2xl mx-auto leading-tight">
              Create Your First Memory Website
            </h2>
            <p className="text-white/80 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
              Show them how much they mean to you. Upload your favorite photos, add a heartfelt note, and create an unforgettable digital surprise today.
            </p>
            <div className="pt-4">
              <Link
                href="/create"
                className="px-12 py-5 bg-white text-primary rounded-full font-bold hover:scale-105 active:scale-95 transition-transform duration-200 inline-flex items-center gap-2 hover:shadow-2xl text-sm uppercase tracking-wider"
              >
                Create Memory Now <Sparkles className="w-4.5 h-4.5 text-accent fill-accent" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
