import { StoryScene, Character, CharacterPosition } from '../types';

// ==========================================
// 资源路径配置 (Resource Configuration)
// ==========================================

// 修正：直接使用文件名，不加任何前缀。
// 这是最稳妥的方式，确保浏览器直接在当前目录下寻找图片。

export const ASSETS = {
  BG_QINGJING: 'bk.JPG',             
  SHEN_QINGQIU_PIC: 'shenqingqiu.png', 
  YUE_QINGYUAN_PIC: 'yueqingyuan.png', 
  START_SCREEN_PIC: 'qijiu_start_screen.png', 
  BGM_URL: 'baheng.mp3',             
  ENDING_B_PIC: 'Image.png'          
};

// --- 1. 定义角色 ---
export const CHARACTERS: Record<string, Character> = {
  shen: { id: 'shen', name: '沈清秋', color: '#10b981' }, // Emerald/Jade Green
  yue: { id: 'yue', name: '岳清源', color: '#818cf8' },  // Indigo/Soft Blue
  system: { id: 'system', name: '系统', color: '#f43f5e' } // Red for system
};

// --- 2. 获取立绘 ---
export const getCharacterImage = (charId: string, expression: string = 'neutral') => {
  if (charId === 'shen') {
    return ASSETS.SHEN_QINGQIU_PIC;
  }
  if (charId === 'yue') {
    return ASSETS.YUE_QINGYUAN_PIC;
  }
  return '';
};

// --- 3. 剧情脚本 ---
export const STORY_SCENES: Record<string, StoryScene> = {
  'start': {
    id: 'start',
    lines: [
      {
        bgImage: ASSETS.BG_QINGJING, 
        text: '清静峰，竹舍。风吹叶动，沙沙作响。',
      },
      {
        speakerId: 'shen',
        text: '（轻叹）今日倒是清静...',
        characterUpdates: [
          { characterId: 'shen', position: CharacterPosition.CENTER, expression: 'neutral' }
        ]
      },
      {
        text: '门外传来一阵沉稳的脚步声。',
      },
      {
        speakerId: 'yue',
        text: '清秋师弟，可在休歇？',
        characterUpdates: [
          { characterId: 'shen', position: CharacterPosition.LEFT, expression: 'neutral' },
          { characterId: 'yue', position: CharacterPosition.RIGHT, expression: 'neutral' }
        ]
      },
      {
        speakerId: 'shen',
        text: '掌门师兄。不知今日造访，有何贵干？',
        choices: [
          { text: '请岳清源入座品茶', nextSceneId: 'tea_scene' },
          { text: '冷淡询问来意', nextSceneId: 'cold_scene' }
        ]
      }
    ]
  },
  'tea_scene': {
    id: 'tea_scene',
    lines: [
      {
        setFlag: { key: 'relationship_yue', value: 5 },
        speakerId: 'shen',
        text: '既然来了，便进来喝杯茶吧。这是新得的雪山毛尖。'
      },
      {
        speakerId: 'yue',
        text: '（微笑着走近）师弟有心了。看你气色尚好，我也就放心了。',
        expression: 'happy'
      },
      {
        speakerId: 'shen',
        text: '师兄此番前来，不仅仅是为了看一眼吧？',
      },
      {
        speakerId: 'yue',
        text: '确实有一事... 关于即将到来的仙盟大会。',
        expression: 'serious'
      },
      {
        text: '两人对坐饮茶，窗外竹影斑驳。',
        jumpToScene: 'end_demo'
      }
    ]
  },
  'cold_scene': {
    id: 'cold_scene',
    lines: [
      {
        setFlag: { key: 'relationship_yue', value: -5 },
        speakerId: 'shen',
        text: '若是公事，传音即可。何必劳烦掌门亲自跑一趟。'
      },
      {
        speakerId: 'yue',
        text: '（眼神微黯）清秋... 你我之间，非要如此生分吗？',
      },
      {
        speakerId: 'shen',
        text: '往事已矣，多说无益。',
        expression: 'cold'
      },
      {
        text: '......',
        jumpToScene: 'end_demo'
      }
    ]
  },
  'end_demo': {
    id: 'end_demo',
    lines: [
      {
        text: '（演示版剧情结束）'
      }
    ]
  }
};