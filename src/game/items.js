/** 道具：洗牌 / 撤销 / 重开 */

import { state } from './state.js';
import { dom } from '../dom.js';
import { sfx } from '../audio/sfx.js';
import { refreshCoverage } from './coverage.js';
import { reflowTray } from './tray.js';
import { startLevel } from './flow.js';
import { updateHUD } from '../ui/hud.js';
import { ICONS } from '../config.js';

/** 洗牌：在牌芯片间随机重排类型（不改变位置与覆盖关系） */
export function shuffle() {
  if (state.shuffleLeft <= 0 || state.lock) return;
  const onBoard = state.tiles.filter(t => t.onBoard);
  if (!onBoard.length) return;

  state.shuffleLeft--;
  sfx.click();

  const types = onBoard.map(t => t.type);
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  onBoard.forEach((t, i) => {
    t.type = types[i];
    t.el.textContent = ICONS[t.type];
  });
  updateHUD();
}

/** 撤销：把最近一次点入卡槽的芯片放回原位 */
export function undo() {
  if (state.undoLeft <= 0 || state.lock) return;
  const tile = state.undoStack.pop();
  if (!tile || !state.tray.includes(tile)) return;

  state.undoLeft--;
  sfx.click();

  state.tray = state.tray.filter(t => t !== tile);
  tile.onBoard = true;
  tile.el.classList.remove('in-tray', 'pop');
  tile.el.style.transform = '';
  tile.el.style.transition = '';
  tile.el.style.left = tile.x + 'px';
  tile.el.style.top = tile.y + 'px';
  tile.el.style.zIndex = tile.layer;
  dom.board.appendChild(tile.el);

  refreshCoverage();
  reflowTray();
  updateHUD();
}

/** 重开：重新生成本关布局，并按“新开一局”从 0 计分 */
export function restart() {
  sfx.click();
  startLevel(state.levelIdx);
}
