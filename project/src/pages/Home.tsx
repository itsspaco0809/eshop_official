import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  ChevronDown,
  Layers,
  Ruler,
  Box,
  ShieldCheck,
  Truck,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Link } from '@/lib/router';
import { supabase, type Product } from '@/lib/supabase';
import { useCurrency } from '@/lib/currency';
import ProductCard from '@/components/ProductCard';

const HERO_SLIDES = [
  {
    eyebrow: 'NEW DROP · 8-STUD SERIES',
    title: 'From Nothing to',
    highlight: 'Collector Grade.',
    subtitle:
      'Original brick-built vehicle kits and 300ppi custom decal sheets designed for builders who care about every line.',
    ctaText: 'Shop New Arrivals',
    ctaLink: '/store?sort=date-desc',
    image:
      'https://raw.githubusercontent.com/itsspaco0809/scitem-images/main/Chevrolet/Corvette_CX/MC00002500/0.webp?auto=compress&cs=tinysrgb&h=900&w=1400',
  },
  {
    eyebrow: 'FEATURED CONCEPT',
    title: 'Precision Aero,',
    highlight: 'Brick by Brick.',
    subtitle:
      'Clean proportions, tight clutch, and custom-matched wheel setups engineered from scratch.',
    ctaText: 'Explore Supercars',
    ctaLink: '/store?category=Super%20Car',
    image:
      'https://raw.githubusercontent.com/itsspaco0809/scitem-images/main/Alpine/Alpenglow/0.webp?auto=compress&cs=tinysrgb&h=900&w=1400',
  },
  {
    eyebrow: 'BESPOKE COMMISSION',
    title: 'Drive It.',
    highlight: 'Build It.',
    subtitle:
      'Turn your own car into a custom brick model with personalized plates, wheels, and aero details.',
    ctaText: 'Request a Custom Build',
    ctaLink: '/contact',
    image:
      'https://raw.githubusercontent.com/itsspaco0809/scitem-images/main/Ford/Mustang_GTD/MC00001900/0.webp?auto=compress&cs=tinysrgb&h=900&w=1400',
  },
];

const THEMES = [
  {
    title: 'Concept Car',
    img: 'https://raw.githubusercontent.com/itsspaco0809/scitem-images/main/Alpine/Alpenglow/0.webp?auto=compress&cs=tinysrgb&h=650&w=940',
    to: '/store?category=Concept%20Car',
  },
  {
    title: 'Super Car',
    img: 'https://raw.githubusercontent.com/itsspaco0809/scitem-images/main/Chevrolet/Corvette_CX/MC00002500/0.webp?auto=compress&cs=tinysrgb&h=650&w=940',
    to: '/store?category=Super%20Car',
  },
  {
    title: 'Sports Car',
    img: 'https://raw.githubusercontent.com/itsspaco0809/scitem-images/main/Hyundai/Ioniq%206%20N/0.webp?auto=compress&cs=tinysrgb&h=650&w=940',
    to: '/store?category=Sports%20Car',
  },
  {
    title: 'SUV',
    img: 'https://raw.githubusercontent.com/itsspaco0809/scitem-images/main/Mercedes-Maybach/GLS/MC00003600/0.webp?auto=compress&cs=tinysrgb&h=650&w=940',
    to: '/store?category=SUV',
  },
  {
    title: 'Display Scenes',
    img: 'https://raw.githubusercontent.com/itsspaco0809/scitem-images/main/Ford/Mustang_GTD/MC00001900/0.webp?auto=compress&cs=tinysrgb&h=650&w=940',
    to: '/store?category=Scene',
  },
];

const FAQS = [
  {
    q: 'Are these pre-built models or DIY brick kits?',
    a: 'Every physical kit comes unassembled with all required bricks sorted and ready to build, plus step-by-step digital PDF instructions. You can also purchase standalone PDF instructions in the Instructions section.',
  },
  {
    q: 'How long does order dispatch & shipping take?',
    a: 'Orders are packed and dispatched within 2–3 working days with tracked international shipping. Exact shipping rates are calculated transparently at checkout.',
  },
  {
    q: 'What if my kit is missing a part?',
    a: 'Every kit is checked before packing, but if a piece is ever missing, just message me through the Contact page with the part number and I will arrange a replacement swiftly.',
  },
  {
    q: 'Can I request a custom build of my own car?',
    a: 'Yes. Share reference photos of your vehicle—including custom license plates, wheels, or aero parts—and I will design a one-off model tailored to your exact spec.',
  },
];

export default function Home() {
  const { formatPrice } = useCurrency();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newIn, setNewIn] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const newCarouselRef = useRef<HTMLDivElement>(null);
  const favCarouselRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  // Auto-advance Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Fetch Supabase Products
  useEffect(() => {
    (async () => {
      const [{ data: featuredData }, { data: kitsData }] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .eq('section', 'kits')
          .order('rating', { ascending: false }),
        supabase.from('products').select('*').eq('section', 'kits'),
      ]);

      if (kitsData) {
        const sortedKits = [...kitsData].sort(
          (a, b) =>
            new Date(b.created_at || b.createdAt || 0).getTime() -
            new Date(a.created_at || a.createdAt || 0).getTime()
        );
        setNewIn(sortedKits.slice(0, 8));
      }

      setFeatured(featuredData || []);
      setLoading(false);
    })();
  }, []);

  const scrollRow = (
    ref: React.RefObject<HTMLDivElement>,
    direction: 'left' | 'right'
  ) => {
    const container = ref.current;
    if (!container) return;
    const firstCard = container.firstElementChild as HTMLElement | null;
    if (!firstCard) return;
    const gap = parseFloat(window.getComputedStyle(container).columnGap || '16');
    const amount = firstCard.getBoundingClientRect().width + gap;
    container.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const spotlightProduct = featured[0] || newIn[0];
  const activeSlide = HERO_SLIDES[slideIndex];

  return (
    <div className="pt-20 min-[1536px]:pt-28 bg-white dark:bg-[#121212] min-h-screen text-neutral-900 dark:text-white">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');`}
      </style>

      {/* 1. HERO SLIDER (24builds Dark Studio Aesthetic + LCP Typography) */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-950 min-h-[520px] sm:min-h-[600px] lg:min-h-[680px] flex items-end border border-neutral-200/20 dark:border-neutral-800">
          {HERO_SLIDES.map((slide, idx) => (
            <img
              key={slide.title}
              src={slide.image}
              alt={slide.title}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                idx === slideIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105 pointer-events-none'
              }`}
            />
          ))}

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/55 to-neutral-950/15" />

          {/* Content */}
          <div className="relative z-10 w-full p-6 sm:p-10 lg:p-16 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#D2FF00] text-[11px] font-bold uppercase tracking-widest mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {activeSlide.eyebrow}
              </span>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.98] tracking-tight">
                <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {activeSlide.title}
                </span>{' '}
                <span className="block text-[#D2FF00] mt-1">
                  {activeSlide.highlight}
                </span>
              </h1>

              <p className="mt-4 text-neutral-300 text-sm sm:text-base max-w-xl leading-relaxed">
                {activeSlide.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  to={activeSlide.ctaLink}
                  className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-neutral-950 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full hover:bg-[#D2FF00] transition-all hover:scale-105 active:scale-95"
                >
                  {activeSlide.ctaText}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>

                <div className="flex items-center gap-2 text-xs text-neutral-300">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5 · Original MOC Designs</span>
                </div>
              </div>
            </div>

            {/* Slide Controls */}
            <div className="flex items-center gap-3 self-start lg:self-end">
              <div className="flex items-center gap-1.5 mr-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlideIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      slideIndex === i
                        ? 'w-8 bg-[#D2FF00]'
                        : 'w-2 bg-white/35 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setSlideIndex(
                    (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
                  )
                }
                aria-label="Previous slide"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length)
                }
                aria-label="Next slide"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BUNDLE PROMO BAR (24builds Tiered Discount Concept) */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        <div className="rounded-2xl bg-neutral-950 dark:bg-neutral-900 border border-neutral-800 px-5 py-4 sm:px-8 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#D2FF00] text-neutral-950 text-[11px] font-black uppercase tracking-wider">
              Bundle & Save
            </span>
            <p className="text-white text-sm sm:text-base font-semibold">
              Add 2 kits for <span className="text-[#D2FF00]">5% off</span> · 3 kits for{' '}
              <span className="text-[#D2FF00]">8% off</span> · 4+ kits for{' '}
              <span className="text-[#D2FF00]">12% off</span>
            </p>
          </div>
          <Link
            to="/store"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-[#D2FF00] transition-colors"
          >
            Build Your Bundle
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 3. CHOOSE YOUR THEME (Horizontal Visual Strip) */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-18">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1.5">
              Choose Your Theme
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Start Building Your Lineup
            </h2>
          </div>
          <Link
            to="/store"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            Shop All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {THEMES.map((theme) => (
            <Link
              key={theme.title}
              to={theme.to}
              className="group relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
            >
              <img
                src={theme.img}
                alt={theme.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-base sm:text-lg">
                  {theme.title}
                </h3>
                <ArrowRight className="w-4 h-4 text-[#D2FF00] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. THIS WEEK'S NEW BUILDS */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1.5">
              Fresh Releases
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              Latest Builds
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRow(newCarouselRef, 'left')}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollRow(newCarouselRef, 'right')}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Link
              to="/store?sort=date-desc"
              className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white inline-flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div
          ref={newCarouselRef}
          className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
        >
          {loading
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="shrink-0 w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.85rem)] xl:w-[calc(25%-0.95rem)] aspect-[3/4] rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse"
                />
              ))
            : newIn.map((p) => (
                <div
                  key={p.id}
                  className="shrink-0 w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.85rem)] xl:w-[calc(25%-0.95rem)] snap-start"
                >
                  <ProductCard product={p} isNew />
                </div>
              ))}
        </div>
      </section>

      {/* 5. CAR OF THE MONTH (24builds Signature Spotlight Section) */}
      {spotlightProduct && (
        <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="rounded-3xl bg-neutral-950 text-white border border-neutral-800 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[320px] bg-neutral-900">
                <img
                  src={spotlightProduct.image_url}
                  alt={spotlightProduct.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-5 left-5 px-3 py-1 rounded-full bg-[#D2FF00] text-neutral-950 text-xs font-black uppercase tracking-wider">
                  Build of the Month
                </span>
              </div>

              <div className="lg:col-span-5 p-6 sm:p-10 lg:p-12">
                <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mb-2">
                  Spotlight Edition
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {spotlightProduct.name}
                </h2>
                <p className="text-neutral-400 text-sm sm:text-base mt-3 leading-relaxed">
                  {spotlightProduct.description ||
                    'Designed for display-grade proportions with clean bodywork, custom wheel fitment, and crisp 300ppi decal detailing.'}
                </p>

                {/* Engineering Specs Grid */}
                <div className="grid grid-cols-3 gap-3 my-7">
                  <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3.5">
                    <Layers className="w-4 h-4 text-[#D2FF00] mb-1.5" />
                    <p className="text-[11px] text-neutral-400 uppercase">Pieces</p>
                    <p className="text-base font-bold">
                      {spotlightProduct.piece_count || '300+'}
                    </p>
                  </div>
                  <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3.5">
                    <Ruler className="w-4 h-4 text-[#D2FF00] mb-1.5" />
                    <p className="text-[11px] text-neutral-400 uppercase">Scale</p>
                    <p className="text-base font-bold">8-Stud</p>
                  </div>
                  <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-3.5">
                    <Box className="w-4 h-4 text-[#D2FF00] mb-1.5" />
                    <p className="text-[11px] text-neutral-400 uppercase">Format</p>
                    <p className="text-base font-bold">Kit + PDF</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-neutral-800">
                  <div>
                    <p className="text-xs text-neutral-400">Starting at</p>
                    <p className="text-2xl font-bold">
                      {formatPrice(spotlightProduct.price)}
                    </p>
                  </div>
                  <Link
                    to={`/product/${spotlightProduct.slug}`}
                    className="group inline-flex items-center gap-2 px-6 py-3.5 bg-white text-neutral-950 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full hover:bg-[#D2FF00] transition-all"
                  >
                    View Product
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. CUSTOMER FAVOURITES */}
      {featured.length > 0 && (
        <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1.5">
                Top Rated
              </p>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                Customer Favourites
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollRow(favCarouselRef, 'left')}
                  aria-label="Scroll left"
                  className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollRow(favCarouselRef, 'right')}
                  aria-label="Scroll right"
                  className="w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-center hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <Link
                to="/store"
                className="text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white inline-flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div
            ref={favCarouselRef}
            className="flex gap-3 sm:gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          >
            {featured.map((p) => (
              <div
                key={p.id}
                className="shrink-0 w-[calc(50%-0.375rem)] md:w-[calc(33.333%-0.85rem)] xl:w-[calc(25%-0.95rem)] snap-start"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. WHY BUILDERS CHOOSE ME (Independent Designer Trust Pillars) */}
      <section className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        <div className="mb-8">
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1.5">
            The Standard
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Three Things I Refuse to Compromise On
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Wrench,
              title: 'Original 100% Independent Design',
              desc: 'Every model is engineered, test-built, and refined by me—no mass-copied templates, just accurate proportions and solid structure.',
            },
            {
              icon: ShieldCheck,
              title: 'Quality Parts & Crisp Decals',
              desc: 'Tight clutch bricks paired with high-resolution 300ppi sticker sheets and clear step-by-step PDF instructions.',
            },
            {
              icon: Truck,
              title: 'Tracked Global Fulfillment',
              desc: 'Carefully packed and shipped worldwide with tracking, plus fast missing-part support if anything ever goes astray.',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl p-6 sm:p-8 bg-neutral-100 dark:bg-[#111112] border border-neutral-200 dark:border-neutral-800"
              >
                <div className="w-11 h-11 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FAQ ACCORDION (24builds Bottom Conversion Booster) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-10">
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-1.5">
            Questions?
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#111112] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left gap-4"
                >
                  <span className="font-bold text-sm sm:text-base">{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-neutral-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
