/* ============================================================
   游戏配置 · 单一事实源
   调难度 / 加关卡 / 换图标只改这里
   ============================================================ */

/** 芯片边长（px），布局与覆盖判定的基准单位 */
export const T = 58;

/** 覆盖判定余量：交叠小于该像素视为仅压角，不算覆盖 */
export const EPS = 12;

/** 芯片图标，按类型索引取用 */
export const ICONS = ['🐑', '🔋', '🛸', '📡', '💾', '🧬', '⚡', '🍄', '🎮', '🪩', '💎', '🌵'];

/** 卡槽容量 */
export const TRAY_SLOTS = 7;

/** 三消所需数量 */
export const MATCH_COUNT = 3;

/**
 * 关卡表（难度递进）
 * types: 芯片类型数 | layers: 堆叠层数
 * cols/rows: 底层网格 | k: 每类芯片的“三联”组数（决定总牌量）
 */
export const LEVELS = [
  { name: '觉醒协议', types: 3, layers: 2, cols: 5, rows: 4, k: 3 },
  { name: '霓虹街区', types: 4, layers: 3, cols: 6, rows: 4, k: 3 },
  { name: '数据高塔', types: 5, layers: 4, cols: 6, rows: 5, k: 3 },
  { name: '电子牧场', types: 6, layers: 5, cols: 7, rows: 5, k: 3 },
  { name: '终局密钥', types: 7, layers: 6, cols: 7, rows: 6, k: 3 },
];

/** 每关道具配额 */
export const ITEM_QUOTA = { shuffle: 2, undo: 3 };
