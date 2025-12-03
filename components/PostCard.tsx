
import React from 'react';
import { Post, Category } from '../types';
import { MapPin, MessageCircle, MoreHorizontal, Ghost, Lock, Timer, Trophy, AlertTriangle, EyeOff } from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { RiskMeter } from './RiskMeter';
import { CURRENT_USER } from '../constants';

interface PostCardProps {
  post: Post;
  onChat: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onChat }) => {
  const isAnon = post.isAnonymous;
  const isLocked = post.minRating ? CURRENT_USER.rating < post.minRating : false;

  return (
    <div className={`bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 mb-4 hover:border-zinc-700 transition-all ${post.isBoosted ? 'shadow-[0_0_20px_rgba(106,76,255,0.1)] border-violet-500/20' : ''}`}>
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                {isAnon ? (
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <Ghost className="w-5 h-5 text-pink-500" />
                    </div>
                ) : (
                    <div className="relative">
                        <img src={post.user.avatar} className="w-10 h-10 rounded-full object-cover bg-zinc-800" alt="" />
                        {post.user.isVerified && <div className="absolute -bottom-1 -right-1"><VerifiedBadge /></div>}
                    </div>
                )}
                
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`font-bold text-sm ${isAnon ? 'text-pink-500' : 'text-white'}`}>
                            {isAnon ? 'Anonymous' : post.user.name}
                        </span>
                        {post.isBoosted && <span className="text-[10px] bg-violet-600/20 text-violet-400 px-1.5 rounded font-bold">PROMOTED</span>}
                    </div>
                    <div className="flex items-center text-zinc-500 text-xs mt-0.5 gap-2">
                        <span>{post.timestamp}</span>
                        {post.location && (
                            <span className="flex items-center">
                                {post.isLocationPrivate ? <EyeOff className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                                {post.isLocationPrivate ? 'Location Blurred' : post.location}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            
            <button className="text-zinc-600 hover:text-white">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </div>

        {/* Content */}
        <div className="mb-4">
            <h3 className="text-lg font-bold text-zinc-100 mb-2 leading-snug">{post.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{post.description}</p>
        </div>

        {/* Features / Stats */}
        <div className="space-y-3 mb-4">
            {post.category === Category.BOUNTY && post.difficulty && (
                <div>
                    <div className="flex justify-between text-xs text-zinc-500 uppercase font-bold mb-1">
                        <span>Risk Level</span>
                        <span>{post.difficulty}%</span>
                    </div>
                    <RiskMeter level={post.difficulty} />
                </div>
            )}
            
            <div className="flex flex-wrap gap-2">
                {post.category === Category.BOUNTY && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded-lg border border-yellow-500/20">
                        <Trophy className="w-3 h-3 mr-1.5" /> {post.reward || 'Bounty'}
                    </span>
                )}
                {post.price && (
                    <span className="inline-flex items-center px-2.5 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-lg border border-green-500/20">
                        {post.price}
                    </span>
                )}
                {post.tags.map((tag, i) => (
                    <span key={i} className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-xs rounded-lg border border-zinc-700">#{tag}</span>
                ))}
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-3 mt-2">
             <div className="flex gap-4">
                 <button onClick={onChat} className="flex items-center text-zinc-400 hover:text-white transition-colors text-sm font-medium">
                     <MessageCircle className="w-4 h-4 mr-2" />
                     {post.attendees > 0 ? `${post.attendees} Joined` : 'Join'}
                 </button>
                 <button className="flex items-center text-zinc-500 hover:text-red-400 transition-colors text-xs">
                     <AlertTriangle className="w-3 h-3 mr-1" /> Report
                 </button>
             </div>
             
             {isLocked && (
                 <div className="flex items-center text-zinc-500 text-xs font-bold">
                     <Lock className="w-3 h-3 mr-1.5" /> Verified Only
                 </div>
             )}
        </div>
    </div>
  );
};
