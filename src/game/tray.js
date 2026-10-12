/** 卡槽：飞行入场动画 / 三消结算 / 槽位重排 */

import { state } from './state.js';
import { dom } from '../dom.js';
import { sfx } from '../audio/sfx.js';
import { refreshCoverage } from './coverage.js';
import { updateHUD } from '../ui/hud.js';
import { checkEnd } from './flow.js';

/** 芯片离场 → 立刻重算覆盖（点亮下层）→ FLIP 飞入卡槽 */
export function flyToTray(tile) {
  tile.onBoard = false;
  refreshCoverage();

  const slotEls = dom.tray.children;
  const slotIdx = state.tray.length;
  state.tray.push(tile);

  const first = tile.el.getBoundingClientRect();
  tile.el.classList.remove('covered', 'shake');
  tile.el.classList.add('in-tray');
  tile.el.style.zIndex = '';
  slotEls[slotIdx].classList.add('lit');
  slotEls[slotIdx].appendChild(tile.el);

  const last = tile.el.getBoundingClientRect();
  const dx = (first.left - last.left) / state.scale;
  const dy = (first.top - last.top) / state.scale;
  tile.el.style.transition = 'none';
  tile.el.style.transform = `translate(${dx}px,${dy}px) scale(${state.scale})`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    tile.el.style.transition = 'transform .3s cubic-bezier(.2,.9,.3,1.15)';
    tile.el.style.transform = 'translate(0,0) scale(1)';
  }));

  setTimeout(() => resolveTray(tile.type), 180);
}

/** 三消判定：凑满即爆裂消除，随后做胜负判定 */
export function resolveTray(type) {
  const idxs = [];
  state.tray.forEach((t, i) => {
    if (t.type === type && idxs.length < 3) idxs.push(i);
  });

  if (idxs.length === 3) {
    state.lock = true;
    sfx.match();
    idxs.forEach(i => state.tray[i].el.classList.add('pop'));
    setTimeout(() => {
      idxs.forEach(i => state.tray[i].el.remove());
      state.tray = state.tray.filter((_, i) => !idxs.includes(i));
      state.score += 30;
      // 清理撤销栈中的死条目（已消除芯片不可再撤销，避免撤销“无声无效”）
      state.undoStack = state.undoStack.filter(t => state.tray.includes(t));
      reflowTray();
      updateHUD();
      state.lock = false;
      checkEnd();
    }, 300);
  } else {
    updateHUD();
    checkEnd();
  }
}

/** 卡槽重排：消除后把剩余芯片按序填回槽位 */
export function reflowTray() {
  const slotEls = dom.tray.children;
  for (let i = 0; i < slotEls.length; i++) {
    slotEls[i].classList.toggle('lit', i < state.tray.length);
    const tile = state.tray[i];
    if (tile && tile.el.parentElement !== slotEls[i]) {
      slotEls[i].appendChild(tile.el);
    }
  }
}
