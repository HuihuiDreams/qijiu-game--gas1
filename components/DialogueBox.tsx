import React, { useEffect, useState, useRef } from 'react';
import { Character } from '../types';
import { TYPEWRITER_SPEED_NORMAL } from '../constants';

interface Props {
  text: string;
  speaker?: Character;
  onFinishedTyping: () => void;
  isTyping: boolean;
  onClick: () => void;
}

export const DialogueBox: React.FC<Props> = ({ text, speaker, onFinishedTyping, isTyping, onClick }) => {
  const [displayedText, setDisplayedText] = useState('');
  const textRef = useRef(text);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setDisplayedText('');
    textRef.current = text;
    
    if (!isTyping) {
        setDisplayedText(text);
        return;
    }

    let currentIndex = 0;
    const typeChar = () => {
      if (textRef.current !== text) return;
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeChar, TYPEWRITER_SPEED_NORMAL);
      } else {
        onFinishedTyping();
      }
    };
    typeChar();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [text, isTyping]); 

  useEffect(() => {
    if (!isTyping) {
        setDisplayedText(text);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [isTyping, text]);

  return (
    <div 
      className="absolute bottom-0 w-full p-4 pb-8 md:p-8 z-30 flex flex-col items-center cursor-pointer"
      onClick={onClick}
    >
      {/* Nameplate - Vertical Tag Style or Horizontal Ink Splash */}
      {speaker && (
        <div 
          className="w-full max-w-5xl mb-[-2px] z-40 flex justify-start pl-8 md:pl-12 animate-fade-in"
        >
          <div 
            className="px-8 py-1 rounded-t border-t border-x backdrop-blur-md relative"
            style={{ 
              backgroundColor: 'rgba(28, 25, 23, 0.95)', // stone-950
              color: speaker.color,
              borderColor: 'rgba(120, 113, 108, 0.3)' // stone-500/30
            }}
          >
            <span className="font-bold text-xl md:text-2xl tracking-[0.2em]" style={{ textShadow: `0 0 10px ${speaker.color}40` }}>
              {speaker.name}
            </span>
          </div>
        </div>
      )}

      {/* Main Text Box - Ink/Paper Style */}
      <div className="w-full max-w-5xl min-h-[180px] md:min-h-[220px] bg-stone-950/90 backdrop-blur-md border-y-2 border-stone-800/80 shadow-2xl p-8 md:p-10 relative overflow-hidden">
        
        {/* Decor: Corner Patterns */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-stone-600 opacity-50" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-stone-600 opacity-50" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-stone-600 opacity-50" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-stone-600 opacity-50" />

        {/* Text */}
        <p className="font-serif text-xl md:text-2xl leading-loose text-stone-300 whitespace-pre-wrap tracking-wide">
          {displayedText}
          {isTyping && <span className="inline-block w-2 h-6 ml-1 bg-stone-500/50 animate-pulse align-middle" />}
        </p>

        {/* Continue indicator - Lotus or Arrow */}
        {!isTyping && (
          <div className="absolute bottom-6 right-8 animate-bounce text-stone-500 opacity-70">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L12 20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};