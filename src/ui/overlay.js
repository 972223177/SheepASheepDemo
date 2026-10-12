/** 表现层：覆盖式界面（开始选关 / 通关 / 失败） */

import { state, unlockedLevels, unlockNext, isMuted, setMuted, bestScore, saveBestScore, resetAllProgress } from '../game/state.js';
import { LEVELS } from '../config.js';
import { dom } from '../dom.js';
import { sfx } from '../audio/sfx.js';
import { startLevel } from '../game/flow.js';

function renderPanel(html) {
  dom.panel.innerHTML = html;
  dom.overlay.classList.remove('hidden');
}

function bind(selector, handler) {
  dom.panel.querySelectorAll(selector).forEach(el =>
    el.addEventListener('click', () => { sfx.click(); handler(el); }));
}

export function showStart() {
  const unlocked = unlockedLevels();
  renderPanel(`
    <h2 class="win">SYSTEM BOOT</h2>
    <p>赛博牧场数据溢出，芯片层层堆叠。<br>凑齐 3 枚同款芯片即可消除，7 格缓存被填满则系统崩溃。<br><b>通关当前区块，方可解锁下一节点。</b></p>
    <div class="level-grid">
      ${LEVELS.map((lv, i) => {
        const best = bestScore(i);
        return `
        <button class="lv-btn ${i >= unlocked ? 'locked' : ''}" data-lv="${i}" ${i >= unlocked ? 'disabled' : ''}>
          <span>STAGE ${i + 1} · ${lv.name}</span>
          <span class="tag">${i >= unlocked ? '🔒 通关上一关解锁'
            : `${lv.types} 类 / ${lv.layers} 层${best ? ` · BEST ${best}` : ''}`}</span>
        </button>`;
      }).join('')}
    </div>
    <div class="settings-row">
      <button class="mini-btn" id="set-sound">音效：${isMuted() ? 'OFF' : 'ON'}</button>
      <button class="mini-btn danger" id="set-reset">重置进度</button>
    </div>`);
  bind('.lv-btn:not(.locked)', el => startLevel(Number(el.dataset.lv)));
  dom.panel.querySelector('#set-sound').addEventListener('click', function () {
    setMuted(!isMuted());
    this.textContent = '音效：' + (isMuted() ? 'OFF' : 'ON');
    if (!isMuted()) sfx.click();
  });
  dom.panel.querySelector('#set-reset').addEventListener('click', () => {
    if (!confirm('确定清空全部关卡解锁与最佳记录？')) return;
    sfx.click();
    resetAllProgress();
    showStart();
  });
}

export function showClear() {
  unlockNext(state.levelIdx);
  saveBestScore(state.levelIdx, state.score);
  const isLast = state.levelIdx === LEVELS.length - 1;
  renderPanel(`
    <h2 class="win">${isLast ? 'ALL CLEAR' : 'STAGE CLEAR'}</h2>
    <p>${isLast
      ? '全部协议已破解，你清空了整座赛博牧场。'
      : '区块已净化，正在接入下一节点…'}<br>SCORE ${state.score}</p>
    ${isLast
      ? `<button class="cta" id="ov-menu">返回菜单</button>`
      : `<button class="cta" id="ov-next">下一关 ▸</button>
         <button class="cta ghost" id="ov-menu">返回菜单</button>`}`);
  const next = dom.panel.querySelector('#ov-next');
  if (next) next.addEventListener('click', () => { sfx.click(); startLevel(state.levelIdx + 1, { carry: true }); });
  dom.panel.querySelector('#ov-menu').addEventListener('click', () => { sfx.click(); showStart(); });
}

export function showGameOver() {
  renderPanel(`
    <h2 class="lose">BUFFER OVERFLOW</h2>
    <p>缓存溢出 · 系统崩溃于 STAGE ${state.levelIdx + 1}<br>SCORE ${state.score}</p>
    <button class="cta" id="ov-retry">重新接入 ▸</button>
    <button class="cta ghost" id="ov-menu">返回菜单</button>`);
  dom.panel.querySelector('#ov-retry').addEventListener('click', () => { sfx.click(); startLevel(state.levelIdx); });
  dom.panel.querySelector('#ov-menu').addEventListener('click', () => { sfx.click(); showStart(); });
}
