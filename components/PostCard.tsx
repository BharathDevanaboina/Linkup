

import React, { useState, useEffect } from 'react';
import { Post, Category } from '../types';
import { MapPin, Users, MessageCircle, Clock, MoreHorizontal, Ghost, Lock, Timer, Zap } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface PostCardProps {
  post: Post;
  onChat: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onChat }) => {
  const isAnonymous = post.isAnonymous;
  const isLocked = post.minRating ? CURRENT_USER.rating < post.minRating : false;
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!post.expiresAt) return;
    const interval = setInterval(() => {
      const diff = (post.expiresAt || 0) - Date.now();
      if (diff <= 0) setTimeLeft('00:00');
      else {
        const mins = Math.floor((diff / 1000) / 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [post.expiresAt]);
  
  return (
    <div className={`p-4 border-b border-zinc-800 hover:bg-zinc-900/40 transition-colors cursor-pointer relative group ${isLocked ? 'opacity-50' : ''}`}>
        
        {/* Header (User Info) */}
        <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
                {isAnonymous ? (
                    <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center mr-3 border border-zinc-700">
                        <Ghost className="w-4 h-4 text-pink-500" />
                    </div>
                ) : (
                    <img src={post.user.avatar} className="w-9 h-9 rounded-full mr-3 object-cover border border-zinc-800" alt="" />
                )}
                
                <div>
                    <div className="flex items-center">
                        <span className={`font-bold text-sm mr-2 ${isAnonymous ? 'text-pink-400' : 'text-white'}`}>
                            {isAnonymous ? 'Anonymous' : post.user.name}
                        </span>
                        {!isAnonymous && <span className="text-zinc-500 text-xs">@{post.user.name.toLowerCase().replace(' ', '')}</span>}
                    </div>
                    <div className="flex items-center text-[10px] text-zinc-500 uppercase tracking-wide">
                         <span>{post.category}</span>
                         <span className="mx-1">•</span>
                        <span>{post.timestamp}</span>
                    </div>
                </div>
            </div>
            
            <button className="text-zinc-500 hover:bg-zinc-800 p-1.5 rounded-full transition-colors">
                <MoreHorizontal className="w-4 h-4" />
            </button>
        </div>

        {/* Content Body */}
        <div className="pl-[48px]">
            <h3 className="text-base font-bold text-zinc-100 mb-1 leading-tight">{post.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3 line-clamp-3">{post.description}</p>

            {/* Badges / Stats */}
            <div className="flex flex-wrap gap-2 mb-3">
                {post.reward && (
                    <div className="flex items-center px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500">
                        <Zap className="w-3 h-3 mr-1" />
                        <span className="text-xs font-bold">{post.reward}</span>
                    </div>
                )}
                {post.expiresAt && (
                    <div className="flex items-center px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-red-500 animate-pulse">
                        <Timer className="w-3 h-3 mr-1" />
                        <span className="text-xs font-bold">{timeLeft}</span>
                    </div>
                )}
                {post.location && (
                    <div className="flex items-center text-zinc-500 text-xs">
                         <MapPin className="w-3 h-3 mr-1" />
                         {post.isLocationPrivate ? 'Secret Location' : post.location}
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/50 max-w-sm">
                 <button onClick={onChat} className="flex items-center group text-zinc-500 hover:text-white transition-colors">
                     <MessageCircle className="w-4 h-4 mr-1.5" />
                     <span className="text-xs font-medium">{post.attendees > 0 ? post.attendees : 'Reply'}</span>
                 </button>
                 
                 <div className="flex items-center group text-zinc-500 hover:text-green-500 transition-colors">
                     <Users className="w-4 h-4 mr-1.5" />
                     <span className="text-xs font-medium">Join</span>
                 </div>
                 
                 {isLocked && (
                     <div className="flex items-center text-red-500">
                         <Lock className="w-3 h-3 mr-1" />
                         <span className="text-[10px] font-bold">LOCKED ({post.minRating}+)</span>
                     </div>
                 )}
            </div>
        </div>
    </div>
  );
};