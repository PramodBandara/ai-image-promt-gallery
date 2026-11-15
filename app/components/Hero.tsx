"use client";

import { useEffect, useRef, useState } from "react";
import BlurText from "./BlurText";

/* ─── animated counter ─────────────────────────────────── */
function useCounter(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return val;
}

/* ─── dot-grid canvas ──────────────────────────────────── */
function DotGrid() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const draw = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gap = 30;
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const maxD = Math.hypot(cx, cy);
      for (let x = gap / 2; x < canvas.width; x += gap)
        for (let y = gap / 2; y < canvas.height; y += gap) {
          const a = 0.04 + 0.11 * (1 - Math.hypot(x - cx, y - cy) / maxD);
          ctx.beginPath();
          ctx.arc(x, y, 1.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,0,0,${a})`;
          ctx.fill();
        }
    };
    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);
  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

/* ─── component ────────────────────────────────────────── */
export default function Hero() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 350); }, []);

  const projects = useCounter(120, 1600, ready);
  const clients  = useCounter(48,  1600, ready);
  const uptime   = useCounter(99,  1400, ready);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

        .h-root { font-family: 'DM Sans', sans-serif; }

        /* nav links */
        .h-nav-link {
          position: relative; color: #6b7280; font-size: .8125rem;
          letter-spacing: .02em; text-decoration: none; transition: color .2s;
        }
        .h-nav-link::after {
          content:''; position:absolute; bottom:-2px; left:0;
          width:0; height:1px; background:#111; transition:width .25s ease;
        }
        .h-nav-link:hover { color:#111; }
        .h-nav-link:hover::after { width:100%; }

        /* badge */
        .h-badge {
          display:inline-flex; align-items:center; gap:7px;
          background:rgba(0,0,0,.05); border:1px solid rgba(0,0,0,.07);
          border-radius:100px; padding:5px 14px;
          font-size:.68rem; letter-spacing:.12em; text-transform:uppercase; color:#666;
        }
        .h-dot {
          width:6px; height:6px; border-radius:50%; background:#22c55e;
          animation: hdot 2s ease infinite;
        }
        @keyframes hdot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.65)} }

        /* headline */
        .h-display {
          font-family:'Cormorant Garamond', serif;
          font-weight:600; line-height:1.07; letter-spacing:-.02em; color:#0d0d0d;
        }

        /* CTAs */
        .h-cta-p {
          display:inline-flex; align-items:center; gap:8px;
          background:#0d0d0d; color:#fff;
          padding:12px 26px; border-radius:100px;
          font-size:.8rem; font-weight:500; letter-spacing:.01em;
          text-decoration:none; transition:transform .2s, box-shadow .2s;
        }
        .h-cta-p:hover { transform:translateY(-2px); box-shadow:0 14px 36px rgba(0,0,0,.18); }
        .h-cta-p svg { transition:transform .2s; }
        .h-cta-p:hover svg { transform:translateX(3px); }

        .h-cta-s {
          display:inline-flex; align-items:center; gap:8px;
          border:1px solid rgba(0,0,0,.14); color:#333;
          padding:12px 26px; border-radius:100px;
          font-size:.8rem; font-weight:400;
          text-decoration:none; background:transparent;
          transition:border-color .2s, background .2s, transform .2s;
        }
        .h-cta-s:hover { border-color:rgba(0,0,0,.28); background:rgba(0,0,0,.03); transform:translateY(-2px); }

        /* stat cards */
        .h-stat {
          display:flex; flex-direction:column; align-items:center; gap:2px;
          padding:15px 26px;
          border:1px solid rgba(0,0,0,.07); border-radius:16px;
          background:rgba(255,255,255,.55); backdrop-filter:blur(8px);
          transition:border-color .2s, transform .25s;
        }
        .h-stat:hover { border-color:rgba(0,0,0,.15); transform:translateY(-3px); }
        .h-stat-n {
          font-family:'Cormorant Garamond', serif;
          font-size:1.8rem; font-weight:600; color:#0d0d0d; line-height:1;
        }
        .h-stat-l { font-size:.67rem; letter-spacing:.1em; text-transform:uppercase; color:#aaa; }

        /* tag pills */
        .h-tag {
          display:inline-flex; align-items:center; gap:5px;
          padding:5px 13px; border:1px solid rgba(0,0,0,.07);
          border-radius:100px; font-size:.68rem; letter-spacing:.07em; color:#888;
          background:rgba(255,255,255,.45);
          transition:color .2s, border-color .2s;
        }
        .h-tag:hover { color:#333; border-color:rgba(0,0,0,.16); }
        .h-tag-dot { width:5px; height:5px; border-radius:50%; background:#d1d5db; flex-shrink:0; }

        /* scroll hint */
        .h-scroll { display:flex; flex-direction:column; align-items:center; gap:4px; opacity:.25; }
        .h-scroll-line {
          width:1px; height:34px;
          background:linear-gradient(to bottom,transparent,#333);
          animation:hscroll 2.2s ease infinite;
        }
        @keyframes hscroll { 0%,100%{opacity:.3;transform:scaleY(1)} 50%{opacity:.9;transform:scaleY(1.2)} }

        /* staggered fade-up */
        @keyframes hfu { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        .hfu  { animation:hfu .65s ease both; }
        .hd1  { animation-delay:.08s; }
        .hd2  { animation-delay:.2s; }
        .hd3  { animation-delay:.34s; }
        .hd4  { animation-delay:.5s; }
        .hd5  { animation-delay:.66s; }
        .hd6  { animation-delay:.82s; }

        /* glass card */
        .h-glass {
          background:rgba(255,255,255,.78);
          backdrop-filter:blur(28px) saturate(180%);
          -webkit-backdrop-filter:blur(28px) saturate(180%);
          border:1px solid rgba(255,255,255,.65);
          box-shadow:
            0 4px 6px -1px rgba(0,0,0,.04),
            0 28px 72px -12px rgba(0,0,0,.1),
            inset 0 1px 0 rgba(255,255,255,.92);
        }

        /* corner accents */
        .h-corner-tr {
          position:absolute; top:18px; right:18px; width:44px; height:44px;
          border-top:1px solid rgba(0,0,0,.07); border-right:1px solid rgba(0,0,0,.07);
          border-radius:0 12px 0 0; pointer-events:none;
        }
        .h-corner-bl {
          position:absolute; bottom:18px; left:18px; width:44px; height:44px;
          border-bottom:1px solid rgba(0,0,0,.07); border-left:1px solid rgba(0,0,0,.07);
          border-radius:0 0 0 12px; pointer-events:none;
        }
      `}</style>

      <section
        className="h-root"
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0",
          background: "#f5f4f0",
          overflow: "hidden",
          width: "100vw",
          height: "100vh",
        }}
      >
        {/* ambient orbs */}
        <div style={{ position:"absolute", top:-80, left:-60, width:420, height:420, borderRadius:"50%", background:"rgba(254,215,170,.55)", filter:"blur(80px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:40, right:-40, width:340, height:340, borderRadius:"50%", background:"rgba(254,205,211,.4)", filter:"blur(72px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:"20%", left:"15%", width:260, height:260, borderRadius:"50%", background:"rgba(186,230,253,.35)", filter:"blur(64px)", pointerEvents:"none" }} />

        <DotGrid />

        {/* ── glass card ─────────────────────────── */}
        <div
          className="h-glass"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: "0px",
            padding: "clamp(24px,4vw,48px) clamp(24px,5vw,56px)",
          }}
        >
          <div className="h-corner-tr" />
          <div className="h-corner-bl" />



          {/* HERO BODY */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>

            {/* badge row */}
            <div
              className="hfu hd1"
              style={{ display:"flex", alignItems:"center", gap:16, marginBottom:28, flexWrap:"wrap", justifyContent:"center" }}
            >
              <span className="h-badge">
                <span className="h-dot" />
                Available for projects
              </span>
              <span style={{ fontSize:".72rem", color:"#bbb", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:32, height:1, background:"rgba(0,0,0,.12)", display:"inline-block" }} />
                Trusted by 48+ product teams
              </span>
            </div>

            {/* headline */}
            <div className="hfu hd2" style={{ textAlign:"center", marginBottom:18 }}>
              <h1
                className="h-display"
                style={{ fontSize:"clamp(2.8rem,6.5vw,5rem)", maxWidth:820, margin:"0 auto" }}
              >
                Best-in-Class
                <br />
                <span style={{ position:"relative", display:"inline-block" }}>
                  Product Engineering
                  <svg
                    viewBox="0 0 420 14"
                    style={{ position:"absolute", bottom:-4, left:0, width:"100%", height:"auto", opacity:.2 }}
                    preserveAspectRatio="none"
                  >
                    <path d="M4 9 Q105 3 210 9 Q315 15 416 7" stroke="#0d0d0d" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>
            </div>

            {/* sub */}
            <div className="hfu hd3" style={{ textAlign:"center", marginBottom:34 }}>
              <p style={{
                fontSize:"clamp(.875rem,1.5vw,1rem)", color:"#6b7280",
                maxWidth:470, margin:"0 auto", lineHeight:1.72, fontWeight:300,
              }}>
                From UI/UX design to deployment pipelines — we build modern
                product systems and explore AI workflows through our Prompt Lab.
              </p>
            </div>

            {/* CTAs */}
            <div className="hfu hd4" style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:44 }}>
              <a href="/upload" className="h-cta-p">
                Share Prompts
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="/gallery" className="h-cta-s">
                Explore Prompt Lab
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M7 5v2.5l1.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </a>
            </div>

            {/* stats */}
            <div className="hfu hd5" style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center", marginBottom:36 }}>
              {[
                { val: projects, suf:"+", label:"Projects Shipped" },
                { val: clients,  suf:"+", label:"Happy Clients" },
                { val: uptime,   suf:"%", label:"Uptime SLA" },
              ].map(({ val, suf, label }) => (
                <div key={label} className="h-stat">
                  <span className="h-stat-n">{val}{suf}</span>
                  <span className="h-stat-l">{label}</span>
                </div>
              ))}
            </div>

            {/* tags */}
            <div className="hfu hd6" style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
              {["UI / UX Design","Product Engineering","Deployment Pipelines","AI Systems","Prompt Engineering"].map((t) => (
                <span key={t} className="h-tag">
                  <span className="h-tag-dot" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* scroll hint */}
          <div style={{ display:"flex", justifyContent:"center", marginTop:36 }}>
            <div className="h-scroll" style={{ animation:"hfu .7s ease 1.5s both" }}>
              <span style={{ fontSize:".6rem", letterSpacing:".14em", textTransform:"uppercase", color:"#aaa" }}>scroll</span>
              <div className="h-scroll-line" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
