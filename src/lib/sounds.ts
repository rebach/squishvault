'use client';

import { Howl } from 'howler';

type SoundName =
  | 'bag-crinkle' | 'bag-rip'
  | 'squish-press' | 'squish-release' | 'squish-combo'
  | 'coin-collect' | 'coin-shower'
  | 'reveal-common' | 'reveal-uncommon' | 'reveal-rare' | 'reveal-mythic'
  | 'celebration' | 'wishlist-add' | 'daily-reward';

const SOUND_CONFIG: Record<SoundName, { src: string; volume?: number }> = {
  'bag-crinkle':     { src: '/sounds/bag-crinkle.mp3', volume: 0.6 },
  'bag-rip':         { src: '/sounds/bag-rip.mp3', volume: 0.7 },
  'squish-press':    { src: '/sounds/squish-press.mp3', volume: 0.5 },
  'squish-release':  { src: '/sounds/squish-release.mp3', volume: 0.4 },
  'squish-combo':    { src: '/sounds/squish-combo.mp3', volume: 0.8 },
  'coin-collect':    { src: '/sounds/coin-collect.mp3', volume: 0.5 },
  'coin-shower':     { src: '/sounds/coin-shower.mp3', volume: 0.6 },
  'reveal-common':   { src: '/sounds/reveal-common.mp3', volume: 0.6 },
  'reveal-uncommon': { src: '/sounds/reveal-uncommon.mp3', volume: 0.7 },
  'reveal-rare':     { src: '/sounds/reveal-rare.mp3', volume: 0.8 },
  'reveal-mythic':   { src: '/sounds/reveal-mythic.mp3', volume: 1.0 },
  'celebration':     { src: '/sounds/celebration.mp3', volume: 0.7 },
  'wishlist-add':    { src: '/sounds/wishlist-add.mp3', volume: 0.5 },
  'daily-reward':    { src: '/sounds/daily-reward.mp3', volume: 0.6 },
};

const sounds: Partial<Record<SoundName, Howl>> = {};
let muted = false;

function getSound(name: SoundName): Howl {
  if (!sounds[name]) {
    const config = SOUND_CONFIG[name];
    sounds[name] = new Howl({
      src: [config.src],
      volume: config.volume ?? 0.5,
      preload: true,
    });
  }
  return sounds[name]!;
}

export function playSound(name: SoundName, pitchVariation = 0) {
  if (muted || typeof window === 'undefined') return;
  const howl = getSound(name);
  const id = howl.play();
  if (pitchVariation > 0) {
    const rate = 1 + (Math.random() * 2 - 1) * pitchVariation;
    howl.rate(rate, id);
  }
}

export function preloadSounds(names: SoundName[]) {
  names.forEach((name) => getSound(name));
}

export function toggleMute(): boolean {
  muted = !muted;
  Howler.mute(muted);
  return muted;
}

export function isMuted(): boolean {
  return muted;
}
