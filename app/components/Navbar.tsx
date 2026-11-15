"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/app/lib/supabase";

export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (user) {
        const { data: profile } = await supabase
          .from("userprofiles")
          .select("username")
          .eq("id", user.id)
          .single();

        setUsername(profile?.username || null);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from("userprofiles")
            .select("username")
            .eq("id", session.user.id)
            .single();

          setUsername(profile?.username || null);
        } else {
          setUsername(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUsername(null);
    router.push("/");
  };

  return (
    <>
      <nav
        className={`sticky top-6 z-50 w-full flex justify-center px-6 relative transition-all duration-300 ${
          scrolled ? 'opacity-99' : 'opacity-95'
        }`}
      >
        <div
          className={`relative w-full max-w-5xl flex items-center justify-between px-6 py-3 rounded-xl backdrop-blur-xl border overflow-hidden transition-all duration-300 ${
            scrolled
              ? 'bg-white/80 dark:bg-black/80 shadow-[0_12px_40px_rgba(0,0,0,0.12)] border-white/50 dark:border-white/20'
              : 'bg-white/60 dark:bg-black/60 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border-white/40 dark:border-white/10'
          }`}
        >
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/20 blur-3xl rounded-full" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
          </div>
          <Link href="/" className="flex items-center gap-2 font-semibold text-base tracking-tight text-black dark:text-white">
            <Image
              src="/flaireco.png"
              alt="Flaireco Logo"
              width={26}
              height={26}
              className="rounded-full"
            />
            <span className="tracking-wide">Flaire</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
            <Link href="/gallery" className="relative px-1 py-1 transition-colors duration-200 hover:text-black dark:hover:text-white">
              prompt lab
            </Link>

            <Link href="/upload" className="relative px-1 py-1 transition-colors duration-200 hover:text-black dark:hover:text-white">
              Upload
            </Link>

            {username ? (
              <>
                {/* Avatar */}
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-black text-white text-sm font-semibold uppercase shadow">
                  {username.charAt(0)}
                </div>

                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">@{username}</span>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/signin" className="hover:text-black transition">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-full bg-black text-white hover:opacity-80 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 dark:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-3 mx-6 rounded-2xl bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-white/40 dark:border-white/10 px-6 py-6 space-y-6">
          <Link href="/gallery" onClick={() => setIsOpen(false)} className="block text-lg">
            Gallery
          </Link>

          <Link href="/upload" onClick={() => setIsOpen(false)} className="block text-lg">
            Upload
          </Link>

          {username ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 flex items-center justify-center rounded-full bg-gradient-to-br from-black to-gray-800 text-white font-semibold uppercase shadow-lg">
                  {username.charAt(0)}
                </div>
                <span className="font-medium">@{username}</span>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 rounded-full bg-black text-white hover:opacity-80 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                onClick={() => setIsOpen(false)}
                className="block text-lg"
              >
                Login
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsOpen(false)}
                className="block text-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}