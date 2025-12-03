
import React from 'react';

interface RiskMeterProps {
  level: number; // 0 to 100
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ level }) => {
  let color = 'bg-green-500';
  if (level > 50) color = 'bg-yellow-500';
  if (level > 80) color = 'bg-red-500';

  return (
    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-2">
      <div 
        className={`h-full ${color} transition-all duration-500`} 
        style={{ width: `${level}%` }}
      ></div>
    </div>
  );
};
