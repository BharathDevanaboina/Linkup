
import React from 'react';
import { Check } from 'lucide-react';

export const VerifiedBadge = () => (
  <div className="bg-blue-500 rounded-full p-[2px] ml-1 inline-flex items-center justify-center w-4 h-4" title="Verified User">
    <Check className="w-3 h-3 text-white stroke-[3px]" />
  </div>
);
