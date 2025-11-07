import { useEffect, useState } from 'react';

export default function KipasaLoader() {
  const [visibleLetters, setVisibleLetters] = useState(0);
  const word = 'KIPASA';

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLetters((prev) => {
        if (prev < word.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        background: 'linear-gradient(to bottom, #0f0f0f, #1a1a1a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '3rem',
        fontWeight: '700',
        letterSpacing: '0.5rem',
        color: '#E91E63',
        animation: 'fadeIn 1s ease',
      }}
    >
      {word.split('').map((char, i) => (
        <span
          key={i}
          style={{
            opacity: i < visibleLetters ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          {char}
        </span>
      ))}

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}