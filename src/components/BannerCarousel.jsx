import React, { useState, useEffect } from 'react';
import { getBanners } from '../utils/appwrite';

export default function BannerCarousel() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    getBanners().then(setBanners);
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  if (!banners.length) return null;

  const current = banners[index];

  return (
    <div className="banner-carousel">
      <a href={current.link || '#'}>
        <img
          src={typeof current.image === 'string' ? current.image : '/fallback.jpg'}
          alt={current.title}
          className="banner-img"
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '12px',
          }}
          onError={(e) => (e.target.src = '/fallback.jpg')}
        />
        <div className="banner-overlay">
          <h2>{current.title}</h2>
          <p>{current.subtitle}</p>
        </div>
      </a>
    </div>
  );
}