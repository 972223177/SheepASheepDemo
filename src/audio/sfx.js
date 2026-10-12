/** 轻量音效引擎：WebAudio 现场合成，无音频资源文件依赖 */

import { isMuted } from '../game/state.js';

let ctx = null;

function beep(freq, dur, type = 'square', gain = 0.045, delay = 0) {
  if (isMuted()) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    vol.gain.setValueAtTime(gain, t0);
    vol.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(vol);
    vol.connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch { /* 音频不可用（如自动播放策略）时静默降级 */ }
}

export const sfx = {
  click: () => beep(720, 0.07),
  deny: () => beep(130, 0.16, 'sawtooth', 0.05),
  match: () => {
    beep(660, 0.09);
    beep(880, 0.09, 'square', 0.045, 0.07);
    beep(1320, 0.12, 'square', 0.04, 0.14);
  },
  win: () => [523, 659, 784, 1046].forEach((f, i) => beep(f, 0.16, 'triangle', 0.05, i * 0.11)),
  lose: () => {
    beep(220, 0.25, 'sawtooth', 0.05);
    beep(110, 0.4, 'sawtooth', 0.05, 0.18);
  },
};
