"use client";

import { useEffect, useState, useRef } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface PageContent {
  heroEst: string;
  heroTagline: string;
  philosophyQuote: string;
  philosophyText: string;
}

const GALLERY_IMAGES = [
  { src: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800&auto=format&fit=crop", alt: "Alabaster Vessel" },
  { src: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop", alt: "Living Sanctuary" },
  { src: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop", alt: "Wide Atelier" },
  { src: "https://images.unsplash.com/photo-1594809222692-071a171d9d4c?q=80&w=800&auto=format&fit=crop", alt: "Raw Earth" },
  { src: "https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?q=80&w=800&auto=format&fit=crop", alt: "Room View" },
  { src: "https://images.unsplash.com/photo-1534349762913-96c225597341?q=80&w=800&auto=format&fit=crop", alt: "Crimson Accent" },
  { src: "https://images.unsplash.com/photo-1505693416388-33eb16280520?q=80&w=800&auto=format&fit=crop", alt: "Minimalist Corner" },
  { src: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=800&auto=format&fit=crop", alt: "Featured Space" },
];

export default function Home() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [content, setContent] = useState<PageContent>({
    heroEst: "Est. 2024",
    heroTagline: "The Art of Living",
    philosophyQuote: "\"Design is not just what it looks like and feels like. <span class='text-rua-red italic'>Design is how it works.</span>\"",
    philosophyText: "RUA encapsulates the essence of timeless aesthetics. We blend raw materials with refined craftsmanship to create spaces that breathe. Our collection is an ode to the imperfect beauty of nature and the precision of modern architecture.",
  });
  const [editContent, setEditContent] = useState<PageContent>(content);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdImage, setNewProdImage] = useState<File | null>(null);

  const WA_NUMBER = "919876543210";
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  // ─── Data Fetching ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error && Array.isArray(data)) {
          if (data.length === 0) {
            setProducts([
              { id: "1", name: "The Alabaster Vessel", price: 4200, image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800&auto=format&fit=crop" },
              { id: "2", name: "Raw Earth Bowl", price: 2850, image: "https://images.unsplash.com/photo-1594809222692-071a171d9d4c?q=80&w=800&auto=format&fit=crop" },
              { id: "3", name: "No. 4 Crimson Accent", price: 5600, image: "https://images.unsplash.com/photo-1534349762913-96c225597341?q=80&w=800&auto=format&fit=crop" },
              { id: "4", name: "Wabi-Sabi Platter", price: 3100, image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop" },
            ]);
          } else {
            setProducts(data);
          }
        }
      });

    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error && data.heroEst) {
          setContent(data);
          setEditContent(data);
        }
      });
  }, []);

  // ─── Animations & Scripts ────────────────────────────────────────────────────
  useEffect(() => {
    // Custom Cursor
    const dot = cursorDotRef.current;
    const outline = cursorOutlineRef.current;

    const onMouseMove = (e: MouseEvent) => {
      if (dot) {
        dot.style.left = `${e.clientX}px`;
        dot.style.top = `${e.clientY}px`;
      }
      if (outline) {
        outline.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const hoverables = document.querySelectorAll("a, button, .img-container, .group");
    const enterFns: (() => void)[] = [];
    const leaveFns: (() => void)[] = [];
    hoverables.forEach((el) => {
      const enter = () => {
        if (outline) {
          outline.style.width = "60px";
          outline.style.height = "60px";
          outline.style.borderColor = "transparent";
          outline.style.backgroundColor = "rgba(138, 44, 44, 0.2)";
        }
      };
      const leave = () => {
        if (outline) {
          outline.style.width = "40px";
          outline.style.height = "40px";
          outline.style.borderColor = "#8a2c2c";
          outline.style.backgroundColor = "transparent";
        }
      };
      enterFns.push(enter);
      leaveFns.push(leave);
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    // Lenis Smooth Scroll
    let lenis: any = null;
    if (typeof window !== "undefined" && (window as any).Lenis) {
      lenis = new (window as any).Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const raf = (time: number) => { lenis?.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }

    // GSAP
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      // Hero text reveal
      gsap.to(".reveal-text", {
        y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out", delay: 0.3,
      });

      // Scroll reveals
      document.querySelectorAll(".reveal-scroll").forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" } }
        );
      });

      // Parallax images
      document.querySelectorAll("img[data-speed]").forEach((img) => {
        const target = img as HTMLElement;
        gsap.to(target, {
          y: () => -100 * Number(target.dataset.speed),
          ease: "none",
          scrollTrigger: { trigger: target.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
    }

    // Navbar on scroll
    const navbar = document.getElementById("navbar");
    const onScroll = () => {
      if (!navbar) return;
      if (window.scrollY > 50) { navbar.classList.add("py-4"); navbar.classList.remove("py-6"); }
      else { navbar.classList.add("py-6"); navbar.classList.remove("py-4"); }
    };
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      hoverables.forEach((el, i) => {
        el.removeEventListener("mouseenter", enterFns[i]);
        el.removeEventListener("mouseleave", leaveFns[i]);
      });
      if (lenis) lenis.destroy();
    };
  }, []);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleLogin = () => {
    if (username === "admin" && password === "password") setIsAdminLoggedIn(true);
    else alert("Incorrect Atelier Credentials");
  };
  const handleLogout = () => { setIsAdminLoggedIn(false); setUsername(""); setPassword(""); };

  const handleOrder = (name: string, price: number) => {
    const msg = `Hello RUA Pottery! I'm interested in "${name}" (₹${price.toLocaleString()}). Is this piece available?`;
    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const saveContent = async () => {
    const res = await fetch("/api/content", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editContent) });
    if (res.ok) { setContent(editContent); alert("Content updated."); } else alert("Failed to save.");
  };

  const addProduct = async () => {
    if (!newProdName || !newProdPrice || !newProdImage) { alert("Fill all fields."); return; }
    try {
      const base64 = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target?.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(newProdImage);
      });
      const r = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newProdName, price: parseInt(newProdPrice), image: base64 }) });
      if (r.ok) { const p = await r.json(); setProducts([p, ...products]); setNewProdName(""); setNewProdPrice(""); setNewProdImage(null); alert("Published."); }
    } catch { alert("Error — image may be too large."); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Remove this piece from the storefront?")) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p.id !== id));
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Custom Cursor */}
      <div ref={cursorDotRef} className="cursor-dot hidden md:block" />
      <div ref={cursorOutlineRef} className="cursor-outline hidden md:block" />

      {/* ── Navigation ─────────────────────────────────────────────────────────── */}
      <nav id="navbar" className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference text-rua-beige transition-all duration-500">
        <div className="font-display font-bold text-3xl tracking-widest">RUA</div>
        <div className="hidden md:flex gap-12 font-sans text-xs tracking-[0.2em] uppercase items-center">
          <a href="#philosophy" className="hover:text-rua-red transition-colors">Philosophy</a>
          <a href="#directory" className="hover:text-rua-red transition-colors">Directory</a>
          <a href="#collection" className="hover:text-rua-red transition-colors">Shop</a>
          <button onClick={() => setIsAdminOpen(true)} className="hover:text-rua-red transition-colors tracking-[0.2em] uppercase">Owner Login</button>
        </div>
        <button className="md:hidden text-sm uppercase tracking-widest">Menu</button>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────────── */}
      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2000&auto=format&fit=crop"
            alt="RUA Hero"
            className="w-full h-[120%] object-cover object-center"
            data-speed="0.5"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        <div className="relative z-10 text-center flex flex-col items-center">
          <p className="reveal-text opacity-0 translate-y-12 font-sans text-xs md:text-sm tracking-[0.4em] mb-4 uppercase text-rua-red font-bold drop-shadow-md">
            {content.heroEst}
          </p>
          <h1 className="reveal-text opacity-0 translate-y-12 font-display text-[18vw] leading-none text-rua-beige mix-blend-overlay">
            RUA
          </h1>
          <p className="reveal-text opacity-0 translate-y-12 font-serif italic text-xl md:text-3xl mt-4 tracking-wider text-rua-beige">
            {content.heroTagline}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 opacity-70 hover:opacity-100 transition-opacity">
          <span className="font-sans text-[10px] tracking-[0.35em] uppercase text-rua-red font-bold drop-shadow-sm">Scroll</span>
          <div className="w-[1px] h-16 bg-rua-beige/20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-rua-red animate-dropLine" />
          </div>
        </div>
      </header>

      <main>
        {/* ── Philosophy ─────────────────────────────────────────────────────────── */}
        <section id="philosophy" className="min-h-[75vh] flex items-center justify-center px-6 py-28 bg-rua-beige">
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center gap-8">
            <span className="reveal-scroll font-sans text-rua-red text-xs tracking-[0.35em] uppercase">Philosophy</span>
            <h2
              className="reveal-scroll font-serif text-3xl md:text-5xl text-rua-charcoal leading-snug"
              dangerouslySetInnerHTML={{ __html: content.philosophyQuote }}
            />
            <p className="reveal-scroll font-sans text-rua-charcoal/70 max-w-lg text-sm md:text-base leading-loose text-justify-last-center">
              {content.philosophyText}
            </p>
          </div>
        </section>

        {/* ── Split Layout ───────────────────────────────────────────────────────── */}
        <section className="py-24 px-6 md:px-16 bg-rua-beige border-t border-rua-charcoal/5">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="reveal-scroll order-2 md:order-1">
              <div className="img-container relative aspect-[3/4] max-w-md mx-auto bg-rua-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop"
                  alt="Interior Detail"
                  className="w-full h-full object-cover img-zoom"
                />
                <div className="absolute bottom-4 right-4 bg-rua-beige/85 backdrop-blur-md px-5 py-2 shadow">
                  <span className="font-sans text-xs tracking-widest uppercase text-rua-charcoal">01. Living</span>
                </div>
              </div>
            </div>
            <div className="reveal-scroll order-1 md:order-2 flex flex-col gap-8">
              <h3 className="font-display text-5xl md:text-7xl text-rua-charcoal leading-tight">
                Serene <br />
                <span className="font-serif italic text-rua-red ml-12">Sanctuary</span>
              </h3>
              <p className="font-sans text-rua-charcoal/80 leading-loose max-w-md">
                Every object in a room tells a story. Our living collection focuses on organic textures and warm, neutral tones that invite calmness. From hand-carved wood to soft linens, we curate for the soul.
              </p>
              <a href="#collection" className="self-start border border-rua-charcoal/30 px-8 py-4 font-sans text-xs tracking-widest uppercase hover:bg-rua-charcoal hover:text-rua-beige transition-colors duration-300">
                View Collection
              </a>
            </div>
          </div>
        </section>

        {/* ── Parallax Wide ──────────────────────────────────────────────────────── */}
        <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden parallax-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop"
            alt="Wide Atelier"
            className="absolute top-0 left-0 w-full h-[120%] object-cover"
            data-speed="0.2"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="reveal-scroll bg-rua-beige/90 backdrop-blur-sm p-10 md:p-16 max-w-lg text-center shadow-2xl">
              <span className="block font-display text-2xl md:text-3xl text-rua-red mb-3">The Atelier</span>
              <p className="font-serif italic text-rua-charcoal text-lg md:text-xl">&ldquo;Where craftsmanship meets vision.&rdquo;</p>
            </div>
          </div>
        </section>

        {/* ── Zig-Zag Masonry ────────────────────────────────────────────────────── */}
        <section className="py-28 px-6 md:px-16 bg-rua-beige">
          <div className="max-w-7xl mx-auto flex flex-col gap-28">
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-start">
              <div className="reveal-scroll w-full md:w-1/3 flex flex-col pt-0 md:pt-16 gap-6">
                <h4 className="font-display text-4xl text-rua-charcoal">
                  Texture &amp; <br />
                  <span className="text-rua-red">Form</span>
                </h4>
                <p className="font-sans text-sm leading-loose text-rua-charcoal/70">
                  The tactile beauty of raw materials — the interplay of light and shadow on structured surfaces brings quiet drama to every space.
                </p>
                <div className="img-container aspect-[4/5] w-full max-w-xs bg-rua-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1594809222692-071a171d9d4c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover img-zoom" alt="Texture Detail" />
                </div>
              </div>
              <div className="reveal-scroll w-full md:w-2/3 self-end">
                <div className="img-container aspect-video w-full bg-rua-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover img-zoom" alt="Room View" />
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col-reverse md:flex-row gap-12 md:gap-20 items-end">
              <div className="reveal-scroll w-full md:w-5/12">
                <div className="img-container aspect-[3/4] w-full bg-rua-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1534349762913-96c225597341?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover img-zoom" alt="Decor Item" />
                </div>
                <div className="mt-5 flex justify-between items-center border-t border-rua-charcoal/15 pt-4">
                  <span className="font-display text-xl text-rua-charcoal">Vase No. 4</span>
                  <span className="font-sans text-xs uppercase tracking-widest text-rua-red">Ceramic</span>
                </div>
              </div>
              <div className="reveal-scroll w-full md:w-7/12 pb-0 md:pb-24">
                <div className="img-container aspect-square w-full max-w-sm ml-auto bg-rua-sand mb-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.unsplash.com/photo-1505693416388-33eb16280520?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover img-zoom" alt="Minimalist Corner" />
                </div>
                <p className="font-serif italic text-2xl md:text-3xl text-right text-rua-charcoal leading-relaxed">
                  Simplicity is the <br /> ultimate sophistication.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Marquee ────────────────────────────────────────────────────────────── */}
        <section className="bg-rua-red overflow-hidden py-14 flex whitespace-nowrap border-y border-rua-red/50">
          <div className="flex animate-marquee items-center shrink-0 text-rua-beige/20">
            <div className="flex gap-12 px-8 items-center text-[9vw]">
              <span className="font-display tracking-widest">AESTHETICS</span>
              <span className="font-serif italic">·</span>
              <span className="font-serif italic">Interiors</span>
              <span className="font-serif italic">·</span>
              <span className="font-display tracking-widest">TIMELESS</span>
              <span className="font-serif italic">·</span>
              <span className="font-serif italic">Design</span>
              <span className="font-serif italic">·</span>
            </div>
            <div className="flex gap-12 px-8 items-center text-[9vw]">
              <span className="font-display tracking-widest">AESTHETICS</span>
              <span className="font-serif italic">·</span>
              <span className="font-serif italic">Interiors</span>
              <span className="font-serif italic">·</span>
              <span className="font-display tracking-widest">TIMELESS</span>
              <span className="font-serif italic">·</span>
              <span className="font-serif italic">Design</span>
              <span className="font-serif italic">·</span>
            </div>
          </div>
        </section>

        {/* ── Featured Highlight ─────────────────────────────────────────────────── */}
        <section className="py-32 px-6 md:px-16 bg-rua-beige flex justify-center overflow-visible">
          <div className="relative w-full max-w-6xl">
            <div className="reveal-scroll img-container w-full h-[70vh] shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200&auto=format&fit=crop"
                className="w-full h-full object-cover img-zoom"
                alt="Featured Space"
              />
            </div>
            <div className="reveal-scroll md:absolute md:-bottom-16 md:right-12 w-full md:w-auto max-w-sm bg-rua-sand p-10 md:p-12 shadow-2xl mt-8 md:mt-0">
              <h4 className="font-display text-2xl text-rua-charcoal pb-4 mb-5 border-b border-rua-charcoal/10">The Red Thread</h4>
              <p className="font-sans text-sm text-rua-charcoal/80 leading-relaxed mb-8">
                A subtle connection of color throughout the home. Our signature red accentuates without overwhelming, providing a focal point of passion and warmth.
              </p>
              <button className="bg-rua-red w-full text-rua-beige font-sans text-xs uppercase tracking-widest py-4 hover:bg-rua-charcoal transition-colors duration-300">
                Explore More
              </button>
            </div>
          </div>
        </section>

        {/* Spacer for featured card overflow */}
        <div className="h-0 md:h-24 bg-rua-beige" />

        {/* ── Visual Directory ───────────────────────────────────────────────────── */}
        <section id="directory" className="py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 reveal-scroll flex flex-col items-center gap-3">
              <span className="font-sans text-xs tracking-[0.35em] uppercase text-rua-red">Curated File</span>
              <h3 className="font-display text-4xl md:text-5xl text-rua-charcoal">Visual Directory</h3>
              <p className="font-sans text-sm text-rua-charcoal/50 max-w-md">
                A curated archive of our aesthetic language — hover to explore in full colour.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
              {GALLERY_IMAGES.map((img, i) => (
                <div key={i} className="group img-container aspect-square overflow-hidden bg-rua-sand reveal-scroll cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.src} className="w-full h-full object-cover grid-img" alt={img.alt} />
                </div>
              ))}
            </div>

            <div className="mt-14 text-center reveal-scroll">
              <button className="border border-rua-charcoal text-rua-charcoal font-sans text-xs tracking-widest uppercase px-10 py-5 hover:bg-rua-charcoal hover:text-rua-beige transition-colors duration-300">
                Load More
              </button>
            </div>
          </div>
        </section>

        {/* ── Product Collection ─────────────────────────────────────────────────── */}
        <section id="collection" className="py-24 px-6 md:px-12 bg-rua-beige">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14 reveal-scroll flex flex-col items-center gap-3">
              <span className="font-sans text-xs tracking-[0.35em] uppercase text-rua-red">Curated Objects</span>
              <h3 className="font-display text-4xl md:text-5xl text-rua-charcoal">Product Placements</h3>
              <p className="font-sans text-sm text-rua-charcoal/50 max-w-md">
                Discover our signature pieces. Orders are placed directly via WhatsApp for a bespoke experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-14">
              {products.length === 0 ? (
                <p className="col-span-full text-center font-sans text-rua-charcoal/40 italic py-16">
                  The collection is currently being curated.
                </p>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="group flex flex-col reveal-scroll">
                    <div className="aspect-[4/5] overflow-hidden mb-4 bg-rua-sand cursor-pointer relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={p.name}
                      />
                    </div>
                    <div className="flex flex-col flex-grow text-center px-2">
                      <h4 className="font-display text-base text-rua-charcoal mb-1 group-hover:text-rua-red transition-colors duration-300">{p.name}</h4>
                      <span className="font-sans text-sm text-rua-charcoal/60 mb-4">₹{p.price.toLocaleString()}</span>
                      <button
                        onClick={() => handleOrder(p.name, p.price)}
                        className="mt-auto w-full bg-rua-charcoal text-rua-beige font-sans text-[10px] tracking-widest uppercase py-4 hover:bg-rua-red transition-colors duration-300"
                      >
                        Order via WhatsApp
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── Footer ─────────────────────────────────────────────────────────────── */}
        <footer className="bg-rua-charcoal text-rua-beige pt-28 pb-10 px-6 md:px-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 pb-16 border-b border-rua-beige/10">
            <div className="md:col-span-6 flex flex-col gap-5">
              <div className="font-display text-6xl md:text-8xl leading-none">RUA</div>
              <p className="font-serif italic text-rua-beige/40 text-xl max-w-sm mt-2">
                Curating spaces that inspire, calm, and endure.
              </p>
              <button
                onClick={() => handleOrder("a custom piece", 0)}
                className="self-start mt-4 border border-rua-red text-rua-red font-sans text-xs tracking-widest uppercase px-8 py-4 hover:bg-rua-red hover:text-rua-beige transition-colors duration-300"
              >
                WhatsApp Us
              </button>
            </div>

            <div className="md:col-span-3">
              <h6 className="font-sans text-xs tracking-widest uppercase text-rua-red mb-8">Socials</h6>
              <ul className="flex flex-col gap-4 font-sans text-sm text-rua-beige/60">
                <li><a href="#" className="hover:text-rua-beige transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-rua-beige transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-rua-beige transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-rua-beige transition-colors">Behance</a></li>
              </ul>
            </div>

            <div className="md:col-span-3">
              <h6 className="font-sans text-xs tracking-widest uppercase text-rua-red mb-8">Atelier</h6>
              <ul className="flex flex-col gap-4 font-sans text-sm text-rua-beige/60">
                <li><a href="mailto:hello@rua-decor.com" className="hover:text-rua-beige transition-colors">hello@rua-decor.com</a></li>
                <li><a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noreferrer" className="hover:text-rua-beige transition-colors">+91 98765 43210</a></li>
                <li className="mt-6 font-serif italic text-rua-beige/40 not-italic leading-relaxed">
                  Design District<br />Mumbai, India
                </li>
              </ul>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-8 flex flex-col md:flex-row justify-between items-center gap-3 text-xs font-sans tracking-widest uppercase text-rua-beige/20">
            <span>&copy; 2024 RUA Pottery</span>
            <span>Crafted with Love</span>
            <span>All Rights Reserved</span>
          </div>
        </footer>
      </main>

      {/* ── Admin Portal ───────────────────────────────────────────────────────── */}
      {isAdminOpen && (
        <div className="fixed inset-0 bg-rua-beige z-[100] overflow-y-auto">
          <button
            onClick={() => setIsAdminOpen(false)}
            className="fixed top-8 right-8 text-rua-charcoal font-sans text-xs tracking-[0.2em] uppercase hover:text-rua-red transition-colors z-10"
          >
            Close ✕
          </button>

          {!isAdminLoggedIn ? (
            <div className="min-h-screen flex items-center justify-center p-6">
              <div className="bg-white p-12 max-w-md w-full shadow-2xl text-center">
                <h2 className="font-display text-3xl text-rua-charcoal mb-2">Atelier Access</h2>
                <p className="font-sans text-xs text-rua-charcoal/50 tracking-widest uppercase mb-10">Owner Portal</p>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full font-sans text-sm p-4 mb-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red transition-colors" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full font-sans text-sm p-4 mb-8 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red transition-colors" />
                <button onClick={handleLogin} className="w-full bg-rua-charcoal text-rua-beige font-sans text-xs tracking-[0.2em] uppercase py-4 hover:bg-rua-red transition-colors">Enter</button>
              </div>
            </div>
          ) : (
            <div className="min-h-screen py-20 px-6 max-w-5xl mx-auto">
              <div className="flex justify-between items-end mb-12 border-b border-rua-charcoal/10 pb-6">
                <div>
                  <h2 className="font-display text-4xl text-rua-charcoal">Inventory Management</h2>
                  <p className="font-sans text-sm text-rua-charcoal/50 mt-2">Add, update, or remove product placements.</p>
                </div>
                <button onClick={handleLogout} className="text-rua-red font-sans text-xs tracking-widest uppercase hover:text-rua-charcoal transition-colors border border-rua-red hover:border-rua-charcoal px-6 py-2">Sign Out</button>
              </div>

              {/* Edit Content */}
              <div className="bg-white p-8 shadow-sm mb-10">
                <h3 className="font-display text-2xl text-rua-charcoal mb-6">Edit Page Content</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/50 mb-2">Hero &ldquo;Est.&rdquo; Text</label>
                    <input type="text" value={editContent.heroEst} onChange={(e) => setEditContent({ ...editContent, heroEst: e.target.value })} className="w-full font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/50 mb-2">Hero Tagline</label>
                    <input type="text" value={editContent.heroTagline} onChange={(e) => setEditContent({ ...editContent, heroTagline: e.target.value })} className="w-full font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/50 mb-2">Philosophy Quote (HTML ok)</label>
                    <textarea value={editContent.philosophyQuote} onChange={(e) => setEditContent({ ...editContent, philosophyQuote: e.target.value })} rows={2} className="w-full font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/50 mb-2">Philosophy Body</label>
                    <textarea value={editContent.philosophyText} onChange={(e) => setEditContent({ ...editContent, philosophyText: e.target.value })} rows={4} className="w-full font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red" />
                  </div>
                </div>
                <button onClick={saveContent} className="mt-6 bg-rua-charcoal text-rua-beige font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-rua-red transition-colors">Save Content</button>
              </div>

              {/* Add Product */}
              <div className="bg-white p-8 shadow-sm mb-10">
                <h3 className="font-display text-2xl text-rua-charcoal mb-6">List New Piece</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder="Piece Title" className="font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red" />
                  <input type="number" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} placeholder="Price (₹)" className="font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red" />
                  <div className="md:col-span-2">
                    <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/50 mb-2">Upload Image</label>
                    <input type="file" accept="image/*" onChange={(e) => setNewProdImage(e.target.files?.[0] || null)} className="w-full font-sans text-sm p-3 bg-rua-beige border border-rua-charcoal/10 focus:outline-none" />
                  </div>
                </div>
                <button onClick={addProduct} className="mt-6 bg-rua-red text-rua-beige font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-rua-charcoal transition-colors">Publish to Storefront</button>
              </div>

              {/* Product List */}
              <div>
                <h3 className="font-display text-2xl text-rua-charcoal mb-6">Current Offerings</h3>
                <div className="space-y-3">
                  {products.length === 0 ? (
                    <p className="font-sans text-sm text-rua-charcoal/40 italic">No pieces listed.</p>
                  ) : (
                    products.map((p) => (
                      <div key={p.id} className="flex items-center justify-between bg-white p-4 border border-rua-charcoal/8 hover:border-rua-charcoal/20 transition-colors">
                        <div className="flex items-center gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.image} className="w-16 h-16 object-cover bg-rua-beige" alt={p.name} />
                          <div>
                            <p className="font-display text-base text-rua-charcoal">{p.name}</p>
                            <p className="font-sans text-xs text-rua-charcoal/50 mt-1">₹{p.price.toLocaleString()}</p>
                          </div>
                        </div>
                        <button onClick={() => deleteProduct(p.id)} className="text-rua-red font-sans text-xs tracking-widest uppercase hover:underline">Remove</button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
