import React, { useState } from 'react';
import { CharacterState, CharacterPosition } from '../types.ts';
import { getCharacterImage, CHARACTERS } from '../services/storyScript.ts';

interface Props {
  activeCharacters: CharacterState[];
}

export const CharacterLayer: React.FC<Props> = ({ activeCharacters }) => {
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});

  const getPositionClass = (pos: CharacterPosition) => {
    switch (pos) {
      case CharacterPosition.LEFT: return 'left-[20%] translate-x-[-50%]';
      case CharacterPosition.CENTER: return 'left-1/2 -translate-x-1/2';
      case CharacterPosition.RIGHT: return 'right-[20%] translate-x-[50%]';
      case CharacterPosition.HIDDEN: return 'opacity-0 pointer-events-none';
      default: return 'hidden';
    }
  };

  const handleImageError = (url: string) => {
    // Debug logging to help identify why images are missing
    console.error(`[CharacterLayer] Failed to load image at: ${url}`);
    
    if (!failedUrls[url]) {
      setFailedUrls(prev => ({ ...prev, [url]: true }));
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex items-end justify-center overflow-hidden pb-0">
      {activeCharacters.map((charState) => {
        const charData = CHARACTERS[charState.characterId];
        const imageUrl = getCharacterImage(charState.characterId, charState.expression);
        const hasError = !imageUrl || failedUrls[imageUrl];
        const isHidden = charState.position === CharacterPosition.HIDDEN;

        return (
          <div
            key={charState.characterId}
            className={`
              absolute bottom-0 
              transition-all duration-700 ease-in-out 
              flex items-end justify-center
              ${getPositionClass(charState.position)}
              ${isHidden ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}
            `}
            style={{ 
              width: 'auto', 
              height: '85vh',
              zIndex: charState.position === CharacterPosition.CENTER ? 20 : 10
            }}
          >
            {/* Image Layer */}
            {!hasError ? (
               <img 
                  key={imageUrl} 
                  src={imageUrl}
                  alt={charData?.name || charState.characterId}
                  onError={() => handleImageError(imageUrl)}
                  className="h-[85vh] w-auto object-contain drop-shadow-2xl"
                />
            ) : (
              /* Fallback: Stylish Placeholder Card (Shows when image is missing in preview) */
               <div 
                 className="
                   h-[75vh] w-[250px]
                   flex flex-col items-center justify-end
                   border-x-2 border-t-2 
                   rounded-t-xl
                   relative overflow-hidden
                   backdrop-blur-sm
                 "
                 style={{ 
                   borderColor: `${charData.color}40`,
                   background: `linear-gradient(to top, ${charData.color}20, transparent)`,
                 }}
               >
                 {/* Inner Glow */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 
                 <div className="z-10 text-center pb-8 space-y-2">
                    <div 
                      className="text-4xl font-serif font-bold opacity-80"
                      style={{ color: charData.color, textShadow: `0 0 10px ${charData.color}60` }}
                    >
                      {charData.name}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30 font-sans">
                      Asset Missing
                    </div>
                 </div>
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
};