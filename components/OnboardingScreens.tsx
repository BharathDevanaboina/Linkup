
import React, { useState } from 'react';
import { ChevronRight, MapPin, DollarSign, Trophy, Ghost } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export const OnboardingScreens: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const screens = [
    {
      icon: MapPin,
      color: 'text-violet-500',
      title: 'Real World Events',
      desc: 'Join parties, rides, and meetups happening near you right now.'
    },
    {
      icon: DollarSign,
      color: 'text-green-500',
      title: 'Earn Money',
      desc: 'Complete quick tasks for others or offer your skills for a fee.'
    },
    {
      icon: Trophy,
      color: 'text-yellow-500',
      title: 'The Gauntlet',
      desc: 'Accept high-stakes challenges and win bounties from other users.'
    },
    {
      icon: Ghost,
      color: 'text-pink-500',
      title: 'Ghost Protocol',
      desc: 'Share secrets and chat anonymously with end-to-end encryption.'
    }
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#050505] z-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-violet-600 transition-all duration-300" style={{ width: `${((step + 1) / 4) * 100}%` }}></div>
        
        <div className="mb-8 mt-4 flex justify-center">
            {React.createElement(screens[step].icon, { className: `w-20 h-20 ${screens[step].color}` })}
        </div>
        
        <h2 className="text-3xl font-bold mb-4 text-white">{screens[step].title}</h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">{screens[step].desc}</p>
        
        <button 
          onClick={handleNext}
          className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center"
        >
          {step === 3 ? 'Get Started' : 'Next'} <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};
