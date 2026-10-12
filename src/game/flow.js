/** 流程控制：胜负判定 / 关卡切换 */

import { state } from './state.js';
import { dom } from '../dom.js';
import { sfx } from '../audio/sfx.js';
import { buildLevel } from './level.js';
import { showClear, showGameOver } from '../ui/overlay.js';

/** 在场 + 卡槽剩余芯片总数 */
export function remaining() {
  return state.tiles.filter(t => t.onBoard).length + state.tray.length;
}

/** 每次卡槽结算后调用：先判胜（清空）再判负（卡槽满） */
export function checkEnd() {
  if (remaining() === 0) {
    sfx.win();
    showClear();
    return;
  }
  if (state.tray.length >= 7) {
    sfx.lose();
    showGameOver();
  }
}

/**
 * 进入关卡
 * @param {number} levelIdx
 * @param {{carry?: boolean}} opts  carry=true 时继承连击链上的累计分（“下一关”），
 *                                  其余入口（选关/重试/重开）一律从 0 计分
 */
export function startLevel(levelIdx, { carry = false } = {}) {
  state.levelIdx = levelIdx;
  state.score = carry ? state.score : 0;
  state.lock = false;
  dom.overlay.classList.add('hidden');
  buildLevel(levelIdx);
}
