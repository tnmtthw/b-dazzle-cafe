import React from 'react';
import { cn } from '@/lib/utils';

interface EspressoSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * EspressoSpinner Component
 * 
 * A custom loading spinner with coffee cup animation
 */
const EspressoSpinner: React.FC<EspressoSpinnerProps> = ({ size = 'md', className }) => {
  const containerSizes = {
    sm: 'scale-50',
    md: 'scale-75',
    lg: 'scale-100'
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", containerSizes[size], className)}>
      <div className="relative w-24 h-24">
        {/* Coffee Cup */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-12 border-b-4 border-l-4 border-r-4 border-brown-primary rounded-b-xl bg-white"></div>
        
        {/* Cup Handle */}
        <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/4 w-4 h-6 border-r-4 border-t-4 border-b-4 border-brown-primary rounded-r-full"></div>
        
        {/* Coffee Loading Animation */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mt-1 w-14 h-5 overflow-hidden">
          <div className="coffee-fill w-full h-full bg-amber-700 rounded-b-lg animate-pulse"></div>
        </div>
        
        {/* Steam Animation */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-6 flex space-x-1">
          <div className="w-1 h-3 bg-gray-300 rounded-full opacity-0 animate-steam1"></div>
          <div className="w-1 h-4 bg-gray-300 rounded-full opacity-0 animate-steam2"></div>
          <div className="w-1 h-3 bg-gray-300 rounded-full opacity-0 animate-steam3"></div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-brown-primary font-medium animate-pulse">Brewing...</p>
      </div>
      
      <style jsx>{`
        @keyframes steam1 {
          0% { transform: translateY(0); opacity: 0; }
          30% { transform: translateY(-5px); opacity: 0.5; }
          60% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(-15px); opacity: 0; }
        }
        
        @keyframes steam2 {
          0% { transform: translateY(0); opacity: 0; }
          40% { transform: translateY(-5px); opacity: 0.5; }
          70% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(-15px); opacity: 0; }
        }
        
        @keyframes steam3 {
          0% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(-5px); opacity: 0.5; }
          80% { transform: translateY(-10px); opacity: 0; }
          100% { transform: translateY(-15px); opacity: 0; }
        }
        
        .animate-steam1 {
          animation: steam1 2s infinite ease-out;
        }
        
        .animate-steam2 {
          animation: steam2 2.3s infinite ease-out;
          animation-delay: 0.3s;
        }
        
        .animate-steam3 {
          animation: steam3 1.9s infinite ease-out;
          animation-delay: 0.6s;
        }
      `}</style>
    </div>
  );
};

export default EspressoSpinner; 