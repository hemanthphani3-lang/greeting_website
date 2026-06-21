'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MemoryContainer } from '@/components/MemoryContainer';
import { Check, Copy, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Default Placeholders to bootstrap editing experience
const DEFAULT_PHOTOS = [
  { id: '1', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7bBTx0MHu1cjP6seMbFiFl6uamC9p2CPukf9FqX9SaQThGa1NCdU_9QmzA9FxH8z6fbP68bp9YrCVDw9AfiW2Y0XPP5XLxGo_o73BqBI-edNNmywONz-xpVxnKU1yHpYP12TEeLMw7TPLP9Tk28XAT16gFT5gqlqVgETmrvbyzaUBoAMM7MFslx4JvElPyIv1sOOonFWm_eAaHO2KUG4X6DGRDc7wvzvOzHY1OzasO7Zs53lDsvDmdAEpEUTgyXRz-fvErlhC-NtQ' },
  { id: '2', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJXb9w5_lZ3EKwSxJkthIWx6iZqQGpBlr4RBOLOY6lGO4O-oK1ZyH06OWQIG4lwq1obADQi2KO_JgUcqTntdHgv7wKmvowd9Un8vaw89J5QjbsJwGjeEX9cMdWZnUfAmLk5NB7NKVLbQK7pLih8i6dIvC65N8BOv9i1h7Rvc6-e-3VF8Yt95HRf6CN32u9CZVtfxhjPvXc6_rAgoI28vnn8IT2ecXbQf-hLWBt98OzbbmbNw41mLxK9NYuKb36U9PFgCPSWSr5co8' },
  { id: '3', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW8Gulw5VAynYSh-Zv36W1HIhTChWDC8S_qovzfeLHg04j83LDfFkko02wLmUdh2cu7gnETCru8ihWel0hu5xiaS-RzudJsuUHBuRJ0EoDWW58LB15cWTTmSjXpEjaI3Z3XZYdghSoilWR4DbSXyKelN6Gw0Mvt_J-XI2cd8p7Gx0X-a77fGUyEYvx7d0KZW7ONc7fCpZ73pOgnAKtu9MJv4IByk7uc4NWYG9Dh6M_c_hWmE_zXpslAuBXMn3D3B0nTEaWMNMJnFY' },
  { id: '4', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBkibqM9omQQ4zeeWDrCzERqEGBW4JNIZGflXiU1cbJe_kxdUFtAsuqsV-h_EcQZvvf3Pv1gTGoXMmBEwpuyzw46xraQuXDUzF1e1UG2nkV8W9IQnK_gahiPzcrIeqUW5Qy6XW9BHQSOuWgXyhTSwD_TpnEip6DtdnB1fnv7U2Z7KglfZAqsMKOOya23_jjPdbExcVq0eHufOJSYHgmvnNt8TUWnonnEHqU6pHOY-xc0Hi75EKaawS7E60eBbT6DHPos4mN6lRb6c' },
  { id: '5', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMTHy5aUhQxw0A8U__M3nxOgnBuJp-SJxWfoxrAFwloAQA1426pIBRJG_PJuhRAsxkM7wZkrc1O4Jbzi4OZvgpx-nw-x94z_RSiBi-QiK7kc6Vhjcf6rr3xa_zOOWL1zxvKb4dh7kTcG-Gxg3HtE_q49iyZYysqfZ1CT7RDtZBWzE3RZgsnnD4vpJ4_M-1kj26x3jS6O8pFEmMrUqVemVM7VGX7GjzuMqjCYBlIkeAp8aQWcJxXvFgTfN51PQORMUdMGFJk5nI-zA' },
  { id: '6', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtgiz2QthNew42UDoedWs7V5sHJtaXLXdighBJKlEncl0507mdf0qn6e2bypr7Eqz9PNLn5jQwRRj_qPtCepCD0uSatYFiua96J_07yRx_A6caV4ncJLDfc3VvOoa4ET4Jc5bZMLFyyPnMdKoQyNZhR8Vqu9sSsEutzQyWkawizq5X1ieisa1oX5eGFnYulmP9zBYYr_HMlQduWGuHtOjAfb7Fo5CVn4yON1iPIW-rA-cl4nbkn3j6y5Hqb1CMcvVYt_cAK0yHXJk' }
];

const DEFAULT_MEMORY = {
  id: '',
  recipient_name: 'Thomas Harrison',
  sender_name: 'The Harrison Family',
  message: 'To our dearest Dad, your life is a map we continue to follow. In every quiet moment of strength and every laugh, we see the legacy you’ve built — not of stone or wood, but of kindness and enduring love. Thank you for being our anchor and our north star.',
  occasion: 'fathersday',
  template: 'legacy',
  music_url: '',
  slug: ''
};

function CreateMemoryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const params = searchParams.toString();
        const redirectPath = `/create${params ? `?${params}` : ''}`;
        router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
      } else {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, [router, searchParams]);

  // Template query synchronization
  const queryTemplate = searchParams.get('template') || 'legacy';
  const initialMemory = {
    ...DEFAULT_MEMORY,
    template: ['reveal', 'legacy', 'scrapbook', 'glass'].includes(queryTemplate) ? queryTemplate : 'legacy'
  };

  // Live Publishing status state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState(0);
  const [publishText, setPublishText] = useState('');
  
  // Link generation modal success states
  const [createdSlug, setCreatedSlug] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Triggered when user clicks "Publish Surprise" inside MemoryContainer
  const handlePublish = async (
    updatedMemory: Partial<typeof DEFAULT_MEMORY>,
    localPhotos: { file?: File; url: string; base64?: string }[]
  ) => {
    setIsPublishing(true);
    setPublishProgress(10);
    setPublishText('Processing and compressing images...');

    try {
      const finalPhotoUrls: string[] = [];

      // 1. Process and upload each photo
      for (let i = 0; i < localPhotos.length; i++) {
        setPublishProgress(15 + Math.floor((i / localPhotos.length) * 45));
        setPublishText(`Saving memory image ${i + 1} of ${localPhotos.length}...`);

        const photo = localPhotos[i];

        if (photo.file) {
          // New file uploaded by user -> upload to Supabase storage
          const fileExt = photo.file.name.split('.').pop() || 'jpg';
          const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
          const filePath = `memories/${fileName}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('memory-photos')
            .upload(filePath, photo.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.warn('Supabase storage upload failed, saving as Base64 fallback:', uploadError.message);
            finalPhotoUrls.push(photo.base64 || photo.url);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('memory-photos')
              .getPublicUrl(filePath);
            finalPhotoUrls.push(publicUrl);
          }
        } else {
          // Using default placeholder -> save original url
          finalPhotoUrls.push(photo.url);
        }
      }

      setPublishProgress(70);
      setPublishText('Writing database records...');

      // Generate custom slug based on recipient name
      const cleanName = (updatedMemory.recipient_name || 'surprise')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const slug = `${cleanName}-${Math.random().toString(36).substring(2, 7)}`;

      // Get current logged-in user
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      // Insert core memory details
      const { data: memoryData, error: memoryError } = await supabase
        .from('memories')
        .insert({
          user_id: userId,
          recipient_name: updatedMemory.recipient_name || 'Thomas Harrison',
          sender_name: updatedMemory.sender_name || null,
          message: updatedMemory.message || '',
          occasion: updatedMemory.occasion || 'fathersday',
          template: updatedMemory.template || 'legacy',
          music_url: updatedMemory.music_url || null,
          slug: slug
        })
        .select()
        .single();

      if (memoryError) throw new Error(memoryError.message);

      setPublishProgress(85);
      setPublishText('Linking visual chapters...');

      // Insert photos mapping
      const photoInserts = finalPhotoUrls.map((url, index) => ({
        memory_id: memoryData.id,
        url: url,
        display_order: index
      }));

      const { error: photosError } = await supabase
        .from('memory_photos')
        .insert(photoInserts);

      if (photosError) throw new Error(photosError.message);

      // Save ID to local storage for user dashboard
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('memoryverse_created_ids');
          const ids = stored ? JSON.parse(stored) : [];
          if (!ids.includes(memoryData.id)) {
            ids.push(memoryData.id);
            localStorage.setItem('memoryverse_created_ids', JSON.stringify(ids));
          }
        } catch (storageErr) {
          console.error('LocalStorage saving error:', storageErr);
        }
      }

      setPublishProgress(100);
      setPublishText('Surprise website published successfully!');

      setTimeout(() => {
        setCreatedSlug(slug);
        setIsPublishing(false);
      }, 700);

    } catch (err: any) {
      console.error('Failed to publish memory:', err);
      alert('Failed to publish surprise website: ' + err.message);
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    const url = `${window.location.origin}/m/${createdSlug}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-heritage-white text-primary">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-primary/40 mt-4">Verifying session...</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        {/* Memory Editor Core Wrapper */}
        <MemoryContainer 
          memory={initialMemory} 
          photos={DEFAULT_PHOTOS.map((p, idx) => ({ id: p.id, url: p.url, display_order: idx }))}
          isEditable={true}
          isPublishing={isPublishing}
          publishProgress={publishProgress}
          publishText={publishText}
          onPublish={handlePublish}
        />
      </div>

      {/* PUBLISHED SUCCESS MODAL OVERLAY */}
      <AnimatePresence>
        {createdSlug && (
          <div className="fixed inset-0 bg-black/60 z-[110] flex items-center justify-center p-6 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 rounded-[2rem] max-w-md w-full space-y-6 text-primary shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-sans font-bold text-2xl">Surprise Website is Live!</h3>
                <p className="text-xs text-primary-light/60">Share this magic link with your loved one to surprise them.</p>
              </div>

              {/* URL copy block */}
              <div className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-200/60 rounded-2xl w-full text-left">
                <input
                  type="text"
                  readOnly
                  value={`${window.location.origin}/m/${createdSlug}`}
                  className="flex-1 bg-transparent text-sm text-primary outline-none px-2 font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5 hover:scale-103 active:scale-97 transition-all cursor-pointer"
                >
                  {isCopied ? (
                    <>Copied <Check className="w-3.5 h-3.5" /></>
                  ) : (
                    <>Copy <Copy className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                <a
                  href={`/m/${createdSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 hover:shadow-md transition-shadow"
                >
                  Preview Live <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    setCreatedSlug('');
                    router.push('/dashboard');
                  }}
                  className="px-8 py-4 border border-gray-200 hover:bg-gray-50 text-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function CreateMemory() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-heritage-white text-primary">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <CreateMemoryForm />
    </Suspense>
  );
}
