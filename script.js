import Game from './module/game.js';
import GameUI from './module/rsp.js';

new GameUI(new Game(), document.querySelector('.main .wrapper'));
