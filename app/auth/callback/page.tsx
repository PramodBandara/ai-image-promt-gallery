'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.push('/login');
        return;
      }

      // Check if username exists
      const { data: profile } = await supabase
        .from('userprofiles')
        .select('username')
        .eq('id', data.user.id)
        .single();

      if (!profile) {
        router.push('/choose-username');
      } else {
        router.push('/');
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
    </div>
  );
}