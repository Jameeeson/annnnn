'use client';

import { motion } from 'framer-motion';
import { StorySection } from '@/components/sections/StorySection';
import { Camera, Image as ImageIcon, Sparkles, Heart } from 'lucide-react';
import { useState } from 'react';
import { CaptureModal } from '@/components/capture/CaptureModal';
import Link from 'next/link';

export default function Home() {
  const [isGlobalCaptureOpen, setIsGlobalCaptureOpen] = useState(false);

  const steps = [
    {
      id: "airbnb",
      title: "Our Quiet Escape",
      time: "2:00 PM",
      description: "Just you, me, and the start of a perfect day.",
      tag: "airbnb-stay",
    },
    {
      id: "moa",
      title: "Afternoon Stroll",
      time: "4:30 PM",
      description: "Walking hand in hand through the mall, feeling the cool air, window shopping, and just enjoying each other's presence.",
      tag: "moa",
    },
    {
      id: "ferris-wheel",
      title: "Above the World",
      time: "5:30 PM",
      description: "Riding the Ferris Wheel just as the sun begins to set. Golden hour lighting up your face—the best view I could ever ask for.",
      tag: "ferris-wheel",
    },
    {
      id: "dinner",
      title: "A Night to Remember",
      time: "7:00 PM",
      description: "A lovely dinner together. Delicious food, deep conversations, and maybe a little secret message waiting for you.",
      tag: "dinner",
    },
    {
      id: "baywalk",
      title: "Waves & Whispers",
      time: "9:00 PM",
      description: "Walking along the Bay Walk.",
      tag: "baywalk",
    },
    {
      id: "midnight",
      title: "Midnight Dance",
      time: "11:30 PM",
      description: "Just us, under the stars, swaying to our own rhythm. A perfect close to our perfect anniversary day.",
      tag: "midnight-dance",
    }
  ];

  return (
    <div className="pb-32 bg-black">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-zinc-950 opacity-80" />

        {/* Floating Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-zinc-700/20 backdrop-blur-md"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="relative z-10 text-center px-4 flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 1.5 }}
          >
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-6xl md:text-8xl font-serif text-white mb-6 drop-shadow-sm"
          >
            Date proposal
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-xl md:text-2xl text-zinc-400 font-light max-w-2xl text-center"
          >
            A Day to remember, made for you to fill our memories together
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-12 animate-bounce"
          >
            <div className="text-zinc-500 text-sm tracking-widest uppercase flex flex-col items-center font-medium">
              <span>Scroll to Begin</span>
              <div className="w-px h-12 bg-zinc-500 mt-4" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="max-w-6xl mx-auto py-20 relative bg-black">
        {steps.map((step, index) => (
          <StorySection key={step.id} index={index} {...step} />
        ))}

        {/* The End / Next Step indicator */}
        <div className="mt-20 text-center flex flex-col items-center">
          <Heart className="w-12 h-12 text-zinc-600 mb-8 animate-pulse" />
          <p className="text-zinc-500 text-lg mb-8 italic">Every great story deserves a proper compilation...</p>
          <Link href="/slideshow">
            <button className="px-8 py-4 bg-zinc-900 text-zinc-200 rounded-full font-serif text-xl hover:bg-zinc-800 transition-colors shadow-2xl flex items-center gap-3 border border-zinc-800">
              Watch Our Slideshow <Sparkles className="w-5 h-5 opacity-50" />
            </button>
          </Link>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-4">
        <Link href="/memories">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-zinc-900/80 backdrop-blur border border-zinc-800 text-zinc-300 rounded-full flex items-center justify-center shadow-lg hover:bg-zinc-800 transition-colors"
            title="Our Memories"
          >
            <ImageIcon className="w-6 h-6" />
          </motion.button>
        </Link>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsGlobalCaptureOpen(true)}
          className="w-16 h-16 bg-zinc-800 text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-zinc-700 transition-colors border border-zinc-700"
          title="Capture Moment"
        >
          <Camera className="w-7 h-7" />
        </motion.button>
      </div>

      <CaptureModal isOpen={isGlobalCaptureOpen} onClose={() => setIsGlobalCaptureOpen(false)} tag="random" />
    </div>
  );
}
