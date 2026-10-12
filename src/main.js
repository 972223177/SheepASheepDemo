/** 入口：装配样式 + 绑定全局事件 + 启动 */

import './styles/main.css';
import { dom } from './dom.js';
import { showStart } from './ui/overlay.js';
import { fitBoard } from './ui/hud.js';
import { shuffle, undo, restart } from './game/items.js';

dom.buttons.shuffle.addEventListener('click', shuffle);
dom.buttons.undo.addEventListener('click', undo);
dom.buttons.restart.addEventListener('click', restart);
dom.buttons.menu.addEventListener('click', showStart);
window.addEventListener('resize', fitBoard);

showStart();
