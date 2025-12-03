
import React, { useState } from 'react';
import { Category } from '../types';
import { X, Sparkles, Loader2, MapPin, Zap, EyeOff, Shield } from 'lucide-react';
import { generateEnhancedPost } from '../services/geminiService';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialCategory?: Category;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit, initialCategory = Category.EVENT }) => {
  const [activeCategory, setActiveCategory] = useState<Category>(initialCategory);
  const [text, setText] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [blurLocation, setBlurLocation] = useState(false);
  const [isBoosted, setIsBoosted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Bounty Specific
  const [difficulty, setDifficulty] = useState(50);

  const handleSubmit = async () => {
    if (!text) return;
    
    // Optional AI enhancement logic hook
    // setLoading(true);
    // const enhanced = await generateEnhancedPost(text, activeCategory);
    
    onSubmit({
        category: activeCategory,
        title: activeCategory === Category.SECRET ? 'Secret Signal' : 'New Post', // Ideally generated
        description: text,
        location: blurLocation ? 'Location Hidden' : location,
        isLocationPrivate: blurLocation,
        price,
        isBoosted,
        tags: [activeCategory],
        isAnonymous: activeCategory === Category.SECRET,
        difficulty: activeCategory === Category.BOUNTY ? difficulty : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/20">
            <h2 className="text-white font-bold text-lg">New Signal</h2>
            <button onClick={onClose}><X className="text-zinc-500 hover:text-white" /></button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 gap-2 bg-zinc-950">
             {Object.values(Category).map(cat => (
                 <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeCategory === cat ? 'bg-violet-600 text-white' : 'text-zinc-500 hover:bg-zinc-800'}`}
                 >
                     {cat}
                 </button>
             ))}
        </div>

        <div className="p-6 space-y-5">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={activeCategory === Category.SECRET ? "Confess safely..." : "Describe your plan..."}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-white h-32 focus:ring-2 focus:ring-violet-600 outline-none resize-none"
            />

            {activeCategory !== Category.SECRET && (
                <div className="space-y-3">
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                        <input 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Location"
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 pl-10 text-white focus:border-violet-600 outline-none"
                        />
                    </div>
                    
                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center text-xs text-zinc-400 cursor-pointer">
                            <input type="checkbox" checked={blurLocation} onChange={(e) => setBlurLocation(e.target.checked)} className="mr-2" />
                            <EyeOff className="w-3 h-3 mr-1" /> Blur Location Map
                        </label>
                    </div>

                    {(activeCategory === Category.TASK || activeCategory === Category.BOUNTY) && (
                        <input 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={activeCategory === Category.BOUNTY ? "Reward Amount" : "Price / Payment"}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl py-3 px-4 text-white focus:border-violet-600 outline-none"
                        />
                    )}

                    {activeCategory === Category.BOUNTY && (
                        <div>
                            <div className="flex justify-between text-xs text-zinc-500 mb-2 uppercase font-bold">
                                <span>Risk Level</span>
                                <span>{difficulty}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(Number(e.target.value))}
                                className="w-full accent-violet-600"
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Monetization / Boost */}
            <div className="bg-violet-900/10 border border-violet-500/20 p-3 rounded-xl flex items-center justify-between">
                <div className="flex items-center text-violet-300 text-xs font-bold">
                    <Zap className="w-4 h-4 mr-2" /> Boost Signal (2x Reach)
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={isBoosted} onChange={(e) => setIsBoosted(e.target.checked)} className="sr-only peer" />
                    <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
            </div>

            <button 
                onClick={handleSubmit}
                disabled={!text}
                className="w-full py-4 bg-white text-black font-black text-lg rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
                POST SIGNAL
            </button>
        </div>
      </div>
    </div>
  );
};
