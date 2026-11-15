'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function ChooseUsername() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    if (!username) {
      alert('Please enter a username');
      return;
    }

    setLoading(true);

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push('/login');
      return;
    }

    // Check if username already exists
    const { data: existing } = await supabase
      .from('userprofiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      alert('Username already taken');
      setLoading(false);
      return;
    }

    await supabase.from('userprofiles').insert({
      id: data.user.id,
      username: username,
    });

    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80 space-y-4">
        <h1 className="text-2xl font-bold text-center">
          Choose Your Username
        </h1>

        <input
          type="text"
          placeholder="Enter username"
          className="w-full p-2 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}