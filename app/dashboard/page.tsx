'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';

export default function Dashboard() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return location.href = '/login';

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (data?.role !== 'admin') {
      alert('Access denied');
      location.href = '/';
    } else {
      await loadAllImages();
      setLoading(false);
    }
  };

  const loadAllImages = async () => {
    const { data } = await supabase
      .from('images')
      .select('*')
      .order('created_at', { ascending: false });

    setImages(data || []);
  };

  const approveImage = async (id: string) => {
    await supabase.from('images').update({ status: 'approved' }).eq('id', id);
    loadAllImages();
  };

  const rejectImage = async (id: string) => {
    await supabase.from('images').update({ status: 'rejected' }).eq('id', id);
    loadAllImages();
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    await supabase.from('images').update({ featured: !currentFeatured }).eq('id', id);
    loadAllImages();
  };

  const deleteImage = async (id: string) => {
    await supabase.from('images').delete().eq('id', id);
    loadAllImages();
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    location.href = '/login';
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-white text-gray-700 text-lg font-sans font-medium">
        Checking admin...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans p-8 flex flex-col items-center gap-8">
      <div className="w-full max-w-[1200px] flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 px-6 py-2 rounded-full border border-gray-300 cursor-pointer font-semibold text-base shadow-sm transition duration-300 ease-in-out hover:from-gray-300 hover:to-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 select-none"
        >
          Logout
        </button>
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight mb-6 max-w-[1200px] w-full text-left text-gray-900 drop-shadow-sm">
        All Images
      </h1>

      <div className="flex flex-wrap gap-6 justify-center w-full max-w-[1200px]">
        {images.map((img) => (
          <div
            key={img.id}
            className="bg-gray-50 p-6 rounded-3xl max-w-[380px] w-full shadow-md flex flex-col transform transition-transform duration-300 ease-in-out select-none hover:-translate-y-1 hover:shadow-lg"
          >
            <img
              src={img.image_url}
              alt=""
              loading="lazy"
              className="w-full rounded-2xl object-cover mb-5 shadow-sm aspect-[4/3]"
            />
            <div className="mb-5 text-sm font-medium tracking-wide flex items-center gap-2">
              <span className="text-gray-600">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  img.status === 'approved'
                    ? 'bg-green-100 text-green-700'
                    : img.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {img.status.charAt(0).toUpperCase() + img.status.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 justify-between">
              <button
                onClick={() => approveImage(img.id)}
                className="bg-gradient-to-r from-green-200 to-green-300 text-green-800 py-2 rounded-xl border border-green-300 cursor-pointer flex-1 min-w-[45%] font-semibold text-base shadow-sm transition duration-300 ease-in-out hover:from-green-300 hover:to-green-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 select-none"
              >
                Approve
              </button>
              <button
                onClick={() => rejectImage(img.id)}
                className="bg-gradient-to-r from-red-200 to-red-300 text-red-800 py-2 rounded-xl border border-red-300 cursor-pointer flex-1 min-w-[45%] font-semibold text-base shadow-sm transition duration-300 ease-in-out hover:from-red-300 hover:to-red-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 select-none"
              >
                Reject
              </button>
              <button
                onClick={() => toggleFeatured(img.id, img.featured)}
                className="bg-gradient-to-r from-yellow-200 to-yellow-300 text-yellow-800 py-2 rounded-xl border border-yellow-300 cursor-pointer flex-1 min-w-[45%] font-semibold text-base shadow-sm transition duration-300 ease-in-out hover:from-yellow-300 hover:to-yellow-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 select-none"
              >
                Toggle Featured
              </button>
              <button
                onClick={() => deleteImage(img.id)}
                className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 py-2 rounded-xl border border-gray-300 cursor-pointer flex-1 min-w-[45%] font-semibold text-base shadow-sm transition duration-300 ease-in-out hover:from-gray-300 hover:to-gray-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 select-none"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
