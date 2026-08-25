import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HERO_SLIDES } from '../data/mockProducts';
import { useShop } from '../context/ShopContext';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { setSearchQuery, updateFilter } = useShop();

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const handleSlideClick = (category: string) => {
    updateFilter('department', category);
    setSearchQuery('', category);
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 select-none max-h-[600px] min-h-[340px] md:min-h-[460px]">
      {/* Background Image Container */}
      <div className="relative w-full h-[380px] md:h-[500px]">
        <img
          src={slide.image}
          alt={slide.headline}
          className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-105"
        />

        {/* Ambient Overlay & Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient} opacity-75`} />

        {/* SOA Signature Bottom Fade into #eaeded */}
        <div className="absolute inset-x-0 bottom-0 h-44 md:h-64 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/80 to-transparent pointer-events-none" />

        {/* Banner Copy & Call to Action */}
        <div className="absolute top-8 md:top-16 left-4 md:left-12 max-w-xl text-white space-y-2.5 z-10">
          <div className="inline-block px-2.5 py-0.5 rounded-sm bg-[#febd69] text-gray-950 font-bold text-xs uppercase tracking-wider shadow">
            Featured Event
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight drop-shadow-md text-white">
            {slide.headline}
          </h1>
          <p className="text-sm md:text-base text-gray-100/90 font-normal drop-shadow">
            {slide.subtext}
          </p>
          <div className="pt-2">
            <button
              onClick={() => handleSlideClick(slide.category)}
              className="px-5 py-2.5 bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 font-bold text-sm rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:outline-none"
            >
              {slide.buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/3 -translate-y-1/2 w-11 h-24 flex items-center justify-center bg-transparent hover:bg-black/20 text-white rounded focus:outline-none focus:ring-2 focus:ring-amber-400 z-20 group transition"
        title="Previous Slide"
      >
        <ChevronLeft className="w-8 h-8 text-white/80 group-hover:text-white" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/3 -translate-y-1/2 w-11 h-24 flex items-center justify-center bg-transparent hover:bg-black/20 text-white rounded focus:outline-none focus:ring-2 focus:ring-amber-400 z-20 group transition"
        title="Next Slide"
      >
        <ChevronRight className="w-8 h-8 text-white/80 group-hover:text-white" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-28 md:bottom-36 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2 bg-white/60 hover:bg-white'
            }`}
            title={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
