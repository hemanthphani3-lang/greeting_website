import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MemoryContainer } from '@/components/MemoryContainer';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;

    const { data: memory } = await supabase
      .from('memories')
      .select('id, recipient_name, occasion')
      .eq('slug', slug)
      .single();

    if (!memory) {
      return {
        title: 'Memory Not Found - MemoryVerse',
      };
    }

    const { data: photo } = await supabase
      .from('memory_photos')
      .select('url')
      .eq('memory_id', memory.id)
      .order('display_order', { ascending: true })
      .limit(1)
      .maybeSingle();

    const title = `A Special Surprise for ${memory.recipient_name} ✨`;
    const description = `Open this magical link to see photos and a heartfelt message created just for you.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: photo ? [{ url: photo.url }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: photo ? [photo.url] : [],
      }
    };
  } catch (error) {
    return {
      title: 'Memory Surprise - MemoryVerse',
    };
  }
}

export default async function MemoryPage({ params }: Props) {
  const { slug } = await params;

  // Fetch memory details
  const { data: memory, error: memoryError } = await supabase
    .from('memories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (memoryError || !memory) {
    notFound();
  }

  // Fetch photos details
  const { data: photos, error: photosError } = await supabase
    .from('memory_photos')
    .select('*')
    .eq('memory_id', memory.id)
    .order('display_order', { ascending: true });

  return <MemoryContainer memory={memory} photos={photos || []} />;
}
