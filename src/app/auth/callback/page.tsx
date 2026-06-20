'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const redirect = searchParams.get('redirect') || '/dashboard';
      
      // Supabase JS client handles hash-based/URL token exchange automatically when instantiated.
      // We will verify if a session is established, and redirect.
      const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.replace(redirect);
        } else {
          // Fallback delay to allow client SDK to parse and store session
          const timeoutId = setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            router.replace(redirect);
          }, 1500);
          return () => clearTimeout(timeoutId);
        }
      };

      checkSession();
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-heritage-white text-primary">
      <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
      <p className="text-xs text-primary/40 mt-4">Confirming your verification code...</p>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-heritage-white text-primary">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
