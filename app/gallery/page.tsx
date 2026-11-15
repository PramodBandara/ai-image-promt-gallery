'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { ImageCard } from '../components/ImageCard';
import Navbar from '../components/Navbar';

type ImageRow = {
  id: string;
  image_url: string;
  prompt: string;
  model: string;
  uploader_email: string;
  uploader_role: string;
  featured?: boolean;
};

export default function GalleryPage() {
  const [images, setImages] = useState<ImageRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState('all');

  useEffect(() => {
    const fetchApprovedImages = async () => {
      setLoading(true);

      let query = supabase
        .from('images')
        .select('id, image_url, prompt, model, uploader_email, uploader_role, featured')
        .eq('status', 'approved');

      if (selectedModel !== 'all') {
        query = query.eq('model', selectedModel);
      }

      const { data, error } = await query
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        // Ignore Supabase abort errors that can happen during fast re-renders
        if (!error.message?.includes('AbortError')) {
          setError(error.message);
        }
      } else {
        setImages(data || []);
      }

      setLoading(false);
    };

    fetchApprovedImages();
  }, [selectedModel]);

  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />

      {/* HEADER */}
      <section className="px-6 md:px-16 pt-12 pb-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          AI Image Gallery
        </h1>
        <p className="text-zinc-500 mt-2 max-w-xl">
          Curated AI‑generated visuals. Explore prompts, models, and inspiration.
        </p>
      </section>

      {/* FILTER BAR */}
      <section className="px-6 md:px-16 mb-10 flex flex-wrap items-center gap-4">
        <span className="text-sm text-zinc-500">Filter by model</span>

        {['all', 'Midjourney', 'DALL·E 3', 'Leonardo', 'Nano Banana'].map((model) => (
          <button
            key={model}
            onClick={() => setSelectedModel(model)}
            className={`rounded-full px-4 py-1.5 text-sm border transition
              ${
                selectedModel === model
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-black'
              }
            `}
          >
            {model}
          </button>
        ))}
      </section>

      {/* STATES */}
      {loading && (
        <p className="px-6 md:px-16 text-zinc-500">Loading images…</p>
      )}

      {error && (
        <p className="px-6 md:px-16 text-red-500">Error: {error}</p>
      )}

      {!loading && images.length === 0 && !error && (
        <p className="px-6 md:px-16 text-zinc-500">
          No approved images yet.
        </p>
      )}

      {/* PINTEREST STYLE GRID */}
      <section className="px-6 md:px-16 pb-24">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {images.map((img) => (
            <div key={img.id} className="break-inside-avoid">
              <ImageCard
                url={img.image_url}
                prompt={img.prompt}
                model={img.model}
                uploader_email={img.uploader_email}
                uploader_role={img.uploader_role}
                featured={img.featured}
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
