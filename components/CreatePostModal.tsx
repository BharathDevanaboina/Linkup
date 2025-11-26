
import React, { useState, useEffect } from 'react';
import { Category } from '../types';
import { X, Sparkles, Loader2, Ghost, Trophy, EyeOff, Skull, ChevronLeft, MapPin, Wand2 } from 'lucide-react';
import { generateEnhancedPost, generateAIImage, generateAIVideo } from '../services/geminiService';

interface CreatePostModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialTab?: 'EVENTS' | 'TASKS' | 'BOUNTY' | 'SECRET';
  initialCategory?: Category;
}

// Map Pillars to Categories
const PILLAR_CATEGORIES = {
    EVENTS: [Category.SOCIAL, Category.RIDE, Category.WELLNESS, Category.EVENT, Category.OTHERS],
    TASKS: [Category.SERVICE, Category.EDUCATION, Category.RENTAL, Category.COMPANION, Category.TASK_OTHER],
    BOUNTY: [Category.BOUNTY],
    SECRET: [Category.ANONYMOUS, Category.CHAT]
};

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onSubmit, initialTab = 'EVENTS', initialCategory }) => {
  // Determine initial pillar based on category or tab
  const getInitialPillar = () => {
      if (initialCategory === Category.BOUNTY) return 'BOUNTY';
      if (Object.values(PILLAR_CATEGORIES.EVENTS).includes(initialCategory as Category)) return 'EVENTS';
      if (Object.values(PILLAR_CATEGORIES.TASKS).includes(initialCategory as Category)) return 'TASKS';
      if (Object.values(PILLAR_CATEGORIES.SECRET).includes(initialCategory as Category)) return 'SECRET';
      return initialTab;
  };

  const [activePillar, setActivePillar] = useState<'EVENTS' | 'TASKS' | 'BOUNTY' | 'SECRET'>(getInitialPillar());
  
  // Default category for the active pillar
  const getDefaultCategory = (pillar: string) => {
      return PILLAR_CATEGORIES[pillar as keyof typeof PILLAR_CATEGORIES][0];
  };

  const [category, setCategory] = useState<Category>(initialCategory || getDefaultCategory(activePillar));
  
  // Update category when pillar changes
  useEffect(() => {
      if (!PILLAR_CATEGORIES[activePillar].includes(category)) {
          setCategory(getDefaultCategory(activePillar));
      }
  }, [activePillar]);

  const [rawText, setRawText] = useState('');
  const [location, setLocation] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLocationPrivate, setIsLocationPrivate] = useState(false);
  const [reward, setReward] = useState('');
  const [generatedData, setGeneratedData] = useState<{ title: string; description: string; tags: string[] } | null>(null);
  
  // Media Gen States
  const [mediaTab, setMediaTab] = useState<'NONE' | 'IMAGE' | 'VIDEO'>('NONE');
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [generatedMediaUrl, setGeneratedMediaUrl] = useState<string | null>(null);
  const [isGeneratingMedia, setIsGeneratingMedia] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('16:9');
  
  // Bounty Specific States
  const [difficulty, setDifficulty] = useState(50);
  const [isHighStakes, setIsHighStakes] = useState(false);

  const handleAIMagic = async () => {
    if (!rawText.trim()) return;
    setIsGenerating(true);
    const result = await generateEnhancedPost(rawText, category);
    setGeneratedData(result);
    setIsGenerating(false);
  };

  const handleMediaGen = async () => {
      if (!mediaPrompt) return;
      setIsGeneratingMedia(true);
      if (mediaTab === 'IMAGE') {
          const url = await generateAIImage(mediaPrompt, aspectRatio);
          if (url) setGeneratedMediaUrl(url);
      } else if (mediaTab === 'VIDEO') {
          const url = await generateAIVideo(mediaPrompt);
          if (url) setGeneratedMediaUrl(url);
      }
      setIsGeneratingMedia(false);
  };

  const handleFinalSubmit = () => {
    const isAnon = activePillar === 'SECRET';

    const postData = generatedData || {
        title: category === Category.BOUNTY 
               ? (isHighStakes ? 'High-Stakes Bounty' : 'Open Challenge') 
               : (isAnon ? 'Secret Signal' : 'New Request'),
        description: rawText || (category === Category.BOUNTY ? `Reward: ${reward}` : 'No description provided.'),
        tags: [category, isAnon ? 'Anonymous' : 'New']
    };

    onSubmit({
        category: category,
        ...postData,
        location: isLocationPrivate ? 'Hidden Location' : (location || 'City Center'),
        price: 'Negotiable',
        reward: reward || undefined,
        isAnonymous: isAnon || category === Category.ANONYMOUS,
        isLocationPrivate,
        difficulty: category === Category.BOUNTY ? difficulty : undefined,
        isHighStakes: category === Category.BOUNTY ? isHighStakes : undefined,
        mediaUrl: generatedMediaUrl
    });
    
    onClose();
  };

  // --- SPECIAL RENDER FOR BOUNTY ---
  if (activePillar === 'BOUNTY') {
      return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-md">
            <div className="bg-[#09090b] rounded-[2.5rem] w-full max-w-sm shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden border border-yellow-500/20 relative animate-fade-in-up">
                {/* Header */}
                <div className="p-6 pb-2 flex justify-between items-center">
                    <button onClick={() => setActivePillar('EVENTS')} className="p-2 -ml-2 text-zinc-400 hover:text-white flex items-center text-xs font-bold uppercase">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </button>
                    <h2 className="text-xl font-bold text-white tracking-widest uppercase">Bounty</h2>
                    <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-white"><X className="w-6 h-6" /></button>
                </div>

                <div className="p-6 space-y-6">
                    {/* High Value Input */}
                    <div className="text-center space-y-2">
                        <label className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Set Reward</label>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full group-hover:bg-yellow-500/30 transition-all"></div>
                            <div className="relative flex items-center justify-center bg-zinc-900/80 border border-yellow-500/30 rounded-2xl p-4 shadow-inner">
                                <span className="text-4xl font-black text-yellow-500 mr-2">$</span>
                                <input 
                                    type="text" 
                                    value={reward}
                                    onChange={(e) => setReward(e.target.value)}
                                    placeholder="50"
                                    className="w-full bg-transparent text-4xl font-black text-white focus:outline-none placeholder-zinc-700 text-center"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Difficulty Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            <span>Risk / Difficulty</span>
                            <span className="text-yellow-500">{difficulty}%</span>
                        </div>
                        <div className="relative h-12 flex items-center">
                            {/* Track */}
                            <div className="absolute w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-zinc-600 via-yellow-600 to-yellow-400" style={{ width: `${difficulty}%` }}></div>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(Number(e.target.value))}
                                className="absolute w-full h-12 opacity-0 cursor-pointer z-10"
                            />
                            <div 
                                className="absolute w-6 h-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] pointer-events-none transition-all"
                                style={{ left: `calc(${difficulty}% - 12px)` }}
                            ></div>
                        </div>
                    </div>

                    {/* Location Input (Bounty) */}
                    <div>
                         <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-3 focus-within:ring-2 focus-within:ring-yellow-500/50 transition-all">
                             <MapPin className="w-5 h-5 text-zinc-500 mr-2" />
                             <input 
                                 type="text" 
                                 value={location}
                                 onChange={(e) => setLocation(e.target.value)}
                                 placeholder="Location (e.g. City Gym)"
                                 className="w-full bg-transparent text-white outline-none placeholder-zinc-600 text-sm font-bold"
                             />
                         </div>
                    </div>

                    {/* High Stakes Toggle */}
                    <div className={`p-4 rounded-2xl border transition-all duration-300 ${isHighStakes ? 'bg-red-950/30 border-red-500/50 shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]' : 'bg-zinc-900 border-zinc-800'}`}>
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center">
                                 <div className={`p-2 rounded-full mr-3 ${isHighStakes ? 'bg-red-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
                                     <Skull className="w-5 h-5" />
                                 </div>
                                 <div className="text-left">
                                     <p className={`font-bold ${isHighStakes ? 'text-red-400' : 'text-zinc-400'}`}>High-Stakes</p>
                                     <p className="text-[10px] text-zinc-600">Verification Required</p>
                                 </div>
                             </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={isHighStakes} onChange={(e) => setIsHighStakes(e.target.checked)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                             </label>
                        </div>
                    </div>

                    {/* Description Short */}
                     <div>
                        <input 
                          type="text"
                          value={rawText}
                          onChange={(e) => setRawText(e.target.value)}
                          placeholder="What is the challenge?"
                          className="w-full bg-transparent border-b border-zinc-800 py-2 text-center text-zinc-300 focus:outline-none focus:border-yellow-500 placeholder-zinc-700"
                        />
                     </div>

                    <button 
                        onClick={handleFinalSubmit}
                        disabled={!reward || !rawText}
                        className={`w-full py-4 rounded-2xl font-black text-black text-lg transition-all shadow-lg ${isHighStakes ? 'bg-red-500 hover:bg-red-400 shadow-red-500/20' : 'bg-yellow-500 hover:bg-yellow-400 shadow-yellow-500/20'} disabled:opacity-50 disabled:grayscale`}
                    >
                        PUBLISH BOUNTY
                    </button>
                </div>
            </div>
        </div>
      )
  }

  // --- STANDARD RENDER FOR EVENTS, TASKS, SECRET ---
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
      <div className="bg-[#18181b] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-up border border-white/10 relative max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-xl font-bold text-white flex items-center tracking-tight">
            {activePillar === 'SECRET' ? <Ghost className="w-5 h-5 mr-3 text-pink-500" /> : <Sparkles className="w-5 h-5 mr-3 text-violet-500" />}
            New {activePillar === 'EVENTS' ? 'Event' : activePillar === 'TASKS' ? 'Task' : 'Secret'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pillar Switcher */}
        <div className="flex border-b border-white/5 bg-black/20">
             {(['EVENTS', 'TASKS', 'BOUNTY', 'SECRET'] as const).map(pillar => (
                 <button 
                    key={pillar}
                    onClick={() => setActivePillar(pillar)}
                    className={`flex-1 py-3 text-[10px] font-black tracking-widest uppercase transition-colors ${activePillar === pillar ? 'text-white bg-white/5' : 'text-zinc-600 hover:text-zinc-400'}`}
                 >
                     {pillar}
                 </button>
             ))}
        </div>

        <div className="p-6 space-y-5">
            {/* AI Media Studio Toggle */}
            <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg">
                <button onClick={() => setMediaTab('NONE')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${mediaTab === 'NONE' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-white'}`}>Text Only</button>
                <button onClick={() => setMediaTab('IMAGE')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${mediaTab === 'IMAGE' ? 'bg-violet-600 text-white shadow' : 'text-zinc-500 hover:text-white'}`}>AI Image</button>
                <button onClick={() => setMediaTab('VIDEO')} className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${mediaTab === 'VIDEO' ? 'bg-fuchsia-600 text-white shadow' : 'text-zinc-500 hover:text-white'}`}>Veo Video</button>
            </div>

            {mediaTab !== 'NONE' && (
                <div className="p-4 bg-zinc-900/50 rounded-xl border border-white/5 space-y-3">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase flex items-center">
                        <Wand2 className="w-3 h-3 mr-1" /> AI Media Studio
                    </h3>
                    
                    {mediaTab === 'IMAGE' && (
                        <div className="flex gap-2 mb-2">
                             {['16:9', '4:3', '1:1'].map(r => (
                                 <button key={r} onClick={() => setAspectRatio(r)} className={`px-2 py-1 text-[10px] rounded border ${aspectRatio === r ? 'bg-violet-500 border-violet-500 text-white' : 'border-zinc-700 text-zinc-500'}`}>{r}</button>
                             ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={mediaPrompt}
                            onChange={(e) => setMediaPrompt(e.target.value)}
                            placeholder={mediaTab === 'IMAGE' ? "Describe the image..." : "Describe the video..."}
                            className="flex-1 bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:border-violet-500 outline-none"
                        />
                        <button 
                            onClick={handleMediaGen}
                            disabled={isGeneratingMedia || !mediaPrompt}
                            className="px-3 py-2 bg-white text-black rounded-lg font-bold text-xs disabled:opacity-50"
                        >
                            {isGeneratingMedia ? <Loader2 className="w-4 h-4 animate-spin" /> : 'GO'}
                        </button>
                    </div>

                    {generatedMediaUrl && (
                        <div className="mt-2 rounded-lg overflow-hidden border border-zinc-700">
                            {mediaTab === 'IMAGE' ? (
                                <img src={generatedMediaUrl} alt="Generated" className="w-full h-32 object-cover" />
                            ) : (
                                <video src={generatedMediaUrl} autoPlay loop muted className="w-full h-32 object-cover" />
                            )}
                        </div>
                    )}
                </div>
            )}

          <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Sub-Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full border border-zinc-700 rounded-xl p-3 bg-zinc-900 text-white focus:ring-2 focus:ring-violet-500 outline-none"
                >
                  {PILLAR_CATEGORIES[activePillar].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

               {/* Location Input */}
               <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Location</label>
                  <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-zinc-500" />
                      <input 
                        type="text" 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={activePillar === 'SECRET' ? "Hidden by default..." : "Where is it happening?"}
                        disabled={isLocationPrivate}
                        className={`w-full border border-zinc-700 rounded-xl p-3 pl-10 bg-zinc-900 text-white focus:ring-2 focus:ring-violet-500 outline-none placeholder-zinc-600 ${isLocationPrivate ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                  </div>
                  
                  <div className="flex items-center mt-2">
                    <input 
                        type="checkbox" 
                        id="privateLocation"
                        checked={isLocationPrivate}
                        onChange={(e) => setIsLocationPrivate(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-600 text-violet-600 focus:ring-violet-500 bg-zinc-800"
                    />
                    <label htmlFor="privateLocation" className="ml-2 text-xs text-zinc-400 flex items-center cursor-pointer hover:text-white transition-colors">
                        <EyeOff className="w-3 h-3 mr-1.5" />
                        Hide Location (Share in chat only)
                    </label>
                  </div>
               </div>
              
              {(activePillar === 'TASKS' || activePillar === 'SECRET') && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 flex items-center">
                        <Trophy className="w-3 h-3 mr-1 text-yellow-500" /> Price / Reward
                    </label>
                    <input 
                      type="text" 
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder={activePillar === 'TASKS' ? "e.g. $20/hr" : "e.g. Free or Tip"}
                      className="w-full border border-zinc-700 rounded-xl p-3 bg-zinc-900 text-white focus:ring-2 focus:ring-violet-500 outline-none placeholder-zinc-600"
                    />
                  </div>
              )}
          </div>

          {!generatedData ? (
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase mb-2">Details</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={activePillar === 'SECRET' ? "Share your secret signal..." : "Describe it. Be specific..."}
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
