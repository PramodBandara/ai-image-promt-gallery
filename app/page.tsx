"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Loader from "./components/Loader";
import Boxr from "./components/Boxr";
import Ls from "./components/ls";
import { supabase } from "@/app/lib/supabase";
import Navbar from "./components/Navbar";
import BlurText from "./components/BlurText";
import Antigravity from "./components/Antigravity";


gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const addSection = (el: HTMLDivElement) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const faqs = [
    {
      q: "Can I customize the designs?",
      a: "Yes. Every design is fully customizable to match your brand identity, product goals, and target audience.",
    },
    {
      q: "How does your SEO optimization work?",
      a: "We combine technical SEO, performance optimization, content strategy, and AI-driven keyword analysis to improve visibility and rankings.",
    },
    {
      q: "Do you offer full product engineering?",
      a: "Absolutely. We handle everything from ideation and UI/UX to development, deployment, and scaling.",
    },
    {
      q: "How fast can I launch my website or product?",
      a: "Most projects launch within 2–6 weeks, depending on complexity, integrations, and scope.",
    },
    {
      q: "Can I try it before committing?",
      a: "Yes. We offer demos, prototypes, or pilot builds so you can validate before full commitment.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [typedText, setTypedText] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const fullText = "Product Engineering";

  const [isLoading, setIsLoading] = useState(true);

  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [approvedUsers, setApprovedUsers] = useState<string[]>([]);
  // const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 2 seconds splash screen

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchApprovedCreators = async () => {
      const { data: images } = await supabase
        .from("images")
        .select("user_id")
        .eq("status", "approved");

      if (!images) return;

      const uniqueUserIds = [...new Set(images.map((img) => img.user_id))];

      if (uniqueUserIds.length === 0) return;

      const { data: profiles } = await supabase
        .from("userprofiles")
        .select("username")
        .in("id", uniqueUserIds);

      if (profiles) {
        setApprovedUsers(profiles.map((p) => p.username));
      }
    };

    fetchApprovedCreators();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 w-screen h-screen bg-black z-[9999]">
          <Image
            src="/ls.png"
            alt="Loading"
            fill
            className="object-contain"
            priority
          />
        </div>
      )}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap');`}
        {`@import url('https://fonts.googleapis.com/css2?family=Joti+One&display=swap');`}
        {`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        `}
      </style>
      <main className="min-h-screen bg-gradient-to-b from-white via-zinc-50 to-white text-black">
        <Navbar />

      <div className="px-6 md:px-16">

        {/* HERO */}
        <section
          id="hero"
          ref={addSection}
          className="relative flex flex-col items-center justify-center text-center min-h-screen px-6 md:px-16 overflow-hidden"
        >
          {/* Antigravity Background */}
          <div className="absolute inset-0 -z-30 pointer-events-none">
            <Antigravity
              count={300}
              magnetRadius={6}
              ringRadius={7}
              waveSpeed={0.4}
              waveAmplitude={1}
              particleSize={1.5}
              lerpSpeed={0.05}
              color="#000000"
              autoAnimate
              particleVariance={1}
              rotationSpeed={0}
              depthFactor={1}
              pulseSpeed={3}
              particleShape="capsule"
              fieldStrength={10}
            />
          </div>
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

          {/* Parallax Gradient Glow */}

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 backdrop-blur-xl px-4 py-1 text-xs font-medium text-zinc-600 shadow-sm">
            🚀 AI‑Driven Product Engineering
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-semibold tracking-tight leading-[1.05] bg-gradient-to-r from-black via-zinc-700 to-black bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradientShift_6s_ease_infinite]">
            Best-in-Class <br />
            {typedText}
            <span className="animate-pulse">|</span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-2xl text-base md:text-lg text-zinc-600 leading-relaxed">
            We design and engineer AI‑powered digital products — from UI/UX design
            and scalable architecture to deployment pipelines and intelligent
            systems. Our AI prompt gallery showcases experiments, while our
            core focus is building real production‑ready software.
          </p>

          {/* CTA Buttons */}
          <div className="mt-14 flex flex-col sm:flex-row gap-6 perspective-1000">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center rounded-full bg-black text-white px-8 py-3 text-sm font-medium transition-all duration-300 transform-gpu hover:scale-105 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)]"
            >
              Share Prompts
            </Link>

            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white/70 backdrop-blur-xl px-8 py-3 text-sm font-medium transition-all duration-300 transform-gpu hover:scale-105 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
            >
              Explore Prompt Lab
            </Link>
          </div>

          {/* Approved Users Pills */}
          {approvedUsers.length > 0 && (
            <div className="mt-12 flex flex-wrap justify-center gap-3 max-w-3xl">
              {approvedUsers.map((username, index) => (
                <div
                  key={index}
                  className="rounded-full border border-zinc-200 bg-white/60 backdrop-blur-xl px-5 py-2 text-xs font-medium text-zinc-700 shadow-sm hover:scale-105 transition"
                >
                  @{username}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI POWERED WEB APPLICATION */}
        <section id="ai" ref={addSection} className="grid md:grid-cols-2 gap-16 mt-40 items-center backdrop-blur-xl bg-white/60 border border-white/70 rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
        <Boxr/>
          <BlurText
            text="AI Product Engineering"
            delay={200}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl md:text-5xl font-semibold tracking-tight text-black leading-tight"
          />

          <p className="text-zinc-600 max-w-md">
            We build production‑grade AI products — combining modern frontend
            systems, scalable backend architecture, RAG pipelines, and future
            MCP‑powered workflows. Every product is engineered to move from
            prototype to real deployment.
          </p>
        </section>

        {/* UI UX DESIGN */}
        <section id="uiux" ref={addSection} className="grid md:grid-cols-2 gap-16 mt-32 items-center backdrop-blur-xl bg-white/60 border border-white/70 rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          
          <p className="text-zinc-600 max-w-md">
            Our UI/UX process focuses on building clear, scalable product
            interfaces that connect design with engineering. Every interface
            is optimized for usability, performance, and real product workflows.
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            UI UX <br /> Design
          </h2>
        </section>

        {/* SEO */}
        <section id="seo"  ref={addSection} className="grid md:grid-cols-2 gap-16 mt-32 items-center backdrop-blur-xl bg-white/60 border border-white/70 rounded-3xl p-10 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <Loader/>
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-blue-400 leading-tight">
            Search <br /> Engine <br /> Optimization
          </h2>

          <p className="text-zinc-600 max-w-md">
            We prepare products for real-world launch with technical SEO,
            performance optimization, and deployment-ready architecture
            so products are discoverable, fast, and scalable.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" ref={addSection} className="mt-40 max-w-3xl mx-auto backdrop-blur-xl bg-white/60 border border-white/70 rounded-3xl p-12 shadow-[0_10px_40px_rgba(0,0,0,0.05)]">
          <h3 className="text-center text-xl font-medium mb-12">
            contact us
          </h3>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-b border-zinc-200 pb-6 cursor-pointer"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium">{faq.q}</p>
                  <span className="text-xl">
                    {openIndex === i ? "−" : "+"}
                  </span>
                </div>

                {openIndex === i && (
                  <p className="mt-3 text-sm text-zinc-600">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="h-32" />
      </div>

      {/* FOOTER */}
      <footer className="mt-40 backdrop-blur-2xl bg-black text-zinc-300">
        <div className="px-6 md:px-16 py-20 grid gap-12 md:grid-cols-4">

          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white font-semibold text-lg">
              <Image src="/flairecow.png" alt="Flare logo" width={24} height={24} />
              Flare.io
            </div>
            <p className="text-sm leading-relaxed">
              We design and engineer AI-powered digital products for ambitious teams.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>AI Web Applications</li>
              <li>UI / UX Design</li>
              <li>SEO & Growth</li>
              <li>Product Engineering</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>About</li>
              <li>Careers</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Let’s build something</h4>
            <p className="text-sm">
              Have an idea or product in mind? Let’s talk.
            </p>
            <button className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2 text-sm font-medium hover:bg-zinc-200 transition">
              Contact us →
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-700/60 px-6 md:px-16 py-6 text-sm flex flex-col md:flex-row items-center justify-between">
          <span>© {new Date().getFullYear()} Flare.io. All rights reserved.</span>
          <span className="mt-2 md:mt-0">Built with AI & precision.</span>
        </div>
      </footer>
      </main>
    </>
  );
}
