/** 覆盖判定：芯片被上层交叠芯片压住时不可点 */

import { T, EPS } from '../config.js';
import { state } from './state.js';

/** 两芯片矩形是否构成实质交叠（压角不算） */
export function overlaps(a, b) {
  return a.x < b.x + T - EPS && a.x + T > b.x + EPS &&
         a.y < b.y + T - EPS && a.y + T > b.y + EPS;
}

/** 遍历在牌区芯片，重算 covered 并同步视觉态（芯片离场 / 撤销 / 洗牌后必须调用） */
export function refreshCoverage() {
  const onBoard = state.tiles.filter(t => t.onBoard);
  for (const tile of onBoard) {
    tile.covered = onBoard.some(other =>
      other !== tile && other.layer > tile.layer && overlaps(tile, other));
    tile.el.classList.toggle('covered', tile.covered);
  }
}
