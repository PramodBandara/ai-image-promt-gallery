'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });

    if (error) {
      alert(error.message);
    } else if (data?.user) {
      await supabase.from("userprofiles").insert({
        id: data.user.id,
        username: username,
      });

      alert('Signup successful!');
      window.location.href = '/';
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80 space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign Up</h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          className="w-full bg-black text-white p-2 rounded"
        >
          Sign Up
        </button>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full bg-white border p-2 rounded mt-3 hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

        <p className="text-sm text-center text-zinc-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}