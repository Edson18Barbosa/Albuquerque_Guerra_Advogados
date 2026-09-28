import React, { useState, useEffect } from 'react';
import { getSiteSettings, fetchSiteSettingsAsync } from '../lib/settingsHelper';

interface LogoProps {
  className?: string;
  variant?: 'horizontal' | 'vertical' | 'monogram';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'horizontal' }) => {
  const [imgError, setImgError] = useState(false);
  const [settings, setSettings] = useState(getSiteSettings());

  useEffect(() => {
    fetchSiteSettingsAsync().then(setSettings);
  }, []);

  if (imgError) {
    // Fallback if the user hasn't uploaded the images to the public folder yet
    if (variant === 'vertical') {
      return (
        <div className={`flex flex-col items-center select-none ${className}`}>
          <div className="flex gap-1 mb-2">
             <span className="text-4xl font-serif text-[#D8CBB3] font-light tracking-tighter">A</span>
             <span className="text-4xl font-serif text-[#D8CBB3] font-light tracking-tighter">G</span>
          </div>
          <div className="text-center">
            <span className="text-xl font-serif text-[#FFFDF8] tracking-widest block uppercase">Albuquerque</span>
            <span className="text-xl font-serif text-[#FFFDF8] tracking-widest block uppercase mb-1">Guerra</span>
            <span className="text-[10px] text-[#F6F3EC]/70 tracking-[0.3em] uppercase">Advogados</span>
          </div>
        </div>
      );
    }

    if (variant === 'monogram') {
      return (
        <div className={`flex items-center justify-center select-none ${className}`}>
          <span className="text-3xl font-serif text-[#D8CBB3] font-light tracking-tighter">A</span>
          <span className="text-3xl font-serif text-[#D8CBB3] font-light tracking-tighter">G</span>
        </div>
      );
    }

    return (
      <div className={`flex items-center gap-4 select-none ${className}`}>
        <div className="flex gap-0.5">
          <span className="text-3xl font-serif text-[#D8CBB3] font-light tracking-tighter">A</span>
          <span className="text-3xl font-serif text-[#D8CBB3] font-light tracking-tighter">G</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-serif text-[#FFFDF8] tracking-widest uppercase leading-none mb-1">Albuquerque Guerra</span>
          <span className="text-[10px] text-[#F6F3EC]/70 tracking-[0.3em] uppercase leading-none">Advogados</span>
        </div>
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <img 
        src={settings.logo_vertical || "/logo-vertical.png"} 
        alt="Albuquerque Guerra Advogados" 
        className={`w-40 md:w-48 lg:w-56 object-contain ${className}`} 
        onError={() => setImgError(true)}
      />
    );
  }

  if (variant === 'monogram') {
    return (
      <img 
        src={settings.logo_monogram || "/logo-monogram.png"} 
        alt="AG Advogados" 
        className={`w-12 h-12 md:w-16 md:h-16 object-contain ${className}`} 
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <img 
      src={settings.logo_horizontal || "/logo-horizontal.png"} 
      alt="Albuquerque Guerra Advogados" 
      className={`h-12 md:h-14 lg:h-16 object-contain ${className}`} 
      onError={() => setImgError(true)}
    />
  );
};
