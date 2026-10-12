/** 表现层：HUD 数据渲染 + 牌区自适应缩放 */

import { state } from '../game/state.js';
import { remaining } from '../game/flow.js';
import { dom } from '../dom.js';

export function updateHUD() {
  dom.hud.level.textContent = state.levelIdx + 1;
  dom.hud.score.textContent = state.score;
  dom.hud.left.textContent = remaining();
  dom.buttons.shuffle.querySelector('i').textContent = '×' + state.shuffleLeft;
  dom.buttons.undo.querySelector('i').textContent = '×' + state.undoLeft;
  dom.buttons.shuffle.disabled = state.shuffleLeft <= 0;
  dom.buttons.undo.disabled = state.undoLeft <= 0;
  // 卡槽危险预警：≥5 格时红色脉冲
  dom.tray.classList.toggle('danger', state.tray.length >= 5);
}

/** 牌区等比缩放：逻辑坐标固定，按可用宽度缩放显示 */
export function fitBoard() {
  const avail = dom.boardWrap.clientWidth;
  state.scale = Math.min(1, avail / state.boardW);
  dom.board.style.transform = `scale(${state.scale})`;
  dom.board.style.width = state.boardW + 'px';
  dom.board.style.height = state.boardH + 'px';
  dom.boardWrap.style.height = (state.boardH * state.scale) + 'px';
}
