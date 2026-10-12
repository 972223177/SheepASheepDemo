/** 关卡生成：布局计算 + 类型池分配 + DOM 渲染 */

import { T, ICONS, LEVELS, ITEM_QUOTA, TRAY_SLOTS } from '../config.js';
import { state } from './state.js';
import { dom } from '../dom.js';
import { sfx } from '../audio/sfx.js';
import { refreshCoverage, overlaps } from './coverage.js';
import { flyToTray } from './tray.js';
import { updateHUD, fitBoard } from '../ui/hud.js';

/**
 * 生成错位堆叠布局：逐层缩格 + 逐层向右下漂移，
 * 保证上下层芯片相互交叠（覆盖玩法的视觉与逻辑基础）
 */
function genPositions(cfg) {
  const pos = [];
  for (let l = 0; l < cfg.layers; l++) {
    const cols = Math.max(3, cfg.cols - l);
    const rows = Math.max(2, cfg.rows - Math.floor(l / 2));
    const dx = l * 14;
    const dy = l * 18;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        pos.push({ layer: l, x: dx + c * T, y: dy + r * T });
      }
    }
  }
  return pos;
}

/** 构建类型池：保证每种类型数量为 3 的倍数（三消可达） */
function buildTypePool(count, types) {
  const perType = count / types;
  const pool = [];
  for (let t = 0; t < types; t++) {
    for (let i = 0; i < perType; i++) pool.push(t);
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

function onTileClick(tile) {
  if (state.lock || !tile.onBoard) return;
  if (tile.covered) {
    sfx.deny();
    tile.el.classList.remove('shake');
    void tile.el.offsetWidth; // 重启动画
    tile.el.classList.add('shake');
    // 反馈增强：高亮显示是哪些上层芯片压住了它
    state.tiles
      .filter(o => o.onBoard && o !== tile && o.layer > tile.layer && overlaps(tile, o))
      .forEach(b => {
        b.el.classList.remove('blocker-flash');
        void b.el.offsetWidth;
        b.el.classList.add('blocker-flash');
      });
    return;
  }
  sfx.click();
  state.undoStack.push(tile);
  flyToTray(tile);
}

export function buildLevel(levelIdx) {
  const cfg = LEVELS[levelIdx];
  let positions = genPositions(cfg);
  const quota = cfg.types * 3 * cfg.k;
  if (positions.length > quota) positions = positions.slice(0, quota); // 从顶层裁剪

  const pad = 10;
  state.boardW = Math.max(...positions.map(p => p.x)) + T + pad * 2;
  state.boardH = Math.max(...positions.map(p => p.y)) + T + pad * 2;

  const pool = buildTypePool(positions.length, cfg.types);

  dom.board.innerHTML = '';
  state.tiles = positions.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'tile covered';
    el.textContent = ICONS[pool[i]];
    el.style.left = (p.x + pad) + 'px';
    el.style.top = (p.y + pad) + 'px';
    el.style.zIndex = p.layer;
    dom.board.appendChild(el);
    const tile = {
      id: i, type: pool[i], layer: p.layer,
      x: p.x + pad, y: p.y + pad,
      el, onBoard: true, covered: true,
    };
    el.addEventListener('pointerdown', () => onTileClick(tile));
    return tile;
  });

  state.tray = [];
  state.undoStack = [];
  state.shuffleLeft = ITEM_QUOTA.shuffle;
  state.undoLeft = ITEM_QUOTA.undo;

  dom.tray.innerHTML = '';
  for (let i = 0; i < TRAY_SLOTS; i++) {
    dom.tray.appendChild(Object.assign(document.createElement('div'), { className: 'slot' }));
  }

  refreshCoverage();
  updateHUD();
  fitBoard();
}
