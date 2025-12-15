import React, { useState, useEffect, useCallback, useRef } from 'react';
import { STORY_SCENES, CHARACTERS } from '../services/storyScript';
import { CharacterState, CharacterPosition, GameSaveState, LogEntry } from '../types';
import { CharacterLayer } from './CharacterLayer';
import { DialogueBox } from './DialogueBox';
import { Button } from './ui/Button';
import { AUTOSAVE_INTERVAL_MS } from '../constants';

interface Props {
  initialState?: GameSaveState;
  onExit: () => void;
  onSave: (state: GameSaveState) => void;
  onAutoSave?: (state: GameSaveState) => void;
}

export const GameEngine: React.FC<Props> = ({ initialState, onExit, onSave, onAutoSave }) => {
  // --- State ---
  const [sceneId, setSceneId] = useState(initialState?.currentSceneId || 'start');
  const [lineIndex, setLineIndex] = useState(initialState?.currentLineIndex || 0);
  const [flags, setFlags] = useState<Record<string, any>>(initialState?.flags || {});
  
  // Visual State
  const [bgImage, setBgImage] = useState<string>('');
  const [bgLoadError, setBgLoadError] = useState(false); // Track BG errors
  const [activeCharacters, setActiveCharacters] = useState<CharacterState[]>([]);
  const [isTyping, setIsTyping] = useState(true);
  const [history, setHistory] = useState<LogEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Audio State
  const [currentBgm, setCurrentBgm] = useState<string | undefined>(initialState?.currentBgm);

  // Refs
  const gameStateRef = useRef({ sceneId, lineIndex, flags, currentBgm });
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    gameStateRef.current = { sceneId, lineIndex, flags, currentBgm };
  }, [sceneId, lineIndex, flags, currentBgm]);
  
  // Derived
  const currentScene = STORY_SCENES[sceneId];
  const currentLine = currentScene?.lines[lineIndex];

  // --- Auto-Save Logic ---
  const triggerAutoSave = useCallback(() => {
    if (onAutoSave) {
      setIsAutoSaving(true);
      const stateToSave: GameSaveState = {
        currentSceneId: gameStateRef.current.sceneId,
        currentLineIndex: gameStateRef.current.lineIndex,
        flags: gameStateRef.current.flags,
        currentBgm: gameStateRef.current.currentBgm,
        timestamp: Date.now()
      };
      onAutoSave(stateToSave);
      setTimeout(() => setIsAutoSaving(false), 2000);
    }
  }, [onAutoSave]);

  useEffect(() => {
    const intervalId = setInterval(() => triggerAutoSave(), AUTOSAVE_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [triggerAutoSave]);

  useEffect(() => {
    const timeoutId = setTimeout(() => triggerAutoSave(), 500);
    return () => clearTimeout(timeoutId);
  }, [sceneId, triggerAutoSave]);


  // --- Audio Logic ---
  useEffect(() => {
    // Initialize Audio Element
    if (!bgmRef.current) {
        bgmRef.current = new Audio();
        bgmRef.current.loop = true;
        bgmRef.current.volume = 0.5; // Default volume
    }

    // Attempt to resume BGM if loading from save and no audio is playing
    if (currentBgm && bgmRef.current.paused && bgmRef.current.src === '') {
         bgmRef.current.src = currentBgm;
         bgmRef.current.play().catch(e => console.warn("Auto-play blocked or file missing:", e));
    }

    return () => {
        // Cleanup on unmount
        if (bgmRef.current) {
            bgmRef.current.pause();
            bgmRef.current = null;
        }
    };
  }, []); // Run once on mount

  useEffect(() => {
    if (!currentLine) return;

    // 1. Handle Sound Effects (One-shot)
    if (currentLine.soundEffect) {
        const sfx = new Audio(currentLine.soundEffect);
        sfx.volume = 0.7;
        sfx.play().catch(e => console.warn("SFX failed:", currentLine.soundEffect, e));
    }

    // 2. Handle Background Music
    if (currentLine.bgm && currentLine.bgm !== currentBgm) {
        if (bgmRef.current) {
            // Fade out logic could go here, but doing hard switch for responsiveness
            bgmRef.current.src = currentLine.bgm;
            bgmRef.current.play().catch(e => console.warn("BGM failed:", currentLine.bgm, e));
            setCurrentBgm(currentLine.bgm);
        }
    }
  }, [currentLine, currentBgm]);


  // --- Visual Effects & Scene Logic ---
  useEffect(() => {
    if (!currentLine) return;

    if (currentLine.bgImage && currentLine.bgImage !== bgImage) {
         setBgImage(currentLine.bgImage);
         setBgLoadError(false);
    }
  }, [currentLine]); 

  useEffect(() => {
    if (!currentLine) return;

    if (currentLine.characterUpdates) {
      setActiveCharacters(prev => {
        let newChars = [...prev];
        currentLine.characterUpdates?.forEach(update => {
          if (update.position === CharacterPosition.HIDDEN) {
            newChars = newChars.filter(c => c.characterId !== update.characterId);
          } else {
            const existingIdx = newChars.findIndex(c => c.characterId === update.characterId);
            if (existingIdx >= 0) {
              newChars[existingIdx] = { ...newChars[existingIdx], ...update };
            } else {
              newChars.push(update);
            }
          }
        });
        return newChars;
      });
    }

    if (currentLine.setFlag) {
      setFlags(prev => ({
        ...prev,
        [currentLine.setFlag!.key]: currentLine.setFlag!.value
      }));
    }

    setIsTyping(true);
  }, [sceneId, lineIndex, currentLine]);

  // --- Handlers ---
  const handleAdvance = useCallback(() => {
    if (!currentLine) return;
    if (isTyping) {
      setIsTyping(false);
      return;
    }
    if (currentLine.choices && currentLine.choices.length > 0) return;

    if (currentLine.jumpToScene) {
      changeScene(currentLine.jumpToScene);
      return;
    }

    const nextIndex = lineIndex + 1;
    if (nextIndex < currentScene.lines.length) {
      addToHistory();
      setLineIndex(nextIndex);
    } else {
      // End of scene and no jump/choices -> Exit to Main Menu
      onExit(); 
    }
  }, [currentLine, isTyping, lineIndex, currentScene]);

  const addToHistory = () => {
    if (!currentLine) return;
    const speakerName = currentLine.speakerId ? CHARACTERS[currentLine.speakerId]?.name : 'Narrator';
    setHistory(prev => [...prev, { speakerName, text: currentLine.text }]);
  };

  const changeScene = (newId: string) => {
    if (!STORY_SCENES[newId]) return;
    addToHistory();
    setSceneId(newId);
    setLineIndex(0);
  };

  const handleChoice = (nextId: string) => {
    addToHistory();
    changeScene(nextId);
  };

  const handleSave = () => {
    onSave({
      currentSceneId: sceneId,
      currentLineIndex: lineIndex,
      flags,
      currentBgm,
      timestamp: Date.now()
    });
    alert("存档成功！");
  };

  if (!currentLine) return <div className="text-center mt-20 text-white">Loading...</div>;

  const speaker = currentLine.speakerId ? CHARACTERS[currentLine.speakerId] : undefined;
  const showChoices = !isTyping && currentLine.choices && currentLine.choices.length > 0;
  const isInteracting = showChoices || showHistory;

  return (
    <div className="relative w-full h-screen bg-stone-950 overflow-hidden select-none">
      
      {/* Background Layer */}
      {bgImage && !bgLoadError ? (
         <img
           src={bgImage}
           alt="Background"
           className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out"
           style={{ filter: isInteracting ? 'blur(4px)' : 'none' }}
           onError={() => setBgLoadError(true)}
         />
      ) : (
         /* Fallback Background (Atmospheric Gradient) */
         <div className="absolute inset-0 bg-gradient-to-br from-stone-800 via-stone-900 to-black animate-pulse-slow" />
      )}
      
      {/* Black overlay for atmosphere */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Characters */}
      <CharacterLayer activeCharacters={activeCharacters} />

      {/* UI Layer */}
      <div className="absolute inset-0 z-20 flex flex-col justify-between">
        
        {/* Top HUD with Gradient Background for Visibility */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-50 bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-12 transition-all duration-300">
           {/* Left Controls */}
           <div className="space-x-2 flex">
             <Button variant="secondary" onClick={() => setShowHistory(true)} className="text-sm py-1 px-3 shadow-lg">历史记录</Button>
             <Button variant="secondary" onClick={handleSave} className="text-sm py-1 px-3 shadow-lg ring-1 ring-white/10">手动存档</Button>
           </div>
           
           {/* Right Controls */}
           <div className="flex items-center space-x-4">
             <div className={`transition-opacity duration-500 text-stone-300 text-xs font-serif tracking-widest drop-shadow-md ${isAutoSaving ? 'opacity-100' : 'opacity-0'}`}>
                自动保存中...
             </div>
             <Button variant="ghost" onClick={onExit} className="text-sm py-1 px-3 text-stone-300 hover:text-white hover:bg-white/10 shadow-lg">返回主页</Button>
           </div>
        </div>

        {/* Interaction Area (Click to advance) */}
        {!isInteracting && (
            <div className="flex-grow z-20" onClick={handleAdvance} />
        )}

        {/* Choices Overlay */}
        {showChoices && (
          <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 animate-fade-in">
             <h2 className="text-xl text-white/80 mb-6 font-bold tracking-widest uppercase">抉择</h2>
             {currentLine.choices?.map((choice, idx) => (
               <button
                 key={idx}
                 onClick={() => handleChoice(choice.nextSceneId)}
                 className="w-full max-w-xl p-4 bg-slate-900/90 hover:bg-rose-900/90 border border-slate-600 hover:border-rose-500 text-white text-lg font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-xl"
               >
                 {choice.text}
               </button>
             ))}
          </div>
        )}

        {/* Dialogue Box */}
        {!isInteracting && (
            <DialogueBox 
              text={currentLine.text} 
              speaker={speaker} 
              isTyping={isTyping}
              onFinishedTyping={() => setIsTyping(false)}
              onClick={handleAdvance}
            />
        )}
      </div>

      {/* History Log */}
      {showHistory && (
        <div className="absolute inset-0 z-50 bg-slate-900/95 flex flex-col p-8 md:p-16">
          <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
            <h2 className="text-3xl font-bold text-slate-200">历史记录</h2>
            <Button onClick={() => setShowHistory(false)}>关闭</Button>
          </div>
          <div className="flex-grow overflow-y-auto space-y-4 pr-4">
            {history.map((entry, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-rose-400 font-bold text-sm">{entry.speakerName}</span>
                <span className="text-slate-300">{entry.text}</span>
              </div>
            ))}
            {history.length === 0 && <p className="text-slate-500 italic">暂无记录</p>}
          </div>
        </div>
      )}

    </div>
  );
};