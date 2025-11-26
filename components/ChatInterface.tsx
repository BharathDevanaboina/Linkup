import React, { useState } from 'react';
import { User, Message } from '../types';
import { Send, Lock, Phone, MoreVertical, ChevronLeft, DollarSign, Star, MapPin } from 'lucide-react';
import { CURRENT_USER } from '../constants';

interface ChatInterfaceProps {
  participant: User;
  onBack: () => void;
  isPaidChat?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ participant, onBack, isPaidChat = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm0',
      senderId: 'system',
      text: 'Messages and calls are end-to-end encrypted. No one outside of this chat, not even LinkUp, can read or listen to them.',
      timestamp: new Date(Date.now() - 3600000),
      isSystem: true
    },
    {
      id: 'm1',
      senderId: participant.id,
      text: 'Hi! I saw your post. I am interested.',
      timestamp: new Date(Date.now() - 10000)
    }
  ]);
  const [input, setInput] = useState('');
  const [showRateModal, setShowRateModal] = useState(false);
  const [locationShared, setLocationShared] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: CURRENT_USER.id,
      text: input,
      timestamp: new Date()
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  const handleShareLocation = () => {
      const newMessage: Message = {
          id: Date.now().toString(),
          senderId: CURRENT_USER.id,
          text: '📍 SHARED PRIVATE LOCATION: 123 Neon Avenue, Apt 4B',
          timestamp: new Date(),
          type: 'location_share'
      };
      setMessages([...messages, newMessage]);
      setLocationShared(true);
  };

  const handleRateUser = (rating: number) => {
      // Logic to send rating to backend would go here
      const newMessage: Message = {
        id: Date.now().toString(),
        senderId: 'system',
        text: `You rated ${participant.name} ${rating} Stars.`,
        timestamp: new Date(),
        isSystem: true
      };
      setMessages([...messages, newMessage]);
      setShowRateModal(false);
  };

  return (
    <div className="flex flex-col h-full md:rounded-3xl md:shadow-2xl overflow-hidden border relative bg-white dark:bg-[#09090b] border-gray-200 dark:border-white/10">
      {/* Rate Modal */}
      {showRateModal && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
              <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Rate Interaction</h3>
                  <p className="text-zinc-400 text-sm mb-6">How was your experience with {participant.name}? This updates their public reputation.</p>
                  <div className="flex justify-center space-x-2 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} onClick={() => handleRateUser(star)} className="p-2 hover:scale-110 transition-transform">
                              <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                          </button>
                      ))}
                  </div>
                  <button onClick={() => setShowRateModal(false)} className="text-zinc-500 text-sm hover:text-white">Cancel</button>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="p-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-lg border-b bg-white/80 dark:bg-zinc-900/80 border-gray-100 dark:border-white/5">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-3 p-2 rounded-full transition-colors group hover:bg-black/5 dark:hover:bg-white/10">
            <ChevronLeft className="w-6 h-6 text-black dark:text-white group-hover:scale-110 transition-transform" />
          </button>
          <div className="relative">
            <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-zinc-800" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full animate-pulse"></span>
          </div>
          <div className="ml-3">
            <h3 className="font-bold text-sm flex items-center text-black dark:text-white">
              {participant.name}
              {isPaidChat && <span className="ml-2 px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 dark:text-yellow-400 text-[10px] rounded border border-yellow-500/30 font-bold">PAID</span>}
            </h3>
            <p className="text-[10px] text-zinc-500 font-mono flex items-center tracking-wider">
               <Lock className="w-2.5 h-2.5 mr-1" /> ENCRYPTED
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <button 
             onClick={() => setShowRateModal(true)}
             className="hidden md:flex items-center px-3 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 text-xs font-bold rounded-full border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors mr-2"
           >
               <Star className="w-3 h-3 mr-1" /> Rate User
           </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-zinc-400">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full text-zinc-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-black" style={{ backgroundImage: 'radial-gradient(rgba(100,100,100,0.1) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
        {messages.map((msg) => {
          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-6">
                <span className="text-[10px] px-4 py-2 rounded-full font-mono tracking-wide flex items-center bg-gray-200 text-gray-500 dark:bg-zinc-900/80 dark:text-zinc-500 border dark:border-white/5">
                   <Lock className="w-3 h-3 mr-2" /> {msg.text}
                </span>
              </div>
            );
          }
          const isMe = msg.senderId === CURRENT_USER.id;
          const isLocation = msg.type === 'location_share';

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm shadow-sm ${
                  isMe 
                    ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 rounded-tl-sm border border-gray-100 dark:border-white/5'
                } ${isLocation ? 'border-2 border-green-500 dark:bg-zinc-900' : ''}`}
              >
                <p className={isLocation ? 'font-bold text-green-600 dark:text-green-400 flex items-center' : ''}>
                    {isLocation && <MapPin className="w-4 h-4 mr-2" />}
                    {msg.text}
                </p>
                <span className={`text-[9px] block text-right mt-1.5 opacity-60 font-mono`}>
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white dark:bg-zinc-900 border-gray-100 dark:border-white/5">
        {/* Host Actions Toolbar */}
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
            {!locationShared && (
                <button 
                  onClick={handleShareLocation}
                  className="flex items-center px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-700"
                >
                    <MapPin className="w-3 h-3 mr-1.5 text-pink-500" /> Share Private Location
                </button>
            )}
             <button 
               onClick={() => setShowRateModal(true)}
               className="md:hidden flex items-center px-3 py-1.5 rounded-lg text-xs transition-colors whitespace-nowrap bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-700"
             >
                 <Star className="w-3 h-3 mr-1.5 text-yellow-500" /> Rate User
             </button>
        </div>

        <div className="flex items-center space-x-2 rounded-full px-2 py-2 border transition-all focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/30 bg-gray-50 border-gray-200 dark:bg-black dark:border-zinc-800">
            {isPaidChat && (
                <button className="p-2 text-zinc-500 hover:text-green-400 transition-colors" title="Send Tip">
                    <DollarSign className="w-5 h-5" />
                </button>
            )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Write a message..."
            className="flex-1 bg-transparent focus:outline-none text-sm ml-2 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 rounded-full transition-all bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};