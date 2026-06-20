'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft,
  Share2,
  Check,
  Heart,
  MessageCircle,
  Copy,
  Layers,
  ArrowRight,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { supabase } from '@/lib/supabase';

interface Photo {
  id: string;
  url: string;
  display_order: number;
}

interface Memory {
  id: string;
  recipient_name: string;
  sender_name?: string;
  message: string;
  occasion: string;
  template: string;
  music_url?: string;
  slug: string;
}

interface MemoryContainerProps {
  memory: Memory;
  photos: Photo[];
  isEditable?: boolean;
  isPublishing?: boolean;
  publishProgress?: number;
  publishText?: string;
  onPublish?: (updatedMemory: Partial<Memory>, updatedPhotos: { file?: File; url: string; base64?: string }[]) => Promise<void>;
}

export const MemoryContainer: React.FC<MemoryContainerProps> = ({ 
  memory, 
  photos,
  isEditable = false,
  isPublishing = false,
  publishProgress = 0,
  publishText = '',
  onPublish
}) => {
  const [opened, setOpened] = useState(isEditable); // Always open in edit mode
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Helper: Get occasion quote
  const getOccasionQuote = (occasion: string) => {
    switch (occasion) {
      case 'fathersday':
        return "The heart of a father is the masterpiece of nature. It carries the weight of a world and the lightness of a child's laughter all at once.";
      case 'mothersday':
        return "All that I am, or hope to be, I owe to my angel mother. Her strength and warmth are the pillars of our lives.";
      case 'birthday':
        return "Count your life by smiles, not tears. Count your age by friends, not years. Today we celebrate the beautiful chapters of your journey.";
      case 'anniversary':
        return "The best thing to hold onto in life is each other. Together, you have built a timeless legacy of love, commitment, and companionship.";
      case 'friendship':
        return "A real friend is one who walks in when the rest of the world walks out. Your friendship has been a guiding light through the years.";
      default:
        return "Life is not measured by the number of breaths we take, but by the moments that take our breath away.";
    }
  };

  // Helper: Get default timeline titles/descriptions
  const getTimelineReflections = (index: number) => {
    const titles = ["The Foundation", "Walking the Path", "Quiet Strength", "Cherished Laughs", "Enduring Legacy"];
    const descriptions = [
      "From early mornings to shared dreams, the foundation of love and integrity carved in every action.",
      "Guiding hands through every milestone, providing a warm presence that defined a generation.",
      "The quiet confidence and support that taught us to stand tall and walk with pride.",
      "Moments filled with smiles, laughter, and the simple joys that make our house a warm home.",
      "An enduring legacy that lives on through lessons taught and memories beautifully preserved."
    ];
    return {
      title: titles[index % titles.length],
      desc: descriptions[index % descriptions.length]
    };
  };

  // Helper: Get galaxy default quote
  const getGalaxyDefaultQuote = (index: number) => {
    const relation = selectedOccasion === 'mothersday' ? "mother's" : selectedOccasion === 'birthday' ? "loved one's" : "father's";
    const quotes = [
      "Every guiding light in my life began with you.",
      "You taught me to reach for the stars without losing my gravity.",
      `A ${relation} hand is the first compass a child ever knows.`,
      "In the galaxy of my life, you are the North Star.",
      "Love is the gravity that keeps our family constellation together."
    ];
    return quotes[index % quotes.length];
  };

  // Helper: Get default template-specific titles
  const getDefaultChapterTitle = (template: string, index: number) => {
    if (template === 'reveal') { // Memory Wall
      const captions = [
        "The day we met. 1985.",
        "Our North Star.",
        "Exploring the Cascades together.",
        "Learning the classics.",
        "Laughter that filled the house."
      ];
      return captions[index % captions.length];
    }
    if (template === 'legacy') {
      const titles = ["The Foundation", "Walking the Path", "Quiet Strength", "Cherished Laughs", "Enduring Legacy"];
      return titles[index % titles.length];
    }
    if (template === 'scrapbook') {
      return getGalaxyDefaultQuote(index);
    }
    return "Moment Chapters";
  };

  // Helper: Get default template-specific descriptions
  const getDefaultChapterDesc = (template: string, index: number) => {
    if (template === 'legacy') {
      const descriptions = [
        "From early mornings to shared dreams, the foundation of love and integrity carved in every action.",
        "Guiding hands through every milestone, providing a warm presence that defined a generation.",
        "The quiet confidence and support that taught us to stand tall and walk with pride.",
        "Moments filled with smiles, laughter, and the simple joys that make our house a warm home.",
        "An enduring legacy that lives on through lessons taught and memories beautifully preserved."
      ];
      return descriptions[index % descriptions.length];
    }
    return "";
  };

  // Helper: Parse message payload
  const parseMessageData = (rawMessage: string) => {
    try {
      if (rawMessage && rawMessage.trim().startsWith('{')) {
        const parsed = JSON.parse(rawMessage);
        return {
          personalLetter: parsed.personalLetter || rawMessage,
          heroQuote: parsed.heroQuote || '',
          chapters: parsed.chapters || [],
          sectionTitle: parsed.sectionTitle || '',
          middleQuote: parsed.middleQuote || '',
          customTitle: parsed.customTitle || '',
          finalHeading: parsed.finalHeading || '',
          finalSubtitle: parsed.finalSubtitle || ''
        };
      }
    } catch (e) {}
    return {
      personalLetter: rawMessage,
      heroQuote: '',
      chapters: [],
      sectionTitle: '',
      middleQuote: '',
      customTitle: '',
      finalHeading: '',
      finalSubtitle: ''
    };
  };

  // Editable states
  const [recipientName, setRecipientName] = useState(memory.recipient_name);
  const [senderName, setSenderName] = useState(memory.sender_name || '');
  const [message, setMessage] = useState(memory.message);
  const [musicUrl, setMusicUrl] = useState(memory.music_url || '');
  const [selectedTemplate, setSelectedTemplate] = useState(memory.template);
  const [selectedOccasion, setSelectedOccasion] = useState(memory.occasion);
  const [localPhotos, setLocalPhotos] = useState<{ id: string; url: string; file?: File; base64?: string }[]>([]);

  // Parsed template fields
  const initialMsgData = parseMessageData(memory.message);
  const [personalLetter, setPersonalLetter] = useState(initialMsgData.personalLetter);
  const [heroQuote, setHeroQuote] = useState(initialMsgData.heroQuote);
  const [chapters, setChapters] = useState<{ title: string; desc: string }[]>(initialMsgData.chapters);
  const [sectionTitle, setSectionTitle] = useState(initialMsgData.sectionTitle);
  const [middleQuote, setMiddleQuote] = useState(initialMsgData.middleQuote);
  const [customTitle, setCustomTitle] = useState(initialMsgData.customTitle);
  const [finalHeading, setFinalHeading] = useState(initialMsgData.finalHeading || '');
  const [finalSubtitle, setFinalSubtitle] = useState(initialMsgData.finalSubtitle || '');

  // Memory Wall Template States
  const [activePhotoModal, setActivePhotoModal] = useState<number | null>(null);
  const [hearts, setHearts] = useState<{ id: number; left: string; size: string; delay: string; color: string }[]>([]);

  // Galaxy Template States
  const [galaxySection, setGalaxySection] = useState<'opening' | 'journey'>('opening');
  const [discoveredNodes, setDiscoveredNodes] = useState<Set<number>>(new Set());
  const [activeGalaxyNode, setActiveGalaxyNode] = useState<number | null>(null);
  const [galaxyStars, setGalaxyStars] = useState<{ id: number; top: string; left: string; size: string; opacity: number }[]>([]);

  useEffect(() => {
    const colors = ['#d4af37', '#e5c06d', '#f1d292', '#ffffff', '#ba1a1a'];
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 20 + 10}px`,
      delay: `${Math.random() * 5}s`,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setHearts(generated);

    // Galaxy Stars generator
    const starsGen = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random() * 0.7 + 0.3
    }));
    setGalaxyStars(starsGen);
  }, []);

  // Sync interactions from Three.js iframe
  useEffect(() => {
    if (selectedTemplate !== 'scrapbook') return;

    const handleIframeMessage = (event: MessageEvent) => {
      if (!event.data) return;

      if (event.data.type === 'GALAXY_NODE_CLICK') {
        const nodeId = event.data.nodeId;
        setActiveGalaxyNode(nodeId);
      } else if (event.data.type === 'GALAXY_IFRAME_READY') {
        // Send current discovered stars state to the iframe that just loaded
        const iframes = document.querySelectorAll('iframe[title="3D Constellation"]');
        iframes.forEach((iframe) => {
          const win = (iframe as HTMLIFrameElement).contentWindow;
          if (win && win === event.source) {
            win.postMessage({
              type: 'UPDATE_STATE',
              discoveredIds: Array.from(discoveredNodes)
            }, '*');
          }
        });
      }
    };

    window.addEventListener('message', handleIframeMessage);
    return () => window.removeEventListener('message', handleIframeMessage);
  }, [discoveredNodes, selectedTemplate]);

  // Keep Three.js iframes updated on discovered nodes changes
  useEffect(() => {
    if (selectedTemplate !== 'scrapbook') return;
    const iframes = document.querySelectorAll('iframe[title="3D Constellation"]');
    iframes.forEach((iframe) => {
      const win = (iframe as HTMLIFrameElement).contentWindow;
      if (win) {
        win.postMessage({
          type: 'UPDATE_STATE',
          discoveredIds: Array.from(discoveredNodes)
        }, '*');
      }
    });
  }, [discoveredNodes, selectedTemplate]);

  // Music ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);

  // Sync props to states
  useEffect(() => {
    setRecipientName(memory.recipient_name);
    setSenderName(memory.sender_name || '');
    setMessage(memory.message);
    setMusicUrl(memory.music_url || '');
    setSelectedTemplate(memory.template);
    setSelectedOccasion(memory.occasion);
    setLocalPhotos(photos.map(p => ({ id: p.id, url: p.url })));

    const msgData = parseMessageData(memory.message);
    setPersonalLetter(msgData.personalLetter);
    setHeroQuote(msgData.heroQuote);
    setChapters(msgData.chapters);
    setSectionTitle(msgData.sectionTitle);
    setMiddleQuote(msgData.middleQuote);
    setCustomTitle(msgData.customTitle);
    setFinalHeading(msgData.finalHeading || '');
    setFinalSubtitle(msgData.finalSubtitle || '');
  }, [memory, photos]);

  // Sync chapters length with localPhotos length
  useEffect(() => {
    if (localPhotos.length > 0) {
      setChapters(prev => {
        const updated = [...prev];
        let changed = false;
        for (let i = 0; i < localPhotos.length; i++) {
          if (!updated[i]) {
            const defaults = getTimelineReflections(i);
            updated[i] = { title: defaults.title, desc: defaults.desc };
            changed = true;
          }
        }
        return changed ? updated : prev;
      });
    }
  }, [localPhotos]);

  // Chapter editing helper
  const handleChapterChange = (index: number, field: 'title' | 'desc', value: string) => {
    setChapters(prev => {
      const updated = [...prev];
      for (let i = 0; i <= index; i++) {
        if (!updated[i]) {
          const defaults = getTimelineReflections(i);
          updated[i] = { title: defaults.title, desc: defaults.desc };
        }
      }
      updated[index] = {
        ...updated[index],
        [field]: value
      };
      return updated;
    });
  };

  // Chapter helpers for views
  const getChapterTitle = (index: number) => {
    if (chapters && chapters[index] && chapters[index].title) {
      return chapters[index].title;
    }
    return getDefaultChapterTitle(selectedTemplate, index);
  };

  const getChapterDesc = (index: number) => {
    if (chapters && chapters[index] && chapters[index].desc) {
      return chapters[index].desc;
    }
    return getDefaultChapterDesc(selectedTemplate, index);
  };

  // Track page view (only if not in editable mode)
  useEffect(() => {
    if (isEditable) return;
    const logView = async () => {
      let device = 'Desktop';
      if (typeof window !== 'undefined') {
        const ua = navigator.userAgent;
        if (/tablet|ipad|playbook|silk/i.test(ua)) {
          device = 'Tablet';
        } else if (/mobile|iphone|ipod|android|blackberry|opera mini|windows phone/i.test(ua)) {
          device = 'Mobile';
        }
      }

      await supabase.from('memory_views').insert({
        memory_id: memory.id,
        device_type: device,
        country: 'Unknown'
      });
    };
    logView();
  }, [memory.id, isEditable]);

  // Track share platform
  const logShare = async (platform: string) => {
    if (isEditable) return;
    await supabase.from('memory_shares').insert({
      memory_id: memory.id,
      platform
    });
  };

  const handleOpenSurprise = () => {
    setOpened(true);
    setIsPlaying(true);
    
    // Play music if URL is present
    if (audioRef.current) {
      audioRef.current.play().catch(err => {
        console.warn('Audio play blocked:', err);
      });
    }

    // Trigger full screen confetti burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    logShare('copy_link');
    setTimeout(() => setCopied(false), 2000);
  };

  // Image compressor helper
  const compressImage = (file: File): Promise<{ base64: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
            resolve({ base64: compressedBase64 });
          } else {
            resolve({ base64: event.target?.result as string });
          }
        };
        img.src = event.target?.result as string;
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Trigger file selection for replacing image
  const triggerPhotoReplace = (index: number) => {
    if (!isEditable) return;
    setReplacingIndex(index);
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || replacingIndex === null) return;
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      const { base64 } = await compressImage(file);
      setLocalPhotos(prev => {
        const updated = [...prev];
        updated[replacingIndex] = {
          ...updated[replacingIndex],
          url: preview,
          file,
          base64
        };
        return updated;
      });
    }
    setReplacingIndex(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Publish handler
  const handlePublishClick = () => {
    if (!onPublish) return;

    const messagePayload = JSON.stringify({
      personalLetter: personalLetter,
      heroQuote: heroQuote || getOccasionQuote(selectedOccasion),
      chapters: chapters.length > 0 ? chapters : localPhotos.map((_, i) => getTimelineReflections(i)),
      sectionTitle: sectionTitle || 'The Chapters of a Life',
      middleQuote: middleQuote || 'The beauty of a lifetime is found in the moments we share, the lessons we carry, and the footprints of love we leave behind.',
      customTitle: customTitle,
      finalHeading: finalHeading,
      finalSubtitle: finalSubtitle
    });

    onPublish(
      {
        recipient_name: recipientName,
        sender_name: senderName || undefined,
        message: messagePayload,
        music_url: musicUrl || undefined,
        template: selectedTemplate,
        occasion: selectedOccasion
      },
      localPhotos
    );
  };

  // YouTube audio parser
  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoId}`;
    }
    return '';
  };

  const youtubeEmbed = musicUrl ? getYoutubeEmbedUrl(musicUrl) : '';

  // Render Template 1: Memory Wall (Museum Gallery style)
  const renderWallTemplate = () => {
    const hasExtraPhoto = localPhotos.length > 5;

    const renderPolaroidCard = (idx: number, colSpan: string, rotation: string, delay: string, aspectClass: string) => {
      const actualIdx = hasExtraPhoto ? idx : idx - 1;
      const photo = localPhotos[actualIdx];
      if (!photo) return null;

      return (
        <div 
          className={`${colSpan} polaroid-float cursor-pointer group w-full`} 
          style={{ '--tw-rotate': rotation, 'animationDelay': delay } as React.CSSProperties}
          onClick={() => !isEditable && setActivePhotoModal(actualIdx)}
        >
          <div className="glass-card p-4 pb-12 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:z-30 relative rounded-2xl">
            <div className={`${aspectClass} overflow-hidden bg-gray-100 relative rounded-xl`}>
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] z-10 pointer-events-none"></div>
              <img src={photo.url} alt="Memory Card" className="w-full h-full object-cover" />
              {isEditable && (
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerPhotoReplace(actualIdx);
                  }}
                  className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Replace</span>
                </div>
              )}
            </div>
            {isEditable ? (
              <input
                type="text"
                value={getChapterTitle(actualIdx)}
                onChange={(e) => handleChapterChange(actualIdx, 'title', e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="font-message-script text-center mt-6 text-[#4d4635] bg-transparent border-b border-dashed border-gray-300 focus:outline-none w-full text-lg"
                placeholder="Card Caption"
              />
            ) : (
              <p className="font-message-script text-center mt-6 text-[#4d4635] text-lg">
                {getChapterTitle(actualIdx)}
              </p>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="bg-[#f9f9f9] text-[#1a1c1c] font-sans min-h-screen w-full relative">
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Epilogue:wght@400&display=swap');
          
          .font-serif {
              font-family: 'Playfair Display', Georgia, serif;
          }
          .font-sans {
              font-family: 'Inter', sans-serif;
          }
          .font-message-script {
              font-family: 'Epilogue', sans-serif;
          }
          .glass-card {
              background: rgba(255, 255, 255, 0.4);
              backdrop-filter: blur(32px);
              -webkit-backdrop-filter: blur(32px);
              border: 1px solid rgba(255, 255, 255, 0.7);
          }
          .shimmer-btn {
              position: relative;
              overflow: hidden;
          }
          .shimmer-btn::after {
              content: '';
              position: absolute;
              top: -50%;
              left: -50%;
              width: 200%;
              height: 200%;
              background: linear-gradient(45deg, transparent, rgba(212, 175, 55, 0.1), transparent);
              transform: rotate(45deg);
              transition: 0.5s;
          }
          .shimmer-btn:hover::after {
              left: 100%;
          }
          .polaroid-float {
              animation: float 6s ease-in-out infinite;
          }
          @keyframes float {
              0%, 100% { transform: translateY(0) rotate(var(--tw-rotate, 0deg)); }
              50% { transform: translateY(-15px) rotate(calc(var(--tw-rotate, 0deg) + 2deg)); }
          }
          @keyframes float-heart {
              0% {
                  transform: translateY(0) translateX(0) rotate(0deg);
                  opacity: 0.8;
              }
              100% {
                  transform: translateY(-600px) translateX(50px) rotate(360deg);
                  opacity: 0;
              }
          }
          .animate-float-heart {
              animation: float-heart 6s linear infinite;
          }
        `}} />

        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f9f9f9]/95 z-10"></div>
            {localPhotos[0] ? (
              <img 
                src={localPhotos[0].url} 
                alt="Memoir cover" 
                className="w-full h-full object-cover grayscale-[10%] brightness-[70%] scale-102" 
              />
            ) : (
              <div className="w-full h-full bg-[#1a1c1c] flex items-center justify-center">
                <span className="text-white opacity-40">A Digital Heirloom</span>
              </div>
            )}
            {isEditable && (
              <div 
                onClick={() => triggerPhotoReplace(0)}
                className="absolute inset-0 bg-black/25 hover:bg-black/45 transition-colors flex items-center justify-center cursor-pointer z-10 group"
              >
                <div className="bg-black/60 hover:bg-black/85 border border-white/10 backdrop-blur-md text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <Upload className="w-4 h-4 text-accent fill-accent" />
                  <span>Change Cover Image</span>
                </div>
              </div>
            )}
          </div>
          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto space-y-8 flex flex-col items-center">
            {isEditable ? (
              <div className="flex flex-col items-center gap-2 w-full">
                <input
                  type="text"
                  value={customTitle || "To My Hero,"}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="text-center font-serif text-3xl md:text-5xl font-bold text-[#1a1c1c] bg-transparent border-b border-dashed border-gray-400 focus:outline-none py-1 max-w-md w-full"
                  placeholder="Title Prefix"
                />
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="text-center font-serif text-4xl md:text-7xl text-[#735c00] italic font-bold bg-transparent border-b border-dashed border-[#735c00]/30 focus:outline-none py-1 mt-2 max-w-xl w-full"
                  placeholder="Recipient Name"
                />
              </div>
            ) : (
              <h1 className="font-serif text-5xl md:text-7xl text-[#1a1c1c] leading-tight font-bold">
                {customTitle || "To My Hero,"}<br/><span className="text-[#735c00] italic font-normal">{recipientName}</span>
              </h1>
            )}
            
            {isEditable ? (
              <textarea
                value={heroQuote || "A life lived with purpose, a heart filled with kindness, and a legacy that will forever guide our path. Welcome to our living tribute."}
                onChange={(e) => setHeroQuote(e.target.value)}
                rows={3}
                className="font-sans text-body-main text-[#4d4635] max-w-2xl mx-auto leading-relaxed text-center bg-transparent border border-dashed border-gray-300 focus:border-[#735c00] focus:outline-none rounded-xl p-4 w-full h-24 resize-none"
                placeholder="Hero Description"
              />
            ) : (
              <p className="font-sans text-[#4d4635] text-lg max-w-2xl mx-auto leading-relaxed">
                {heroQuote || "A life lived with purpose, a heart filled with kindness, and a legacy that will forever guide our path. Welcome to our living tribute."}
              </p>
            )}

            <div className="pt-8">
              <a 
                className="shimmer-btn inline-flex items-center gap-2 px-10 py-4 bg-[#735c00] text-white rounded-full font-semibold transition-all hover:shadow-xl hover:-translate-y-0.5 active:scale-95" 
                href="#gallery"
              >
                Enter the Gallery
                <span className="text-sm">↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* Memory Wall Bento Gallery Section */}
        <section className="py-24 bg-[#f3f3f4] relative overflow-hidden" id="gallery">
          <div className="max-w-[1200px] mx-auto px-6 md:px-12">
            <div className="text-center mb-16 space-y-2">
              <span className="font-sans text-xs font-bold tracking-widest text-[#735c00] uppercase block">Exhibit One</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1a1c1c]">The Archives</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[800px] perspective-1000 items-center justify-items-center w-full">
              {/* Card 1 */}
              {renderPolaroidCard(1, 'md:col-span-4', '-3deg', '0s', 'aspect-[4/5]')}
              {/* Card 2 */}
              {renderPolaroidCard(2, 'md:col-span-3', '2deg', '1s', 'aspect-square')}
              {/* Card 3 */}
              {renderPolaroidCard(3, 'md:col-span-5', '-1deg', '2s', 'aspect-[16/10]')}
              {/* Card 4 */}
              {renderPolaroidCard(4, 'md:col-span-4 md:col-start-2', '4deg', '1.5s', 'aspect-square')}
              {/* Card 5 */}
              {renderPolaroidCard(5, 'md:col-span-5', '-2.5deg', '0.5s', 'aspect-[4/3]')}
            </div>
          </div>
        </section>

        {/* Message Section */}
        <section className="py-24 px-6" id="message">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-8 md:p-24 rounded-[32px] text-center relative overflow-hidden border border-white/60">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#d4af37] via-[#735c00] to-[#d4af37]"></div>
              <span className="text-6xl text-[#735c00] font-serif block mb-8 opacity-40">“</span>
              
              {isEditable ? (
                <textarea
                  value={middleQuote || "A father is neither an anchor to hold us back, nor a sail to take us there, but a guiding light whose love shows us the way."}
                  onChange={(e) => setMiddleQuote(e.target.value)}
                  rows={2}
                  className="font-serif italic text-xl md:text-3xl text-[#1a1c1c] leading-relaxed text-center bg-transparent border border-dashed border-gray-300 focus:border-[#735c00] focus:outline-none rounded-xl p-4 w-full h-24 resize-none mb-8"
                  placeholder="Section Quote"
                />
              ) : (
                <h3 className="font-serif text-xl md:text-3xl font-semibold text-[#1a1c1c] mb-8 italic leading-relaxed">
                  "{middleQuote || "A father is neither an anchor to hold us back, nor a sail to take us there, but a guiding light whose love shows us the way."}"
                </h3>
              )}
              
              {isEditable ? (
                <textarea
                  value={personalLetter}
                  onChange={(e) => setPersonalLetter(e.target.value)}
                  className="font-message-script text-lg md:text-xl text-[#4d4635] leading-relaxed text-center bg-transparent border border-dashed border-gray-300 focus:border-[#735c00] focus:outline-none rounded-xl p-6 w-full h-64 resize-none"
                  placeholder="Write your long-form message..."
                />
              ) : (
                <div className="space-y-6 font-message-script text-lg md:text-xl text-[#4d4635] text-left md:text-center leading-relaxed">
                  {personalLetter.split('\n\n').map((para: string, pIdx: number) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>
              )}

              {isEditable ? (
                <div className="mt-12 flex flex-col items-center">
                  <div className="w-24 h-px bg-gray-200 mb-4"></div>
                  <div className="flex items-center gap-1.5 justify-center">
                    <span className="text-[10px] font-sans font-bold tracking-widest text-[#735c00] uppercase">With Eternal Love,</span>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="text-sm font-sans font-bold tracking-widest text-[#735c00] uppercase bg-transparent border-b border-dashed border-gray-300 focus:outline-none w-48 text-center"
                      placeholder="Sender Name"
                    />
                  </div>
                </div>
              ) : (
                <div className="mt-12 flex flex-col items-center">
                  <div className="w-24 h-px bg-gray-200 mb-4"></div>
                  <p className="font-sans text-xs font-bold tracking-widest text-[#735c00] uppercase">
                    With Eternal Love, {senderName || 'Your Family'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Legacy / Thank You Section */}
        <section className="py-24 relative min-h-[600px] flex items-center justify-center text-center overflow-hidden bg-white" id="legacy">
          {/* Animated Heart Particle Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-30 z-0">
            {hearts.map(h => (
              <span
                key={h.id}
                className="absolute bottom-[-20px] animate-float-heart"
                style={{
                  left: h.left,
                  fontSize: h.size,
                  color: h.color,
                  animationDelay: h.delay,
                  animationDuration: '6s',
                  animationIterationCount: 'infinite',
                  animationTimingFunction: 'linear'
                } as React.CSSProperties}
              >
                ❤
              </span>
            ))}
          </div>

          <div className="relative z-10 max-w-2xl px-6 space-y-6 flex flex-col items-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-20 bg-[#d4af37]/35"></div>
              <span className="text-[#735c00]">★</span>
              <div className="h-px w-20 bg-[#d4af37]/35"></div>
            </div>
            
            {isEditable ? (
              <input
                type="text"
                value={sectionTitle || `Thank You, ${recipientName}`}
                onChange={(e) => setSectionTitle(e.target.value)}
                placeholder="Legacy Section Header"
                className="font-serif text-3xl md:text-5xl font-bold text-[#1a1c1c] mb-6 bg-transparent border-b border-dashed border-gray-300 focus:outline-none text-center max-w-xl w-full"
              />
            ) : (
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1a1c1c] mb-6">
                {sectionTitle || `Thank You, ${recipientName}`}
              </h2>
            )}

            <p className="font-sans text-[#4d4635] text-lg leading-relaxed mb-12">
              This {selectedOccasion === 'fathersday' ? "Father's Day" : selectedOccasion === 'mothersday' ? "Mother's Day" : selectedOccasion === 'birthday' ? "Birthday" : "special occasion"}, we celebrate the man you were and the legacy you've left behind. You will always be our hero.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  confetti({ particleCount: 50, spread: 60 });
                }}
                className="px-8 py-3 bg-[#735c00] text-white rounded-full font-semibold shadow-md hover:bg-[#735c00]/90 transition-all hover:scale-103 active:scale-97 cursor-pointer"
              >
                Replay Tribute
              </button>
              {!isEditable && (
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="px-8 py-3 border border-[#735c00] text-[#735c00] hover:bg-[#735c00]/5 rounded-full font-semibold transition-all hover:scale-103 active:scale-97 cursor-pointer"
                >
                  Share Memory
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Large Zoom Glass Modal */}
        {activePhotoModal !== null && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity duration-300 cursor-pointer"
            onClick={() => setActivePhotoModal(null)}
          >
            <div 
              className="relative max-w-4xl w-full glass-card p-4 rounded-3xl shadow-2xl overflow-hidden cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-6 right-6 z-50 bg-white/20 hover:bg-white/40 p-2 rounded-full transition-all text-white cursor-pointer"
                onClick={() => setActivePhotoModal(null)}
              >
                <span className="text-lg font-bold block px-2 py-0.5">✕</span>
              </button>
              <div className="w-full min-h-[300px] flex items-center justify-center bg-black/10 rounded-2xl overflow-hidden p-2">
                <img 
                  src={localPhotos[activePhotoModal]?.url} 
                  alt="Enlarged Memory" 
                  className="max-h-[70vh] object-contain shadow-lg rounded-xl" 
                />
              </div>
              <div className="p-6 text-center font-message-script text-2xl text-[#1a1c1c]">
                {getChapterTitle(activePhotoModal)}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Template 2: Legacy Timeline (Digital Heirloom style)
  const renderLegacyTemplate = () => {
    const occasionQuote = getOccasionQuote(selectedOccasion);

    return (
      <div className="bg-[#fbfbfd] text-[#1a1b1f] font-sans min-h-screen w-full">
        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            {localPhotos[0] ? (
              <img 
                src={localPhotos[0].url} 
                alt="Memoir cover" 
                className="w-full h-full object-cover grayscale-[20%] brightness-[60%] scale-105" 
              />
            ) : (
              <div className="w-full h-full bg-[#1a1b1f] flex items-center justify-center">
                <span className="text-white opacity-40">A Digital Heirloom</span>
              </div>
            )}
            {isEditable && (
              <div 
                onClick={() => triggerPhotoReplace(0)}
                className="absolute inset-0 bg-black/25 hover:bg-black/45 transition-colors flex items-center justify-center cursor-pointer z-10 group"
              >
                <div className="bg-black/60 hover:bg-black/85 border border-white/10 backdrop-blur-md text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <Upload className="w-4 h-4 text-accent fill-accent" />
                  <span>Change Cover Image</span>
                </div>
              </div>
            )}
          </div>
          <div className="relative z-20 text-center px-6 space-y-6 w-full flex flex-col items-center">
            {isEditable ? (
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Recipient Name"
                className="font-serif text-4xl sm:text-7xl font-bold text-white tracking-tight leading-none text-center bg-transparent border-b border-dashed border-white/40 focus:border-white focus:outline-none max-w-xl py-2"
              />
            ) : (
              <h1 className="font-serif text-5xl sm:text-7xl font-bold text-white tracking-tight leading-none">
                {recipientName}
              </h1>
            )}
            
            {isEditable ? (
              <textarea
                value={heroQuote || occasionQuote}
                onChange={(e) => setHeroQuote(e.target.value)}
                placeholder="Write a custom hero quote..."
                rows={3}
                className="font-serif italic text-lg sm:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed text-center bg-transparent border-b border-dashed border-white/40 focus:border-white focus:outline-none w-full max-w-xl resize-none py-1"
              />
            ) : (
              <p className="font-serif italic text-lg sm:text-2xl text-white/95 max-w-2xl mx-auto leading-relaxed">
                "{heroQuote || occasionQuote}"
              </p>
            )}
            <div className="pt-16 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">Scroll to Explore</span>
              <div className="w-px h-16 bg-gradient-to-b from-[#C5A059] to-transparent animate-bounce" />
            </div>
          </div>
        </section>

        {/* Memory Timeline Section */}
        <section className="relative py-24 bg-[#FAF8FE] overflow-hidden" id="journey">
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
              <circle cx="200" cy="150" fill="#c5a059" r="100" opacity="0.1" className="animate-pulse" />
              <circle cx="600" cy="450" fill="#c5a059" r="150" opacity="0.08" className="animate-pulse" />
            </svg>
          </div>

          <div className="max-w-[1120px] mx-auto px-6 md:px-12 relative">
            <div className="text-center mb-24 space-y-4 flex flex-col items-center">
              <div className="w-12 h-1 bg-[#C5A059] mx-auto" />
              {isEditable ? (
                <input
                  type="text"
                  value={sectionTitle || 'The Chapters of a Life'}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  placeholder="Section Title"
                  className="font-serif text-3xl md:text-5xl font-bold text-[#1A1A1A] bg-transparent border-b border-dashed border-gray-400 focus:border-primary focus:outline-none text-center max-w-xl py-1"
                />
              ) : (
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#1A1A1A]">
                  {sectionTitle || "The Chapters of a Life"}
                </h2>
              )}
            </div>

            <div className="absolute left-1/2 top-48 bottom-0 w-px bg-gradient-to-b from-[#C5A059] via-[#C5A059] to-transparent -translate-x-1/2 hidden md:block" />

            <div className="space-y-24 relative">
              {localPhotos.slice(1).map((photo, i) => {
                const globalIdx = i + 1;
                const isLeft = i % 2 === 0;

                const cardContent = (
                  <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-md hover:shadow-xl transition-shadow relative group text-left">
                    <div className="overflow-hidden rounded-xl mb-6 aspect-video relative">
                      <img 
                        src={photo.url} 
                        alt="Timeline Memory" 
                        className="w-full h-full object-cover hover:scale-103 transition-transform duration-700" 
                      />
                      {isEditable && (
                        <div 
                          onClick={() => triggerPhotoReplace(globalIdx)}
                          className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Upload className="w-6 h-6 mb-1" />
                          <span className="text-[10px] uppercase font-bold tracking-wider">Replace</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest text-[#C5A059] uppercase block mb-2">
                      Chapter {i + 1}
                    </span>
                    {isEditable ? (
                      <input
                        type="text"
                        value={getChapterTitle(globalIdx)}
                        onChange={(e) => handleChapterChange(globalIdx, 'title', e.target.value)}
                        placeholder="Chapter Title"
                        className="font-serif text-2xl font-bold mb-3 text-[#1A1A1A] bg-transparent border-b border-dashed border-gray-300 focus:border-primary focus:outline-none w-full"
                      />
                    ) : (
                      <h3 className="font-serif text-2xl font-bold mb-3 text-[#1A1A1A]">{getChapterTitle(globalIdx)}</h3>
                    )}
                    {isEditable ? (
                      <textarea
                        value={getChapterDesc(globalIdx)}
                        onChange={(e) => handleChapterChange(globalIdx, 'desc', e.target.value)}
                        placeholder="Chapter Description"
                        rows={3}
                        className="text-sm text-primary-light/80 leading-relaxed font-sans bg-transparent border border-dashed border-gray-300 focus:border-primary focus:outline-none w-full rounded-lg p-2 resize-none"
                      />
                    ) : (
                      <p className="text-sm text-primary-light/80 leading-relaxed font-sans">{getChapterDesc(globalIdx)}</p>
                    )}
                  </div>
                );

                return (
                  <div key={photo.id || globalIdx} className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">
                    {/* Left node */}
                    <div className="w-full md:w-[46%] order-2 md:order-1">
                      {isLeft && (
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6 }}
                        >
                          {cardContent}
                        </motion.div>
                      )}
                    </div>

                    {/* Timeline Node Glow Bullet */}
                    <div className="hidden md:flex w-9 h-9 rounded-full bg-[#C5A059] z-10 items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.4)] order-2 md:order-2">
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    </div>

                    {/* Right node */}
                    <div className="w-full md:w-[46%] order-2 md:order-3">
                      {!isLeft && (
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6 }}
                        >
                          {cardContent}
                        </motion.div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dynamic Interactive Quote */}
        <section className="py-20 bg-[#F5F5F7] border-y border-gray-200/50 text-center">
          <div className="max-w-3xl mx-auto px-6 space-y-6 flex flex-col items-center">
            <div className="w-16 h-px bg-[#C5A059] mx-auto" />
            {isEditable ? (
              <textarea
                value={middleQuote || 'The beauty of a lifetime is found in the moments we share, the lessons we carry, and the footprints of love we leave behind.'}
                onChange={(e) => setMiddleQuote(e.target.value)}
                placeholder="Write a custom middle quote..."
                rows={3}
                className="font-serif italic text-xl md:text-3xl text-[#1A1A1A] leading-relaxed text-center bg-transparent border-b border-dashed border-gray-400 focus:border-primary focus:outline-none w-full max-w-3xl mx-auto resize-none py-1"
              />
            ) : (
              <blockquote className="font-serif italic text-xl md:text-3xl text-[#1A1A1A] leading-relaxed">
                "{middleQuote || "The beauty of a lifetime is found in the moments we share, the lessons we carry, and the footprints of love we leave behind."}"
              </blockquote>
            )}
            <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Digital Memoir Quote</p>
          </div>
        </section>

        {/* Personal Letter/Message Section */}
        <section className="py-24 max-w-4xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 md:p-16 rounded-[2rem] border border-gray-100 shadow-xl relative overflow-hidden text-center"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
              <span className="text-9xl font-serif">“</span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#1A1A1A] border-b border-[#C5A059] pb-4 inline-block mb-10">
              A Personal Letter
            </h2>
            
            {isEditable ? (
              <div className="space-y-4 w-full">
                <textarea
                  value={personalLetter}
                  onChange={(e) => setPersonalLetter(e.target.value)}
                  className="font-serif italic text-lg md:text-2xl text-[#1a1b1f] leading-relaxed text-center bg-transparent border border-dashed border-gray-300 focus:border-[#C5A059] focus:outline-none rounded-xl p-4 w-full h-40 resize-none font-sans"
                  placeholder="Write your personal letter..."
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">With Love,</span>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="font-serif text-xl font-bold text-[#C5A059] bg-transparent border-b border-dashed border-gray-300 focus:border-[#C5A059] focus:outline-none text-center"
                    placeholder="Your Name (Sender)"
                  />
                </div>
              </div>
            ) : (
              <>
                <p className="font-serif italic text-lg md:text-2xl text-[#1a1b1f] leading-relaxed mb-10">
                  "{personalLetter}"
                </p>
                {senderName && (
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">With Love,</span>
                    <span className="font-serif text-xl font-bold text-[#C5A059]">{senderName}</span>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </section>

        {/* Final Replay/Share Section */}
        <section className="py-24 bg-[#1A1A1A] text-white text-center space-y-12">
          <div className="max-w-xl mx-auto px-6 space-y-4">
            <h2 className="font-serif text-3xl md:text-5xl font-bold">Timeless Remembrances</h2>
            <p className="text-white/60 text-xs sm:text-sm">This digital heirloom was generated to preserve and celebrate our most special moments.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                confetti({ particleCount: 50, spread: 60 });
              }}
              className="px-10 py-4 bg-[#C5A059] hover:bg-[#C5A059]/90 text-white rounded-full font-bold uppercase tracking-widest text-[11px] hover:scale-105 active:scale-95 transition-all"
            >
              Replay Journey
            </button>
            {!isEditable && (
              <button 
                onClick={() => setShowShareModal(true)}
                className="px-10 py-4 border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059]/10 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all"
              >
                Share Memory
              </button>
            )}
          </div>
        </section>
      </div>
    );
  };

  // Render Template 3: Constellation of Memories (Galaxy Template)
  const renderGalaxyTemplate = () => {
    const galaxyNodes = [
      { id: 1, top: '35%', left: '45%', size: 'w-6 h-6' },
      { id: 2, top: '55%', left: '58%', size: 'w-4 h-4' },
      { id: 3, top: '65%', left: '40%', size: 'w-5 h-5' },
      { id: 4, top: '45%', left: '30%', size: 'w-4 h-4' },
      { id: 5, top: '25%', left: '65%', size: 'w-6 h-6' }
    ];

    const handleNodeClick = (nodeId: number) => {
      setActiveGalaxyNode(nodeId);
    };

    const handleCloseGalaxyModal = () => {
      if (activeGalaxyNode !== null) {
        const nodeIdx = activeGalaxyNode;
        setDiscoveredNodes(prev => {
          const next = new Set(prev);
          next.add(nodeIdx);
          return next;
        });
      }
      setActiveGalaxyNode(null);
    };

    const handleReplayJourney = () => {
      setDiscoveredNodes(new Set());
      setGalaxySection('opening');
    };

    return (
      <div className="bg-[#031632] text-[#eae1d4] font-sans-technical min-h-screen w-full relative overflow-hidden selection:bg-[#f2ca50] selection:text-[#3c2f00]">
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;600;700&display=swap');
          
          .font-display-lg {
              font-family: 'Playfair Display', Georgia, serif;
          }
          .font-headline-sm {
              font-family: 'Playfair Display', Georgia, serif;
              font-style: italic;
          }
          .font-sans-technical {
              font-family: 'Inter', sans-serif;
          }
          .galaxy-glass-panel {
              background: rgba(255, 255, 255, 0.05);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 0.5px solid rgba(255, 255, 255, 0.1);
              box-shadow: 0 0 20px rgba(212, 175, 55, 0.05);
          }
          .galaxy-glass-button {
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(20px);
              border: 1px solid #d4af37;
              transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .galaxy-glass-button:hover {
              background: rgba(255, 255, 255, 0.2);
              box-shadow: 0 0 25px rgba(212, 175, 55, 0.4);
              transform: translateY(-2px);
          }
          .galaxy-star-pulse {
              animation: galaxy-pulse 3s infinite cubic-bezier(0.4, 0, 0.2, 1);
          }
          @keyframes galaxy-pulse {
              0%, 100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 10px #d4af37; }
              50% { transform: scale(1.4); opacity: 1; box-shadow: 0 0 25px #d4af37; }
          }
          .galaxy-gold-shimmer {
              background: linear-gradient(92deg, #d4af37 0%, #f2ca50 50%, #d4af37 100%);
              background-size: 200% auto;
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              animation: galaxy-shimmer 4s linear infinite;
          }
          @keyframes galaxy-shimmer {
              to { background-position: 200% center; }
          }
        `}} />

        {/* Star Field Background */}
        <div className="fixed inset-0 w-full h-full pointer-events-none opacity-70 z-0">
          {/* Nebula Glows */}
          <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />
          {/* Pulsing stars */}
          {galaxyStars.map(star => (
            <div
              key={star.id}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                opacity: star.opacity,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>

        {/* --- EDITABLE VIEW MODE --- */}
        {isEditable ? (
          <div className="relative z-10 w-full space-y-16 py-12">
            {/* Opening Screen Section */}
            <section className="py-12 px-6 text-center max-w-4xl mx-auto space-y-6 border-b border-white/10">
              <span className="text-[10px] text-[#d4af37] font-bold tracking-[0.3em] uppercase block">Opening Slide</span>
              <textarea
                value={customTitle || "For The Brightest Star In My Life"}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Welcome Header (e.g. For The Brightest Star In My Life)"
                rows={2}
                className="font-display-lg text-4xl sm:text-6xl text-white font-bold leading-tight tracking-tight text-center bg-transparent border border-dashed border-white/20 focus:border-white focus:outline-none rounded-xl p-4 w-full resize-none"
              />
              <div className="flex items-center justify-center gap-2">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient Name (e.g. Dad)"
                  className="font-display-lg text-2xl text-[#f2ca50] bg-transparent border-b border-dashed border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none text-center w-64"
                />
                <span className="text-2xl text-[#f2ca50] font-display-lg italic">❤️</span>
              </div>
            </section>

            {/* Constellation Map Section */}
            <section className="py-12 px-6 max-w-4xl mx-auto space-y-8 border-b border-white/10 text-center">
              <div>
                <span className="text-[10px] text-[#d4af37] font-bold tracking-[0.3em] uppercase block mb-2">Interactive Constellation Map</span>
                <p className="text-xs text-[#d0c5af]/60">Click any pulsing node on the constellation map to upload photos and edit their story quotes.</p>
              </div>

              <div className="relative w-full h-[450px] bg-black/35 rounded-[2rem] border border-white/10 overflow-hidden flex items-center justify-center shadow-inner">
                {/* Three.js Constellation Background - Interactive in Edit Mode */}
                <iframe 
                  src="/stitch_constellation_of_memories/three.js.html?mode=edit" 
                  className="absolute inset-0 w-full h-full border-none opacity-90 z-10"
                  title="3D Constellation"
                />
              </div>
            </section>

            {/* Final Letter Editor Section */}
            <section className="py-12 px-6 max-w-4xl mx-auto space-y-8 text-center">
              <span className="text-[10px] text-[#d4af37] font-bold tracking-[0.3em] uppercase block">Final Letter & Signature</span>
              
              <input
                type="text"
                value={finalHeading || "Every Star In My Life Points Back To You"}
                onChange={(e) => setFinalHeading(e.target.value)}
                placeholder="Final Reveal Heading"
                className="font-display-lg text-2xl md:text-4xl text-white font-bold bg-transparent border-b border-dashed border-white/20 focus:outline-none text-center max-w-xl w-full"
              />

              <div className="galaxy-glass-panel p-8 md:p-12 rounded-2xl text-left border border-[#d4af37]/20 space-y-6 max-w-2xl mx-auto shadow-2xl relative">
                <textarea
                  value={personalLetter}
                  onChange={(e) => setPersonalLetter(e.target.value)}
                  placeholder="Write the full final letter surprise..."
                  rows={6}
                  className="w-full bg-transparent border border-dashed border-white/25 focus:border-[#d4af37] focus:outline-none rounded-xl p-6 text-on-surface font-body-lg leading-relaxed italic h-48 resize-none text-white/95"
                />

                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                  <div>
                    <p className="font-sans-technical text-[9px] font-bold tracking-widest text-[#eae1d4]/60 mb-2 uppercase">Signed By</p>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Sender Name"
                      className="font-display-lg text-lg text-[#f2ca50] bg-transparent border-b border-dashed border-[#d4af37]/30 focus:outline-none w-48 font-semibold italic"
                    />
                  </div>
                  <div>
                    <p className="font-sans-technical text-[9px] font-bold tracking-widest text-[#eae1d4]/60 mb-2 uppercase">Tribute Subtitle</p>
                    <input
                      type="text"
                      value={finalSubtitle || `The ${recipientName} Tribute Project`}
                      onChange={(e) => setFinalSubtitle(e.target.value)}
                      placeholder="Final Subtitle"
                      className="font-sans-technical text-xs text-[#eae1d4]/80 bg-transparent border-b border-dashed border-[#d4af37]/30 focus:border-[#d4af37] focus:outline-none w-48 text-left"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* --- VISITOR PLAY MODE --- */
          <div className="relative z-10 w-full min-h-screen">
            {/* Opening Screen */}
            {galaxySection === 'opening' && (
              <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-8 flex flex-col items-center">
                  <h2 className="font-display-lg text-4xl sm:text-7xl text-white font-bold leading-tight tracking-tight">
                    {customTitle || "For The Brightest Star In My Life"}
                  </h2>
                  <h1 className="font-display-lg text-3xl sm:text-5xl text-[#f2ca50] galaxy-gold-shimmer italic font-semibold">
                    {recipientName} ❤️
                  </h1>
                  <div className="pt-8">
                    <button 
                      onClick={() => setGalaxySection('journey')}
                      className="galaxy-glass-button px-10 py-4 rounded-full font-sans-technical text-xs tracking-widest text-[#f2ca50] flex items-center gap-3 mx-auto uppercase font-bold hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      BEGIN THE JOURNEY
                      <Sparkles className="w-4 h-4 text-[#f2ca50] fill-[#f2ca50]" />
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Interactive Journey Map */}
            {galaxySection === 'journey' && (
              <section className="min-h-screen flex flex-col items-center justify-center relative p-6">
                <div className="absolute top-28 left-1/2 -translate-x-1/2 w-full max-w-md text-center">
                  <p className="font-headline-sm text-headline-sm italic text-[#d0c5af]/80">
                    "Every guiding light in my universe began with you."
                  </p>
                </div>

                <div className="relative w-full max-w-4xl h-[450px] flex items-center justify-center mt-12">
                  {/* Three.js Constellation Background - Interactive in Play Mode */}
                  <iframe 
                    src="/stitch_constellation_of_memories/three.js.html?mode=play" 
                    className="absolute inset-0 w-full h-full border-none opacity-90 z-10"
                    title="3D Constellation"
                  />
                </div>

                {/* Progress bar and counter */}
                <div className="w-full max-w-xs text-center space-y-3 mt-12">
                  <p className="font-sans-technical text-[10px] font-bold tracking-[0.3em] text-[#eae1d4]/80 uppercase">
                    {discoveredNodes.size} OF 5 STARS DISCOVERED
                  </p>
                  <div className="w-full h-px bg-white/10 relative overflow-hidden rounded-full">
                    <div 
                      className="absolute left-0 top-0 h-full bg-[#f2ca50] transition-all duration-700 ease-out" 
                      style={{ width: `${(discoveredNodes.size / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </section>
            )}
          </div>
        )}

        {/* --- COMMON GALAXY MODAL --- */}
        {activeGalaxyNode !== null && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 pointer-events-auto">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={handleCloseGalaxyModal}></div>
            <div className="relative w-full max-w-3xl galaxy-glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 z-10">
              <div className="flex flex-col md:flex-row min-h-[300px]">
                <div className="w-full md:w-1/2 aspect-square relative group bg-black/10">
                  {localPhotos[(activeGalaxyNode - 1) % localPhotos.length] ? (
                    <img 
                      src={localPhotos[(activeGalaxyNode - 1) % localPhotos.length].url} 
                      alt="Memory" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/40 text-xs gap-2">
                      <span>No photo uploaded</span>
                      {isEditable && <span className="text-[10px] text-[#f2ca50]">Click to upload</span>}
                    </div>
                  )}
                  {isEditable && (
                    <div 
                      onClick={() => triggerPhotoReplace((activeGalaxyNode - 1) % localPhotos.length)}
                      className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Replace</span>
                    </div>
                  )}
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center space-y-6 text-left">
                  <Sparkles className="w-6 h-6 text-[#f2ca50]" />
                  
                  {isEditable ? (
                    <textarea
                      value={getChapterTitle(activeGalaxyNode - 1)}
                      onChange={(e) => handleChapterChange(activeGalaxyNode - 1, 'title', e.target.value)}
                      placeholder="Write memory quote here..."
                      rows={4}
                      className="font-headline-sm text-lg md:text-xl italic text-white leading-relaxed bg-transparent border border-dashed border-white/20 focus:border-[#d4af37] focus:outline-none rounded-xl p-4 w-full resize-none"
                    />
                  ) : (
                    <p className="font-headline-sm text-xl md:text-2xl text-on-surface leading-tight text-white">
                      "{getChapterTitle(activeGalaxyNode - 1)}"
                    </p>
                  )}
                  
                  <div className="h-px w-12 bg-[#d4af37]/40"></div>
                  
                  <button 
                    onClick={handleCloseGalaxyModal}
                    className="galaxy-glass-button w-fit px-6 py-2 rounded-full font-sans-technical text-[10px] font-bold text-[#f2ca50] tracking-widest uppercase cursor-pointer"
                  >
                    {isEditable ? "SAVE & RETURN" : "RETURN TO STARS"}
                  </button>
                </div>
              </div>
              <button 
                className="absolute top-4 right-4 text-white/50 hover:text-[#f2ca50] transition-colors cursor-pointer bg-transparent border-0 text-xl font-bold"
                onClick={handleCloseGalaxyModal}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* --- VISITOR FINAL REVEAL OVERLAY --- */}
        {discoveredNodes.size === 5 && !isEditable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl overflow-y-auto py-12 px-6">
            <div className="text-center space-y-8 max-w-2xl mx-auto my-auto flex flex-col items-center">
              <Sparkles className="text-[#f2ca50] w-12 h-12 animate-pulse" />
              <h2 className="font-display-lg text-3xl sm:text-5xl text-white font-bold leading-tight galaxy-gold-shimmer">
                {finalHeading || "Every Star In My Life Points Back To You"}
              </h2>
              
              {/* Message Card */}
              <div className="galaxy-glass-panel p-8 md:p-12 rounded-2xl text-left border border-[#d4af37]/20 space-y-6 w-full shadow-2xl relative">
                <p className="font-display-lg text-lg md:text-xl text-on-surface/90 leading-relaxed italic text-[#eae1d4] whitespace-pre-line">
                  {personalLetter || `Dad, thank you for being the constant in my universe. No matter how far I wander or how dark the night gets, your wisdom and love are the celestial map that guides me home. You've taught me how to burn bright without fading. Happy Father's Day.`}
                </p>
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                  <div>
                    <p className="font-sans-technical text-[9px] font-bold tracking-widest text-[#eae1d4]/60 mb-1 uppercase">WITH ENDLESS LOVE,</p>
                    <p className="font-display-lg text-lg signature-font text-[#f2ca50] italic font-semibold">{senderName || 'Your Brightest Star'}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-sans-technical text-[9px] font-bold tracking-widest text-[#eae1d4]/60 mb-1 uppercase">THE TRIBUTE</p>
                    <p className="font-sans-technical text-xs text-[#eae1d4]/80">{finalSubtitle || `The ${recipientName} Tribute Project`}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleReplayJourney}
                className="font-sans-technical text-[10px] font-bold text-white/50 hover:text-[#f2ca50] transition-colors flex items-center gap-2 mx-auto uppercase tracking-widest cursor-pointer bg-transparent border-0"
              >
                REPLAY JOURNEY
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Template 4: Heritage Letter (Editorial Tribute style)
  const renderHeritageTemplate = () => {
    return (
      <div className="bg-[#fbf9f8] text-[#1b1c1c] font-sans min-h-screen w-full relative selection:bg-[#ffdea5] selection:text-[#261900]">
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;600&display=swap');
          
          .font-display-lg, .font-headline-md, .font-letter-handwritten {
              font-family: 'Playfair Display', Georgia, serif;
          }
          .font-body-md, .font-body-lg, .font-label-caps {
              font-family: 'Inter', sans-serif;
          }
          .letter-card-glass {
              background: rgba(251, 249, 248, 0.9);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(161, 127, 59, 0.2);
              box-shadow: 0 20px 50px rgba(18, 18, 18, 0.05);
          }
          .scroll-reveal {
              opacity: 1;
              transform: none;
          }
          .zoom-container {
              overflow: hidden;
          }
          .zoom-image {
              transition: transform 10s ease-out;
              transform: scale(1.05);
          }
          .zoom-image:hover {
              transform: scale(1.15);
          }
        `}} />

        {/* Hero Section */}
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0 zoom-container">
            {localPhotos[0] ? (
              <img 
                src={localPhotos[0].url} 
                alt="Hero Cover" 
                className="w-full h-full object-cover brightness-[60%] zoom-image"
              />
            ) : (
              <div className="w-full h-full bg-[#1b1c1c]" />
            )}
            {isEditable && (
              <div 
                onClick={() => triggerPhotoReplace(0)}
                className="absolute inset-0 bg-black/25 hover:bg-black/45 transition-colors flex items-center justify-center cursor-pointer z-10 group"
              >
                <div className="bg-black/60 hover:bg-black/85 border border-white/10 backdrop-blur-md text-white px-5 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-2xl transition-all hover:scale-105 active:scale-95">
                  <Upload className="w-4 h-4 text-accent fill-accent" />
                  <span>Change Cover Image</span>
                </div>
              </div>
            )}
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto space-y-6 flex flex-col items-center">
            {isEditable ? (
              <input
                type="text"
                value={customTitle || "Celebrating a Legacy"}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="text-center font-sans text-xs font-bold tracking-[0.3em] uppercase text-white/80 bg-transparent border-b border-dashed border-white/30 focus:outline-none w-72"
                placeholder="Header Subtitle"
              />
            ) : (
              <span className="font-sans text-xs text-white/80 tracking-[0.3em] uppercase block mb-6">{customTitle || "Celebrating a Legacy"}</span>
            )}

            {isEditable ? (
              <div className="flex items-center justify-center gap-1.5 w-full text-center">
                <span className="font-display-lg text-4xl sm:text-7xl text-white font-bold">To My Father,</span>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="font-display-lg text-4xl sm:text-7xl text-white font-bold bg-transparent border-b border-dashed border-white/30 focus:outline-none text-center w-64"
                  placeholder="Recipient Name"
                />
              </div>
            ) : (
              <h1 className="font-display-lg text-4xl sm:text-7xl text-white mb-8 font-bold">To My Father, {recipientName}</h1>
            )}

            {isEditable ? (
              <textarea
                value={heroQuote || "A tribute to the man who shaped my world through strength, wisdom, and quiet love."}
                onChange={(e) => setHeroQuote(e.target.value)}
                rows={2}
                className="font-sans text-body-lg text-white/90 max-w-xl mx-auto leading-relaxed text-center bg-transparent border border-dashed border-white/20 focus:outline-none rounded-xl p-4 w-full h-20 resize-none"
                placeholder="Hero Description"
              />
            ) : (
              <p className="font-sans text-body-lg text-white/90 max-w-xl mx-auto leading-relaxed">
                {heroQuote || "A tribute to the man who shaped my world through strength, wisdom, and quiet love."}
              </p>
            )}
          </div>
        </section>

        {/* Alternating Narrative & Photo Sections */}
        {localPhotos.slice(1).map((photo, i) => {
          const globalIdx = i + 1;
          const isOdd = i % 2 === 0;

          return (
            <React.Fragment key={photo.id || globalIdx}>
              {/* Text Narrative block */}
              <section className="py-24 px-6 md:px-16 bg-[#fbf9f8]">
                <div className="max-w-3xl mx-auto">
                  {isOdd ? (
                    <div className="space-y-8 text-left">
                      {isEditable ? (
                        <textarea
                          value={getChapterTitle(globalIdx)}
                          onChange={(e) => handleChapterChange(globalIdx, 'title', e.target.value)}
                          placeholder="Chapter Quote"
                          rows={2}
                          className="font-display-lg text-2xl md:text-3xl text-[#000000] italic leading-relaxed w-full bg-transparent border-b border-dashed border-gray-300 focus:outline-none resize-none py-1"
                        />
                      ) : (
                        <p className="font-display-lg text-2xl md:text-3xl text-[#000000] italic leading-relaxed">
                          "{getChapterTitle(globalIdx)}"
                        </p>
                      )}
                      
                      {isEditable ? (
                        <textarea
                          value={getChapterDesc(globalIdx)}
                          onChange={(e) => handleChapterChange(globalIdx, 'desc', e.target.value)}
                          placeholder="Chapter Description"
                          rows={4}
                          className="font-sans text-base md:text-lg text-[#5e5e5b] leading-loose w-full bg-transparent border border-dashed border-gray-300 focus:outline-none rounded-xl p-4 resize-none"
                        />
                      ) : (
                        <p className="font-sans text-base md:text-lg text-[#5e5e5b] leading-loose">
                          {getChapterDesc(globalIdx)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-8 text-left">
                      {isEditable ? (
                        <textarea
                          value={getChapterDesc(globalIdx)}
                          onChange={(e) => handleChapterChange(globalIdx, 'desc', e.target.value)}
                          placeholder="Chapter Description"
                          rows={4}
                          className="font-sans text-base md:text-lg text-[#5e5e5b] leading-loose w-full bg-transparent border border-dashed border-gray-300 focus:outline-none rounded-xl p-4 resize-none"
                        />
                      ) : (
                        <p className="font-sans text-base md:text-lg text-[#5e5e5b] leading-loose">
                          {getChapterDesc(globalIdx)}
                        </p>
                      )}

                      {isEditable ? (
                        <textarea
                          value={getChapterTitle(globalIdx)}
                          onChange={(e) => handleChapterChange(globalIdx, 'title', e.target.value)}
                          placeholder="Chapter Quote"
                          rows={2}
                          className="font-display-lg text-2xl md:text-3xl text-[#000000] italic leading-relaxed w-full bg-transparent border-b border-dashed border-gray-300 focus:outline-none resize-none py-1"
                        />
                      ) : (
                        <p className="font-display-lg text-2xl md:text-3xl text-[#000000] italic leading-relaxed">
                          "{getChapterTitle(globalIdx)}"
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {/* Full Width Image block */}
              <section className="h-[500px] md:h-[700px] w-full zoom-container relative group">
                <img 
                  src={photo.url} 
                  alt={`Heritage Memory ${globalIdx}`} 
                  className="w-full h-full object-cover zoom-image" 
                />
                {isEditable && (
                  <div 
                    onClick={() => triggerPhotoReplace(globalIdx)}
                    className="absolute inset-0 bg-black/45 flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-xs uppercase font-bold tracking-wider">Replace Image</span>
                  </div>
                )}
              </section>
            </React.Fragment>
          );
        })}

        {/* Personal Letter Card Section */}
        <section className="py-32 px-6 bg-[#f5f3f3] flex items-center justify-center">
          <div className="max-w-4xl w-full">
            <div className="letter-card-glass p-8 md:p-24 relative overflow-hidden rounded-[2rem]">
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply" 
                style={{ 
                  backgroundImage: "url('https://www.transparenttextures.com/patterns/paper-fibers.png')",
                  backgroundRepeat: "repeat"
                }}
              ></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                  <span className="font-sans text-[10px] font-bold text-[#a17f3b] tracking-widest uppercase">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <div className="w-16 h-[1px] bg-[#a17f3b]/30"></div>
                </div>

                {isEditable ? (
                  <textarea
                    value={personalLetter}
                    onChange={(e) => setPersonalLetter(e.target.value)}
                    rows={8}
                    className="font-display-lg text-xl md:text-3xl text-[#000000] leading-relaxed w-full bg-transparent border border-dashed border-gray-300 focus:outline-none rounded-xl p-4 resize-none"
                    placeholder="Write your personal letter details..."
                  />
                ) : (
                  <div className="font-display-lg text-[#000000] text-xl md:text-3xl leading-relaxed space-y-8">
                    {personalLetter.split('\n\n').map((para: string, pIdx: number) => (
                      <p key={pIdx}>{para}</p>
                    ))}
                  </div>
                )}

                <div className="mt-20 border-t border-gray-200/50 pt-12 flex flex-col md:flex-row justify-between items-end gap-8">
                  <div>
                    <span className="font-sans text-[10px] font-bold text-[#5e5e5b] tracking-widest uppercase block mb-2">Signed By</span>
                    {isEditable ? (
                      <input
                        type="text"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="font-display-lg text-2xl text-[#000000] italic font-semibold bg-transparent border-b border-dashed border-gray-300 focus:outline-none w-48 text-left"
                        placeholder="Your Name (Sender)"
                      />
                    ) : (
                      <p className="font-display-lg text-2xl text-[#000000] italic font-semibold">{senderName || 'Your Loved One'}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-[10px] font-bold text-[#5e5e5b] tracking-widest uppercase block mb-2">Location</span>
                    {isEditable ? (
                      <input
                        type="text"
                        value={sectionTitle || 'New York City'}
                        onChange={(e) => setSectionTitle(e.target.value)}
                        className="font-sans text-[#000000] bg-transparent border-b border-dashed border-gray-300 focus:outline-none w-48 text-right"
                        placeholder="Your Location"
                      />
                    ) : (
                      <p className="font-sans text-[#000000]">{sectionTitle || 'New York City'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Signature / Actions Section */}
        <section className="py-24 bg-[#fbf9f8] text-center px-6">
          <div className="max-w-xl mx-auto space-y-8 flex flex-col items-center">
            <span className="text-5xl text-[#a17f3b] block">❖</span>
            
            {isEditable ? (
              <input
                type="text"
                value={middleQuote || "A Legacy Continued"}
                onChange={(e) => setMiddleQuote(e.target.value)}
                className="font-display-lg text-2xl md:text-3xl font-semibold text-[#000000] bg-transparent border-b border-dashed border-gray-300 focus:outline-none text-center max-w-md w-full"
                placeholder="Tribute Ending Title"
              />
            ) : (
              <h2 className="font-display-lg text-2xl md:text-3xl font-semibold text-[#000000]">{middleQuote || "A Legacy Continued"}</h2>
            )}

            <p className="font-sans text-[#5e5e5b] leading-relaxed">
              This letter is a digital archive of our shared history. A place where memories are preserved in their most elegant form, to be revisited for generations to come.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <button 
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  confetti({ particleCount: 50, spread: 60 });
                }}
                className="bg-[#000000] hover:bg-[#1a1b1b] text-white px-8 py-4 font-sans text-xs font-bold tracking-widest hover:opacity-90 transition-all rounded-md cursor-pointer"
              >
                REPLAY TRIBUTE
              </button>
              {!isEditable && (
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="border border-[#000000] text-[#000000] hover:bg-[#000000]/5 px-8 py-4 font-sans text-xs font-bold tracking-widest transition-all rounded-md cursor-pointer"
                >
                  SHARE TRIBUTE
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Final Screen Section */}
        <section className="h-screen w-full flex items-center justify-center bg-[#000000] overflow-hidden relative">
          <div className="text-center px-6 space-y-4 w-full max-w-2xl mx-auto flex flex-col items-center">
            {isEditable ? (
              <textarea
                value={finalHeading || `Happy\n${selectedOccasion === 'fathersday' ? "Father's Day" : selectedOccasion === 'mothersday' ? "Mother's Day" : selectedOccasion === 'birthday' ? "Birthday" : "Special Day"}`}
                onChange={(e) => setFinalHeading(e.target.value)}
                placeholder="Final Tribute Heading"
                rows={2}
                className="font-display-lg text-[40px] md:text-[70px] text-white tracking-tight leading-none text-center bg-transparent border border-dashed border-white/20 focus:border-white focus:outline-none rounded-xl p-4 w-full h-40 resize-none whitespace-pre-line"
              />
            ) : (
              <h2 className="font-display-lg text-[64px] md:text-[100px] text-white tracking-tight leading-none whitespace-pre-line">
                {finalHeading || `Happy\n${selectedOccasion === 'fathersday' ? "Father's Day" : selectedOccasion === 'mothersday' ? "Mother's Day" : selectedOccasion === 'birthday' ? "Birthday" : "Special Day"}`}
              </h2>
            )}

            {isEditable ? (
              <input
                type="text"
                value={finalSubtitle || `The ${recipientName} Tribute Project`}
                onChange={(e) => setFinalSubtitle(e.target.value)}
                placeholder="Final Tribute Subtitle"
                className="font-sans text-[10px] font-bold text-[#a17f3b] tracking-[0.4em] uppercase text-center bg-transparent border-b border-dashed border-[#a17f3b]/30 focus:border-[#a17f3b] focus:outline-none w-72 mt-4"
              />
            ) : (
              <p className="font-sans text-[10px] font-bold text-[#a17f3b] tracking-[0.4em] uppercase">
                {finalSubtitle || `The ${recipientName} Tribute Project`}
              </p>
            )}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className={`relative min-h-screen w-full flex flex-col justify-between ${
      selectedTemplate === 'glass' ? 'bg-[#031632] text-white' : 'bg-heritage-white text-primary'
    }`}>
      {/* Background visual shader */}
      {selectedTemplate !== 'glass' && <div className="fixed inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-blue-500/5 -z-10" />}
      {selectedTemplate === 'glass' && (
        <div className="fixed inset-0 bg-radial-gradient from-primary-light/50 to-primary -z-10" />
      )}

      {/* Hidden file input for inline replacement */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Hidden/ambient background audio */}
      {musicUrl && !youtubeEmbed && (
        <audio
          ref={audioRef}
          src={musicUrl}
          loop
          muted={isMuted}
        />
      )}

      {/* Embedded YouTube Audio Player */}
      {musicUrl && youtubeEmbed && opened && (
        <iframe
          width="1"
          height="1"
          src={youtubeEmbed}
          title="Background Music"
          allow="autoplay; encrypted-media"
          className="absolute -top-40 -left-40 pointer-events-none opacity-0"
        />
      )}

      {/* Builder Top controls panel */}
      {isEditable && (
        <div className="fixed top-6 left-6 right-6 z-50 flex flex-col md:flex-row justify-between items-center max-w-[1120px] mx-auto bg-white/80 backdrop-blur-md border border-gray-200/50 shadow-lg px-6 py-4 rounded-3xl gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Live Builder</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-primary">
            {/* Occasion Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">Occasion:</span>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none"
              >
                <option value="fathersday">Father's Day</option>
                <option value="mothersday">Mother's Day</option>
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="friendship">Friendship Day</option>
                <option value="custom">Custom Occasion</option>
              </select>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">Theme:</span>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none"
              >
                <option value="reveal">Memory Wall</option>
                <option value="legacy">Legacy Timeline</option>
                <option value="scrapbook">Constellation of Memories</option>
                <option value="glass">Heritage Letter</option>
              </select>
            </div>

            {/* Music Input */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-primary/40 uppercase tracking-wider">Music URL:</span>
              <input
                type="text"
                value={musicUrl}
                onChange={(e) => setMusicUrl(e.target.value)}
                placeholder="Direct MP3 or YouTube link"
                className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1 w-36 md:w-44 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <button
              onClick={handlePublishClick}
              disabled={isPublishing}
              className="bg-primary hover:bg-primary-light text-white text-[11px] font-bold uppercase tracking-wider px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              Publish Surprise <Sparkles className="w-3.5 h-3.5 text-accent fill-accent" />
            </button>
          </div>
        </div>
      )}

      {/* Top Floating Action Header (Only when published/opened, not in editor) */}
      {opened && !isEditable && (
        <header className="fixed top-6 left-6 right-6 z-40 flex justify-between items-center max-w-[1120px] mx-auto">
          <div className="glass-panel px-4 py-2 rounded-full border-white/50 backdrop-blur-md shadow-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">MemoryVerse</span>
          </div>
          
          <div className="flex gap-2">
            {musicUrl && !youtubeEmbed && (
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-white/75 backdrop-blur-md border border-gray-200/50 flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform"
              >
                {isMuted ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
              </button>
            )}
            <button
              onClick={() => setShowShareModal(true)}
              className="w-10 h-10 rounded-full bg-white/75 backdrop-blur-md border border-gray-200/50 flex items-center justify-center text-primary shadow-sm hover:scale-105 transition-transform"
            >
              <Share2 className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>
      )}

      {/* SURPRISE INTRO COVER (Only when published/viewed) */}
      <AnimatePresence>
        {!opened && !isEditable && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-white"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-blue-500/5 -z-10" />
            <div className="text-center space-y-8 max-w-md">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-secondary-light/40 border border-secondary-light rounded-full flex items-center justify-center text-secondary text-3xl mx-auto shadow-md"
              >
                🎁
              </motion.div>
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-sans font-bold text-primary tracking-tight leading-tight">
                  You have received a <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent font-serif italic font-normal">
                    surprise website!
                  </span>
                </h1>
                <p className="text-xs text-primary-light/60">A personalized memory layout has been generated especially for you.</p>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleOpenSurprise}
                  className="px-10 py-5 bg-primary text-white font-bold uppercase tracking-wider text-xs rounded-full inline-flex items-center gap-2 hover:scale-105 active:scale-95 hover:shadow-2xl transition-all cursor-pointer"
                >
                  Open Surprise <Sparkles className="w-4.5 h-4.5 text-accent fill-accent" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PUBLISHING PROGRESS LOADER */}
      {isPublishing && (
        <div className="fixed inset-0 bg-white/95 z-[100] flex flex-col items-center justify-center space-y-6 text-primary">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-gray-100 border-t-primary animate-spin" />
            <Sparkles className="w-8 h-8 text-secondary animate-pulse" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-sans font-bold text-xl">{publishText || 'Publishing Memory...'}</h3>
            <p className="text-xs text-primary-light/60 max-w-xs px-6">We are resizing photos, storing assets in cloud buckets, and writing databases.</p>
          </div>
          <div className="w-full max-w-xs bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-secondary to-accent transition-all duration-300"
              style={{ width: `${publishProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* MAIN RENDERED EXPERIENCE */}
      {opened && (
        <main className={`flex-1 w-full relative z-10 ${isEditable && selectedTemplate !== 'legacy' ? 'pt-32' : ''}`}>
          {selectedTemplate === 'reveal' && renderWallTemplate()}
          {selectedTemplate === 'legacy' && renderLegacyTemplate()}
          {selectedTemplate === 'scrapbook' && renderGalaxyTemplate()}
          {selectedTemplate === 'glass' && renderHeritageTemplate()}
        </main>
      )}

      {/* FOOTER */}
      {opened && (
        <footer className={`py-8 text-center text-[10px] font-bold uppercase tracking-widest opacity-40 border-t ${
          selectedTemplate === 'glass' ? 'border-white/10' : 'border-gray-100'
        }`}>
          Create your own at memoryverse.app
        </footer>
      )}

      {/* SHARE MODAL */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-white p-8 rounded-3xl max-w-sm w-full space-y-6 text-primary shadow-2xl relative"
            >
              <div className="space-y-2">
                <h3 className="font-sans font-bold text-xl">Spread the Joy!</h3>
                <p className="text-xs text-primary-light/60">Let others view this beautiful tribute memory page.</p>
              </div>

              {/* URL field */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200/60 rounded-xl w-full">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 bg-transparent text-xs outline-none px-2 font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-primary text-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Social sharing row */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    logShare('whatsapp');
                    window.open(`https://api.whatsapp.com/send?text=Look%20at%20this%20beautiful%20surprise%20memory%20website%20I%20created!%20${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                  className="p-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-xl text-center text-xs font-bold"
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => {
                    logShare('twitter');
                    window.open(`https://twitter.com/intent/tweet?text=Beautiful%20surprise%20website!&url=${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                  className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-500 rounded-xl text-center text-xs font-bold"
                >
                  Twitter
                </button>
                <button
                  onClick={() => {
                    logShare('facebook');
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                  }}
                  className="p-3 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] rounded-xl text-center text-xs font-bold"
                >
                  Facebook
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-primary font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
