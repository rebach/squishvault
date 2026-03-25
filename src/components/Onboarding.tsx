'use client';

import { useState } from 'react';

const SCREENS = [
  {
    title: 'Open Blind Bags',
    desc: 'Earn coins daily, then spend them in the store to open surprise blind bags!',
    emoji: '🎒',
    bg: 'linear-gradient(135deg, #FF85C2, #C8A8F5)',
  },
  {
    title: 'Collect Squishies',
    desc: 'Build your collection across series — from common to mythic!',
    emoji: '📦',
    bg: 'linear-gradient(135deg, #5BB8FF, #B8F4E8)',
  },
  {
    title: 'Squish & Share',
    desc: 'Tap your squishies to squish them, hit combos, and share your rarest finds!',
    emoji: '🫧',
    bg: 'linear-gradient(135deg, #FFE87C, #FF9A8B)',
  },
];

interface Props {
  onDone: () => void;
}

export default function Onboarding({ onDone }: Props) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < SCREENS.length - 1) {
      setStep(step + 1);
    } else {
      onDone();
    }
  };

  const screen = SCREENS[step];

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center px-8"
      style={{
        background: screen.bg,
        transition: 'background 0.5s ease',
      }}
    >
      <button
        onClick={onDone}
        className="absolute top-5 right-5 text-sm text-white border-none cursor-pointer px-3 py-1.5 rounded-full"
        style={{
          background: 'rgba(255,255,255,0.25)',
          fontFamily: 'var(--font-body)',
          backdropFilter: 'blur(8px)',
        }}
      >
        Skip
      </button>

      <div
        className="text-8xl mb-8"
        style={{
          animation: 'squishy-float 3s ease-in-out infinite',
          filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.15))',
        }}
      >
        {screen.emoji}
      </div>

      <h2
        className="text-3xl text-white text-center mb-3"
        style={{
          fontFamily: 'var(--font-display)',
          textShadow: '0 2px 12px rgba(0,0,0,0.15)',
          animation: 'slide-up 0.4s ease',
        }}
      >
        {screen.title}
      </h2>
      <p
        className="text-center text-white text-base max-w-xs mb-10"
        style={{
          fontFamily: 'var(--font-body)',
          opacity: 0.9,
          animation: 'slide-up 0.4s 0.1s ease both',
        }}
      >
        {screen.desc}
      </p>

      {/* Dots */}
      <div className="flex gap-2 mb-8">
        {SCREENS.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all"
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              background: i === step ? 'white' : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>

      <button
        onClick={handleNext}
        className="px-10 py-4 rounded-full text-lg font-bold border-none cursor-pointer"
        style={{
          fontFamily: 'var(--font-display)',
          background: 'white',
          color: '#2D1B4E',
          boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          animation: 'slide-up 0.4s 0.2s ease both',
        }}
      >
        {step < SCREENS.length - 1 ? 'Next' : "Let's Go!"}
      </button>
    </div>
  );
}
