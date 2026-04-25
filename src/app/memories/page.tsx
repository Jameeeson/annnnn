'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Memory {
  _id: string;
  imageUrl: string;
  caption: string;
  tag: string;
  createdAt: string;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      const data = await res.json();
      if (data.success) {
        setMemories(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteMemory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this memory?')) return;
    try {
      await fetch(`/api/memories/${id}`, { method: 'DELETE' });
      setMemories((prev) => prev.filter((m) => m._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] p-6 py-12 md:p-12 relative overflow-hidden">
      {/* Texture background */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-12">
          <Link href="/">
            <button className="p-3 bg-zinc-900/80 hover:bg-zinc-800 rounded-full shadow-sm border border-zinc-800 transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-300" />
            </button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-zinc-100 text-center flex-1">
            Our Polaroid Board
          </h1>
          <div className="w-11" /> {/* Spacer */}
        </div>

        {memories.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-xl font-serif italic">No memories captured yet. Go back and capture some moments!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {memories.map((memory, i) => (
              <motion.div
                key={memory._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="polaroid relative group flex flex-col shadow-2xl"
                style={{ '--random': Math.random() } as React.CSSProperties}
              >
                <div className="aspect-[3/4] w-full bg-black overflow-hidden mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={memory.imageUrl} alt={memory.caption} className="w-full h-full object-cover" />
                </div>
                
                <p className="font-serif text-black text-center text-lg flex-1 leading-tight px-2 break-words">
                  {memory.caption}
                </p>
                <div className="mt-2 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-sans">
                    {new Date(memory.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => deleteMemory(memory._id)} className="p-2 bg-red-950/80 hover:bg-red-900 text-red-100 rounded-full backdrop-blur-sm shadow-sm transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
