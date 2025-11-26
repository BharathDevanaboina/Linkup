
import React, { useState } from 'react';
import { Category } from '../types';
import { X, Sparkles, Loader2, Ghost, Trophy, EyeOff } from 'lucide-react';
import { generateEnhancedPost } from '../services/geminiService';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialTab?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit, initialTab }) => {
  const [category, setCategory] = useState<Category>(Category.SOCIAL);
  const [rawText, setRawText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(initialTab === 'Anonymous');
  const [isLocationPrivate, setIsLocationPrivate] = useState(false);
  const [reward, setReward] = useState('');
  const [generatedData, setGeneratedData] = useState<{ title: string; description: string; tags: string[] } | null>(null);

  const handleAIMagic = async () => {
    if (!rawText.trim()) return;
    setIsGenerating(true);
    const result = await generateEnhancedPost(rawText, category);
    setGeneratedData(result);
    setIsGenerating(false);
  };

  const handleFinalSubmit = () => {
    const postData = generatedData || {
        title: isAnonymous ? 'Anonymous Request' : 'New Request',
        description: rawText,
        tags: [category, isAnonymous ? 'Anonymous' : 'New']
    };

    onSubmit({
        category: isAnonymous ? Category.ANONYMOUS : category,
        ...postData,
        location: isLocationPrivate ? 'Hidden Location' : 'City Center (Mock)',
        price: 'Negotiable',
        reward: reward || undefined,
        isAnonymous,
        isLocationPrivate
    });
    
    onClose();
  };

  // Helper to determine if we are in "Dark Mode" based on parent app classes is tricky with portals/modals
  // so we'll just style the modal to be consistent with the "Dark" vibe for anonymous and "Light/Neutral" for normal.
  // Actually, standardizing on a dark modal for "Create" looks cool in both modes, but let's try to be adaptive if possible.
  // For simplicity and aesthetic consistency in this prototype, the modal will use a dark glass theme which works on both.

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#18181b] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up border border-white/10 relative">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white flex items-center tracking-tight">
            {isAnonymous ? <Ghost className="w-5 h-5 mr-3 text-pink-500" /> : <Sparkles className="w-5 h-5 mr-3 text-violet-500" />}
            {isAnonymous ? 'Create Secret Signal' : 'New LinkUp'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Privacy Toggle */}
          <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-white/5">
            <div className="flex items-center">
               <div className={`p-2.5 rounded-full mr-3 ${isAnonymous ? 'bg-pink-500/20 text-pink-400' : 'bg-zinc-800 text-zinc-500'}`}>
                   <Ghost className="w-5 h-5" />
               </div>
               <div>
                   <p className="text-sm font-bold text-white">Post Anonymously</p>
                   <p className="text-[10px] text-zinc-500 uppercase tracking-wide">Identity Hidden</p>
               </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="sr-only peer" />
              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as Category)}
                  disabled={isAnonymous}
                  className="w-full border border-zinc-700 rounded-xl p-3 bg-zinc-900 text-white focus:ring-2 focus:ring-violet-500 outline-none disabled:opacity-50 disabled:bg-zinc-800"
                >
                  {Object.values(Category).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              {/* Reward Field */}
              {(category === Category.CHALLENGE || category === Category.ANONYMOUS) && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 flex items-center">
                        <Trophy className="w-3 h-3 mr-1 text-yellow-500" /> Reward
                    </label>
                    <input 
                      type="text" 
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="e.g. 100 Rs"
                      className="w-full border border-zinc-700 rounded-xl p-3 bg-zinc-900 text-white focus:ring-2 focus:ring-violet-500 outline-none placeholder-zinc-600"
                    />
                  </div>
              )}
          </div>

            {/* Private Location Toggle */}
            <div className="flex items-center mb-2">
                <input 
                    type="checkbox" 
                    id="privateLocation"
                    checked={isLocationPrivate}
                    onChange={(e) => setIsLocationPrivate(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-600 text-violet-600 focus:ring-violet-500 bg-zinc-800"
                />
                <label htmlFor="privateLocation" className="ml-2 text-sm text-zinc-300 flex items-center cursor-pointer">
                    <EyeOff className="w-4 h-4 mr-2 text-zinc-400" />
                    Hide Location (Share privately in chat)
                </label>
            </div>


          {!generatedData ? (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Details</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={isAnonymous ? "Share your secret signal..." : "Describe the event. Be specific..."}
                className="w-full border border-zinc-700 rounded-xl p-4 bg-zinc-900 text-white h-32 resize-none focus:ring-2 focus:ring-violet-500 outline-none placeholder-zinc-600"
              />
              <button
                onClick={handleAIMagic}
                disabled={isGenerating || !rawText.trim()}
                className="mt-4 w-full flex items-center justify-center py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)]"
              >
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> ENHANCING SIGNAL...</>
                ) : (
                  <><Sparkles className="w-5 h-5 mr-2" /> AI ENHANCE</>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in bg-zinc-900/50 p-4 rounded-xl border border-white/5">
              <div>
                <label className="text-[10px] font-bold text-violet-400 uppercase">Enhanced Title</label>
                <input 
                  type="text" 
                  value={generatedData.title}
                  onChange={(e) => setGeneratedData({...generatedData, title: e.target.value})}
                  className="w-full font-bold text-lg text-white bg-transparent border-b border-zinc-700 focus:outline-none focus:border-violet-500 py-1"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-violet-400 uppercase">Description</label>
                <textarea 
                  value={generatedData.description}
                  onChange={(e) => setGeneratedData({...generatedData, description: e.target.value})}
                  className="w-full text-zinc-300 text-sm border-zinc-700 rounded p-2 bg-zinc-800/50 focus:bg-zinc-800 focus:ring-1 focus:ring-violet-500 h-24 mt-1"
                />
              </div>
              <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setGeneratedData(null)}
                    className="flex-1 py-3 text-zinc-400 font-bold hover:bg-white/5 rounded-xl transition-colors"
                  >
                    BACK
                  </button>
                  <button 
                    onClick={handleFinalSubmit}
                    className="flex-1 py-3 bg-white text-black font-black rounded-xl hover:bg-zinc-200 shadow-lg"
                  >
                    POST
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
