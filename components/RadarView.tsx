
import React, { useEffect, useState } from 'react';
import { Post, Category } from '../types';
import { Ghost, Trophy, User, MapPin, Zap } from 'lucide-react';

interface RadarViewProps {
  posts: Post[];
  onPostSelect: (post: Post) => void;
}

export const RadarView: React.FC<RadarViewProps> = ({ posts, onPostSelect }) => {
  const [blips, setBlips] = useState<any[]>([]);

  // Generate random positions for blips on the radar
  useEffect(() => {
    const newBlips = posts.map(post => ({
      ...post,
      top: 10 + Math.random() * 80, // 10% to 90%
      left: 10 + Math.random() * 80, // 10% to 90%
      delay: Math.random() * 2 // Random animation delay
    }));
    setBlips(newBlips);
  }, [posts]);

  return (
    <div className="relative w-full h-[60vh] bg-black overflow-hidden rounded-3xl border-2 border-zinc-800 shadow-[0_0_30px_rgba(34,197,94,0.1)] mx-auto max-w-3xl mt-4">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-20"
        style={{
            backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
        }}
      ></div>

      {/* Radar Sweep Animation */}
      <div className="absolute inset-0 z-0 animate-[spin_4s_linear_infinite] origin-bottom-right">
         <div className="w-full h-full bg-gradient-to-t from-green-500/20 to-transparent border-r border-green-500/50 blur-sm transform origin-bottom-right rotate-45"></div>
      </div>
      
      {/* Center User */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_15px_#22c55e] animate-pulse"></div>
          <div className="w-32 h-32 border border-green-500/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"></div>
      </div>

      {/* Blips */}
      {blips.map((blip) => {
          let Icon = User;
          let color = "text-green-400";
          let bg = "bg-green-500";
          
          if (blip.isAnonymous) {
              Icon = Ghost;
              color = "text-pink-400";
              bg = "bg-pink-500";
          } else if (blip.category === Category.BOUNTY) {
              Icon = Trophy;
              color = "text-yellow-400";
              bg = "bg-yellow-500";
          } else if (blip.expiresAt) {
              Icon = Zap;
              color = "text-red-400";
              bg = "bg-red-500";
          }

          return (
            <button
                key={blip.id}
                onClick={() => onPostSelect(blip)}
                className="absolute z-30 group"
                style={{ top: `${blip.top}%`, left: `${blip.left}%`, animationDelay: `${blip.delay}s` }}
            >
                {/* Ping Effect */}
                <div className={`absolute -inset-4 rounded-full opacity-0 group-hover:opacity-20 animate-ping ${bg}`}></div>
                
                {/* Icon */}
                <div className={`relative p-2.5 rounded-full bg-black border border-zinc-700 hover:scale-125 transition-transform hover:border-white shadow-lg ${color}`}>
                    <Icon className="w-4 h-4" />
                    {blip.expiresAt && <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>}
                </div>

                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-48 bg-black/80 text-white text-xs p-3 rounded-lg border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40 backdrop-blur-md shadow-xl">
                    <p className="font-bold truncate text-green-400 mb-1 tracking-wide">{blip.title}</p>
                    <div className="flex items-center text-zinc-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{blip.location}</span>
                    </div>
                </div>
            </button>
          );
      })}

      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-40 bg-black/40 backdrop-blur px-3 py-1 border border-green-500/30 rounded text-green-400 text-[10px] font-mono tracking-widest">
          SCANNING SECTOR... {blips.length} SIGNALS
      </div>
    </div>
  );
};
