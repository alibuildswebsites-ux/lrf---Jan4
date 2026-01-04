
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: number;
  className?: string;
  label?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  fullScreen = false, 
  size = 40, 
  className = "",
  label = "Loading..."
}) => {
  const spinner = <Loader2 className={`animate-spin text-brand ${className}`} size={size} />;
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center">
        {spinner}
        <p className="text-gray-400 text-sm font-medium tracking-widest uppercase animate-pulse mt-4">{label}</p>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center py-12 w-full">
      {spinner}
    </div>
  );
};
