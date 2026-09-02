'use client'
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Truck, ShieldCheck, RefreshCw, Clock, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

const slides = [
  {
    id: 1,
    title: 'Ухаалаг технологийн 75% хүртэлх хямдрал',
    subtitle: 'Microsoft Office 2021 Pro & Смарт төхөөрөмжүүдийн онцгой урамшуулал',
    bg: 'from-[#0f2b5c] via-[#1a3a70] to-[#0d2147]',
    badge: 'Онцгой урамшуулал',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80',
    tag: 'Цөөн тоотой'
  },
  {
    id: 2,
    title: 'Өвөл, хаврын гадуур хувцасны шинэ ирэлт',
    subtitle: 'Уулын аялал болон өдөр тутмын ус, салхины хамгаалалттай чанартай куртик',
    bg: 'from-[#1e3a8a] via-[#1d4ed8] to-[#1e40af]',
    badge: 'Шинэ бараа',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80',
    tag: 'Үнэгүй хүргэлт'
  },
  {
    id: 3,
    title: 'Гэр ахуй & Гал тогооны хэрэгслүүд',
    subtitle: 'Халуунаа 24 цаг барьдаг вакуум сав болон тав тухтай орчин бүтээгч',
    bg: 'from-[#065f46] via-[#047857] to-[#064e3b]',
    badge: 'Шилдэг борлуулалт',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80',
    tag: 'Бэлэн байгаа'
  }
];

export const HeroBanner = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const onShopNow = () => router.push('/filter/1');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:h-[600px]">
      {/* Main Hero Slider (3 Cols on desktop) */}
      <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-md group h-[360px] sm:h-[420px] lg:h-full flex items-center">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-gradient-to-r ${slide.bg} flex items-center ${
              idx === currentSlide ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background pattern & overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
            
            <div className="relative z-10 w-full p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-white space-y-3 sm:space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold backdrop-blur-sm">
                  <span>{slide.badge}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white drop-shadow-sm">
                  {slide.title}
                </h2>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
                  {slide.subtitle}
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <button
                    onClick={onShopNow}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                  >
                    <span>Худалдан авах</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-blue-200/80 font-medium">
                    {slide.tag}
                  </span>
                </div>
              </div>

              {/* Slide Image */}
              <div className="hidden sm:block shrink-0 w-44 sm:w-56 h-44 sm:h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentSlide ? 'w-7 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Side Promotional Banners (1 Col on desktop) */}
      <div className="hidden lg:flex flex-col gap-3 h-full">
        {/* Banner 1 */}
        <div
          onClick={onShopNow}
          className="flex-1 rounded-2xl p-4 bg-gradient-to-br from-blue-900 to-indigo-900 text-white relative overflow-hidden cursor-pointer group border border-blue-800 shadow-sm flex flex-col justify-between"
        >
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              ⚡ Шинэ урамшуулал
            </span>
            <h3 className="text-sm font-bold leading-snug group-hover:text-amber-300 transition-colors">
              i12 Inpods Bluetooth Чихэвч
            </h3>
            <p className="text-xs text-blue-200 font-bold">24,200₮ <span className="text-[10px] line-through text-blue-300 font-normal">32,000₮</span></p>
          </div>
          <div className="relative z-10 flex items-center justify-between pt-2">
            <span className="text-[11px] font-semibold text-emerald-400 underline">🚚 Үнэгүй хүргэлт</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </div>
          <img
            src="https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80"
            alt="Banner 1"
            className="absolute -right-6 -bottom-6 w-28 h-28 object-cover rounded-xl opacity-40 group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Banner 2 */}
        <div
          onClick={onShopNow}
          className="flex-1 rounded-2xl p-4 bg-gradient-to-br from-emerald-900 to-teal-950 text-white relative overflow-hidden cursor-pointer group border border-emerald-800 shadow-sm flex flex-col justify-between"
        >
          <div className="relative z-10 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              🔥 Онцлох бараа
            </span>
            <h3 className="text-sm font-bold leading-snug group-hover:text-emerald-200 transition-colors">
              Халуунаа барьдаг вакуум сав
            </h3>
            <p className="text-xs text-emerald-200 font-bold">12,000₮ <span className="text-[10px] text-emerald-300/80 font-normal">Бэлэн байгаа</span></p>
          </div>
          <div className="relative z-10 flex items-center justify-between pt-2">
            <span className="text-[11px] font-semibold text-emerald-300">24 цаг халуунаа барина</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
          </div>
          <img
            src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80"
            alt="Banner 2"
            className="absolute -right-6 -bottom-6 w-28 h-28 object-cover rounded-xl opacity-40 group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export const ServiceHighlightsBar = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-3 p-1">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">Шуурхай хүргэлт</h4>
          <p className="text-[11px] text-slate-500 font-normal">24-48 цагт таны гар дээр</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-1">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">Найдвартай төлбөр</h4>
          <p className="text-[11px] text-slate-500 font-normal">QPay & Дансаар шилжүүлэх</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-1">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">Баталгаат чанар</h4>
          <p className="text-[11px] text-slate-500 font-normal">100% Оригинал бараа</p>
        </div>
      </div>

      <div className="flex items-center gap-3 p-1">
        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-800">Шууд зөвлөгөө</h4>
          <p className="text-[11px] text-slate-500 font-normal">Өдөр бүр 09:00 - 21:00</p>
        </div>
      </div>
    </div>
  );
};
