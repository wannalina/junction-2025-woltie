import { useState, useRef } from 'react';

interface BannerSlide {
  title: string;
  subtitle: string;
  subtitle2: string;
  badge: string;
  color: string;
}

interface PromotionBannerProps {
  slides: BannerSlide[];
}

export function PromotionBanner({ slides }: PromotionBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const slideWidth = e.currentTarget.offsetWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex !== currentSlide && newIndex >= 0 && newIndex < slides.length) {
      setCurrentSlide(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      const slideWidth = scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="px-4 mb-4">
      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory"
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`min-w-full ${slide.color} rounded-xl p-3.5 relative overflow-hidden snap-start h-[130px] cursor-pointer`}
            >
              <div className="relative z-10">
                <h2 className="text-base sm:text-lg font-bold text-white mb-0.5">{slide.title}</h2>
                <p className="text-white text-[10px] sm:text-xs mb-0.5">{slide.subtitle}</p>
                <p className="text-white text-[10px] sm:text-xs">{slide.subtitle2}</p>
              </div>
              <div className="absolute top-2.5 right-2.5 bg-orange-400 text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
                {slide.badge}
              </div>
              <div className="absolute bottom-0 right-0 opacity-20">
                <div className="w-20 h-20 bg-white rounded-full -mb-10 -mr-10"></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center gap-1.5 mt-2.5">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-gray-600'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

