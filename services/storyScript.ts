import { StoryScene, Character, CharacterPosition } from '../types';

// ==========================================
// 资源路径配置 (Resource Configuration)
// ==========================================

const PLACEHOLDER_BASE = 'https://placehold.co';

// 音频资源
export const AUDIO = {
  // BGM
  BGM_GUQIN: '/audio/bgm_guqin.mp3',       
  BGM_HEARTBEAT: '/audio/bgm_heartbeat.mp3', 
  BGM_EPIC: '/audio/bgm_epic.mp3',         
  BGM_WIND: '/audio/bgm_wind.mp3',         
  BGM_WARM: '/audio/bgm_warm.mp3',         
  
  // SFX
  SFX_BARRIER: '/audio/sfx_barrier.mp3',   
  SFX_DOOR_BREAK: '/audio/sfx_door.mp3',   
  SFX_SWORD: '/audio/sfx_sword.mp3',       
};

export const ASSETS = {
  // 背景 (确保服务器上文件夹名为 pictures)
  BG_QIANCAO: 'pictures/qiancao.png', 
  BG_BAMBOO_NIGHT: 'pictures/bamboonight.png', 
  BG_COLD_SPRING: 'pictures/coldspring.png',
  BG_BEDROOM: 'pictures/bedroom.png', 
  BG_RUINS: 'pictures/ruin.png', 
  BG_CLIFF: 'pictures/cliff.png',
  BG_BLACK: 'pictures/black.png', 
  
  // 封面
  START_SCREEN_PIC: './pictures/start.png',

  // 立绘 (确保文件名与实际上传的一致)
  SHEN_QINGQIU_PIC: './shenqingqiu.png',
  YUE_QINGYUAN_PIC: 'pictures/yueqingyuan.png',
  MU_QINGFANG_PIC: `${PLACEHOLDER_BASE}/450x800/14b8a6/ffffff?text=Mu+Qingfang`,
  
  // 特殊 CG
  CG_KISS: `${PLACEHOLDER_BASE}/1920x1080/881337/ffffff?text=CG:+Reunion`, 
  CG_MEMORY: `${PLACEHOLDER_BASE}/1920x1080/fbbf24/ffffff?text=Memory:+Ling+Xi+Cave`
};

// --- 1. 定义角色 ---
export const CHARACTERS: Record<string, Character> = {
  shen: { id: 'shen', name: '沈清秋', color: '#10b981' }, 
  yue: { id: 'yue', name: '岳清源', color: '#818cf8' },  
  mu: { id: 'mu', name: '木清芳', color: '#2dd4bf' },    
  system: { id: 'system', name: '系统/旁白', color: '#f43f5e' } 
};

// --- 2. 获取立绘 ---
export const getCharacterImage = (charId: string, expression: string = 'neutral') => {
  if (charId === 'shen') return ASSETS.SHEN_QINGQIU_PIC;
  if (charId === 'yue') return ASSETS.YUE_QINGYUAN_PIC;
  if (charId === 'mu') return ASSETS.MU_QINGFANG_PIC;
  return '';
};

// --- 3. 剧情脚本 ---
export const STORY_SCENES: Record<string, StoryScene> = {
  'start': {
    id: 'start',
    lines: [
      {
        bgImage: ASSETS.BG_QIANCAO,
        text: '【Chapter 1: 药与火】',
        speakerId: 'system',
        bgm: AUDIO.BGM_GUQIN
      },
      {
        speakerId: 'shen',
        text: '（手中折扇“啪”地合上，眉间聚着戾气）没有？木师弟，你千草峰号称汇集天下灵药，如今我要能助我结丹突破的药，你却推三阻四？',
        characterUpdates: [
          { characterId: 'shen', position: CharacterPosition.LEFT, expression: 'disdain' },
          { characterId: 'mu', position: CharacterPosition.HIDDEN, expression: 'neutral' }
        ]
      },
      {
        speakerId: 'mu',
        text: '沈师兄，并非师弟不给。只是修行讲究循序渐进。若用猛药强行拔高，只怕欲速则不达。',
        characterUpdates: [
           { characterId: 'shen', position: CharacterPosition.CENTER, expression: 'disdain' }
        ]
      },
      {
        speakerId: 'shen',
        text: '（冷笑一声）欲速则不达？我看柳清歌精进神速，也没见他出什么岔子。怎么，他是天之骄子，我就是朽木一块？',
        expression: 'disdain'
      },
      {
        speakerId: 'mu',
        text: '（叹气，取出贴着符箓的青瓷小瓶）这是新炼的“固元紫金丹”。此药性烈，能短时间激发潜能……不过师弟必须言明，这批药的几味辅料是安定峰新进的，尚师兄虽信誓旦旦说是上品，但我尚未完全验过药性……',
      },
      {
        speakerId: 'shen',
        text: '（一把夺过药瓶）够了。只要有用就行。',
        expression: 'disdain'
      },
      {
        text: '他无法忍受同辈师兄弟都先他结丹。他要变强，哪怕饮鸩止渴。',
      },
      {
        bgImage: ASSETS.BG_BAMBOO_NIGHT,
        text: '夜深了，竹林在风中沙沙作响。沈清秋屏退众弟子，设下两道禁制，仰头将那颗紫金丹药吞入腹中。',
        characterUpdates: [
          { characterId: 'shen', position: CharacterPosition.CENTER, expression: 'neutral' }
        ],
        bgm: AUDIO.BGM_HEARTBEAT
      },
      {
        speakerId: 'shen',
        text: '（闷哼一声，额头渗出冷汗）唔……',
        expression: 'pain'
      },
      {
        text: '那火没烧在经脉，全烧进了骨髓血液，直冲小腹，带着难以言喻又令人羞耻的燥热。',
      },
      {
        speakerId: 'shen',
        text: '（蜷缩起身子，手指死抓身下竹席）该死……木清芳……尚清华……',
        expression: 'shame'
      },
      {
        text: '身体像被万蚁噬咬，又痒又痛，更可怕的是那种深处泛上来的空虚感。',
      },
      {
        text: '（门外禁制被触动）',
        soundEffect: AUDIO.SFX_BARRIER
      },
      {
        speakerId: 'yue',
        text: '清秋师弟？我刚得了些极好的雨前龙井，想着你应该还没歇……',
      },
      {
        speakerId: 'shen',
        text: '（浑身一僵，死死咬住嘴唇）（内心）岳清源。绝不能让他看见自己这副模样！绝不！滚……',
        expression: 'shame'
      },
      {
        speakerId: 'yue',
        text: '（声音染上焦急）清秋师弟？你怎么了？怎么气息如此紊乱？',
        choices: [
            { text: '（岳清源视角）顾忌他的自尊，在门外询问', nextSceneId: 'bad_end_1' },
            { text: '（岳清源视角）察觉不对，强行破门而入', nextSceneId: 'start_break_in' }
        ]
      }
    ]
  },
  'bad_end_1': {
    id: 'bad_end_1',
    lines: [
      {
        speakerId: 'yue',
        text: '既然师弟不便，那我明日再来。清秋，若有不适，定要传音于我。'
      },
      {
        text: '岳清源脚步声远去。',
      },
      {
        speakerId: 'shen',
        text: '（惨笑）呵……这就是你的“好意”……岳清源……你果然……',
        expression: 'despair'
      },
      {
        bgImage: ASSETS.BG_BLACK,
        text: '【Bad End 1: 枯骨】那一夜无人知晓发生了什么。次日清晨，弟子发现沈峰主七窍流血，经脉寸断，死于走火入魔。岳清源抱着那具冰冷的尸体，在竹舍前坐了整整三天三夜，最终心魔深种，苍穹山派从此再无宁日。',
        choices: [],
        bgm: AUDIO.BGM_WIND
      }
    ]
  },
  'start_break_in': {
    id: 'start_break_in',
    lines: [
      {
        text: '砰！灵力破门',
        characterUpdates: [
            { characterId: 'shen', position: CharacterPosition.LEFT, expression: 'shame' },
            { characterId: 'yue', position: CharacterPosition.RIGHT, expression: 'shocked' }
        ],
        soundEffect: AUDIO.SFX_DOOR_BREAK
      },
      {
        speakerId: 'yue',
        text: '（几步冲到榻前）这味道……千机散？！小九！',
        expression: 'shocked'
      },
      {
        speakerId: 'shen',
        text: '（眼神涣散，痛苦地撕扯领口）别……别碰我……',
        expression: 'shame',
        jumpToScene: 'chapter_2'
      }
    ]
  },
  'chapter_2': {
    id: 'chapter_2',
    lines: [
      {
        bgImage: ASSETS.BG_COLD_SPRING,
        text: '【Chapter 2: 生死抉择】',
        speakerId: 'system',
        bgm: AUDIO.BGM_EPIC
      },
      {
        text: '寒潭冷泉。岳清源抱着沈清秋跳入池中，试图帮他化解药性。然而一炷香过去，沈清秋体内热度未退，反因外界极寒刺激，逼得药性疯狂反扑。',
        characterUpdates: [
          { characterId: 'yue', position: CharacterPosition.CENTER, expression: 'sorrow' },
          { characterId: 'shen', position: CharacterPosition.HIDDEN, expression: 'hidden' }
        ]
      },
      {
        speakerId: 'shen',
        text: '（猛地喷出一口鲜血）噗——',
        characterUpdates: [
            { characterId: 'yue', position: CharacterPosition.HIDDEN, expression: 'hidden' },
            { characterId: 'shen', position: CharacterPosition.CENTER, expression: 'pain' }
        ]
      },
      {
        text: '眼角、鼻下、耳孔，竟都渗出了细细血丝。七窍流血。这是即将爆体而亡的征兆。',
      },
      {
        speakerId: 'yue',
        text: '（抱着他的手剧烈颤抖）（内心）冷泉没用。药太烈，已入骨髓。若不疏解，小九会没命的。真的会死。',
        characterUpdates: [
            { characterId: 'shen', position: CharacterPosition.HIDDEN, expression: 'hidden' },
            { characterId: 'yue', position: CharacterPosition.CENTER, expression: 'sorrow' }
        ],
        choices: [
          { text: '即使他会死，也不能趁人之危', nextSceneId: 'be_separation' },
          { text: '恨我也好，杀我也罢，只要你活着', nextSceneId: 'chapter_2_save' }
        ]
      }
    ]
  },
  'be_separation': {
    id: 'be_separation',
    lines: [
      { bgImage: ASSETS.BG_BLACK, text: '【Bad End: 阴阳两隔】岳清源选择了克制，却眼睁睁看着沈清秋在怀中爆体而亡。', bgm: AUDIO.BGM_WIND }
    ]
  },
  'chapter_2_save': {
    id: 'chapter_2_save',
    lines: [
      {
        speakerId: 'yue',
        text: '（红着眼，将人猛地抱起）恨我也好，杀我也罢……只要你活着。',
        expression: 'dark'
      },
      {
        bgImage: ASSETS.BG_BEDROOM,
        text: '肌肤相亲瞬间，甜腻香气彻底引爆一切。沈清秋本能地将他当成唯一救赎，死死缠住岳清源脖颈。',
        characterUpdates: [
            { characterId: 'yue', position: CharacterPosition.HIDDEN, expression: 'hidden' },
            { characterId: 'shen', position: CharacterPosition.CENTER, expression: 'shame' }
        ]
      },
      {
        speakerId: 'shen',
        text: '（难受地蹭着，眼泪大颗滚落）……七哥……救我……七哥……好难受……',
        expression: 'shame'
      },
      {
        speakerId: 'yue',
        text: '（眼底墨色翻涌）小九……七哥救你……七哥这就给你……',
        characterUpdates: [
            { characterId: 'shen', position: CharacterPosition.HIDDEN, expression: 'hidden' },
            { characterId: 'yue', position: CharacterPosition.CENTER, expression: 'dark' }
        ]
      },
      {
        bgImage: ASSETS.BG_BLACK,
        text: '衣衫尽裂，满室荒唐。这是一场名为救赎的凌迟。沈清秋在药力驱使下展现出从未见过的媚态，岳清源则在沈清秋一声声变调的“七哥”中，彻底疯魔向。',
        jumpToScene: 'chapter_3'
      }
    ]
  },
  'chapter_3': {
    id: 'chapter_3',
    lines: [
      {
        bgImage: ASSETS.BG_BEDROOM,
        text: '【Chapter 3: 逃离与雷霆】',
        speakerId: 'system',
        bgm: AUDIO.BGM_WIND
      },
      {
        text: '翌日清晨。寝殿一片狼藉。沈清秋在一阵酸痛中醒来，记忆如潮水回笼。',
        characterUpdates: [
           { characterId: 'yue', position: CharacterPosition.HIDDEN, expression: 'hidden' },
           { characterId: 'shen', position: CharacterPosition.CENTER, expression: 'despair' }
        ]
      },
      {
        speakerId: 'shen',
        text: '（看着身侧熟睡的岳清源，脸色惨白）（内心）太可笑了。太下贱了。真正让我崩溃的是……昨晚那场荒唐中，我竟感到一丝满足。我竟然……还是爱着这个恨了半辈子的人。',
        expression: 'despair'
      },
      {
        speakerId: 'shen',
        text: '逃。',
        expression: 'despair'
      },
      {
        text: '沈清秋抓了件外袍，狼狈逃离苍穹山。',
        characterUpdates: [
           { characterId: 'shen', position: CharacterPosition.HIDDEN, expression: 'hidden' }
        ]
      },
      {
        speakerId: 'yue',
        text: '（醒来面对空荡的怀抱，心头一慌）小九？',
        characterUpdates: [
           { characterId: 'yue', position: CharacterPosition.CENTER, expression: 'worried' }
        ]
      },
      {
        text: '没有。哪里都没有。岳清源看着满地狼藉——碎裂的青衫、染血锦被。他愿受这份恨，还以为只要负责，或许……可小九逃了。',
      },
      {
        bgImage: ASSETS.BG_QIANCAO,
        speakerId: 'mu',
        text: '（脸色煞白）掌……掌门师兄？这……主料没问题，但辅料“龙涎草”被换成了“合欢千叶红”！这是合欢宗流出的劣质催情辅料……是安定峰采购的。',
        characterUpdates: [
           { characterId: 'yue', position: CharacterPosition.LEFT, expression: 'dark' },
           { characterId: 'mu', position: CharacterPosition.RIGHT, expression: 'neutral' } 
        ]
      },
      {
        speakerId: 'yue',
        text: '（气极反笑，笑容渗人）省钱？传我掌门令。尚清华滥用职权，采购劣药，致同门受害，险酿大祸。即日起，革去尚清华安定峰峰主半年俸禄，罚没私库充公。命他亲自清理那批劣药，一颗不许剩。',
        expression: 'dark',
        characterUpdates: [
           { characterId: 'yue', position: CharacterPosition.CENTER, expression: 'dark' },
           { characterId: 'mu', position: CharacterPosition.HIDDEN, expression: 'hidden' } 
        ]
      },
      {
        speakerId: 'yue',
        text: '还有，禁足安定峰三个月，让他把以前所有账目重算一遍。若再有纰漏，我就让他去百战峰给柳师弟当陪练。',
        expression: 'determined'
      },
      {
        bgImage: ASSETS.BG_CLIFF,
        speakerId: 'yue',
        text: '（抚摸着脖颈上的带血吻痕）小九……哪怕翻遍九州，我也要找到你。',
        expression: 'dark',
        jumpToScene: 'chapter_4'
      }
    ]
  },
  'chapter_4': {
    id: 'chapter_4',
    lines: [
      {
        bgImage: ASSETS.BG_RUINS,
        text: '【Chapter 4: 废墟对峙】',
        speakerId: 'system',
        bgm: AUDIO.BGM_WIND
      },
      {
        text: '沈清秋像一缕游魂，兜兜转转回到了那片焦土废墟。曾经的秋府。',
        characterUpdates: [
            { characterId: 'yue', position: CharacterPosition.HIDDEN, expression: 'hidden' },
            { characterId: 'shen', position: CharacterPosition.CENTER, expression: 'despair' }
        ]
      },
      {
        speakerId: 'shen',
        text: '（对着废墟嘶哑低吼）为什么……既当初弃我，如今又何必假惺惺来招惹！',
        expression: 'despair'
      },
      {
        speakerId: 'yue',
        text: '（突然出现，扣住他的手腕）我不放。你还要躲到几时？',
        characterUpdates: [
            { characterId: 'shen', position: CharacterPosition.LEFT, expression: 'despair' },
            { characterId: 'yue', position: CharacterPosition.RIGHT, expression: 'sorrow' }
        ]
      },
      {
        speakerId: 'shen',
        text: '（眼尾泛红，冷笑讥讽）岳掌门若怕我败坏苍穹山名声，大可清理门户！似我这般流连烟花柳巷之人，本来就脏……',
        expression: 'disdain'
      },
      {
        speakerId: 'yue',
        text: '（一声暴喝）住口！你以为那晚是我救了你？小九，那是你在自救！是你心里终于肯让我靠近，肯哭着喊我一声七哥……你逃根本不是因为恨我，你是恨你自己！',
        expression: 'dark'
      },
      {
        speakerId: 'shen',
        text: '（彻底崩溃）闭嘴……你闭嘴！！',
        expression: 'shame'
      },
      {
        speakerId: 'yue',
        text: '（赤红着眼乞求）你若还有恨，拔出玄肃取我性命！只求你，别再作践你自己！',
        expression: 'sorrow',
        choices: [
          { text: '既然知道，那就去死！', nextSceneId: 'chapter_4_truth' },
          { text: '停手，转身离开', nextSceneId: 'be_stranger' }
        ]
      }
    ]
  },
  'be_stranger': {
    id: 'be_stranger',
    lines: [
      { bgImage: ASSETS.BG_BLACK, text: '【Bad End: 陌路】沈清秋最终放下了剑，也放下了这段纠缠半生的孽缘，从此消失于江湖，与岳清源死生不复相见。', bgm: AUDIO.BGM_WIND }
    ]
  },
  'chapter_4_truth': {
    id: 'chapter_4_truth',
    lines: [
      {
        speakerId: 'shen',
        text: '既然知道，那就去死！！',
        expression: 'shame'
      },
      {
        text: '嗡——！！！凄厉的剑鸣。血色灵光炸裂，进入记忆闪回。',
        bgImage: ASSETS.CG_MEMORY,
        soundEffect: AUDIO.SFX_SWORD
      },
      {
        text: '剑锋即将贯穿胸膛的刹那，岳清源腰间玄肃剑骤然发出一声凄厉悲鸣！那非护主剑气，而是灵魂深处的共鸣与哀嚎。沈清秋的神识被强行拽入一片混沌的记忆之海。',
        characterUpdates: [
            { characterId: 'shen', position: CharacterPosition.HIDDEN, expression: 'hidden' },
            { characterId: 'yue', position: CharacterPosition.HIDDEN, expression: 'hidden' }
        ]
      },
      {
        text: '（记忆闪回）“若无路可走，便以命开路。”少年岳七跌跌撞撞御剑冲向秋府，口中溢血，却在笑：“小九……等我……七哥来了……”',
      },
      {
        bgImage: ASSETS.BG_RUINS,
        speakerId: 'shen',
        text: '（冷汗湿透，跪倒在尘埃里）这剑鸣……直到这一刻，我才终于听懂了这句话……“拔出玄肃取我性命”。那不是一把剑，那是岳清源的命！',
        characterUpdates: [
            { characterId: 'shen', position: CharacterPosition.CENTER, expression: 'shocked' }
        ]
      },
      {
        text: '所有的怨恨、刻薄、自厌，在这份沉重窒息的真相面前，显得如此可笑苍白。',
      },
      {
        speakerId: 'yue',
        text: '（面色惨白，正欲转身离去）……',
        characterUpdates: [
            { characterId: 'shen', position: CharacterPosition.LEFT, expression: 'shocked' },
            { characterId: 'yue', position: CharacterPosition.RIGHT, expression: 'sorrow' }
        ]
      },
      {
        speakerId: 'shen',
        text: '（跌撞上前，死死扣住他的腰背，泪水汹涌）七哥……',
        expression: 'shocked'
      },
      {
        speakerId: 'yue',
        text: '（浑身巨震，狠狠将怀中人揉进骨血）我在。小九，我们……回家。回苍穹山。',
        expression: 'gentle',
        jumpToScene: 'chapter_5'
      }
    ]
  },
  'chapter_5': {
    id: 'chapter_5',
    lines: [
      {
        bgImage: ASSETS.BG_BEDROOM,
        text: '【Chapter 5: 尾声 - 归途】',
        speakerId: 'system',
        bgm: AUDIO.BGM_WARM
      },
      {
        text: '尘埃落定。尚清华被废去修为打入水牢。苍穹山夜色重归宁静。掌门寝殿，仍是那张床榻，气氛却截然不同。沈清秋体内余毒沉积，需靠双修化解。',
        characterUpdates: [
           { characterId: 'shen', position: CharacterPosition.HIDDEN, expression: 'hidden' },
           { characterId: 'yue', position: CharacterPosition.HIDDEN, expression: 'hidden' }
        ]
      },
      {
        speakerId: 'yue',
        text: '（手指轻抚他的眉眼）小九，可能会有点疼，忍一忍。',
        characterUpdates: [
           { characterId: 'yue', position: CharacterPosition.RIGHT, expression: 'gentle' },
           { characterId: 'shen', position: CharacterPosition.LEFT, expression: 'soft' }
        ]
      },
      {
        speakerId: 'shen',
        text: '（睫毛颤了颤，耳根微红）啰嗦……快点。',
        expression: 'soft'
      },
      {
        bgImage: ASSETS.CG_KISS,
        text: '沈清秋仰起头，笨拙而坚定地吻上岳清源。',
        characterUpdates: [
           { characterId: 'yue', position: CharacterPosition.HIDDEN, expression: 'hidden' },
           { characterId: 'shen', position: CharacterPosition.HIDDEN, expression: 'hidden' }
        ]
      },
      {
        text: '那场由劣质丹药引发的烈火，曾差点将他们焚毁。可最终，这把火烧尽了所有的虚伪、隔阂与误解，将两颗早已千疮百孔的心，重新熔铸在了一起。',
      },
      {
        text: '情不知所起，一往而深。恨不知所终，一笑而泯。',
      },
      {
        text: '【Happy End: 归途】',
        choices: []
      }
    ]
  }
};
