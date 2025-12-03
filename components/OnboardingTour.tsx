
import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';

export interface TourStep {
  targetId: string; // The ID of the HTML element to highlight (or 'center' for modal)
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ steps, isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Update target position on step change or resize
  useEffect(() => {
    if (!isOpen) return;

    const updateRect = () => {
      const step = steps[currentStep];
      if (step.targetId === 'center') {
        setTargetRect(null); // No spotlight for center modal
        return;
      }

      const element = document.getElementById(step.targetId);
      if (element) {
        // Add a slight delay to allow UI to settle if changing views
        setTimeout(() => {
           const rect = element.getBoundingClientRect();
           setTargetRect(rect);
        }, 100);
      } else {
        // Fallback if element not found (e.g., mobile view missing desktop sidebar)
        console.warn(`Tour target #${step.targetId} not found`);
        setTargetRect(null); 
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [currentStep, isOpen, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      onComplete();
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];
  const isCenter = step.targetId === 'center' || !targetRect;

  // Calculate Tooltip Position
  const getTooltipStyle = () => {
    if (isCenter) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    if (!targetRect) return {};

    const gap = 20;
    const tooltipWidth = 320; // Approx max width
    
    // Default logic based on preferred position, falling back to basic math
    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - 100;
        left = targetRect.right + gap;
        break;
      case 'left':
        top = targetRect.top;
        left = targetRect.left - tooltipWidth - gap;
        break;
      case 'bottom':
        top = targetRect.bottom + gap;
        left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);
        break;
      case 'top':
      default:
        top = targetRect.top - 200 - gap; // Approx height of tooltip
        left = targetRect.left;
        break;
    }

    // Boundary checks (keep it on screen)
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - 10;
    if (top < 10) top = 10;

    return { top, left, position: 'absolute' as 'absolute' };
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto">
      {/* 1. The Spotlight (Box Shadow Trick) */}
      {!isCenter && targetRect && (
        <div 
          className="absolute rounded-xl transition-all duration-500 ease-in-out border-2 border-violet-500/50 shadow-[0_0_30px_rgba(124,58,237,0.3)] animate-pulse"
          style={{
            top: targetRect.top - 5,
            left: targetRect.left - 5,
            width: targetRect.width + 10,
            height: targetRect.height + 10,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.85)' // The dark overlay
          }}
        />
      )}

      {/* 1.b Full Dark Overlay for Center Modal */}
      {isCenter && (
         <div className="absolute inset-0 bg-black/85 backdrop-blur-sm transition-opacity duration-500" />
      )}

      {/* 2. The Tooltip Card */}
      <div 
        className={`fixed z-[101] w-full max-w-sm transition-all duration-300 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        style={getTooltipStyle()}
      >
        <div className="bg-[#09090b] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Cyberpunk Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600"></div>
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all"></div>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-4 relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-800 px-2 py-1 rounded bg-black">
                    Step {currentStep + 1} / {steps.length}
                </span>
                <button onClick={onSkip} className="text-zinc-500 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <h3 className="text-xl font-black text-white mb-2 relative z-10 leading-tight">
                {step.title}
            </h3>
            <p className="text-zinc-400 text-sm mb-6 relative z-10 leading-relaxed">
                {step.content}
            </p>

            {/* Actions */}
            <div className="flex justify-between items-center relative z-10">
                 <div className="flex space-x-1">
                     {steps.map((_, idx) => (
                         <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-6 bg-white' : 'w-2 bg-zinc-700'}`}
                         />
                     ))}
                 </div>
                 
                 <button 
                    onClick={handleNext}
                    className="flex items-center px-5 py-2.5 bg-white text-black font-bold rounded-full text-sm hover:bg-zinc-200 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                 >
                    {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                    {currentStep === steps.length - 1 ? <Check className="w-4 h-4 ml-2" /> : <ChevronRight className="w-4 h-4 ml-2" />}
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
};
