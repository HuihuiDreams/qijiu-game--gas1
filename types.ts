export enum CharacterPosition {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
  HIDDEN = 'hidden' // Used to remove a character
}

export interface Character {
  id: string;
  name: string;
  color: string; // Hex code for nameplate
  avatarUrl?: string; // Optional small avatar for text box
}

export interface CharacterState {
  characterId: string;
  expression: string; // e.g., 'neutral', 'happy', 'angry' - maps to image URL logic
  position: CharacterPosition;
}

export interface Choice {
  text: string;
  nextSceneId: string;
  requiredFlag?: { key: string; value: any }; // Optional condition to show choice
}

export interface DialogueLine {
  speakerId?: string; // If undefined, treated as narration
  text: string;
  expression?: string; // Updates the character's expression
  choices?: Choice[]; // If present, game halts until choice made
  jumpToScene?: string; // Auto-jump after text (if no choices)
  setFlag?: { key: string; value: any }; // Set a variable when this line is reached
  bgImage?: string; // Change background
  characterUpdates?: CharacterState[]; // Enter/Exit/Move characters
}

export interface StoryScene {
  id: string;
  lines: DialogueLine[];
}

export interface GameSaveState {
  currentSceneId: string;
  currentLineIndex: number;
  flags: Record<string, any>;
  timestamp: number;
  screenshot?: string; // Optional placeholder for save UI
}

export interface LogEntry {
  speakerName: string;
  text: string;
}