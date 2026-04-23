import { useState, useEffect, useRef, useCallback } from "react";

const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@300;400;500;600&display=swap');

    :root {
      --bronze: #2C7A7B;
      --bronze-light: #4FD1C5;
      --bronze-pale: #D6F6F4;
      --bronze-xpale: #EDF9F9;
      --ink: #111827;
      --ink-soft: #4B5563;
      --muted: #6B7280;
      --muted-light: #9CA3AF;
      --cream: #F7F6F2;
      --linen: #EEF7F6;
      --white: #FFFFFF;
      --border: #D9E4E7;
      --border-soft: #E7F0F1;
      --dark: #0B1123;
      --dark-card: #14203A;
      --dark-muted: #475569;
      --accent-rgb: 44,122,123;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Jost', sans-serif;
      background: var(--cream);
      color: var(--ink);
      overflow-x: hidden;
      cursor: none !important;
    }
    *, *:hover { cursor: none !important; }
    .font-display { font-family: 'Cormorant Garamond', serif; }

    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--linen); }
    ::-webkit-scrollbar-thumb { background: var(--bronze); border-radius: 2px; }

    /* ── CURSOR ── */
    #cursor-dot {
      width: 6px; height: 6px;
      background: var(--bronze);
      border-radius: 50%;
      position: fixed; top: 0; left: 0;
      pointer-events: none; z-index: 99999;
      transform: translate(-50%, -50%);
      transition: width .2s, height .2s, background .2s, opacity .2s;
    }
    #cursor-ring {
      width: 32px; height: 32px;
      border: 1.5px solid rgba(44,122,123,0.5);
      border-radius: 50%;
      position: fixed; top: 0; left: 0;
      pointer-events: none; z-index: 99998;
      transform: translate(-50%, -50%);
      transition: width .4s cubic-bezier(.25,.46,.45,.94),
                  height .4s cubic-bezier(.25,.46,.45,.94),
                  border-color .4s, opacity .4s;
    }
    #cursor-label {
      position: fixed; top: 0; left: 0; z-index: 99997;
      pointer-events: none;
      font-size: 8px; letter-spacing: 2px; color: var(--bronze);
      text-transform: uppercase; font-weight: 600;
      transform: translate(-50%, -50%);
      opacity: 0; transition: opacity .3s; white-space: nowrap;
    }
    body.cursor-hover #cursor-dot { width: 0; height: 0; opacity: 0; }
    body.cursor-hover #cursor-ring { width: 72px; height: 72px; border-color: var(--bronze); }
    body.cursor-hover #cursor-label { opacity: 1; }
    body.cursor-click #cursor-dot { width: 12px; height: 12px; }
    body.cursor-click #cursor-ring { width: 20px; height: 20px; }

    /* ── KEYFRAMES ── */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(48px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeLeft {
      from { opacity: 0; transform: translateX(-48px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeRight {
      from { opacity: 0; transform: translateX(48px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(.96) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes shimmerSweep {
      0%   { background-position: -400% center; }
      100% { background-position: 400% center; }
    }
    @keyframes float {
      0%,100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-18px) rotate(1deg); }
    }
    @keyframes float2 {
      0%,100% { transform: translateY(0) rotate(0deg); }
      50%      { transform: translateY(-12px) rotate(-1.5deg); }
    }
    @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    @keyframes slideInToast {
      from { transform: translateX(120px); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    @keyframes lineGrow { from { width: 0; } to { width: 60px; } }
    @keyframes pulseRing {
      0%,100% { box-shadow: 0 0 0 0 rgba(44,122,123,.3); }
      50%      { box-shadow: 0 0 0 16px rgba(44,122,123,0); }
    }
    @keyframes revealClip {
      from { clip-path: inset(0 100% 0 0); }
      to   { clip-path: inset(0 0% 0 0); }
    }
    @keyframes spinSlow {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes breathe {
      0%,100% { opacity: .4; transform: scale(1); }
      50%      { opacity: .7; transform: scale(1.06); }
    }

    .animate-fade-up   { animation: fadeUp 1s cubic-bezier(.25,.46,.45,.94) forwards; opacity: 0; }
    .animate-fade-left { animation: fadeLeft .9s cubic-bezier(.25,.46,.45,.94) forwards; opacity: 0; }
    .animate-float     { animation: float 6s ease-in-out infinite; }
    .animate-float2    { animation: float2 8s ease-in-out infinite; }
    .d1 { animation-delay: .15s; } .d2 { animation-delay: .3s; }
    .d3 { animation-delay: .5s; } .d4 { animation-delay: .7s; }
    .d5 { animation-delay: .9s; }

    .gold-shimmer {
      background: linear-gradient(90deg, var(--ink-soft), var(--bronze-light), #78d9cc, var(--bronze-light), var(--ink-soft));
      background-size: 300% auto;
      -webkit-background-clip: text; background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmerSweep 6s linear infinite;
    }

    /* ── REVEAL ── */
    .reveal       { opacity: 0; transform: translateY(36px); transition: all .8s cubic-bezier(.25,.46,.45,.94); }
    .reveal-left  { opacity: 0; transform: translateX(-36px); transition: all .8s cubic-bezier(.25,.46,.45,.94); }
    .reveal-right { opacity: 0; transform: translateX(36px); transition: all .8s cubic-bezier(.25,.46,.45,.94); }
    .reveal.visible, .reveal-left.visible, .reveal-right.visible {
      opacity: 1; transform: translate(0);
    }

    /* ── GOLD LINE ── */
    .gold-line {
      width: 60px; height: 1px;
      background: linear-gradient(90deg, transparent, var(--bronze), transparent);
      margin: 0 auto;
    }

    /* ── BUTTONS ── */
    .btn-primary {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px 40px;
      background: var(--ink); color: var(--bronze-light);
      font-family: 'Jost', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 3.5px; text-transform: uppercase;
      border: 1.5px solid var(--ink);
      position: relative; overflow: hidden;
      transition: all .45s cubic-bezier(.25,.46,.45,.94);
    }
    .btn-primary::before {
      content: ''; position: absolute; inset: 0;
      background: var(--bronze);
      transform: translateX(-101%);
      transition: transform .45s cubic-bezier(.25,.46,.45,.94);
    }
    .btn-primary span { position: relative; z-index: 1; }
    .btn-primary:hover::before { transform: translateX(0); }
    .btn-primary:hover { color: var(--white); border-color: var(--bronze); transform: translateY(-2px); }

    .btn-outline {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      padding: 13px 38px;
      background: transparent; color: var(--ink);
      font-family: 'Jost', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 3.5px; text-transform: uppercase;
      border: 1.5px solid var(--border);
      transition: all .35s ease;
    }
    .btn-outline:hover { background: var(--ink); color: var(--bronze-light); border-color: var(--ink); transform: translateY(-2px); }

    .btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      background: none; border: none; color: var(--bronze);
      font-family: 'Jost', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase;
      transition: all .3s; position: relative;
      padding-bottom: 4px;
    }
    .btn-ghost::after {
      content: ''; position: absolute; bottom: 0; left: 0;
      width: 100%; height: 1px; background: var(--bronze);
      transform: scaleX(0); transform-origin: right;
      transition: transform .35s ease;
    }
    .btn-ghost:hover::after { transform: scaleX(1); transform-origin: left; }

    /* ── NAVBAR ── */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
      transition: all .5s cubic-bezier(.25,.46,.45,.94);
    }
    .navbar-scrolled {
      background: rgba(254,250,244,.97);
      backdrop-filter: blur(24px);
      box-shadow: 0 1px 0 var(--border), 0 8px 40px rgba(28,20,16,.06);
    }
    .navbar-top {
      background: var(--bronze);
      text-align: center; padding: 9px;
      font-size: 9px; letter-spacing: 3.5px; color: var(--white);
      text-transform: uppercase; font-weight: 600;
      overflow: hidden;
    }
    .marquee-inner { display: inline-block; animation: marquee 22s linear infinite; white-space: nowrap; }

    /* ── SECTION LABEL ── */
    .section-label {
      font-size: 9px; font-weight: 600; letter-spacing: 5px;
      text-transform: uppercase; color: var(--bronze); margin-bottom: 12px;
    }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(36px,5vw,58px);
      font-weight: 300; color: var(--ink); line-height: 1.12;
    }

    /* ── HERO ── */
    .hero-section {
      min-height: 100vh; position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      background: var(--cream);
    }

    /* ── ORNAMENT ── */
    .ornament {
      display: flex; align-items: center; justify-content: center; gap: 20px;
    }
    .ornament::before, .ornament::after {
      content: ''; flex: 1; max-width: 100px; height: 1px;
      background: linear-gradient(to right, transparent, var(--bronze-pale));
    }
    .ornament::after { background: linear-gradient(to left, transparent, var(--bronze-pale)); }

    /* ── PRODUCT CARD ── */
    .product-card {
      position: relative; overflow: hidden;
      background: var(--white);
      border: 1px solid var(--border-soft);
      transition: transform .5s cubic-bezier(.25,.46,.45,.94),
                  box-shadow .5s cubic-bezier(.25,.46,.45,.94),
                  border-color .4s ease;
      will-change: transform;
    }
    .product-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 28px 70px rgba(28,20,16,.1), 0 0 0 1px rgba(44,122,123,.15);
      border-color: var(--bronze-pale);
    }
    .product-card .img-wrap {
      overflow: hidden; position: relative;
      background: var(--linen); aspect-ratio: 3/4;
    }
    .product-card img {
      width: 100%; height: 100%; object-fit: cover;
      transition: transform .8s cubic-bezier(.25,.46,.45,.94);
    }
    .product-card:hover img { transform: scale(1.08); }
    .product-card .card-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(28,20,16,.75) 0%, rgba(28,20,16,.15) 55%, transparent 100%);
      display: flex; align-items: flex-end; justify-content: center;
      padding-bottom: 24px;
      opacity: 0; transition: opacity .45s ease;
    }
    .product-card:hover .card-overlay { opacity: 1; }
    .product-card .badge {
      position: absolute; top: 14px; left: 14px;
      background: var(--bronze); color: var(--white);
      font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
      padding: 5px 13px;
    }

    /* ── FILTER TAG ── */
    .filter-tag {
      padding: 7px 18px; border: 1px solid var(--border);
      font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase;
      transition: all .3s; color: var(--muted); background: transparent;
      font-family: 'Jost', sans-serif;
    }
    .filter-tag.active, .filter-tag:hover {
      background: var(--ink); color: var(--bronze-light); border-color: var(--ink);
      transform: translateY(-2px);
    }

    /* ── TESTIMONIAL CARD ── */
    .testimonial-card {
      background: var(--white);
      border: 1px solid var(--border);
      padding: 44px; position: relative;
      transition: all .5s cubic-bezier(.25,.46,.45,.94);
    }
    .testimonial-card:hover {
      border-color: var(--bronze-pale);
      box-shadow: 0 20px 60px rgba(44,122,123,.08);
      transform: translateY(-4px);
    }
    .testimonial-card::before {
      content: '201C';
      font-family: 'Cormorant Garamond', serif;
      font-size: 120px; color: var(--bronze-pale);
      position: absolute; top: -10px; left: 20px; line-height: 1;
      pointer-events: none;
    }

    /* ── LUXURY INPUT ── */
    .luxury-input {
      width: 100%; padding: 14px 20px;
      background: transparent; border: 1px solid var(--border);
      font-family: 'Jost', sans-serif; font-size: 13px; color: var(--ink);
      transition: all .3s; outline: none; border-radius: 0;
    }
    .luxury-input:focus { border-color: var(--bronze); box-shadow: 0 0 0 3px rgba(44,122,123,.07); }
    .luxury-input::placeholder { color: var(--muted-light); letter-spacing: 1px; }

    /* ── CART ITEM ── */
    .cart-item {
      display: grid; grid-template-columns: 100px 1fr auto;
      gap: 24px; padding: 28px 0;
      border-bottom: 1px solid var(--border);
      align-items: center;
    }
    .cart-item:hover { background: rgba(44,122,123,.02); }

    /* ── TOAST ── */
    .toast {
      position: fixed; bottom: 36px; right: 36px;
      background: var(--ink); color: var(--bronze-light);
      padding: 18px 28px; font-size: 10px;
      letter-spacing: 2.5px; text-transform: uppercase;
      border-left: 3px solid var(--bronze);
      z-index: 9999; animation: slideInToast .5s cubic-bezier(.25,.46,.45,.94);
      box-shadow: 0 20px 60px rgba(28,20,16,.25);
    }

    /* ── STARS ── */
    .stars { color: var(--bronze); letter-spacing: 1px; }

    /* ── RANGE SLIDER ── */
    input[type=range] {
      -webkit-appearance: none; width: 100%; height: 2px;
      background: linear-gradient(to right, var(--bronze) 0%, var(--bronze) 50%, var(--border) 50%);
      outline: none; border-radius: 1px;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none; width: 18px; height: 18px;
      background: var(--bronze); border-radius: 50%;
      box-shadow: 0 2px 8px rgba(44,122,123,.4);
      transition: transform .2s;
    }
    input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.25); }

    /* ── MOBILE MENU ── */
    .mobile-menu {
      position: fixed; inset: 0; z-index: 999;
      background: var(--cream);
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      gap: 36px; transform: translateX(100%);
      transition: transform .6s cubic-bezier(.25,.46,.45,.94);
    }
    .mobile-menu.open { transform: translateX(0); }
    .mobile-menu a {
      font-family: 'Cormorant Garamond', serif;
      font-size: 48px; color: var(--ink);
      text-decoration: none; letter-spacing: 4px;
      transition: color .3s; position: relative;
    }
    .mobile-menu a:hover { color: var(--bronze); }

    /* ── TIMELINE ── */
    .timeline-item { position: relative; padding-left: 36px; }
    .timeline-item::before {
      content: ''; position: absolute; left: 0; top: 7px;
      width: 10px; height: 10px; border: 2px solid var(--bronze);
      border-radius: 50%; background: var(--cream);
      animation: pulseRing 3s ease-in-out infinite;
    }
    .timeline-item::after {
      content: ''; position: absolute; left: 4px; top: 22px;
      width: 2px; height: calc(100% + 20px);
      background: linear-gradient(to bottom, var(--bronze-pale), transparent);
    }
    .timeline-item:last-child::after { display: none; }

    /* ── COLOR SWATCH ── */
    .color-swatch {
      border-radius: 50%; border: 2px solid transparent;
      transition: all .3s cubic-bezier(.25,.46,.45,.94);
      box-shadow: 0 2px 8px rgba(0,0,0,.12);
    }
    .color-swatch.selected { border-color: var(--bronze); transform: scale(1.28); }
    .color-swatch:hover:not(.selected) { transform: scale(1.15); }

    /* ── CARD GOLD BORDER ── */
    .card-accent::after {
      content: ''; position: absolute;
      bottom: 0; left: 50%; right: 50%;
      height: 2px; background: var(--bronze);
      transition: left .4s ease, right .4s ease;
    }
    .card-accent:hover::after { left: 0; right: 0; }

    /* ── CATEGORY CARD ── */
    .cat-info {
      position: absolute; bottom: 0; left: 0; right: 0;
      padding: 40px 36px;
      transform: translateY(10px);
      transition: transform .5s cubic-bezier(.25,.46,.45,.94);
    }
    .cat-card:hover .cat-info { transform: translateY(0); }

    /* ── FOOTER ── */
    footer { background: var(--dark); color: #9B8B7E; }
    footer a { color: #9B8B7E; text-decoration: none; font-size: 13px; letter-spacing: .5px; transition: all .3s; display: inline-block; }
    footer a:hover { color: var(--bronze-light); transform: translateX(4px); }

    /* ── ZOOM ── */
    .zoom-container { position: relative; overflow: hidden; }
    .zoom-container img { transition: transform .6s cubic-bezier(.25,.46,.45,.94); }
    .zoom-container:hover img { transform: scale(1.4); }

    /* ── PAGE ENTER ── */
    .page-enter { animation: scaleIn .5s cubic-bezier(.25,.46,.45,.94) forwards; }

    /* ── DECORATIVE GRID ── */
    .deco-grid {
      position: absolute; inset: 0; pointer-events: none;
      background-image:
        linear-gradient(rgba(44,122,123,.045) 1px, transparent 1px),
        linear-gradient(90deg, rgba(44,122,123,.045) 1px, transparent 1px);
      background-size: 56px 56px;
    }

    /* ── NOISE ── */
    .noise {
      position: absolute; inset: 0; pointer-events: none; opacity: .025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 180px 180px;
    }

    @media (max-width: 768px) {
      .desktop-nav { display: none !important; }
      .mobile-toggle { display: block !important; }
      .cart-item { grid-template-columns: 80px 1fr; grid-template-rows: auto auto; }
    }
  `}</style>
);

/* ── CURSOR ── */
const MagneticCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const af = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      if (labelRef.current) {
        labelRef.current.style.left = `${e.clientX}px`;
        labelRef.current.style.top = `${e.clientY}px`;
      }
    };
    const loop = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.1;
      ring.current.y += (pos.current.y - ring.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.left = `${ring.current.x}px`;
        ringRef.current.style.top = `${ring.current.y}px`;
      }
      af.current = requestAnimationFrame(loop);
    };
    const onDown = () => document.body.classList.add("cursor-click");
    const onUp = () => document.body.classList.remove("cursor-click");
    const addHover = () => {
      document
        .querySelectorAll(
          "button,a,.product-card,.filter-tag,.color-swatch,.cat-card",
        )
        .forEach((el) => {
          el.addEventListener("mouseenter", () => {
            document.body.classList.add("cursor-hover");
            if (labelRef.current)
              labelRef.current.textContent = el.dataset.cursorText || "View";
          });
          el.addEventListener("mouseleave", () =>
            document.body.classList.remove("cursor-hover"),
          );
        });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    af.current = requestAnimationFrame(loop);
    setTimeout(addHover, 600);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(af.current);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} />
      <div id="cursor-ring" ref={ringRef} />
      <div id="cursor-label" ref={labelRef}>
        View
      </div>
    </>
  );
};

/* ── DATA ── */
const PRODUCTS = [
  {
    id: 1,
    name: "Noir Élégance Tote",
    category: "handbags",
    price: 2850,
    originalPrice: 3400,
    colors: ["#1A1A1A", "#8B7355", "#C4A882"],
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    badge: "New",
    rating: 5,
    reviews: 128,
    description:
      "Crafted from full-grain Italian leather, this timeless tote features gold-plated hardware and a spacious interior with suede lining.",
  },
  {
    id: 2,
    name: "Doré Clutch Evening",
    category: "clutches",
    price: 1250,
    originalPrice: null,
    colors: ["#C9A84C", "#1A1A1A", "#FFFFFF"],
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80",
    badge: "Bestseller",
    rating: 5,
    reviews: 89,
    description:
      "An exquisite evening clutch adorned with 24k gold-plated chain and handcrafted embossed leather.",
  },
  {
    id: 3,
    name: "Heritage Leather Backpack",
    category: "backpacks",
    price: 3200,
    originalPrice: 3800,
    colors: ["#8B7355", "#1A1A1A", "#5C4033"],
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    badge: "Sale",
    rating: 4,
    reviews: 67,
    description:
      "Refined elegance meets practicality. Vegetable-tanned leather that develops a unique patina over time.",
  },
  {
    id: 4,
    name: "Ivory Structured Satchel",
    category: "handbags",
    price: 1950,
    originalPrice: null,
    colors: ["#F5F0E8", "#C4A882", "#1A1A1A"],
    image:
      "https://images.unsplash.com/photo-1584917865442-de89be144769?w=600&q=80",
    badge: "New",
    rating: 5,
    reviews: 203,
    description:
      "A minimalist structured satchel in pristine ivory leather, perfect for both boardroom and social occasions.",
  },
  {
    id: 5,
    name: "Velvet Noir Mini Bag",
    category: "clutches",
    price: 890,
    originalPrice: 1100,
    colors: ["#1A1A1A", "#4A0E4E", "#8B0000"],
    image:
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&q=80",
    badge: "Sale",
    rating: 4,
    reviews: 55,
    description:
      "Luxurious black velvet with sterling silver chain. A petite masterpiece that commands attention.",
  },
  {
    id: 6,
    name: "Cognac Travel Duffle",
    category: "backpacks",
    price: 4100,
    originalPrice: null,
    colors: ["#8B6914", "#1A1A1A", "#C4A882"],
    image:
      "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&q=80",
    badge: "Limited",
    rating: 5,
    reviews: 41,
    description:
      "For the world traveler. Handstitched cognac leather duffle with monogramming service available.",
  },
  {
    id: 7,
    name: "Chain-Link Shoulder Bag",
    category: "handbags",
    price: 2100,
    originalPrice: 2500,
    colors: ["#C9A84C", "#1A1A1A", "#F5F0E8"],
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
    badge: "Trending",
    rating: 5,
    reviews: 176,
    description:
      "Draped in a gold chain-link strap, this shoulder bag is the epitome of Parisian chic.",
  },
  {
    id: 8,
    name: "Croc-Embossed Tote",
    category: "handbags",
    price: 3600,
    originalPrice: null,
    colors: ["#1A1A1A", "#556B2F", "#8B2252"],
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    badge: "Exclusive",
    rating: 5,
    reviews: 93,
    description:
      "Hand-embossed crocodile-pattern leather in a bold structured silhouette. Limited production.",
  },
  {
    id: 9,
    name: "Silk Brocade Minaudière",
    category: "clutches",
    price: 750,
    originalPrice: 950,
    colors: ["#C9A84C", "#4A0E4E", "#8B0000"],
    image:
      "https://images.unsplash.com/photo-1563904092230-7ec217b65fe2?w=600&q=80",
    badge: "Sale",
    rating: 4,
    reviews: 38,
    description:
      "A jewel-box evening bag in vintage-inspired brocade with hand-set crystal clasp.",
  },
  {
    id: 10,
    name: "The Everyday Luxe Tote",
    category: "handbags",
    price: 1680,
    originalPrice: null,
    colors: ["#C4A882", "#1A1A1A", "#F5F0E8"],
    image:
      "https://images.unsplash.com/photo-1612902456551-b7f0571441c9?w=600&q=80",
    badge: "New",
    rating: 5,
    reviews: 247,
    description:
      "Elevated everyday carry. Supple pebbled leather with 14-karat gold hardware.",
  },
];

const TESTIMONIALS = [
  {
    name: "Isabelle Moreau",
    title: "Fashion Editor, Paris",
    text: "Xclusive Bags has redefined what luxury means to me. Every piece tells a story of impeccable craftsmanship and timeless design.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
  },
  {
    name: "Sophia Chen",
    title: "Creative Director, Milan",
    text: "The quality is absolutely extraordinary. My Noir Élégance Tote has become my most prized possession. The leather ages so beautifully.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
  },
  {
    name: "Amara Williams",
    title: "Entrepreneur, New York",
    text: "I've shopped every major luxury brand and Xclusive Bags stands apart. The personalized service, the packaging, the quality — it feels like couture.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80",
  },
];

const fp = (p) => `$${p.toLocaleString()}`;

const StarRating = ({ rating, sm }) => (
  <span className="stars" style={{ fontSize: sm ? "12px" : "16px" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} style={{ opacity: i <= rating ? 1 : 0.25 }}>
        ★
      </span>
    ))}
  </span>
);

/* ── HOOKS ── */
const useScrollReveal = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.08, rootMargin: "0px 0px -50px 0px" },
    );
    document
      .querySelectorAll(".reveal,.reveal-left,.reveal-right")
      .forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });
};

const useParallax = (ref, speed = 0.3) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = () => {
      const rect = el.getBoundingClientRect();
      const cy = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${cy * speed}px)`;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [ref, speed]);
};

/* ── ANIMATED STAT ── */
const AnimatedStat = ({ value, label }) => {
  const [displayed, setDisplayed] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          const num = parseInt(value.replace(/\D/g, "")) || 0;
          let cur = 0;
          const step = num / (1800 / 16);
          const t = setInterval(() => {
            cur += step;
            if (cur >= num) {
              setDisplayed(num);
              clearInterval(t);
            } else setDisplayed(Math.floor(cur));
          }, 16);
        }
      },
      { threshold: 0.5 },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  const pre = value.match(/^\D+/)?.[0] || "";
  const suf = value.match(/\D+$/)?.[0] || "";
  return (
    <div ref={ref} className="reveal" style={{ textAlign: "center" }}>
      <div
        className="font-display gold-shimmer"
        style={{ fontSize: "60px", fontWeight: 300, lineHeight: 1 }}
      >
        {pre}
        {displayed}
        {suf}
      </div>
      <div
        style={{
          fontSize: "9px",
          letterSpacing: "4px",
          color: "var(--dark-muted)",
          textTransform: "uppercase",
          marginTop: "12px",
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ── NAVBAR ── */
const Navbar = ({ cartCount, setPage, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["Home", "Shop", "About", "Contact"];
  const nav = (p) => {
    setPage(p.toLowerCase());
    setMobileOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
        {!scrolled && (
          <div className="navbar-top">
            <div className="marquee-inner">
              ✦ Complimentary shipping on orders above $500 &nbsp;&nbsp; ✦ New
              Autumn Collection Available Now &nbsp;&nbsp; ✦ Italian Handcrafted
              Leather &nbsp;&nbsp; ✦ Complimentary shipping on orders above $500
              &nbsp;&nbsp; ✦ New Autumn Collection Available Now &nbsp;&nbsp; ✦
              Italian Handcrafted Leather &nbsp;&nbsp;
            </div>
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 52px",
            height: "72px",
            background: scrolled ? "transparent" : "rgba(254,250,244,.92)",
            backdropFilter: scrolled ? "none" : "blur(16px)",
            borderBottom: scrolled ? "none" : "1px solid var(--border-soft)",
          }}
        >
          <button
            onClick={() => nav("home")}
            style={{ background: "none", border: "none" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                className="font-display"
                style={{
                  color: "var(--bronze)",
                  fontSize: "22px",
                  fontWeight: 400,
                  letterSpacing: "6px",
                  textTransform: "uppercase",
                }}
              >
                Xclusive
              </span>
              <span
                style={{
                  color: "var(--bronze-light)",
                  fontSize: "7px",
                  letterSpacing: "9px",
                  textTransform: "uppercase",
                  marginTop: "-4px",
                }}
              >
                BAGS
              </span>
            </div>
          </button>

          <div style={{ display: "flex", gap: "44px" }} className="desktop-nav">
            {links.map((l) => (
              <button
                key={l}
                onClick={() => nav(l)}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "Jost,sans-serif",
                  color:
                    currentPage === l.toLowerCase()
                      ? "var(--bronze)"
                      : "var(--muted)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  transition: "color .3s",
                  borderBottom:
                    currentPage === l.toLowerCase()
                      ? "1px solid var(--bronze)"
                      : "1px solid transparent",
                  paddingBottom: "3px",
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <button
              onClick={() => nav("shop")}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                fontSize: "18px",
                transition: "color .3s",
              }}
            >
              🔍
            </button>
            <button
              onClick={() => nav("cart")}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                fontSize: "18px",
                position: "relative",
              }}
            >
              🛍️
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-10px",
                    background: "var(--bronze)",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    animation: "pulseRing 2s ease-in-out infinite",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="mobile-toggle"
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                fontSize: "20px",
                display: "none",
              }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        {links.map((l, i) => (
          <a
            key={l}
            onClick={() => nav(l)}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {l}
          </a>
        ))}
        <button
          className="btn-primary"
          onClick={() => nav("cart")}
          style={{ marginTop: "8px" }}
        >
          <span>Cart ({cartCount})</span>
        </button>
      </div>
    </>
  );
};

/* ── FOOTER ── */
const Footer = ({ setPage }) => (
  <footer>
    <div
      style={{
        padding: "80px 60px 40px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent, rgba(44,122,123,.25), rgba(44,122,123,.6), rgba(44,122,123,.25), transparent)",
          marginBottom: "60px",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "60px",
          marginBottom: "60px",
        }}
      >
        <div>
          <div
            className="font-display"
            style={{
              color: "var(--bronze-light)",
              fontSize: "28px",
              letterSpacing: "6px",
              marginBottom: "4px",
            }}
          >
            Xclusive
          </div>
          <div
            style={{
              color: "var(--dark-muted)",
              fontSize: "8px",
              letterSpacing: "9px",
              marginBottom: "20px",
            }}
          >
            BAGS
          </div>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.9,
              color: "var(--dark-muted)",
            }}
          >
            Crafting timeless luxury since 1998. Every bag is a testament to
            artisanal excellence and refined taste.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
            {["IG", "FB", "TW", "PIN"].map((s) => (
              <div
                key={s}
                style={{
                  width: "36px",
                  height: "36px",
                  border: "1px solid #2C2820",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "9px",
                  letterSpacing: "1px",
                  color: "var(--dark-muted)",
                  transition: "all .3s",
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "var(--bronze)";
                  e.target.style.color = "var(--bronze)";
                  e.target.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "#2C2820";
                  e.target.style.color = "var(--dark-muted)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
        {[
          [
            "Collections",
            ["Handbags", "Clutches", "Backpacks", "New Arrivals", "Sale"],
          ],
          [
            "Company",
            ["About Us", "Craftsmanship", "Sustainability", "Press", "Careers"],
          ],
          [
            "Support",
            [
              "Shipping & Returns",
              "Size Guide",
              "Care Guide",
              "Contact Us",
              "FAQs",
            ],
          ],
        ].map(([title, items]) => (
          <div key={title}>
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "4px",
                color: "var(--bronze)",
                marginBottom: "28px",
                textTransform: "uppercase",
              }}
            >
              {title}
            </div>
            {items.map((l) => (
              <div key={l} style={{ marginBottom: "14px" }}>
                <a
                  onClick={() => {
                    if (l === "About Us") setPage("about");
                    else if (l === "Contact Us") setPage("contact");
                    else setPage("shop");
                  }}
                >
                  {l}
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: "1px solid #2A2018",
          paddingTop: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <p style={{ fontSize: "11px", color: "#3C3028", letterSpacing: "2px" }}>
          © 2025 XCLUSIVE BAGS. ALL RIGHTS RESERVED.
        </p>
        <div style={{ display: "flex", gap: "28px" }}>
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
            <a key={l} style={{ fontSize: "10px", color: "#3C3028" }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ── HOME PAGE ── */
const HomePage = ({ setPage, addToCart }) => {
  useScrollReveal();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const parallaxRef1 = useRef(null);
  const parallaxRef2 = useRef(null);
  useParallax(parallaxRef1, 0.12);
  useParallax(parallaxRef2, -0.08);

  const categories = [
    {
      name: "Handbags",
      desc: "Timeless Structure",
      img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      count: "24 Pieces",
    },
    {
      name: "Clutches",
      desc: "Evening Elegance",
      img: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80",
      count: "18 Pieces",
    },
    {
      name: "Backpacks",
      desc: "Refined Utility",
      img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      count: "12 Pieces",
    },
  ];

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="deco-grid" />

        {/* Decorative orbs */}
        <div
          ref={parallaxRef1}
          className="animate-float"
          style={{
            position: "absolute",
            width: "560px",
            height: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,149,106,.09) 0%, transparent 70%)",
            top: "5%",
            right: "2%",
            pointerEvents: "none",
          }}
        />
        <div
          ref={parallaxRef2}
          className="animate-float2"
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(44,122,123,.06) 0%, transparent 70%)",
            bottom: "15%",
            left: "3%",
            pointerEvents: "none",
          }}
        />

        {/* Vertical accent lines */}
        {[
          "80px",
          "calc(50% - 380px)",
          "calc(50% + 380px)",
          "calc(100% - 80px)",
        ].map((l, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: l,
              top: 0,
              width: "1px",
              height: "100%",
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(44,122,123,.08) 25%, rgba(44,122,123,.14) 50%, rgba(44,122,123,.08) 75%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Corner ornaments */}
        {[
          { t: 36, b: "auto", l: 36, r: "auto" },
          { t: 36, b: "auto", l: "auto", r: 36 },
          { t: "auto", b: 36, l: 36, r: "auto" },
          { t: "auto", b: 36, l: "auto", r: 36 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: pos.t,
              bottom: pos.b,
              left: pos.l,
              right: pos.r,
              width: "44px",
              height: "44px",
              borderTop: i < 2 ? "1px solid rgba(44,122,123,.25)" : "none",
              borderBottom: i >= 2 ? "1px solid rgba(44,122,123,.25)" : "none",
              borderLeft:
                i % 2 === 0 ? "1px solid rgba(44,122,123,.25)" : "none",
              borderRight:
                i % 2 === 1 ? "1px solid rgba(44,122,123,.25)" : "none",
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Spinning decorative ring */}
        <div
          style={{
            position: "absolute",
            width: "640px",
            height: "640px",
            borderRadius: "50%",
            border: "1px dashed rgba(44,122,123,.08)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "spinSlow 80s linear infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "440px",
            height: "440px",
            borderRadius: "50%",
            border: "1px dashed rgba(44,122,123,.06)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "spinSlow 55s linear infinite reverse",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            textAlign: "center",
            zIndex: 2,
            padding: "0 24px",
            maxWidth: "960px",
          }}
        >
          <div
            className="ornament animate-fade-up"
            style={{ marginBottom: "28px" }}
          >
            <span
              style={{
                fontSize: "9px",
                letterSpacing: "7px",
                color: "var(--bronze)",
                textTransform: "uppercase",
              }}
            >
              Maison de Luxe · Est. 1998
            </span>
          </div>

          <h1
            className="font-display animate-fade-up d1"
            style={{
              fontSize: "clamp(56px,12vw,132px)",
              color: "var(--ink)",
              fontWeight: 300,
              lineHeight: 0.9,
              letterSpacing: "-2px",
              marginBottom: "6px",
            }}
          >
            Art of the
          </h1>
          <h1
            className="font-display animate-fade-up d2"
            style={{
              fontSize: "clamp(56px,12vw,132px)",
              fontWeight: 300,
              lineHeight: 0.95,
              letterSpacing: "-2px",
              marginBottom: "44px",
            }}
          >
            <span className="gold-shimmer">Extraordinary</span>
          </h1>

          <div
            style={{
              width: "1px",
              height: "44px",
              background:
                "linear-gradient(to bottom, var(--bronze), transparent)",
              margin: "0 auto 32px",
              animation: "fadeIn 1s .65s ease both",
            }}
          />

          <p
            className="animate-fade-up d3"
            style={{
              color: "var(--muted)",
              fontSize: "clamp(13px,1.4vw,15px)",
              letterSpacing: "2.5px",
              maxWidth: "480px",
              margin: "0 auto 52px",
              lineHeight: 2.1,
              textTransform: "uppercase",
            }}
          >
            Italian craftsmanship meets contemporary vision.
            <br />
            Each piece — a narrative of uncompromising luxury.
          </p>

          <div
            className="animate-fade-up d4"
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-primary"
              onClick={() => setPage("shop")}
              data-cursor-text="Shop"
            >
              <span>Discover Collection</span>
            </button>
            <button
              className="btn-outline"
              onClick={() => setPage("about")}
              data-cursor-text="Story"
            >
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
            animation: "float 3s ease-in-out infinite",
          }}
        >
          <span
            style={{
              fontSize: "7px",
              letterSpacing: "5px",
              color: "var(--muted-light)",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <div
            style={{
              width: "1px",
              height: "52px",
              background:
                "linear-gradient(to bottom, var(--bronze), transparent)",
            }}
          />
        </div>
      </section>

      {/* ── MARQUEE STRIP ── */}
      <div
        style={{
          background: "var(--bronze)",
          padding: "13px 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            animation: "marquee 18s linear infinite",
            whiteSpace: "nowrap",
          }}
        >
          {Array(4)
            .fill(null)
            .map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: "9px",
                  letterSpacing: "4.5px",
                  textTransform: "uppercase",
                  color: "var(--white)",
                  fontWeight: 600,
                  marginRight: "80px",
                }}
              >
                ✦ Italian Leather &nbsp;&nbsp; ✦ Gold Hardware &nbsp;&nbsp; ✦
                Lifetime Warranty &nbsp;&nbsp; ✦ Free Shipping Over $500
                &nbsp;&nbsp; ✦ Bespoke Monogramming &nbsp;&nbsp;
              </span>
            ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section
        style={{
          padding: "120px 60px",
          background: "var(--dark)",
          position: "relative",
        }}
      >
        <div className="noise" />
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "72px" }}
          >
            <div
              style={{
                color: "var(--bronze)",
                fontSize: "9px",
                letterSpacing: "7px",
                textTransform: "uppercase",
                marginBottom: "14px",
              }}
            >
              Curated For You
            </div>
            <h2
              className="font-display"
              style={{
                color: "var(--white)",
                fontSize: "clamp(38px,5vw,64px)",
                fontWeight: 300,
              }}
            >
              Our Collections
            </h2>
            <div className="gold-line" style={{ marginTop: "28px" }} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "2px",
            }}
          >
            {categories.map((c, i) => (
              <div
                key={i}
                className="cat-card reveal"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  aspectRatio: "3/4",
                  animationDelay: `${i * 0.15}s`,
                }}
                onClick={() => setPage("shop")}
                data-cursor-text="Explore"
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector("img").style.transform =
                    "scale(1.1)";
                  e.currentTarget.querySelector(".cat-ov").style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector("img").style.transform =
                    "scale(1)";
                  e.currentTarget.querySelector(".cat-ov").style.opacity = ".6";
                }}
              >
                <img
                  src={c.img}
                  alt={c.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform .8s cubic-bezier(.25,.46,.45,.94)",
                  }}
                />
                <div
                  className="cat-ov"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(26,16,8,.97) 0%, rgba(26,16,8,.2) 60%, transparent 100%)",
                    opacity: 0.6,
                    transition: "opacity .5s",
                  }}
                />
                <div className="cat-info">
                  <div
                    style={{
                      width: "28px",
                      height: "1px",
                      background: "var(--bronze)",
                      marginBottom: "18px",
                    }}
                  />
                  <div
                    style={{
                      fontSize: "8px",
                      letterSpacing: "4px",
                      color: "var(--bronze)",
                      marginBottom: "8px",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.count}
                  </div>
                  <h3
                    className="font-display"
                    style={{
                      color: "var(--white)",
                      fontSize: "40px",
                      fontWeight: 300,
                      marginBottom: "6px",
                    }}
                  >
                    {c.name}
                  </h3>
                  <p
                    style={{
                      color: "var(--muted-light)",
                      fontSize: "10px",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                    }}
                  >
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section style={{ padding: "120px 60px", background: "var(--white)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            className="reveal"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "68px",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <div>
              <div className="section-label">Handpicked For You</div>
              <h2 className="section-title">Featured Pieces</h2>
            </div>
            <button className="btn-ghost" onClick={() => setPage("shop")}>
              View All →
            </button>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
              gap: "32px",
            }}
          >
            {PRODUCTS.slice(0, 4).map((p, i) => (
              <div
                key={p.id}
                className="product-card card-accent reveal"
                style={{ transitionDelay: `${i * 0.1}s`, position: "relative" }}
                data-cursor-text="View"
                onClick={() => setPage(`product-${p.id}`)}
              >
                <div className="img-wrap">
                  <img src={p.image} alt={p.name} loading="lazy" />
                  {p.badge && <span className="badge">{p.badge}</span>}
                  <div className="card-overlay">
                    <button
                      className="btn-primary"
                      style={{ padding: "12px 24px", fontSize: "9px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(p);
                      }}
                    >
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
                <div style={{ padding: "22px 20px" }}>
                  <div
                    style={{
                      fontSize: "8px",
                      letterSpacing: "3px",
                      color: "var(--bronze)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {p.category}
                  </div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 500,
                      marginBottom: "10px",
                      color: "var(--ink)",
                    }}
                  >
                    {p.name}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <StarRating rating={p.rating} sm />
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                      ({p.reviews})
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 500,
                        color: "var(--ink)",
                        fontFamily: "Cormorant Garamond,serif",
                      }}
                    >
                      {fp(p.price)}
                    </span>
                    {p.originalPrice && (
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--muted-light)",
                          textDecoration: "line-through",
                        }}
                      >
                        {fp(p.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER ── */}
      <section
        style={{
          position: "relative",
          height: "540px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1600&q=80"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(26,16,8,.92) 0%, rgba(26,16,8,.6) 50%, rgba(26,16,8,.1) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "0 100px",
            maxWidth: "680px",
          }}
        >
          <div
            className="reveal-left"
            style={{
              fontSize: "8px",
              letterSpacing: "7px",
              color: "var(--bronze-light)",
              marginBottom: "22px",
              textTransform: "uppercase",
            }}
          >
            Limited Edition — 2025
          </div>
          <h2
            className="font-display reveal-left"
            style={{
              color: "var(--white)",
              fontSize: "clamp(34px,5vw,68px)",
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: "28px",
              animationDelay: ".15s",
            }}
          >
            The Autumn
            <br />
            <span className="gold-shimmer">Couture Edit</span>
          </h2>
          <p
            className="reveal-left"
            style={{
              color: "rgba(255,255,255,.6)",
              fontSize: "14px",
              lineHeight: 1.9,
              marginBottom: "40px",
              animationDelay: ".3s",
            }}
          >
            Discover our most exclusive pieces of the season — where heritage
            meets haute couture.
          </p>
          <div className="reveal-left" style={{ animationDelay: ".45s" }}>
            <button
              className="btn-primary"
              onClick={() => setPage("shop")}
              data-cursor-text="Shop"
            >
              <span>Explore Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── TRENDING CAROUSEL ── */}
      <section
        style={{
          padding: "120px 0 120px 60px",
          background: "var(--linen)",
          overflow: "hidden",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            className="reveal"
            style={{
              textAlign: "center",
              marginBottom: "64px",
              paddingRight: "60px",
            }}
          >
            <div className="section-label">What's Hot</div>
            <h2 className="section-title">Trending Now</h2>
            <div className="gold-line" style={{ marginTop: "24px" }} />
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ overflow: "hidden", paddingRight: "120px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "24px",
                  transition: "transform .6s cubic-bezier(.25,.46,.45,.94)",
                  transform: `translateX(-${carouselIdx * (100 / 3)}%)`,
                }}
              >
                {PRODUCTS.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      minWidth: "calc(33.33% - 16px)",
                      flex: "0 0 calc(33.33% - 16px)",
                    }}
                  >
                    <div
                      className="product-card"
                      onClick={() => setPage(`product-${p.id}`)}
                      data-cursor-text="View"
                    >
                      <div className="img-wrap" style={{ aspectRatio: "1/1" }}>
                        <img src={p.image} alt={p.name} loading="lazy" />
                        {p.badge && <span className="badge">{p.badge}</span>}
                        <div className="card-overlay">
                          <button
                            className="btn-primary"
                            style={{ padding: "11px 22px", fontSize: "9px" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(p);
                            }}
                          >
                            <span>Quick Add</span>
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: "18px 20px" }}>
                        <h3
                          style={{
                            fontSize: "15px",
                            fontWeight: 500,
                            marginBottom: "6px",
                            color: "var(--ink)",
                          }}
                        >
                          {p.name}
                        </h3>
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: 400,
                            color: "var(--bronze)",
                            fontFamily: "Cormorant Garamond,serif",
                          }}
                        >
                          {fp(p.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                right: "60px",
                top: "40%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {[
                ["‹", -1],
                ["›", 1],
              ].map(([icon, dir]) => (
                <button
                  key={icon}
                  onClick={() =>
                    setCarouselIdx((prev) =>
                      Math.max(0, Math.min(PRODUCTS.length - 3, prev + dir)),
                    )
                  }
                  style={{
                    width: "52px",
                    height: "52px",
                    background: "var(--white)",
                    border: "1px solid var(--border)",
                    color: "var(--bronze)",
                    fontSize: "22px",
                    transition: "all .3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--bronze)";
                    e.target.style.color = "var(--white)";
                    e.target.style.borderColor = "var(--bronze)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--white)";
                    e.target.style.color = "var(--bronze)";
                    e.target.style.borderColor = "var(--border)";
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "32px",
                paddingRight: "60px",
                justifyContent: "center",
              }}
            >
              {Array(PRODUCTS.length - 2)
                .fill(0)
                .map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setCarouselIdx(i)}
                    style={{
                      width: carouselIdx === i ? "28px" : "6px",
                      height: "2px",
                      background:
                        carouselIdx === i ? "var(--bronze)" : "var(--border)",
                      transition: "all .4s ease",
                      borderRadius: "1px",
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        style={{
          padding: "100px 60px",
          background: "var(--dark)",
          position: "relative",
        }}
      >
        <div className="noise" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(44,122,123,.025) 0, rgba(44,122,123,.025) 1px, transparent 1px, transparent 80px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: "40px",
          }}
        >
          {[
            ["25+", "Years of Craftsmanship"],
            ["10K+", "Happy Clients"],
            ["100%", "Italian Leather"],
            ["48hr", "Express Delivery"],
          ].map(([n, l]) => (
            <AnimatedStat key={n} value={n} label={l} />
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: "120px 60px", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <div
            className="reveal"
            style={{ textAlign: "center", marginBottom: "72px" }}
          >
            <div className="section-label">Client Stories</div>
            <h2 className="section-title">Words of Distinction</h2>
            <div className="gold-line" style={{ marginTop: "24px" }} />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: "28px",
            }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="testimonial-card reveal"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 2.1,
                    color: "var(--ink-soft)",
                    position: "relative",
                    zIndex: 1,
                    marginBottom: "32px",
                    fontStyle: "italic",
                    fontFamily: "Cormorant Garamond,serif",
                    fontSize: "16px",
                  }}
                >
                  {t.text}
                </p>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <img
                    src={t.avatar}
                    alt={t.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid var(--bronze-pale)",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        letterSpacing: ".5px",
                        color: "var(--ink)",
                      }}
                    >
                      {t.name}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--bronze)",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                      }}
                    >
                      {t.title}
                    </div>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <StarRating rating={t.rating} sm />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section
        style={{
          padding: "120px 60px",
          background: "var(--linen)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            border: "1px solid rgba(44,122,123,.08)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "440px",
            height: "440px",
            borderRadius: "50%",
            border: "1px solid rgba(44,122,123,.12)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            border: "1px solid rgba(44,122,123,.16)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            textAlign: "center",
            position: "relative",
          }}
        >
          <div
            className="reveal"
            style={{
              fontSize: "8px",
              letterSpacing: "8px",
              color: "var(--bronze)",
              marginBottom: "18px",
              textTransform: "uppercase",
            }}
          >
            Join The Circle
          </div>
          <h2
            className="font-display reveal"
            style={{
              color: "var(--ink)",
              fontSize: "clamp(32px,5vw,56px)",
              fontWeight: 300,
              marginBottom: "20px",
            }}
          >
            Private Access Awaits
          </h2>
          <p
            className="reveal"
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 1.9,
              marginBottom: "44px",
            }}
          >
            Subscribe for exclusive previews, private sales, and curated content
            from our ateliers.
          </p>
          {subscribed ? (
            <div
              className="reveal"
              style={{
                padding: "24px",
                border: "1px solid var(--bronze-pale)",
                color: "var(--bronze)",
                letterSpacing: "3px",
                fontSize: "12px",
                background: "rgba(44,122,123,.04)",
              }}
            >
              ✦ Welcome to the Circle of Excellence ✦
            </div>
          ) : (
            <div
              className="reveal"
              style={{ display: "flex", maxWidth: "480px", margin: "0 auto" }}
            >
              <input
                type="email"
                className="luxury-input"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, borderRight: "none" }}
              />
              <button
                className="btn-primary"
                onClick={() => {
                  if (email) setSubscribed(true);
                }}
                style={{ flexShrink: 0, padding: "14px 28px", fontSize: "9px" }}
              >
                <span>Subscribe</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

/* ── SHOP PAGE ── */
const ShopPage = ({ setPage, addToCart }) => {
  useScrollReveal();
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [selectedColors, setSelectedColors] = useState([]);
  const [grid, setGrid] = useState(3);

  const colorMap = {
    "#1A1A1A": "Black",
    "#C9A84C": "Gold",
    "#F5F0E8": "Ivory",
    "#8B7355": "Tan",
    "#C4A882": "Camel",
  };

  let filtered = PRODUCTS.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (p.price > maxPrice) return false;
    if (
      selectedColors.length > 0 &&
      !p.colors.some((c) => selectedColors.includes(c))
    )
      return false;
    return true;
  });
  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);

  const toggleColor = (c) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  return (
    <div
      style={{
        paddingTop: "100px",
        minHeight: "100vh",
        background: "var(--cream)",
      }}
    >
      <div
        style={{
          background: "var(--dark)",
          padding: "80px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="noise" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(44,122,123,.03) 0, rgba(44,122,123,.03) 1px, transparent 1px, transparent 120px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            fontSize: "8px",
            letterSpacing: "8px",
            color: "var(--bronze)",
            marginBottom: "18px",
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          Discover
        </div>
        <h1
          className="font-display"
          style={{
            color: "var(--white)",
            fontSize: "clamp(40px,7vw,84px)",
            fontWeight: 300,
            position: "relative",
          }}
        >
          The Collection
        </h1>
        <div className="gold-line" style={{ marginTop: "24px" }} />
      </div>

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "60px",
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: "60px",
        }}
      >
        {/* Sidebar */}
        <aside>
          <div style={{ position: "sticky", top: "110px" }}>
            {/* Category */}
            <div style={{ marginBottom: "44px" }}>
              <div
                style={{
                  fontSize: "8px",
                  letterSpacing: "5px",
                  color: "var(--bronze)",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "12px",
                }}
              >
                Category
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "4px" }}
              >
                {["all", "handbags", "clutches", "backpacks"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      fontFamily: "Jost,sans-serif",
                      fontSize: "13px",
                      letterSpacing: "1px",
                      padding: "10px 0",
                      color: category === c ? "var(--bronze)" : "var(--muted)",
                      borderBottom: `1px solid ${category === c ? "var(--bronze-pale)" : "var(--border-soft)"}`,
                      fontWeight: category === c ? 600 : 400,
                      transition: "all .3s",
                    }}
                  >
                    {c === "all"
                      ? "All Pieces"
                      : c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {/* Price */}
            <div style={{ marginBottom: "44px" }}>
              <div
                style={{
                  fontSize: "8px",
                  letterSpacing: "5px",
                  color: "var(--bronze)",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "12px",
                }}
              >
                Price Range
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  marginBottom: "16px",
                }}
              >
                <span style={{ color: "var(--muted)", letterSpacing: "1px" }}>
                  $0
                </span>
                <span
                  style={{
                    color: "var(--bronze)",
                    fontWeight: 700,
                    fontFamily: "Cormorant Garamond,serif",
                    fontSize: "18px",
                  }}
                >
                  {fp(maxPrice)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
              />
            </div>
            {/* Color */}
            <div style={{ marginBottom: "44px" }}>
              <div
                style={{
                  fontSize: "8px",
                  letterSpacing: "5px",
                  color: "var(--bronze)",
                  marginBottom: "20px",
                  textTransform: "uppercase",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "12px",
                }}
              >
                Color
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {Object.keys(colorMap).map((c) => (
                  <div
                    key={c}
                    className={`color-swatch ${selectedColors.includes(c) ? "selected" : ""}`}
                    style={{
                      width: "30px",
                      height: "30px",
                      background: c,
                      boxShadow:
                        c === "#F5F0E8"
                          ? "0 0 0 1px rgba(0,0,0,.15) inset"
                          : undefined,
                    }}
                    title={colorMap[c]}
                    onClick={() => toggleColor(c)}
                  />
                ))}
              </div>
              {selectedColors.length > 0 && (
                <button
                  onClick={() => setSelectedColors([])}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "9px",
                    letterSpacing: "3px",
                    color: "var(--bronze)",
                    marginTop: "12px",
                    textDecoration: "underline",
                    textTransform: "uppercase",
                    fontFamily: "Jost,sans-serif",
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>
            {/* Help Box */}
            <div
              style={{
                padding: "28px",
                background: "var(--bronze-xpale)",
                textAlign: "center",
                border: "1px solid var(--bronze-pale)",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  letterSpacing: "4px",
                  color: "var(--bronze)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                Need Help?
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  lineHeight: 1.8,
                  marginBottom: "20px",
                }}
              >
                Our style consultants are here to guide you.
              </p>
              <button
                className="btn-primary"
                onClick={() => setPage("contact")}
                style={{ width: "100%", fontSize: "9px", padding: "12px" }}
              >
                <span>Contact Us</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <main>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "36px",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "var(--muted)",
                letterSpacing: "3px",
                textTransform: "uppercase",
              }}
            >
              {filtered.length} Pieces
            </span>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="luxury-input"
                style={{
                  width: "auto",
                  padding: "10px 16px",
                  fontSize: "11px",
                  letterSpacing: "1px",
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div style={{ display: "flex", gap: "4px" }}>
                {[3, 2].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrid(g)}
                    style={{
                      width: "34px",
                      height: "34px",
                      background: grid === g ? "var(--ink)" : "transparent",
                      border: "1px solid var(--border)",
                      color:
                        grid === g ? "var(--bronze-light)" : "var(--muted)",
                      fontSize: "10px",
                      transition: "all .3s",
                      fontFamily: "Jost,sans-serif",
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "100px",
                color: "var(--muted)",
              }}
            >
              <div
                style={{ fontSize: "48px", marginBottom: "20px", opacity: 0.2 }}
              >
                ✦
              </div>
              <p
                style={{
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                  fontSize: "11px",
                }}
              >
                No pieces match your selection
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${Math.min(grid, 3)},1fr)`,
                gap: "24px",
              }}
            >
              {filtered.map((p, i) => (
                <div
                  key={p.id}
                  className="product-card card-accent reveal"
                  style={{
                    transitionDelay: `${(i % 3) * 0.08}s`,
                    position: "relative",
                  }}
                  data-cursor-text="View"
                  onClick={() => setPage(`product-${p.id}`)}
                >
                  <div className="img-wrap">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    {p.badge && <span className="badge">{p.badge}</span>}
                    <div className="card-overlay">
                      <button
                        className="btn-primary"
                        style={{ padding: "12px 24px", fontSize: "9px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                      >
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: "18px 16px" }}>
                    <div
                      style={{
                        fontSize: "8px",
                        letterSpacing: "3px",
                        color: "var(--bronze)",
                        textTransform: "uppercase",
                        marginBottom: "5px",
                      }}
                    >
                      {p.category}
                    </div>
                    <h3
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                        marginBottom: "8px",
                        color: "var(--ink)",
                      }}
                    >
                      {p.name}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "18px",
                          fontWeight: 400,
                          color: "var(--ink)",
                          fontFamily: "Cormorant Garamond,serif",
                        }}
                      >
                        {fp(p.price)}
                      </span>
                      {p.originalPrice && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--muted-light)",
                            textDecoration: "line-through",
                          }}
                        >
                          {fp(p.originalPrice)}
                        </span>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: "5px" }}>
                      {p.colors.map((c) => (
                        <div
                          key={c}
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            background: c,
                            border:
                              c === "#F5F0E8"
                                ? "1px solid rgba(0,0,0,.15)"
                                : "1px solid rgba(0,0,0,.04)",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

/* ── PRODUCT DETAIL ── */
const ProductDetailPage = ({ productId, setPage, addToCart }) => {
  const product = PRODUCTS.find((p) => p.id === productId);
  const [selectedColor, setSelectedColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState("description");
  useScrollReveal();

  if (!product)
    return (
      <div style={{ padding: "200px", textAlign: "center" }}>
        Product not found
      </div>
    );

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 4);
  const images = [product.image, ...related.slice(0, 2).map((r) => r.image)];

  const reviews = [
    {
      name: "Charlotte L.",
      date: "Nov 2024",
      rating: 5,
      text: "Absolutely stunning. The craftsmanship is unmatched — I receive compliments every time I carry it.",
    },
    {
      name: "Priya K.",
      date: "Oct 2024",
      rating: 5,
      text: "Worth every penny. The leather quality is superb and the gold hardware is solid and weighty.",
    },
    {
      name: "Elena M.",
      date: "Sep 2024",
      rating: 4,
      text: "Exquisite bag. Delivery was swift and packaging was luxurious. Very happy.",
    },
  ];

  const colorNames = {
    "#1A1A1A": "Black",
    "#C9A84C": "Gold",
    "#F5F0E8": "Ivory",
    "#8B7355": "Tan",
    "#C4A882": "Camel",
    "#5C4033": "Dark Brown",
    "#556B2F": "Olive",
    "#8B2252": "Mauve",
    "#4A0E4E": "Purple",
    "#8B0000": "Burgundy",
    "#8B6914": "Cognac",
  };

  return (
    <div style={{ paddingTop: "100px", background: "var(--cream)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px" }}>
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            fontSize: "10px",
            letterSpacing: "2px",
            color: "var(--muted)",
            marginBottom: "52px",
            textTransform: "uppercase",
            alignItems: "center",
          }}
        >
          {[
            ["Home", "home"],
            ["Shop", "shop"],
            [product.name, null],
          ].map(([label, pg], i) => (
            <span
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              {i > 0 && (
                <span style={{ color: "var(--bronze)", fontSize: "8px" }}>
                  ›
                </span>
              )}
              <span
                onClick={() => pg && setPage(pg)}
                style={{
                  cursor: pg ? "pointer" : "default",
                  color: pg ? "var(--muted)" : "var(--bronze)",
                  transition: "color .3s",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (pg) e.target.style.color = "var(--bronze)";
                }}
                onMouseLeave={(e) => {
                  if (pg) e.target.style.color = "var(--muted)";
                }}
              >
                {label}
              </span>
            </span>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          {/* Images */}
          <div>
            <div
              className="zoom-container"
              style={{
                background: "var(--linen)",
                marginBottom: "16px",
                position: "relative",
              }}
            >
              <img
                src={images[activeImg]}
                alt={product.name}
                style={{
                  width: "100%",
                  aspectRatio: "1/1",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  background: "rgba(254,250,244,.9)",
                  padding: "6px 14px",
                  fontSize: "8px",
                  letterSpacing: "2px",
                  color: "var(--bronze)",
                  textTransform: "uppercase",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--border-soft)",
                }}
              >
                Hover to zoom
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "12px",
              }}
            >
              {images.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    overflow: "hidden",
                    border: `2px solid ${activeImg === i ? "var(--bronze)" : "transparent"}`,
                    transition: "all .3s",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      aspectRatio: "1/1",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform .4s",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div style={{ position: "sticky", top: "110px" }}>
            <div
              style={{
                fontSize: "8px",
                letterSpacing: "5px",
                color: "var(--bronze)",
                textTransform: "uppercase",
                marginBottom: "12px",
                display: "flex",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <span>{product.category}</span>
              <span
                style={{
                  width: "1px",
                  height: "12px",
                  background: "var(--bronze-pale)",
                }}
              />
              <span>{product.badge}</span>
            </div>
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(28px,4vw,50px)",
                fontWeight: 300,
                marginBottom: "16px",
                lineHeight: 1.1,
                color: "var(--ink)",
              }}
            >
              {product.name}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "24px",
              }}
            >
              <StarRating rating={product.rating} />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--muted)",
                  letterSpacing: "1px",
                }}
              >
                {product.reviews} Reviews
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "baseline",
                marginBottom: "32px",
              }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: "44px",
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: "-1px",
                }}
              >
                {fp(product.price)}
              </span>
              {product.originalPrice && (
                <>
                  <span
                    style={{
                      fontSize: "22px",
                      color: "var(--muted-light)",
                      textDecoration: "line-through",
                      fontFamily: "Cormorant Garamond,serif",
                    }}
                  >
                    {fp(product.originalPrice)}
                  </span>
                  <span
                    style={{
                      background: "var(--bronze)",
                      color: "var(--white)",
                      fontSize: "8px",
                      padding: "5px 12px",
                      letterSpacing: "2px",
                      fontWeight: 700,
                    }}
                  >
                    SAVE{" "}
                    {Math.round(
                      (1 - product.price / product.originalPrice) * 100,
                    )}
                    %
                  </span>
                </>
              )}
            </div>
            <div
              style={{
                height: "1px",
                background:
                  "linear-gradient(90deg, var(--bronze-pale), var(--border-soft), transparent)",
                marginBottom: "32px",
              }}
            />

            {/* Color */}
            <div style={{ marginBottom: "28px" }}>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                Color:{" "}
                <span style={{ color: "var(--ink)", fontWeight: 600 }}>
                  {colorNames[product.colors[selectedColor]] || "—"}
                </span>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                {product.colors.map((c, i) => (
                  <div
                    key={i}
                    className={`color-swatch ${selectedColor === i ? "selected" : ""}`}
                    style={{
                      width: "36px",
                      height: "36px",
                      background: c,
                      boxShadow:
                        c === "#F5F0E8"
                          ? "0 0 0 1px rgba(0,0,0,.15) inset"
                          : undefined,
                    }}
                    onClick={() => setSelectedColor(i)}
                  />
                ))}
              </div>
            </div>

            {/* Qty */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "var(--muted)",
                  textTransform: "uppercase",
                  marginBottom: "12px",
                }}
              >
                Quantity
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid var(--border)",
                }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    color: "var(--muted)",
                    transition: "color .2s",
                    fontFamily: "Jost,sans-serif",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--bronze)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
                >
                  −
                </button>
                <span
                  style={{
                    width: "48px",
                    textAlign: "center",
                    fontSize: "15px",
                    fontWeight: 500,
                    fontFamily: "Cormorant Garamond,serif",
                  }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    color: "var(--muted)",
                    transition: "color .2s",
                    fontFamily: "Jost,sans-serif",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "var(--bronze)")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--muted)")}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: "12px", marginBottom: "36px" }}>
              <button
                className="btn-primary"
                style={{ flex: 1, fontSize: "10px" }}
                onClick={() => {
                  for (let i = 0; i < qty; i++) addToCart(product);
                  setPage("cart");
                }}
              >
                <span>Add to Cart — {fp(product.price * qty)}</span>
              </button>
              <button
                className="btn-outline"
                style={{ padding: "14px 18px", fontSize: "18px" }}
              >
                ♡
              </button>
            </div>

            {/* Features */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                marginBottom: "32px",
              }}
            >
              {[
                ["🇮🇹", "Italian Leather"],
                ["✦", "Gold Hardware"],
                ["🔒", "Lifetime Warranty"],
                ["📦", "Free Returns"],
              ].map(([icon, label]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px",
                    background: "var(--linen)",
                    border: "1px solid var(--border-soft)",
                    transition: "background .3s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--bronze-xpale)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--linen)")
                  }
                >
                  <span style={{ fontSize: "16px" }}>{icon}</span>
                  <span
                    style={{
                      fontSize: "9px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                      color: "var(--ink-soft)",
                      fontWeight: 600,
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ borderTop: "1px solid var(--border)" }}>
              <div style={{ display: "flex" }}>
                {["description", "details", "shipping"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    style={{
                      flex: 1,
                      padding: "16px 8px",
                      background: "none",
                      border: "none",
                      borderBottom: `2px solid ${tab === t ? "var(--bronze)" : "transparent"}`,
                      fontSize: "9px",
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      color: tab === t ? "var(--bronze)" : "var(--muted)",
                      fontFamily: "Jost,sans-serif",
                      transition: "all .3s",
                      marginBottom: "-1px",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div
                style={{
                  padding: "24px 0",
                  fontSize: "14px",
                  lineHeight: 2,
                  color: "var(--ink-soft)",
                  animation: "fadeIn .3s ease",
                }}
              >
                {tab === "description" && product.description}
                {tab === "details" &&
                  "Full-grain Italian leather · Gold-plated brass hardware · Suede interior lining · Interior zip pocket × 2 · Interior card slots × 4 · Detachable shoulder strap · Dimensions: 34×24×12cm · Weight: 680g"}
                {tab === "shipping" &&
                  "Complimentary express shipping (2–3 business days) on all orders over $500. Returns accepted within 30 days for a full refund. Each order arrives in our signature box with tissue, dust bag, and authenticity card."}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div
          style={{
            marginTop: "100px",
            borderTop: "1px solid var(--border)",
            paddingTop: "60px",
          }}
        >
          <h3
            className="font-display"
            style={{
              fontSize: "40px",
              fontWeight: 300,
              marginBottom: "48px",
              color: "var(--ink)",
            }}
          >
            Client Reviews
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: "24px",
            }}
          >
            {reviews.map((r, i) => (
              <div
                key={i}
                className="reveal"
                style={{
                  padding: "32px",
                  border: "1px solid var(--border)",
                  background: "var(--white)",
                  transition: "all .4s",
                  transitionDelay: `${i * 0.1}s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--bronze-pale)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 40px rgba(44,122,123,.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "14px",
                        marginBottom: "2px",
                        color: "var(--ink)",
                      }}
                    >
                      {r.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--muted-light)",
                        letterSpacing: "1px",
                      }}
                    >
                      {r.date}
                    </div>
                  </div>
                  <StarRating rating={r.rating} sm />
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    lineHeight: 1.9,
                    color: "var(--ink-soft)",
                    fontStyle: "italic",
                    fontFamily: "Cormorant Garamond,serif",
                  }}
                >
                  {r.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div
            style={{
              marginTop: "100px",
              borderTop: "1px solid var(--border)",
              paddingTop: "60px",
            }}
          >
            <h3
              className="font-display"
              style={{
                fontSize: "40px",
                fontWeight: 300,
                marginBottom: "48px",
                color: "var(--ink)",
              }}
            >
              You May Also Like
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                gap: "24px",
              }}
            >
              {related.map((p) => (
                <div
                  key={p.id}
                  className="product-card card-accent reveal"
                  style={{ position: "relative" }}
                  onClick={() => setPage(`product-${p.id}`)}
                  data-cursor-text="View"
                >
                  <div className="img-wrap">
                    <img src={p.image} alt={p.name} loading="lazy" />
                    <div className="card-overlay">
                      <button
                        className="btn-primary"
                        style={{ padding: "10px 20px", fontSize: "9px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(p);
                        }}
                      >
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                  <div style={{ padding: "16px 18px" }}>
                    <h4
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        marginBottom: "6px",
                        color: "var(--ink)",
                      }}
                    >
                      {p.name}
                    </h4>
                    <span
                      style={{
                        fontSize: "16px",
                        color: "var(--bronze)",
                        fontWeight: 400,
                        fontFamily: "Cormorant Garamond,serif",
                      }}
                    >
                      {fp(p.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── CART PAGE ── */
const CartPage = ({ cart, setCart, setPage }) => {
  const updateQty = (id, delta) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  const removeItem = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 500 ? 0 : 45;
  const total = subtotal + shipping;

  return (
    <div
      style={{
        paddingTop: "100px",
        minHeight: "100vh",
        background: "var(--cream)",
      }}
    >
      <div
        style={{
          background: "var(--dark)",
          padding: "80px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="noise" />
        <h1
          className="font-display"
          style={{
            color: "var(--white)",
            fontSize: "clamp(36px,6vw,76px)",
            fontWeight: 300,
            position: "relative",
          }}
        >
          Your Selection
        </h1>
        <div className="gold-line" style={{ marginTop: "20px" }} />
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "120px 0" }}>
            <div
              style={{ fontSize: "64px", marginBottom: "28px", opacity: 0.15 }}
            >
              🛍️
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "44px",
                fontWeight: 300,
                marginBottom: "16px",
                color: "var(--ink)",
              }}
            >
              Your cart is empty
            </h2>
            <p
              style={{
                color: "var(--muted)",
                marginBottom: "36px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontSize: "11px",
              }}
            >
              Discover our curated collection
            </p>
            <button className="btn-primary" onClick={() => setPage("shop")}>
              <span>Explore Collection</span>
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 360px",
              gap: "60px",
            }}
          >
            <div>
              {cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    onClick={() => setPage(`product-${item.id}`)}
                    style={{
                      width: "100px",
                      height: "120px",
                      objectFit: "cover",
                      background: "var(--linen)",
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontSize: "8px",
                        letterSpacing: "3px",
                        color: "var(--bronze)",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {item.category}
                    </div>
                    <h3
                      style={{
                        fontSize: "18px",
                        fontWeight: 400,
                        marginBottom: "8px",
                        fontFamily: "Cormorant Garamond,serif",
                        color: "var(--ink)",
                      }}
                    >
                      {item.name}
                    </h3>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                      }}
                    >
                      {fp(item.price)} each
                    </span>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        border: "1px solid var(--border)",
                        marginTop: "14px",
                      }}
                    >
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        style={{
                          width: "36px",
                          height: "36px",
                          background: "none",
                          border: "none",
                          fontSize: "18px",
                          color: "var(--muted)",
                          fontFamily: "Jost,sans-serif",
                        }}
                      >
                        −
                      </button>
                      <span
                        style={{
                          width: "36px",
                          textAlign: "center",
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: "Cormorant Garamond,serif",
                        }}
                      >
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        style={{
                          width: "36px",
                          height: "36px",
                          background: "none",
                          border: "none",
                          fontSize: "18px",
                          color: "var(--muted)",
                          fontFamily: "Jost,sans-serif",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: 300,
                        marginBottom: "12px",
                        fontFamily: "Cormorant Garamond,serif",
                        color: "var(--ink)",
                      }}
                    >
                      {fp(item.price * item.qty)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "9px",
                        letterSpacing: "2px",
                        color: "var(--muted-light)",
                        textDecoration: "underline",
                        textTransform: "uppercase",
                        fontFamily: "Jost,sans-serif",
                        transition: "color .3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.color = "var(--bronze)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.color = "var(--muted-light)")
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div
                style={{
                  background: "var(--dark)",
                  padding: "44px",
                  position: "sticky",
                  top: "110px",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    letterSpacing: "5px",
                    color: "var(--bronze)",
                    textTransform: "uppercase",
                    marginBottom: "32px",
                  }}
                >
                  Order Summary
                </div>
                {[
                  ["Subtotal", subtotal],
                  ["Shipping", shipping],
                ].map(([l, v]) => (
                  <div
                    key={l}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--dark-muted)",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                      }}
                    >
                      {l}
                    </span>
                    <span
                      style={{
                        fontSize: "15px",
                        color: "#D4D0C8",
                        fontFamily: "Cormorant Garamond,serif",
                      }}
                    >
                      {v === 0 ? "Free" : fp(v)}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(44,122,123,.4), transparent)",
                    margin: "24px 0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "32px",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#D4D0C8",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                    }}
                  >
                    Total
                  </span>
                  <span
                    className="font-display"
                    style={{ fontSize: "34px", color: "var(--bronze-light)" }}
                  >
                    {fp(total)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--dark-muted)",
                      marginBottom: "24px",
                      letterSpacing: "1px",
                      lineHeight: 1.7,
                    }}
                  >
                    Add {fp(500 - subtotal)} more for free shipping
                  </p>
                )}
                <button
                  className="btn-primary"
                  style={{ width: "100%" }}
                  onClick={() => setPage("checkout")}
                >
                  <span>Proceed to Checkout</span>
                </button>
                <button
                  onClick={() => setPage("shop")}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    background: "none",
                    border: "1px solid #2C2820",
                    color: "var(--dark-muted)",
                    padding: "12px",
                    fontSize: "9px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    fontFamily: "Jost,sans-serif",
                    transition: "all .3s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "rgba(44,122,123,.4)";
                    e.target.style.color = "var(--bronze)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#2C2820";
                    e.target.style.color = "var(--dark-muted)";
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ── CHECKOUT PAGE ── */
const CheckoutPage = ({ cart, setCart, setPage }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "United States",
  });
  const [payment, setPayment] = useState("card");
  const [placed, setPlaced] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const update = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  if (placed)
    return (
      <div
        style={{
          paddingTop: "100px",
          minHeight: "100vh",
          background: "var(--cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "80px",
            animation: "scaleIn .6s ease",
          }}
        >
          <div
            style={{
              width: "88px",
              height: "88px",
              border: "2px solid var(--bronze)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 36px",
              fontSize: "36px",
              color: "var(--bronze)",
              animation: "pulseRing 2s ease-in-out 1",
            }}
          >
            ✓
          </div>
          <h1
            className="font-display"
            style={{
              color: "var(--ink)",
              fontSize: "56px",
              fontWeight: 300,
              marginBottom: "16px",
            }}
          >
            Order Placed
          </h1>
          <p
            style={{
              color: "var(--bronze)",
              fontSize: "10px",
              letterSpacing: "3px",
              marginBottom: "12px",
              textTransform: "uppercase",
            }}
          >
            Confirmation #XB{Date.now().toString().slice(-6)}
          </p>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "14px",
              lineHeight: 1.9,
              maxWidth: "420px",
              margin: "0 auto 48px",
            }}
          >
            Your exquisite selection is being prepared with the utmost care.
            Expect delivery within 2–3 business days.
          </p>
          <button className="btn-primary" onClick={() => setPage("home")}>
            <span>Return Home</span>
          </button>
        </div>
      </div>
    );

  return (
    <div
      style={{
        paddingTop: "100px",
        minHeight: "100vh",
        background: "var(--cream)",
      }}
    >
      <div
        style={{
          background: "var(--dark)",
          padding: "60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="noise" />
        <h1
          className="font-display"
          style={{
            color: "var(--white)",
            fontSize: "clamp(28px,4vw,56px)",
            fontWeight: 300,
            marginBottom: "36px",
            position: "relative",
          }}
        >
          Secure Checkout
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0",
            maxWidth: "480px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {["Shipping", "Payment", "Review"].map((s, i) => (
            <div
              key={s}
              style={{ flex: 1, textAlign: "center", position: "relative" }}
            >
              {i > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: "-50%",
                    top: "15px",
                    width: "100%",
                    height: "1px",
                    background:
                      step > i ? "var(--bronze)" : "rgba(44,122,123,.2)",
                  }}
                />
              )}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: step > i ? "var(--bronze)" : "transparent",
                  border: `2px solid ${step >= i + 1 ? "var(--bronze)" : "rgba(44,122,123,.3)"}`,
                  color:
                    step > i
                      ? "#000"
                      : step === i + 1
                        ? "var(--bronze)"
                        : "var(--dark-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  fontSize: "12px",
                  fontWeight: 700,
                  position: "relative",
                  zIndex: 1,
                  transition: "all .4s",
                }}
              >
                {step > i ? "✓" : i + 1}
              </div>
              <div
                style={{
                  fontSize: "9px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: step >= i + 1 ? "var(--bronze)" : "var(--dark-muted)",
                  transition: "color .4s",
                }}
              >
                {s}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "60px",
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "60px",
        }}
      >
        <div>
          {step === 1 && (
            <div style={{ animation: "scaleIn .4s ease" }}>
              <h2
                className="font-display"
                style={{
                  fontSize: "36px",
                  fontWeight: 300,
                  marginBottom: "36px",
                  color: "var(--ink)",
                }}
              >
                Shipping Information
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "32px",
                }}
              >
                {[
                  ["firstName", "First Name"],
                  ["lastName", "Last Name"],
                  ["email", "Email Address"],
                  ["phone", "Phone Number"],
                  ["address", "Street Address"],
                  ["city", "City"],
                  ["state", "State"],
                  ["zip", "ZIP Code"],
                ].map(([k, label]) => (
                  <div
                    key={k}
                    style={{ gridColumn: k === "address" ? "1/-1" : "auto" }}
                  >
                    <label
                      style={{
                        fontSize: "9px",
                        letterSpacing: "3px",
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      className="luxury-input"
                      value={form[k]}
                      onChange={(e) => update(k, e.target.value)}
                      placeholder={label}
                    />
                  </div>
                ))}
              </div>
              <button className="btn-primary" onClick={() => setStep(2)}>
                <span>Continue to Payment</span>
              </button>
            </div>
          )}
          {step === 2 && (
            <div style={{ animation: "scaleIn .4s ease" }}>
              <h2
                className="font-display"
                style={{
                  fontSize: "36px",
                  fontWeight: 300,
                  marginBottom: "36px",
                  color: "var(--ink)",
                }}
              >
                Payment Method
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  marginBottom: "32px",
                }}
              >
                {[
                  ["card", "Credit / Debit Card", "💳"],
                  ["paypal", "PayPal", "🅿"],
                  ["apple", "Apple Pay", "🍎"],
                  ["crypto", "Cryptocurrency", "₿"],
                ].map(([id, label, icon]) => (
                  <label
                    key={id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
                      padding: "20px 28px",
                      border: `1px solid ${payment === id ? "var(--bronze)" : "var(--border)"}`,
                      transition: "all .3s",
                      background:
                        payment === id ? "var(--bronze-xpale)" : "var(--white)",
                    }}
                  >
                    <input
                      type="radio"
                      checked={payment === id}
                      onChange={() => setPayment(id)}
                      style={{ accentColor: "var(--bronze)" }}
                    />
                    <span style={{ fontSize: "20px" }}>{icon}</span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: payment === id ? "var(--bronze)" : "var(--ink)",
                      }}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn-outline" onClick={() => setStep(1)}>
                  Back
                </button>
                <button className="btn-primary" onClick={() => setStep(3)}>
                  <span>Review Order</span>
                </button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div style={{ animation: "scaleIn .4s ease" }}>
              <h2
                className="font-display"
                style={{
                  fontSize: "36px",
                  fontWeight: 300,
                  marginBottom: "36px",
                  color: "var(--ink)",
                }}
              >
                Review Your Order
              </h2>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: "24px",
                    padding: "24px 0",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: "80px",
                      height: "96px",
                      objectFit: "cover",
                      background: "var(--linen)",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4
                      style={{
                        fontSize: "17px",
                        fontWeight: 400,
                        marginBottom: "4px",
                        fontFamily: "Cormorant Garamond,serif",
                        color: "var(--ink)",
                      }}
                    >
                      {item.name}
                    </h4>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--muted)",
                        letterSpacing: "1px",
                      }}
                    >
                      Qty: {item.qty}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: 400,
                      fontFamily: "Cormorant Garamond,serif",
                      color: "var(--ink)",
                    }}
                  >
                    {fp(item.price * item.qty)}
                  </span>
                </div>
              ))}
              <div style={{ marginTop: "32px", display: "flex", gap: "12px" }}>
                <button className="btn-outline" onClick={() => setStep(2)}>
                  Back
                </button>
                <button
                  className="btn-primary"
                  onClick={() => {
                    setCart([]);
                    setPlaced(true);
                  }}
                >
                  <span>Place Order — {fp(total)}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            background: "var(--dark)",
            padding: "36px",
            height: "fit-content",
            position: "sticky",
            top: "110px",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "5px",
              color: "var(--bronze)",
              textTransform: "uppercase",
              marginBottom: "28px",
            }}
          >
            Order Summary
          </div>
          {cart.slice(0, 3).map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: "14px",
                marginBottom: "16px",
                alignItems: "center",
              }}
            >
              <div style={{ position: "relative", flexShrink: 0 }}>
                <img
                  src={item.image}
                  alt=""
                  style={{ width: "52px", height: "64px", objectFit: "cover" }}
                />
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-6px",
                    background: "var(--bronze)",
                    color: "#000",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    fontSize: "9px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                >
                  {item.qty}
                </span>
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#D4D0C8",
                    fontWeight: 500,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>
              </div>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--dark-muted)",
                  fontFamily: "Cormorant Garamond,serif",
                  whiteSpace: "nowrap",
                }}
              >
                {fp(item.price * item.qty)}
              </span>
            </div>
          ))}
          <div
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(44,122,123,.4), transparent)",
              margin: "24px 0",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "var(--dark-muted)",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Total
            </span>
            <span
              className="font-display"
              style={{ fontSize: "30px", color: "var(--bronze-light)" }}
            >
              {fp(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── ABOUT PAGE ── */
const AboutPage = ({ setPage }) => {
  useScrollReveal();
  return (
    <div style={{ paddingTop: "100px", background: "var(--cream)" }}>
      <div
        style={{
          position: "relative",
          height: "75vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(26,16,8,.92) 0%, rgba(26,16,8,.5) 60%, rgba(26,16,8,.1) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            padding: "0 100px",
            maxWidth: "800px",
          }}
        >
          <div
            style={{
              fontSize: "8px",
              letterSpacing: "8px",
              color: "var(--bronze)",
              marginBottom: "22px",
              textTransform: "uppercase",
              animation: "fadeLeft .8s ease both",
            }}
          >
            Est. 1998 ✦ Florence, Italy
          </div>
          <h1
            className="font-display"
            style={{
              color: "var(--white)",
              fontSize: "clamp(44px,8vw,92px)",
              fontWeight: 300,
              lineHeight: 1.0,
              animation: "fadeLeft .9s .15s ease both",
            }}
          >
            A Legacy
            <br />
            Woven in
            <br />
            <span className="gold-shimmer">Leather</span>
          </h1>
        </div>
      </div>

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 60px" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
            marginBottom: "140px",
          }}
        >
          <div className="reveal-left">
            <div className="section-label">Our Story</div>
            <h2
              className="font-display"
              style={{
                fontSize: "48px",
                fontWeight: 300,
                marginBottom: "28px",
                lineHeight: 1.2,
                color: "var(--ink)",
              }}
            >
              Born From a<br />
              Passion for Perfection
            </h2>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 2.1,
                color: "var(--ink-soft)",
                marginBottom: "24px",
              }}
            >
              In 1998, master artisan Alessandro Ferretti founded Xclusive Bags
              in the cobblestone workshops of Florence with a singular
              conviction: that a bag should be more than an accessory — it
              should be an heirloom.
            </p>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 2.1,
                color: "var(--ink-soft)",
                marginBottom: "36px",
              }}
            >
              Drawing on generations of Italian leatherworking tradition,
              Alessandro combined ancestral techniques with a contemporary
              design language, creating pieces that speak to the woman who
              demands the extraordinary.
            </p>
            <button className="btn-outline" onClick={() => setPage("shop")}>
              Discover the Collection
            </button>
          </div>
          <div className="reveal-right" style={{ position: "relative" }}>
            <img
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80"
              alt="Atelier"
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-28px",
                right: "-28px",
                background: "var(--bronze)",
                padding: "28px 36px",
                color: "var(--white)",
              }}
            >
              <div
                className="font-display"
                style={{ fontSize: "44px", fontWeight: 400, lineHeight: 1 }}
              >
                25+
              </div>
              <div
                style={{
                  fontSize: "8px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginTop: "4px",
                  opacity: 0.85,
                }}
              >
                Years of
                <br />
                Mastery
              </div>
            </div>
          </div>
        </div>

        <div
          className="reveal"
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div className="section-label">Our Philosophy</div>
          <h2 className="section-title">The Pillars of Excellence</h2>
          <div className="gold-line" style={{ marginTop: "24px" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "2px",
            marginBottom: "140px",
          }}
        >
          {[
            [
              "✦",
              "Artisanship",
              "Each piece passes through the hands of over 40 skilled artisans before reaching yours.",
            ],
            [
              "⬡",
              "Materials",
              "Only the finest full-grain Italian and French leathers, sourced from generations-old tanneries.",
            ],
            [
              "◈",
              "Timelessness",
              "We design for the woman who transcends trends. Each silhouette is a study in enduring elegance.",
            ],
            [
              "❋",
              "Sustainability",
              "Our commitment to responsible luxury means traceable materials and zero-waste workshops.",
            ],
          ].map(([icon, title, desc], i) => (
            <div
              key={title}
              className="reveal"
              style={{
                padding: "52px 32px",
                background: i % 2 === 0 ? "var(--dark)" : "var(--dark-card)",
                textAlign: "center",
                transition: "background .5s",
                transitionDelay: `${i * 0.1}s`,
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#1F1508")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  i % 2 === 0 ? "var(--dark)" : "var(--dark-card)")
              }
            >
              <div
                style={{
                  fontSize: "28px",
                  color: "var(--bronze)",
                  marginBottom: "20px",
                }}
              >
                {icon}
              </div>
              <h3
                className="font-display"
                style={{
                  fontSize: "26px",
                  fontWeight: 300,
                  marginBottom: "14px",
                  color: "var(--white)",
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  lineHeight: 1.9,
                  color: "var(--dark-muted)",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
            marginBottom: "140px",
          }}
        >
          <div>
            <div
              className="reveal"
              style={{ textAlign: "left", marginBottom: "48px" }}
            >
              <div className="section-label">Our Journey</div>
              <h2 className="section-title">Milestones</h2>
            </div>
            <div>
              {[
                ["1998", "Founded in Florence, Italy by Alessandro Ferretti"],
                ["2003", "First flagship boutique opens on Via Tornabuoni"],
                ["2008", "Launch of the iconic Heritage Collection"],
                ["2014", "International expansion: New York, Paris, Dubai"],
                [
                  "2019",
                  "Sustainability pledge: carbon-neutral workshops by 2025",
                ],
                [
                  "2024",
                  "Celebrating 25 years of uncompromising craftsmanship",
                ],
              ].map(([year, event]) => (
                <div
                  key={year}
                  className="timeline-item reveal"
                  style={{ marginBottom: "48px" }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      letterSpacing: "4px",
                      color: "var(--bronze)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {year}
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      lineHeight: 1.8,
                      color: "var(--ink-soft)",
                    }}
                  >
                    {event}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div
            className="reveal-right"
            style={{ position: "sticky", top: "120px" }}
          >
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
              alt=""
              style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover" }}
            />
          </div>
        </div>

        <div
          className="reveal"
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div className="section-label">The Visionaries</div>
          <h2 className="section-title">Meet Our Team</h2>
          <div className="gold-line" style={{ marginTop: "24px" }} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
            gap: "40px",
          }}
        >
          {[
            {
              name: "Alessandro Ferretti",
              role: "Founder & Creative Director",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
            },
            {
              name: "Giulia Rossi",
              role: "Head of Design",
              img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
            },
            {
              name: "Pierre Laurent",
              role: "Master Artisan",
              img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
            },
          ].map((t, i) => (
            <div
              key={t.name}
              className="reveal"
              style={{ textAlign: "center", transitionDelay: `${i * 0.15}s` }}
            >
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  marginBottom: "24px",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.querySelector("img").style.transform =
                    "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.querySelector("img").style.transform =
                    "scale(1)";
                }}
              >
                <img
                  src={t.img}
                  alt={t.name}
                  style={{
                    width: "220px",
                    height: "270px",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform .6s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: "1px solid rgba(44,122,123,.25)",
                    transform: "translate(8px,8px)",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 500,
                  marginBottom: "6px",
                  color: "var(--ink)",
                }}
              >
                {t.name}
              </h3>
              <p
                style={{
                  fontSize: "9px",
                  letterSpacing: "3px",
                  color: "var(--bronze)",
                  textTransform: "uppercase",
                }}
              >
                {t.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── CONTACT PAGE ── */
const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  return (
    <div style={{ paddingTop: "100px", background: "var(--cream)" }}>
      <div
        style={{
          background: "var(--dark)",
          padding: "80px 60px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="noise" />
        <div
          style={{
            fontSize: "8px",
            letterSpacing: "8px",
            color: "var(--bronze)",
            marginBottom: "18px",
            textTransform: "uppercase",
            position: "relative",
          }}
        >
          Get In Touch
        </div>
        <h1
          className="font-display"
          style={{
            color: "var(--white)",
            fontSize: "clamp(36px,6vw,84px)",
            fontWeight: 300,
            position: "relative",
          }}
        >
          Contact Us
        </h1>
        <div className="gold-line" style={{ marginTop: "24px" }} />
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "100px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "80px",
        }}
      >
        <div>
          <div className="section-label" style={{ marginBottom: "12px" }}>
            Reach Out
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "44px",
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: "28px",
              color: "var(--ink)",
            }}
          >
            We'd Love
            <br />
            to Hear From You
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 2,
              color: "var(--ink-soft)",
              marginBottom: "52px",
            }}
          >
            Whether you have a question about a piece, need styling advice, or
            wish to arrange a private appointment — our team is at your service.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "32px",
              marginBottom: "52px",
            }}
          >
            {[
              [
                "✉",
                "Email Us",
                "contact@xclusivebags.com",
                "boutique@xclusivebags.com",
              ],
              ["☎", "Call Us", "+1 (212) 555-0192", "Mon–Fri, 9am–6pm EST"],
              ["◎", "Visit Us", "15 East 57th Street", "New York, NY 10022"],
            ].map(([icon, label, l1, l2]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  gap: "24px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    border: "1px solid var(--bronze-pale)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--bronze)",
                    fontSize: "20px",
                    flexShrink: 0,
                    transition: "all .3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--bronze-xpale)";
                    e.currentTarget.style.borderColor = "var(--bronze)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderColor = "var(--bronze-pale)";
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "9px",
                      letterSpacing: "4px",
                      color: "var(--bronze)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "var(--ink)",
                      marginBottom: "3px",
                      fontWeight: 500,
                    }}
                  >
                    {l1}
                  </div>
                  <div style={{ fontSize: "13px", color: "var(--muted)" }}>
                    {l2}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--white)",
            padding: "52px",
            boxShadow: "0 8px 60px rgba(28,20,16,.07)",
            border: "1px solid var(--border)",
          }}
        >
          {sent ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 0",
                animation: "scaleIn .5s ease",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  border: "2px solid var(--bronze)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 28px",
                  color: "var(--bronze)",
                  fontSize: "28px",
                  animation: "pulseRing 2s ease-in-out 1",
                }}
              >
                ✓
              </div>
              <h3
                className="font-display"
                style={{
                  fontSize: "34px",
                  fontWeight: 300,
                  marginBottom: "16px",
                  color: "var(--ink)",
                }}
              >
                Message Received
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--muted)",
                  lineHeight: 2,
                }}
              >
                Our team will respond within 24 hours. Thank you for reaching
                out.
              </p>
            </div>
          ) : (
            <>
              <h3
                className="font-display"
                style={{
                  fontSize: "32px",
                  fontWeight: 300,
                  marginBottom: "36px",
                  color: "var(--ink)",
                }}
              >
                Send a Message
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {[
                  ["name", "Your Full Name", "text"],
                  ["email", "Email Address", "email"],
                  ["subject", "Subject", "text"],
                ].map(([k, p, t]) => (
                  <div key={k}>
                    <label
                      style={{
                        fontSize: "9px",
                        letterSpacing: "4px",
                        color: "var(--muted)",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: "10px",
                      }}
                    >
                      {p}
                    </label>
                    <input
                      type={t}
                      className="luxury-input"
                      placeholder={p}
                      value={form[k]}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [k]: e.target.value }))
                      }
                    />
                  </div>
                ))}
                <div>
                  <label
                    style={{
                      fontSize: "9px",
                      letterSpacing: "4px",
                      color: "var(--muted)",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: "10px",
                    }}
                  >
                    Message
                  </label>
                  <textarea
                    className="luxury-input"
                    rows={5}
                    placeholder="Your message..."
                    value={form.message}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    style={{ resize: "vertical" }}
                  />
                </div>
                <button
                  className="btn-primary"
                  onClick={() => {
                    if (form.name && form.email && form.message) setSent(true);
                  }}
                  style={{ width: "100%" }}
                >
                  <span>Send Message</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── TOAST ── */
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className="toast">{message}</div>;
};

/* ── APP ── */
export default function App() {
  const [page, setPageRaw] = useState("home");
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState(null);

  const setPage = (p) => {
    setPageRaw(p);
    window.scrollTo(0, 0);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing)
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
        );
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(`${product.name} added ✦`);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const productId = page.startsWith("product-")
    ? parseInt(page.split("-")[1])
    : null;

  return (
    <div>
      <FontLoader />
      <MagneticCursor />
      <Navbar cartCount={cartCount} setPage={setPage} currentPage={page} />
      <main className="page-enter" key={page}>
        {page === "home" && (
          <HomePage setPage={setPage} addToCart={addToCart} />
        )}
        {page === "shop" && (
          <ShopPage setPage={setPage} addToCart={addToCart} />
        )}
        {productId && (
          <ProductDetailPage
            productId={productId}
            setPage={setPage}
            addToCart={addToCart}
          />
        )}
        {page === "cart" && (
          <CartPage cart={cart} setCart={setCart} setPage={setPage} />
        )}
        {page === "checkout" && (
          <CheckoutPage cart={cart} setCart={setCart} setPage={setPage} />
        )}
        {page === "about" && <AboutPage setPage={setPage} />}
        {page === "contact" && <ContactPage />}
      </main>
      <Footer setPage={setPage} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
