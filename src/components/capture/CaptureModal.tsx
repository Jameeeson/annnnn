'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Upload, X, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface CaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: string; // e.g., 'ferris-wheel', 'dinner'
}

export function CaptureModal({ isOpen, onClose, tag = 'general' }: CaptureModalProps) {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'select' | 'camera' | 'preview'>('select');

  const webcamRef = useRef<Webcam>(null);

  const captureCamera = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      setMode('preview');
    }
  }, [webcamRef]);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new globalThis.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          const MAX_SIZE = 800;

          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressedBase64 = await compressImage(file);
      setImage(compressedBase64);
      setMode('preview');
    }
  };

  const saveMemory = async () => {
    if (!image || !caption.trim()) return;

    setIsUploading(true);
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: image,
          caption: caption.trim(),
          tag,
        }),
      });

      if (res.ok) {
        // Assume success, clear and close
        setImage(null);
        setCaption('');
        setMode('select');
        onClose();
      } else {
        console.error('Failed to save memory');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      setImage(null);
      setCaption('');
      setMode('select');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.05)] overflow-hidden border border-zinc-800"
          >
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/50">
              <h2 className="text-xl font-serif text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-zinc-400" />
                Capture Memory
              </h2>
              <button onClick={handleClose} disabled={isUploading} className="text-zinc-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {mode === 'select' && (
                <div className="flex flex-col gap-4">
                  <Button variant="default" className="w-full flex gap-3 h-16 bg-white text-black hover:bg-zinc-200" onClick={() => setMode('camera')}>
                    <Camera className="w-6 h-6" />
                    Take a Photo
                  </Button>
                  
                  <div className="relative border-2 border-dashed border-zinc-800 rounded-2xl p-8 hover:bg-zinc-900 transition-colors text-center cursor-pointer text-zinc-400 flex flex-col items-center gap-3">
                    <Upload className="w-8 h-8 opacity-50" />
                    <span className="font-medium">Upload from gallery</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {mode === 'camera' && (
                <div className="flex flex-col gap-4">
                  <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4] border border-zinc-800">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="object-cover w-full h-full"
                      videoConstraints={{ facingMode: "environment" }}
                    />
                  </div>
                  <div className="flex justify-between gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => setMode('select')}>Back</Button>
                    <Button variant="default" className="flex-1 bg-white text-black hover:bg-zinc-200" onClick={captureCamera}>Snap</Button>
                  </div>
                </div>
              )}

              {mode === 'preview' && image && (
                <div className="flex flex-col gap-5">
                  <div className="relative rounded-xl overflow-hidden bg-black aspect-[3/4] shadow-md border border-zinc-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Preview" className="object-cover w-full h-full" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button variant="glass" size="icon" onClick={() => setMode('select')} className="w-10 h-10 bg-black/80">
                        <X className="w-5 h-5 text-white" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-zinc-400 ml-1">Write your heart out...</label>
                    <textarea 
                      placeholder="What makes this moment special?"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full resize-none rounded-2xl border-zinc-800 border bg-zinc-900 p-4 text-white focus:outline-none focus:ring-2 focus:ring-zinc-600 placeholder:text-zinc-600 shadow-inner"
                      rows={3}
                    />
                  </div>

                  <Button 
                    variant="default" 
                    className="w-full h-14 text-lg mt-2 bg-white text-black hover:bg-zinc-200" 
                    onClick={saveMemory}
                    disabled={isUploading || !caption.trim()}
                  >
                    {isUploading ? (
                      <><Loader2 className="animate-spin w-5 h-5 mr-2" /> Saving Memory...</>
                    ) : (
                      'Save Forever'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
