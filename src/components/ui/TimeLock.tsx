'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLockProps {
  children: React.ReactNode;
  targetDate: string; // ISO string e.g., '2026-05-01T00:00:00'
}

export function TimeLock({ children, targetDate }: TimeLockProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const target = new Date(targetDate).getTime();

    const checkTime = () => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance <= 0) {
        setIsUnlocked(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };

    checkTime();
    const timer = setInterval(checkTime, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) {
    // Prevent hydration mismatch by showing nothing or a spinner until client logic kicks in
    return <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500">Loading...</div>;
  }

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-8 text-zinc-100 background-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="max-w-md w-full bg-black/40 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.05)] border border-zinc-800"
      >
        <h1 className="text-3xl font-serif mb-4 text-zinc-100 tracking-wider">WIT LANG PU</h1>
        <p className="text-zinc-500 font-light mb-8">
          The memories will be revealed when the time is right.
        </p>

        <div className="flex justify-center gap-4 text-center">
          <div className="flex flex-col">
            <span className="text-4xl font-light tabular-nums text-white">{timeLeft.days}</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500 mt-2">Days</span>
          </div>
          <span className="text-4xl font-light text-zinc-700">:</span>
          <div className="flex flex-col">
            <span className="text-4xl font-light tabular-nums text-white">{timeLeft.hours}</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500 mt-2">Hours</span>
          </div>
          <span className="text-4xl font-light text-zinc-700">:</span>
          <div className="flex flex-col">
            <span className="text-4xl font-light tabular-nums text-white">{timeLeft.minutes}</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500 mt-2">Mins</span>
          </div>
          <span className="text-4xl font-light text-zinc-700">:</span>
          <div className="flex flex-col">
            <span className="text-4xl font-light tabular-nums text-white">{timeLeft.seconds}</span>
            <span className="text-xs uppercase tracking-widest text-zinc-500 mt-2">Secs</span>
          </div>
        </div>

        {/* <div className="mt-8 pt-4 border-t border-zinc-800/50 flex justify-center">
          <button
            onClick={() => setIsUnlocked(true)}
            className="text-[10px] text-zinc-700 hover:text-zinc-500 transition-colors uppercase tracking-widest"
          >
            Developer Bypass
          </button>
        </div> */}
      </motion.div>
    </div>
  );
}
