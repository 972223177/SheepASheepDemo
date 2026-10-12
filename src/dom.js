/** DOM 引用集中管理：避免各模块重复 querySelector，也便于整体 mock 测试 */

const $ = (sel) => document.querySelector(sel);

export const dom = {
  board: $('#board'),
  boardWrap: $('#board-wrap'),
  tray: $('#tray'),
  overlay: $('#overlay'),
  panel: $('#panel'),
  hud: {
    level: $('#hud-level'),
    score: $('#hud-score'),
    left: $('#hud-left'),
  },
  buttons: {
    shuffle: $('#btn-shuffle'),
    undo: $('#btn-undo'),
    restart: $('#btn-restart'),
    menu: $('#btn-menu'),
  },
};
