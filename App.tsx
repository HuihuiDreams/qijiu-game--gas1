import React, { useState, useEffect } from 'react';
import { GameEngine } from './components/GameEngine.tsx';
import { Button } from './components/ui/Button.tsx';
import { GameSaveState } from './types.ts';
import { STORAGE_KEY_SAVES, STORAGE_KEY_AUTOSAVE } from './constants.ts';
import { ASSETS } from './services/storyScript.ts';

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadState, setLoadState] = useState<GameSaveState | undefined>(undefined);
  const [hasSave, setHasSave] = useState(false);
  const [hasAutoSave, setHasAutoSave] = useState(false);
  const [bgError, setBgError] = useState(false);

  useEffect(() => {
    // Check manual saves
    const saved = localStorage.getItem(STORAGE_KEY_SAVES);
    if (saved) setHasSave(true);
    
    // Check auto saves
    const autoSaved = localStorage.getItem(STORAGE_KEY_AUTOSAVE);
    if (autoSaved) setHasAutoSave(true);
  }, [isPlaying]);

  const handleStartNew = () => {
    setLoadState(undefined);
    setIsPlaying(true);
  };

  const handleLoadGame = () => {
    const saved = localStorage.getItem(STORAGE_KEY_SAVES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLoadState(parsed);
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to load save", e);
        alert("存档已损坏");
      }
    }
  };

  const handleContinue = () => {
    const saved = localStorage.getItem(STORAGE_KEY_AUTOSAVE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setLoadState(parsed);
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to load auto-save", e);
        alert("自动存档已损坏");
      }
    }
  };

  const handleSaveGame = (state: GameSaveState) => {
    localStorage.setItem(STORAGE_KEY_SAVES, JSON.stringify(state));
    setHasSave(true);
  };

  const handleAutoSave = (state: GameSaveState) => {
    localStorage.setItem(STORAGE_KEY_AUTOSAVE, JSON.stringify(state));
    setHasAutoSave(true);
  };

  const handleExit = () => {
    setIsPlaying(false);
  };

  if (isPlaying) {
    return (
      <GameEngine 
        initialState={loadState} 
        onExit={handleExit}
        onSave={handleSaveGame}
        onAutoSave={handleAutoSave}
      />
    );
  }

  return (
    <div className="w-full h-screen bg-stone-950 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Layer with Fallback */}
      {!bgError ? (
        <img 
          src={ASSETS.START_SCREEN_PIC}
          className="absolute inset-0 w-full h-full object-cover opacity-50 contrast-110 scale-105 animate-pulse-slow"
          onError={() => {
            console.error(`[App] Failed to load start screen image: ${ASSETS.START_SCREEN_PIC}`);
            setBgError(true);
          }}
          alt="Start Screen"
        />
      ) : (
        /* Stylish Gradient Fallback if image missing */
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-emerald-900/20 to-stone-900 opacity-80" />
      )}
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />

      <div className="z-10 text-center space-y-16 max-w-md w-full p-6 relative">
        {/* Title Group */}
        <div className="space-y-4 border-y border-stone-800 py-12 bg-stone-950/60 backdrop-blur-sm shadow-2xl">
           <h1 className="text-7xl font-serif text-stone-200 tracking-[0.2em] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            苍穹<span className="text-emerald-700">绝响</span>
          </h1>
          <p className="text-stone-400 text-lg tracking-[0.5em] font-light border-t border-stone-800/50 pt-4 inline-block px-4">
             VISUAL NOVEL
          </p>
        </div>

        {/* Menu Buttons */}
        <div className="flex flex-col space-y-5 px-8">
          <Button onClick={handleStartNew} className="py-3 text-xl border-stone-700">
            初入江湖
          </Button>
          
          {hasAutoSave && (
            <Button 
              onClick={handleContinue} 
              variant="secondary" 
              className="border-emerald-900/50 text-emerald-100/80"
            >
              继续旅程 (自动存档)
            </Button>
          )}

          <Button 
            onClick={handleLoadGame} 
            variant={hasSave ? 'secondary' : 'ghost'} 
            disabled={!hasSave}
            className={!hasSave ? 'opacity-30 cursor-not-allowed' : ''}
          >
            {hasSave ? '读取存档' : '暂无手动存档'}
          </Button>
          
          <div className="pt-12 text-xs text-stone-600 font-serif tracking-widest">
            v1.2.0 • 苍穹山派制
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;