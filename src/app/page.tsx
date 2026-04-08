"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface PageContent {
  heroEst: string;
  heroTagline: string;
  philosophyQuote: string;
  philosophyText: string;
}

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
    philosophyText: "RUA encapsulates the essence of timeless aesthetics. We blend raw materials with refined craftsmanship to create spaces that breathe. Our collection is an ode to the imperfect beauty of nature and the precision of modern architecture."
  });

  const [editContent, setEditContent] = useState<PageContent>(content);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdImage, setNewProdImage] = useState<File | null>(null);

  const WA_NUMBER = "919876543210";

  // Cursor refs
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorOutlineRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          if (data.length === 0) {
            // Default aesthetic products if db is empty
            const defaults = [
              { id: "1", name: "The Alabaster Vessel", price: 4200, image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800&auto=format&fit=crop" },
              { id: "2", name: "Raw Earth Bowl", price: 2850, image: "https://images.unsplash.com/photo-1594809222692-071a171d9d4c?q=80&w=800&auto=format&fit=crop" },
              { id: "3", name: "No. 4 Crimson Accent", price: 5600, image: "https://images.unsplash.com/photo-1534349762913-96c225597341?q=80&w=800&auto=format&fit=crop" }
            ];
            setProducts(defaults);
          } else {
            setProducts(data);
          }
        }
      });

    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        if (!data.error && data.heroEst) {
          setContent(data);
          setEditContent(data);
        }
      });
  }, []);

  // Initialize scripts and anims
  useEffect(() => {
    // Custom Cursor
    const onMouseMove = (e: MouseEvent) => {
      if (cursorDotRef.current && cursorOutlineRef.current) {
        cursorDotRef.current.style.left = `${e.clientX}px`;
        cursorDotRef.current.style.top = `${e.clientY}px`;
        cursorOutlineRef.current.animate({
          left: `${e.clientX}px`,
          top: `${e.clientY}px`
        }, { duration: 500, fill: "forwards" });
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    // Hoverable elements cursor effect
    const hoverables = document.querySelectorAll('a, button, .img-container, .group');
    hoverables.forEach(el => {
      const enter = () => {
        if(cursorOutlineRef.current) {
          cursorOutlineRef.current.style.width = '60px';
          cursorOutlineRef.current.style.height = '60px';
          cursorOutlineRef.current.style.borderColor = 'transparent';
          cursorOutlineRef.current.style.backgroundColor = 'rgba(138, 44, 44, 0.2)';
        }
      };
      const leave = () => {
        if(cursorOutlineRef.current) {
          cursorOutlineRef.current.style.width = '40px';
          cursorOutlineRef.current.style.height = '40px';
          cursorOutlineRef.current.style.borderColor = '#8a2c2c';
          cursorOutlineRef.current.style.backgroundColor = 'transparent';
        }
      };
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      return () => {
        el.removeEventListener('mouseenter', enter);
        el.removeEventListener('mouseleave', leave);
      }
    });

    // Lenis Setup
    // @ts-ignore
    let lenis: any = null;
    if (typeof window !== "undefined" && (window as any).Lenis) {
      lenis = new (window as any).Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      const raf = (time: number) => {
        lenis?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // GSAP Setup
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;

    if (gsap && ScrollTrigger) {
      gsap.to('.reveal-text', {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
      });

      const revealElements = document.querySelectorAll('.reveal-scroll');
      revealElements.forEach(element => {
        gsap.fromTo(element, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 85%",
                }
            }
        );
      });

      document.querySelectorAll('img[data-speed]').forEach(img => {
        const target = img as HTMLElement;
        gsap.to(target, {
            y: () => -100 * Number(target.dataset.speed),
            ease: "none",
            scrollTrigger: {
                trigger: target.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
      });
    }

    // Navbar Scroll
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
      if (window.scrollY > 50 && navbar) {
          navbar.classList.add('py-4');
          navbar.classList.remove('py-6');
      } else if (navbar) {
          navbar.classList.add('py-6');
          navbar.classList.remove('py-4');
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      if(lenis) lenis.destroy();
    };
  }, []);

  // Handlers
  const handleLogin = () => {
    if (username === "admin" && password === "password") {
      setIsAdminLoggedIn(true);
    } else {
      alert("Incorrect Atelier Credentials");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setUsername("");
    setPassword("");
  };

  const handleOrder = (name: string, price: number) => {
    const message = `Hello RUA Decor, I am interested in inquiring about the "${name}" listed for ₹${price.toLocaleString()}. Is this piece currently available?`;
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const saveContent = async () => {
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editContent)
      });
      if (res.ok) {
        setContent(editContent);
        alert("Landing page content updated on database.");
      } else {
        alert("Failed to update content");
      }
    } catch (e) {
      alert("Error saving content.");
    }
  };

  const addProduct = async () => {
    if (!newProdName || !newProdPrice || !newProdImage) {
      alert("Please provide a title, price, and image.");
      return;
    }

    try {
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result);
        reader.onerror = reject;
        reader.readAsDataURL(newProdImage);
      });

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName,
          price: parseInt(newProdPrice),
          image: base64Image
        })
      });

      if (res.ok) {
        const newProd = await res.json();
        setProducts([newProd, ...products]);
        setNewProdName("");
        setNewProdPrice("");
        setNewProdImage(null);
        alert("Object successfully published to storefront.");
      } else {
        alert("Failed to publish object.");
      }
    } catch (e) {
      alert("Error saving object. Image may be too large.");
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Remove this object from the storefront?")) {
      await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <>
      <div ref={cursorDotRef} className="cursor-dot hidden md:block"></div>
      <div ref={cursorOutlineRef} className="cursor-outline hidden md:block"></div>

      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center mix-blend-difference text-rua-beige transition-all duration-300" id="navbar">
        <div className="font-display font-bold text-2xl tracking-widest text-rua-beige">RUA</div>
        <div className="hidden md:flex space-x-12 font-sans text-xs tracking-[0.2em] uppercase items-center">
            <a href="#collection" className="hover:text-rua-red transition-colors text-rua-beige">Collection</a>
            <button onClick={() => setIsAdminOpen(true)} className="hover:text-rua-red transition-colors text-rua-beige tracking-[0.2em] uppercase">Owner Login</button>
            <a href="#" className="hover:text-rua-red transition-colors text-rua-beige">Contact</a>
        </div>
        <div className="md:hidden">
            <button className="text-sm uppercase tracking-widest text-rua-beige">Menu</button>
        </div>
      </nav>

      <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=2000&auto=format&fit=crop" alt="RUA Hero" className="w-full h-full object-cover opacity-90 scale-105" data-speed="0.5" />
            <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <div className="relative z-10 text-center flex flex-col items-center">
            <p className="font-sans text-xs md:text-sm tracking-[0.4em] mb-4 uppercase opacity-0 translate-y-12 reveal-text text-rua-red font-semibold drop-shadow-md">{content.heroEst}</p>
            <h1 className="font-display text-[18vw] leading-none text-rua-beige mix-blend-overlay opacity-0 translate-y-12 reveal-text">RUA</h1>
            <p className="font-serif italic text-xl md:text-3xl mt-4 tracking-wider opacity-0 translate-y-12 reveal-text text-rua-beige">{content.heroTagline}</p>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-rua-red font-sans text-[10px] tracking-widest uppercase font-bold drop-shadow-sm">Scroll</span>
            <div className="w-[1px] h-12 bg-rua-beige/30 overflow-hidden">
                <div className="w-full h-full bg-rua-red animate-pulseslide"></div>
            </div>
        </div>
      </header>

      <main>
        <section className="min-h-[80vh] flex items-center justify-center px-6 py-24 bg-rua-beige relative">
            <div className="max-w-4xl mx-auto text-center">
                <span className="block text-rua-red font-sans text-xs tracking-[0.3em] uppercase mb-8 reveal-scroll">Philosophy</span>
                <h2 className="font-serif text-4xl md:text-6xl text-rua-charcoal leading-tight mb-10 reveal-scroll" dangerouslySetInnerHTML={{ __html: content.philosophyQuote }}>
                </h2>
                <div className="flex justify-center">
                    <p className="font-sans text-rua-charcoal/70 max-w-lg text-sm md:text-base leading-relaxed text-justify-last-center reveal-scroll">
                        {content.philosophyText}
                    </p>
                </div>
            </div>
        </section>

        <section className="py-20 px-4 md:px-12 bg-rua-beige">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                <div className="order-2 md:order-1 reveal-scroll">
                    <div className="img-container relative aspect-[3/4] overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop" alt="Interior Detail" className="w-full h-full object-cover img-zoom" />
                        <div className="absolute bottom-4 right-4 bg-rua-beige/90 px-4 py-2 backdrop-blur-sm">
                            <span className="font-display text-rua-red text-sm">01. Living</span>
                        </div>
                    </div>
                </div>
                <div className="order-1 md:order-2 space-y-8 reveal-scroll">
                    <h3 className="font-display text-5xl md:text-7xl text-rua-charcoal">Serene <br /> <span className="pl-12 text-rua-red italic font-serif">Sanctuary</span></h3>
                    <p className="font-sans text-rua-charcoal/80 leading-relaxed max-w-md">
                        Every object in a room tells a story. Our living collection focuses on organic textures and warm, neutral tones that invite calmness. From hand-carved wood to soft linens, we curate for the soul.
                    </p>
                    <a href="#" className="inline-block border-b border-rua-red pb-1 text-rua-red font-sans text-xs tracking-widest uppercase hover:text-rua-charcoal hover:border-rua-charcoal transition-colors">View Collection</a>
                </div>
            </div>
        </section>

        <section className="w-full py-20 overflow-hidden">
            <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden parallax-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop" alt="Wide Interior" className="absolute top-0 left-0 w-full h-[120%] object-cover" data-speed="0.2" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-rua-beige/90 p-8 md:p-16 max-w-lg text-center shadow-2xl reveal-scroll">
                        <span className="text-rua-red font-display text-2xl mb-2 block">The Atelier</span>
                        <p className="font-serif italic text-rua-charcoal text-lg">"Where craftsmanship meets vision."</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-24 px-4 bg-rua-beige">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-12 mb-24">
                    <div className="md:w-1/3 pt-12 reveal-scroll">
                        <h4 className="font-display text-3xl text-rua-charcoal mb-4">Texture &amp; <br/><span className="text-rua-red">Form</span></h4>
                        <p className="font-sans text-sm text-rua-charcoal/70 mb-8">
                            Exploring the tactile nature of our surroundings. The interplay of light and shadow on structured surfaces.
                        </p>
                        <div className="img-container aspect-[4/5]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1594809222692-071a171d9d4c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover img-zoom" alt="Texture Detail"/>
                        </div>
                    </div>
                    <div className="md:w-2/3 reveal-scroll flex">
                        <div className="img-container aspect-video w-full">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1617104424032-b9bd6972d0e4?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover img-zoom" alt="Room View"/>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse gap-12 items-end">
                    <div className="md:w-5/12 reveal-scroll">
                        <div className="img-container aspect-[3/4]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1534349762913-96c225597341?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover img-zoom" alt="Decor Item"/>
                        </div>
                        <div className="mt-6 flex justify-between items-baseline border-t border-rua-charcoal/10 pt-4">
                            <span className="font-display text-xl text-rua-charcoal">Vase No. 4</span>
                            <span className="font-sans text-xs text-rua-red tracking-widest uppercase">Ceramic</span>
                        </div>
                    </div>
                    <div className="md:w-5/12 pb-12 reveal-scroll">
                        <div className="img-container aspect-square">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="https://images.unsplash.com/photo-1505693416388-33eb16280520?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover img-zoom" alt="Minimalist Corner"/>
                        </div>
                        <p className="font-serif text-2xl italic text-right mt-6 text-rua-charcoal">
                            Simplicity is the ultimate <br/> sophistication.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-12 bg-rua-red overflow-hidden whitespace-nowrap">
            <div className="inline-flex animate-marquee">
                <span className="text-[10vw] font-display text-rua-beige/20 px-8">AESTHETICS</span>
                <span className="text-[10vw] font-serif italic text-rua-beige/20 px-8">Interiors</span>
                <span className="text-[10vw] font-display text-rua-beige/20 px-8">TIMELESS</span>
                <span className="text-[10vw] font-serif italic text-rua-beige/20 px-8">Design</span>
                <span className="text-[10vw] font-display text-rua-beige/20 px-8">AESTHETICS</span>
                <span className="text-[10vw] font-serif italic text-rua-beige/20 px-8">Interiors</span>
                <span className="text-[10vw] font-display text-rua-beige/20 px-8">TIMELESS</span>
                <span className="text-[10vw] font-serif italic text-rua-beige/20 px-8">Design</span>
            </div>
        </section>

        <section className="py-24 px-6 md:px-20 bg-rua-beige flex flex-col items-center">
            <div className="relative w-full max-w-5xl h-[70vh] reveal-scroll">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1560448204-603b3fc33ddc?q=80&w=1200&auto=format&fit=crop" alt="Featured Space" className="w-full h-full object-cover"/>
                <div className="absolute -bottom-10 -right-4 md:-right-10 bg-rua-sand p-8 md:p-12 shadow-xl max-w-sm">
                    <h5 className="font-display text-2xl text-rua-charcoal mb-4">The Red Thread</h5>
                    <p className="font-sans text-sm text-rua-charcoal/80 mb-6">
                        A subtle connection of color throughout the home. Our signature red accentuates without overwhelming.
                    </p>
                    <button className="bg-rua-red text-rua-beige font-sans text-xs tracking-widest uppercase px-6 py-3 hover:bg-rua-charcoal transition-colors">
                        Explore
                    </button>
                </div>
            </div>
        </section>

        <section id="collection" className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-rua-red font-sans text-xs tracking-[0.3em] uppercase">Curated Objects</span>
                    <h3 className="font-display text-4xl mt-4 text-rua-charcoal">Product Placements</h3>
                    <p className="font-sans text-rua-charcoal/60 max-w-lg mx-auto mt-4 text-sm">Discover our signature pieces. Direct inquiries are handled personally via WhatsApp to ensure a bespoke experience.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {products.length === 0 ? (
                        <p className="col-span-full text-center font-sans text-rua-charcoal/50 italic">The collection is currently being curated.</p>
                    ) : (
                        products.map(p => (
                            <div key={p.id} className="group cursor-pointer flex flex-col reveal-scroll">
                                <div className="aspect-[3/4] bg-rua-beige overflow-hidden mb-6 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={p.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={p.name} />
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                                        <button onClick={() => handleOrder(p.name, p.price)} className="bg-rua-red text-rua-beige font-sans text-xs tracking-widest uppercase px-8 py-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-rua-charcoal">
                                            Inquire via WhatsApp
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-baseline border-t border-rua-charcoal/10 pt-4">
                                    <span className="font-display text-xl text-rua-charcoal">{p.name}</span>
                                    <span className="font-sans text-sm text-rua-charcoal/60">₹{p.price.toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>

        <footer className="bg-rua-charcoal text-rua-beige px-6 py-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                    <h2 className="font-display text-6xl md:text-8xl mb-6">RUA</h2>
                    <p className="font-serif italic text-white/50 max-w-sm">
                        Curating spaces that inspire, calm, and endure.
                    </p>
                </div>
                <div>
                    <h6 className="font-sans text-xs tracking-widest uppercase text-rua-red mb-6">Connect</h6>
                    <ul className="space-y-4 font-sans text-sm text-white/70">
                        <li><a href="#" className="hover:text-white">Instagram</a></li>
                        <li><a href="#" className="hover:text-white">Pinterest</a></li>
                        <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                    </ul>
                </div>
                <div>
                    <h6 className="font-sans text-xs tracking-widest uppercase text-rua-red mb-6">Contact</h6>
                    <ul className="space-y-4 font-sans text-sm text-white/70">
                        <li>hello@rua-decor.com</li>
                        <li>+1 (555) 000-0000</li>
                        <li className="pt-4">
                            123 Aesthetic Avenue<br/>
                            Design District, NY
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 mt-20 pt-8 flex justify-between items-center text-xs font-sans text-white/30 uppercase tracking-widest">
                <span>© 2024 RUA Decor</span>
                <span>All Rights Reserved</span>
            </div>
        </footer>
      </main>

      {isAdminOpen && (
        <div className="fixed inset-0 bg-rua-beige z-[100] overflow-y-auto">
            <button onClick={() => setIsAdminOpen(false)} className="absolute top-8 right-8 text-rua-charcoal font-sans text-xs tracking-[0.2em] uppercase hover:text-rua-red transition-colors">Close ✕</button>
            
            {!isAdminLoggedIn ? (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="bg-white p-12 max-w-md w-full shadow-2xl text-center">
                        <h2 className="font-display text-3xl text-rua-charcoal mb-2">Atelier Access</h2>
                        <p className="font-sans text-xs text-rua-charcoal/60 tracking-widest uppercase mb-8">Owner Portal</p>
                        
                        <input type="text" value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username (admin)" className="w-full font-sans text-sm p-4 mb-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red transition-colors"/>
                        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (password)" className="w-full font-sans text-sm p-4 mb-8 bg-rua-beige border border-rua-charcoal/10 focus:outline-none focus:border-rua-red transition-colors"/>
                        
                        <button onClick={handleLogin} className="w-full bg-rua-charcoal text-rua-beige font-sans text-xs tracking-[0.2em] uppercase py-4 hover:bg-rua-red transition-colors">Enter</button>
                    </div>
                </div>
            ) : (
                <div className="min-h-screen py-20 px-6 max-w-5xl mx-auto">
                    <div className="flex justify-between items-end mb-12 border-b border-rua-charcoal/10 pb-6">
                        <div>
                            <h2 className="font-display text-4xl text-rua-charcoal">Inventory Management</h2>
                            <p className="font-sans text-sm text-rua-charcoal/60 mt-2">Add or remove product placements.</p>
                        </div>
                        <button onClick={handleLogout} className="text-rua-red font-sans text-xs tracking-widest uppercase hover:text-rua-charcoal transition-colors border border-rua-red hover:border-rua-charcoal px-6 py-2">Sign Out</button>
                    </div>

                    <div className="bg-white p-8 shadow-sm mb-12">
                        <h3 className="font-display text-2xl text-rua-charcoal mb-2">Edit Landing Page Content</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/60 mb-2">Hero Established Text</label>
                                <input type="text" value={editContent.heroEst} onChange={e=>setEditContent({...editContent, heroEst: e.target.value})} className="w-full font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none"/>
                            </div>
                            <div>
                                <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/60 mb-2">Hero Tagline</label>
                                <input type="text" value={editContent.heroTagline} onChange={e=>setEditContent({...editContent, heroTagline: e.target.value})} className="w-full font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none"/>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/60 mb-2">Philosophy Quote (HTML allowed)</label>
                                <textarea value={editContent.philosophyQuote} onChange={e=>setEditContent({...editContent, philosophyQuote: e.target.value})} className="w-full font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none" rows={2}></textarea>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/60 mb-2">Philosophy Body Text</label>
                                <textarea value={editContent.philosophyText} onChange={e=>setEditContent({...editContent, philosophyText: e.target.value})} className="w-full font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none" rows={4}></textarea>
                            </div>
                        </div>
                        <button onClick={saveContent} className="mt-8 bg-rua-charcoal text-rua-beige font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-rua-red transition-colors">Save Page Content</button>
                    </div>

                    <div className="bg-white p-8 shadow-sm mb-12">
                        <h3 className="font-display text-2xl text-rua-charcoal mb-6">List New Object</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" value={newProdName} onChange={e=>setNewProdName(e.target.value)} placeholder="Object Title" className="font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none"/>
                            <input type="number" value={newProdPrice} onChange={e=>setNewProdPrice(e.target.value)} placeholder="Price (₹)" className="font-sans text-sm p-4 bg-rua-beige border border-rua-charcoal/10 focus:outline-none"/>
                            <div className="md:col-span-2">
                                <label className="block font-sans text-xs tracking-widest uppercase text-rua-charcoal/60 mb-2">Upload Image</label>
                                <input type="file" accept="image/*" onChange={e=>setNewProdImage(e.target.files?.[0] || null)} className="w-full font-sans text-sm p-3 bg-rua-beige border border-rua-charcoal/10 focus:outline-none"/>
                            </div>
                        </div>
                        <button onClick={addProduct} className="mt-8 bg-rua-red text-rua-beige font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-rua-charcoal transition-colors">Publish to Storefront</button>
                    </div>

                    <div>
                        <h3 className="font-display text-2xl text-rua-charcoal mb-6">Current Offerings</h3>
                        <div className="space-y-4">
                            {products.length === 0 ? (
                                <p className="font-sans text-sm text-rua-charcoal/60 italic">No objects currently listed.</p>
                            ) : (
                                products.map(p => (
                                    <div key={p.id} className="flex items-center justify-between bg-white p-4 border border-rua-charcoal/10">
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={p.image} className="w-16 h-16 object-cover bg-rua-beige" alt={p.name} />
                                            <div>
                                                <p className="font-display text-lg text-rua-charcoal">{p.name}</p>
                                                <p className="font-sans text-xs text-rua-charcoal/60">₹{p.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => deleteProduct(p.id)} className="text-rua-red font-sans text-xs tracking-widest uppercase hover:underline">Revoke</button>
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
