import { useEffect, useRef, useState } from 'react';

const slides = [
  {
    className: 'banner-item-01',
    subtitle: 'Explore Incredible India',
    title: 'Curated Holiday Packages Across India',
  },
  {
    className: 'banner-item-02',
    subtitle: 'Heritage & Culture',
    title: 'Royal Rajasthan & Golden Triangle Tours',
  },
  {
    className: 'banner-item-03',
    subtitle: 'Mountains & Valleys',
    title: 'Kashmir, Manali & Shimla Hill Escapes',
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef(null);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 4000);
    return resetTimeout;
  }, [current]);

  return (
    <div className="banner header-text">
      <div className="owl-banner owl-carousel banner-carousel">
        <div
          className="banner-slides"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className={`banner-slide ${slide.className}`}>
              <div className="text-content">
                <h4>{slide.subtitle}</h4>
                <h2>{slide.title}</h2>
              </div>
            </div>
          ))}
        </div>
        <div className="carousel-indicators">
          {slides.map((_, i) => (
            <span
              key={i}
              className={i === current ? 'active' : ''}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
