/** 全局游戏状态（唯一可变状态源，所有模块从这里读写） */

import { ITEM_QUOTA } from '../config.js';

export const state = {
  levelIdx: 0,
  tiles: [],        // Tile[] { id, type, layer, x, y, el, onBoard, covered }
  tray: [],         // 卡槽内的 Tile
  undoStack: [],    // 撤销栈：玩家点击过的芯片，按序回放
  scale: 1,         // 牌区自适应缩放比
  boardW: 0,
  boardH: 0,
  lock: false,      // 消除动画期间锁输入
  score: 0,
  shuffleLeft: ITEM_QUOTA.shuffle,
  undoLeft: ITEM_QUOTA.undo,
};

/* ---------- 关卡解锁进度（localStorage 持久化） ---------- */

const STORAGE_KEY = 'neonSheep.unlocked';

export const unlockedLevels = () => Number(localStorage.getItem(STORAGE_KEY) || 1);

export function unlockNext(levelIdx) {
  // 通关 STAGE N（levelIdx = N-1）应解锁 STAGE N+1，即 unlocked = levelIdx + 2。
  // 边界：默认 unlocked=1，通关第 1 关时目标值为 2，">" 判断可正确写入
  // （旧实现写 levelIdx+1 与默认值相等，导致第 1 关永远无法解锁第 2 关）。
  const target = levelIdx + 2;
  if (target > unlockedLevels()) {
    localStorage.setItem(STORAGE_KEY, String(target));
  }
}

/* ---------- 设置与最佳记录（localStorage 持久化） ---------- */

const MUTE_KEY = 'neonSheep.muted';
export const isMuted = () => localStorage.getItem(MUTE_KEY) === '1';
export const setMuted = (muted) => localStorage.setItem(MUTE_KEY, muted ? '1' : '0');

const bestKey = (i) => `neonSheep.best.${i}`;
export const bestScore = (i) => Number(localStorage.getItem(bestKey(i)) || 0);
export function saveBestScore(levelIdx, score) {
  if (score > bestScore(levelIdx)) localStorage.setItem(bestKey(levelIdx), String(score));
}

/** 清空本游戏的全部本地数据（解锁进度 / 最佳分 / 音效偏好） */
export function resetAllProgress() {
  Object.keys(localStorage)
    .filter(k => k.startsWith('neonSheep.'))
    .forEach(k => localStorage.removeItem(k));
}
