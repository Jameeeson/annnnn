'use client';

import { useEffect, useRef } from 'react';

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new globalThis.Audio('/music.mp3');
    audioRef.current.loop = true;

    // Browsers block autoplay until the user interacts with the page.
    // Try playing immediately, if it fails, wait for the first click/scroll.
    const tryPlay = () => {
      audioRef.current?.play().catch(() => {
        // Autoplay prevented by browser
      });
    };

    tryPlay();

    const handleFirstInteraction = () => {
      audioRef.current?.play().catch(() => {});
      // Once playing, remove the listeners so we don't spam the play command
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction, { passive: true });
    document.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      audioRef.current?.pause();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  return null; // Invisible component, always plays in background
}
