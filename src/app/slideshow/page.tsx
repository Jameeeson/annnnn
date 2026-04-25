'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Memory {
  _id: string;
  imageUrl: string;
  caption: string;
}

// EDIT YOUR LOVE LETTER HERE!
// You can change the greeting, add/remove paragraphs, and sign your name easily.
const LOVE_LETTER = {
  salutation: "My Darling,",
  paragraphs: [
    "Today was extra beautiful because of you. From the moment we arrived at the Airbnb, to the quiet walks, the glowing Ferris wheel, and finally ending the night just swaying together.",
    "I wanted to capture these moments not just in our minds, but somewhere we can always look back on. This day is a reminder of how lucky I am to have you by my side.",
    "Thank you for this beautiful day, and for all the days yet to come."
  ],
  signOff: "Forever yours,",
  signature: "Matatahe"
};

export default function SlideshowPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLetter, setShowLetter] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await fetch('/api/memories');
        const data = await res.json();
        if (data.success) {
          // Sort oldest to newest for the story flow
          let dbMemories = data.data.reverse();

          // Pre-defined throwbacks that you want to show at the end of the slideshow!
          // You just need to place images named 'throwback1.jpg', 'throwback2.jpg', etc., inside your `public` folder!
          const throwbacks = [
            { _id: 't-1', imageUrl: '/throwback1.jpg', caption: 'Where it all started...' },
            { _id: 't-2', imageUrl: '/throwback2.jpg', caption: 'One of my favorite smiles of yours.' },
            { _id: 't-3', imageUrl: '/throwback3.jpg', caption: 'That time we were just so perfectly happy.' },
            { _id: 't-4', imageUrl: '/throwback4.jpg', caption: 'My first flowers to you, I hope you always remember that feeling' },
            { _id: 't-5', imageUrl: '/throwback5.jpg', caption: 'First roadtrip na walang kwenta, makasama ka lang..' },
            { _id: 't-6', imageUrl: '/throwback6.jpg', caption: 'First actual fight na magkasama, But one of the best night also!' },
            { _id: 't-7', imageUrl: '/throwback7.jpg', caption: 'Just quality time together...' },
            { _id: 't-8', imageUrl: '/throwback8.jpg', caption: 'Naglampungan sa but first...' },
            { _id: 't-9', imageUrl: '/throwback9.jpg', caption: 'Our first getaway date...' },
            { _id: 't-10', imageUrl: '/throwback10.jpg', caption: 'To many more memories like these...' },
          ];

          setMemories([...dbMemories, ...throwbacks]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMemories();
  }, []);

  useEffect(() => {
    if (memories.length > 0 && !showLetter) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === memories.length - 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setTimeout(() => setShowLetter(true), 3000); // Wait 3s on last slide then show letter
            return prev;
          }
          return prev + 1;
        });
      }, 5000); // 5 seconds per slide
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [memories, showLetter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400 flex-col gap-6">
        <p className="font-serif text-2xl">We need to make some memories first.</p>
        <Link href="/">
          <span className="text-zinc-300 hover:text-white underline underline-offset-4">Go back to the timeline</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative font-serif">
      <AnimatePresence mode="wait">
        {!showLetter ? (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center bg-black"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={memories[currentIndex].imageUrl}
              alt="Memory"
              className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm"
            />
            <div className="relative z-10 flex flex-col items-center max-w-4xl px-4">
              <div className="polaroid -rotate-2 scale-110 md:scale-125 mb-12 shadow-2xl shadow-black/80">
                <div className="w-64 h-80 md:w-80 md:h-[400px] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={memories[currentIndex].imageUrl} alt="Memory" className="w-full h-full object-cover" />
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-white text-2xl md:text-4xl text-center max-w-2xl drop-shadow-md leading-relaxed"
              >
                "{memories[currentIndex].caption}"
              </motion.p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="love-letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="min-h-screen w-full flex items-center justify-center p-4 bg-black relative overflow-y-auto"
          >
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ delay: 1, duration: 2 }}
              className="bg-[#fdfbf7] p-8 md:p-16 max-w-2xl w-full rounded-sm shadow-[0_0_50px_rgba(255,255,255,0.05)] relative mt-32 mb-32 text-zinc-950"
            >
              <p className="text-xl md:text-2xl leading-loose mb-8">
                {LOVE_LETTER.salutation}
              </p>

              {LOVE_LETTER.paragraphs.map((text, i) => (
                <p key={i} className="text-lg md:text-xl leading-loose mb-8">
                  {text}
                </p>
              ))}

              <div className="mt-8">
                <p className="text-xl md:text-2xl leading-loose mb-2">
                  {LOVE_LETTER.signOff}
                </p>
                <p className="text-2xl font-bold signature-font">
                  {LOVE_LETTER.signature}
                </p>
              </div>

              <div className="absolute -bottom-6 right-8">
                <Heart className="text-zinc-800 w-12 h-12 fill-zinc-800" />
              </div>
            </motion.div>

            <div className="fixed top-8 left-8 z-50">
              <Link href="/">
                <button className="text-zinc-400 hover:text-white uppercase tracking-widest text-sm flex items-center gap-2 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
