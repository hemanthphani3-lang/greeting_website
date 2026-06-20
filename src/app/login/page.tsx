'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ShaderBackground } from '@/components/ShaderBackground';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Sparkles, ArrowRight, LogIn, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const redirectOrigin = window.location.origin.includes('localhost')
          ? 'https://greeting-website-six.vercel.app'
          : window.location.origin;

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: name,
            },
            emailRedirectTo: `${redirectOrigin}/auth/callback?redirect=${redirectTo}`,
          },
        });

        if (error) throw error;

        if (data.user && data.session) {
          setSuccessMsg('Account created successfully! Redirecting...');
          setTimeout(() => {
            router.push(redirectTo);
          }, 1500);
        } else {
          setSuccessMsg('Account created! Please check your email to verify your address.');
        }
      } else {
        // Sign In Flow
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setSuccessMsg('Logged in successfully! Redirecting...');
        setTimeout(() => {
          router.push(redirectTo);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setErrorMsg(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-md">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15 }}
        className="glass-panel p-8 md:p-10 rounded-[2.5rem] border-white/60 shadow-apple text-primary"
      >
        {/* Title */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white shadow-md mx-auto animate-float">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-primary">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-primary-light/60 mt-1.5">
              {isSignUp 
                ? 'Join MemoryVerse to build, share, and track surprise greetings' 
                : 'Sign in to access your custom greetings and analytics dashboard'}
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 bg-white/40 p-1 rounded-2xl border border-gray-200/40 mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
              !isSignUp
                ? 'bg-primary text-white shadow-sm'
                : 'text-primary/60 hover:text-primary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
              isSignUp
                ? 'bg-primary text-white shadow-sm'
                : 'text-primary/60 hover:text-primary'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 mb-6 overflow-hidden"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-4 py-3 rounded-xl flex items-start gap-2.5 mb-6 overflow-hidden"
            >
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-primary/60 block ml-1">
                Your Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/60 border border-gray-200/50 focus:border-primary focus:bg-white focus:outline-none pl-11 pr-4 py-3 text-sm rounded-xl transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-primary/60 block ml-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/60 border border-gray-200/50 focus:border-primary focus:bg-white focus:outline-none pl-11 pr-4 py-3 text-sm rounded-xl transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-primary/60 block">
                Password
              </label>
              {!isSignUp && (
                <Link
                  href="/login/reset"
                  className="text-[10px] font-bold text-accent hover:text-accent-light uppercase tracking-wider transition-colors"
                >
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/60 border border-gray-200/50 focus:border-primary focus:bg-white focus:outline-none pl-11 pr-4 py-3 text-sm rounded-xl transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSignUp ? (
              <>
                Sign Up Now <Sparkles className="w-4 h-4" />
              </>
            ) : (
              <>
                Log In <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>


      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <ShaderBackground opacity={0.4} />
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center justify-center px-6 pt-32 pb-20 min-h-[85vh]">
        <Suspense fallback={
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
            <p className="text-xs text-primary/40">Loading security portal...</p>
          </div>
        }>
          <LoginContent />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
