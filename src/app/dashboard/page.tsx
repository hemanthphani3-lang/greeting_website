'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  Search, 
  Eye, 
  Share2, 
  Trash2, 
  Copy, 
  Check, 
  Edit3, 
  Plus, 
  ExternalLink,
  Layers,
  Heart,
  Calendar,
  Grid,
  TrendingUp,
  Files
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ShaderBackground } from '@/components/ShaderBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface Memory {
  id: string;
  created_at: string;
  recipient_name: string;
  sender_name?: string;
  message: string;
  occasion: string;
  template: string;
  music_url?: string;
  slug: string;
  memory_photos: { url: string }[];
  memory_views: { id: string }[];
  memory_shares: { id: string }[];
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [search, setSearch] = useState('');
  
  // Analytics summaries
  const [totalViews, setTotalViews] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  
  // Copy link feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit modal state
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [editRecipientName, setEditRecipientName] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [editMusicUrl, setEditMusicUrl] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Fetch user memories from local storage IDs
  const fetchMemories = async () => {
    setLoading(true);
    try {
      if (typeof window === 'undefined') return;
      const stored = localStorage.getItem('memoryverse_created_ids');
      const ids: string[] = stored ? JSON.parse(stored) : [];

      if (ids.length === 0) {
        setMemories([]);
        setTotalViews(0);
        setTotalShares(0);
        setLoading(false);
        return;
      }

      // Fetch memory records including their related views and shares counts
      const { data, error } = await supabase
        .from('memories')
        .select(`
          *,
          memory_photos(url),
          memory_views(id),
          memory_shares(id)
        `)
        .in('id', ids)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setMemories(data as Memory[]);
        
        // Sum analytics
        let views = 0;
        let shares = 0;
        data.forEach((m: any) => {
          views += m.memory_views?.length || 0;
          shares += m.memory_shares?.length || 0;
        });
        setTotalViews(views);
        setTotalShares(shares);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  // Handle link copying
  const handleCopyLink = (slug: string, id: string) => {
    const url = `${window.location.origin}/m/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle memory deletion
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory website permanently?')) return;

    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local storage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('memoryverse_created_ids');
        let ids: string[] = stored ? JSON.parse(stored) : [];
        ids = ids.filter(x => x !== id);
        localStorage.setItem('memoryverse_created_ids', JSON.stringify(ids));
      }

      // Refresh data
      setMemories(prev => prev.filter(m => m.id !== id));
      fetchMemories();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  // Handle memory duplication
  const handleDuplicate = async (memory: Memory) => {
    try {
      setLoading(true);
      const newSlug = `${memory.recipient_name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
      
      // 1. Insert new memory
      const { data: newMemory, error: memoryError } = await supabase
        .from('memories')
        .insert({
          recipient_name: `${memory.recipient_name} (Copy)`,
          sender_name: memory.sender_name || null,
          message: memory.message,
          occasion: memory.occasion,
          template: memory.template,
          music_url: memory.music_url || null,
          slug: newSlug
        })
        .select()
        .single();

      if (memoryError) throw memoryError;

      // 2. Link existing photos
      if (memory.memory_photos && memory.memory_photos.length > 0) {
        const photoInserts = memory.memory_photos.map((p, index) => ({
          memory_id: newMemory.id,
          url: p.url,
          display_order: index
        }));

        const { error: photosError } = await supabase
          .from('memory_photos')
          .insert(photoInserts);

        if (photosError) throw photosError;
      }

      // 3. Save new ID to local storage
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('memoryverse_created_ids');
        const ids = stored ? JSON.parse(stored) : [];
        ids.push(newMemory.id);
        localStorage.setItem('memoryverse_created_ids', JSON.stringify(ids));
      }

      fetchMemories();
    } catch (err: any) {
      alert('Duplicate failed: ' + err.message);
      setLoading(false);
    }
  };

  // Edit mode trigger
  const startEditing = (memory: Memory) => {
    setEditingMemory(memory);
    setEditRecipientName(memory.recipient_name);
    setEditMessage(memory.message);
    setEditMusicUrl(memory.music_url || '');
  };

  // Save changes
  const handleSaveEdit = async () => {
    if (!editingMemory || !editRecipientName || !editMessage) return;
    setEditLoading(true);
    try {
      const { error } = await supabase
        .from('memories')
        .update({
          recipient_name: editRecipientName,
          message: editMessage,
          music_url: editMusicUrl || null
        })
        .eq('id', editingMemory.id);

      if (error) throw error;

      setEditingMemory(null);
      fetchMemories();
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Search filter
  const filteredMemories = memories.filter(m => 
    m.recipient_name.toLowerCase().includes(search.toLowerCase()) ||
    m.occasion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <ShaderBackground opacity={0.4} />
      <Navbar />

      <main className="flex-1 w-full max-w-[1120px] mx-auto px-6 md:px-12 pt-28 pb-16 flex flex-col justify-start min-h-[85vh]">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-primary">Your MemoryVerse</h1>
            <p className="text-sm text-primary-light/70 mt-1">Manage created memory surprise websites and view their performance analytics.</p>
          </div>
          <Link
            href="/create"
            className="px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 transition-colors shadow-md hover:shadow-lg active:scale-97"
          >
            Create New Memory <Plus className="w-4 h-4" />
          </Link>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Total memories */}
          <div className="glass-panel p-6 rounded-2xl border-white/60 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
              <Grid className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Total Memories</p>
              <h3 className="text-2xl font-bold text-primary">{memories.length}</h3>
            </div>
          </div>

          {/* Card 2: Views */}
          <div className="glass-panel p-6 rounded-2xl border-white/60 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-secondary/5 flex items-center justify-center text-secondary shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Total Surprise Views</p>
              <h3 className="text-2xl font-bold text-primary">{totalViews}</h3>
            </div>
          </div>

          {/* Card 3: Shares */}
          <div className="glass-panel p-6 rounded-2xl border-white/60 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-accent/5 flex items-center justify-center text-accent shrink-0">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Surprise Shares</p>
              <h3 className="text-2xl font-bold text-primary">{totalShares}</h3>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="glass-panel p-6 md:p-8 rounded-[2rem] border-white/60 shadow-apple space-y-6">
          {/* Search bar */}
          <div className="flex items-center gap-3 p-3 bg-white/60 border border-gray-200/50 rounded-2xl max-w-sm">
            <Search className="w-4 h-4 text-primary/40 shrink-0" />
            <input
              type="text"
              placeholder="Search by recipient or occasion..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-primary outline-none flex-1 placeholder-primary/30 font-sans"
            />
          </div>

          {/* Memories Table/List */}
          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-gray-100 border-t-primary rounded-full animate-spin" />
              <p className="text-xs text-primary/40">Loading your memories dashboard...</p>
            </div>
          ) : filteredMemories.length === 0 ? (
            <div className="py-20 text-center space-y-6">
              <span className="text-5xl block">🎁</span>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-primary">No surprise websites found</h3>
                <p className="text-xs text-primary-light/60 max-w-xs mx-auto">
                  {search ? 'No memories matched your search criteria.' : 'Create your first memory website to surprise a loved one.'}
                </p>
              </div>
              {!search && (
                <Link
                  href="/create"
                  className="px-6 py-3 bg-primary hover:bg-primary-light text-white text-xs font-bold uppercase tracking-wider rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-all"
                >
                  Create First Surprise <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMemories.map((memory) => (
                <div 
                  key={memory.id} 
                  className="p-5 bg-white/40 border border-gray-200/60 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:bg-white/80 hover:shadow-sm transition-all group"
                >
                  {/* Photo & Main info */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 relative">
                      {memory.memory_photos && memory.memory_photos[0] ? (
                        <img src={memory.memory_photos[0].url} alt="Memory cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg bg-gray-100">📸</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-base text-primary">Surprise for {memory.recipient_name}</h4>
                      <div className="flex flex-wrap gap-2 items-center text-xs text-primary-light/60">
                        <span className="bg-primary/5 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider text-primary">{memory.occasion}</span>
                        <span className="bg-secondary/5 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider text-secondary">{memory.template} template</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(memory.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Analytics counts */}
                  <div className="flex gap-6 items-center shrink-0">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Views</p>
                      <p className="font-bold text-sm text-primary">{memory.memory_views?.length || 0}</p>
                    </div>
                    <div className="text-center border-l border-gray-200/60 pl-6">
                      <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Shares</p>
                      <p className="font-bold text-sm text-primary">{memory.memory_shares?.length || 0}</p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 items-center self-end sm:self-center shrink-0">
                    {/* Copy Link */}
                    <button
                      onClick={() => handleCopyLink(memory.slug, memory.id)}
                      className="p-2.5 hover:bg-gray-100/60 text-primary/70 rounded-xl transition-colors cursor-pointer"
                      title="Copy sharing link"
                    >
                      {copiedId === memory.id ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* View live */}
                    <a
                      href={`/m/${memory.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 hover:bg-gray-100/60 text-primary/70 rounded-xl transition-colors"
                      title="View live website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* Edit */}
                    <button
                      onClick={() => startEditing(memory)}
                      className="p-2.5 hover:bg-gray-100/60 text-primary/70 rounded-xl transition-colors cursor-pointer"
                      title="Edit message/recipient"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(memory)}
                      className="p-2.5 hover:bg-gray-100/60 text-primary/70 rounded-xl transition-colors cursor-pointer"
                      title="Duplicate memory"
                    >
                      <Files className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(memory.id)}
                      className="p-2.5 hover:bg-red-50 text-red-500 rounded-xl transition-colors cursor-pointer"
                      title="Delete memory"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* EDIT MODAL OVERLAY */}
      {editingMemory && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-8 md:p-10 rounded-3xl max-w-md w-full space-y-6 text-primary shadow-2xl relative">
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-xl">Edit Surprise Details</h3>
              <p className="text-xs text-primary-light/60">Update details for "{editingMemory.recipient_name}" memory page.</p>
            </div>

            <div className="space-y-4">
              {/* Recipient Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary/60">Recipient Name</label>
                <input
                  type="text"
                  value={editRecipientName}
                  onChange={(e) => setEditRecipientName(e.target.value)}
                  className="w-full border border-gray-200 focus:border-secondary focus:outline-none px-4 py-2.5 text-sm rounded-xl"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary/60">Heartfelt Message</label>
                <textarea
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 focus:border-secondary focus:outline-none px-4 py-2.5 text-sm rounded-xl resize-none font-sans"
                />
              </div>

              {/* Music URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-primary/60">Music URL</label>
                <input
                  type="text"
                  value={editMusicUrl}
                  onChange={(e) => setEditMusicUrl(e.target.value)}
                  className="w-full border border-gray-200 focus:border-secondary focus:outline-none px-4 py-2.5 text-sm rounded-xl"
                  placeholder="Direct audio/MP3 or YouTube link"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setEditingMemory(null)}
                className="py-3 bg-gray-100 hover:bg-gray-200 text-primary font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="py-3 bg-primary text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-primary-light transition-colors disabled:opacity-50 cursor-pointer"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
