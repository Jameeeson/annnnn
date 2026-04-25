'use client';

import { motion } from 'framer-motion';
import { Camera, Heart } from 'lucide-react';
import { useState } from 'react';
import { CaptureModal } from '@/components/capture/CaptureModal';

interface StorySectionProps {
  id: string;
  title: string;
  time: string;
  description: string;
  tag: string;
  index: number;
}

export function StorySection({ title, time, description, tag, index }: StorySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isEven = index % 2 === 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative flex flex-col md:flex-row items-center justify-between gap-8 py-16 px-4 md:px-12 w-full ${isEven ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Center Line for timeline */}
      <div className="absolute left-1/2 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 -translate-x-1/2 hidden md:block" />
      
      {/* Node */}
      <div className="absolute left-1/2 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-100 border-4 border-zinc-900 shadow-[0_0_15px_rgba(255,255,255,0.2)] z-10 hidden md:block" />

      <div className="w-full md:w-[45%] flex flex-col space-y-4">
        <div className="inline-block px-4 py-1 rounded-full bg-zinc-900/80 text-zinc-400 text-sm font-semibold tracking-widest w-fit shadow-sm border border-zinc-800 backdrop-blur-sm">
          {time}
        </div>
        <h3 className="text-4xl md:text-5xl font-serif text-zinc-100 leading-tight">
          {title}
        </h3>
        <p className="text-lg text-zinc-500 font-light leading-relaxed">
          {description}
        </p>
        
        <div className="pt-6">
           <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-zinc-100 text-black font-medium shadow-xl shadow-white/5 hover:bg-zinc-200 transition-colors"
          >
            <Camera className="w-5 h-5" />
            Capture this moment <Heart className="w-4 h-4 ml-1 fill-black/20" />
          </motion.button>
        </div>
      </div>

      <div className="w-full md:w-[45%] hidden md:flex items-center justify-center">
         {/* Decorative element or illustration placeholder */}
         <div className="relative w-64 h-64 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center opacity-30">
            <Heart className="w-24 h-24 text-zinc-600" />
            <div className="absolute inset-0 bg-zinc-700/10 blur-3xl rounded-full" />
         </div>
      </div>

      <CaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} tag={tag} />
    </motion.div>
  );
}
