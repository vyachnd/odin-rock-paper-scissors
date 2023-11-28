import Game from './module/game.js';
import GameInterface from './module/gameInterface.js';

const game = new Game();
const gameInterface = new GameInterface();

const scenes = {
  'menu': {
    type: gameInterface.type.PROMPT,
    message: [
      'ROCK PAPER SCISSORS\n',
      '1 | Start game',
      () => `2 | Change name - ${game.userName}`,
      '3 | Exit',
      '\nEnter number',
    ],
    onSubmit(res) {
      switch (Number(res)) {
        case 1:
          game.clear();
          return gameInterface.render(scenes.startGame);
        case 2: return gameInterface.render(scenes.changeName);
        case 3: return gameInterface.render(scenes.exit);
        default: return gameInterface.update();
      }
    },
    onCancel() { gameInterface.update() },
  },
  'startGame': {
    type: gameInterface.type.PROMPT,
    message: [
      () => `ROUND ${game.rounds.length} / ${game.maxRounds}\n`,
      `1 | ${game.figures.ROCK.symbol} ${game.figures.ROCK.name}`,
      `2 | ${game.figures.PAPER.symbol} ${game.figures.PAPER.name}`,
      `3 | ${game.figures.SCISSORS.symbol} ${game.figures.SCISSORS.name}`,
      '\n0 | Main menu\n',
      'Enter your figure number',
    ],
    onSubmit(res) {
      if (res === '') return gameInterface.update();

      const resNum = Number(res);

      switch (resNum) {
        case 1:
        case 2:
        case 3:
          const figure = game.getFigure(resNum - 1);
          game.playerChoice(figure);
          game.playRound();

          return gameInterface.render(scenes.showRoundWinner, true);
        case 0:
          return gameInterface.render({
            type: gameInterface.type.CONFIRM,
            message: 'Are you sure want to go back to the menu? The game progress will not be saved',
            onSubmit() { gameInterface.backTo(); },
            onCancel() { gameInterface.update(); },
          }, true);
        default: return gameInterface.update();
      }
    },
    onCancel() { gameInterface.update(); },
  },
  'showRoundWinner': {
    type: gameInterface.type.ALERT,
    message: [
      () => {
        const rounds = game.rounds;
        const [user, computer] = rounds[rounds.length - 1];
        const winner = user.isWinner && user || computer.isWinner && computer;
        const winMessage = winner ? `${winner.player.name} wins the round!` : 'It\'s a DRAW!';

        return [
          `ROUND ${game.rounds.length}`,
          `[ ${user.player.score} ] ${user.player.name} | ${user.figure.symbol} vs ${computer.figure.symbol} | ${computer.player.name} [ ${computer.player.score} ]\n`,
          winMessage,
        ].join('\n');
      }
    ],
    onCancel() {
      if (game.rounds.length + 1 > game.maxRounds) {
        return gameInterface.render(scenes.showGameWinner, true);
      }

      return gameInterface.update();
    },
  },
  'showGameWinner': {
    type: gameInterface.type.CONFIRM,
    message: [
      () => {
        const gameWinner = game.gameWinner();
        const [user, computer] = game.players;

        if (gameWinner === computer) {
          return `Sorry, but the ${gameWinner.name.toUpperCase()} was luckier than you. His score is ${gameWinner.score} points. Maybe it's worth trying again?`;
        } else if (gameWinner === user) {
          return `Congratulate, ${gameWinner.name} have won! Your score is ${gameWinner.score} points. Maybe it's worth trying again?`;
        } else {
          return 'DRAW. Maybe it\'s worth trying again?';
        }
      },
    ],
    onSubmit() {
      game.clear();
      gameInterface.update();
    },
    onCancel() { gameInterface.backTo(); },
  },
  'changeName': {
    type: gameInterface.type.PROMPT,
    message: [
      () => `Your current name is ${game.userName}`,
      '\nMinimum length 3 and maximum length 24',
      '\nEnter new name',
    ],
    onSubmit(res) {
      if (res.length < 3 || res.length > 24) gameInterface.update();

      game.changeName(res);
      gameInterface.backTo();
    },
    onCancel() { gameInterface.backTo(); }
  },
  'exit': {
    type: gameInterface.type.CONFIRM,
    message: 'Are you sure want to exit from the game?',
    onSubmit() { game.clear(); },
    onCancel() { gameInterface.backTo(); },
  }
};

document
  .getElementById('start-game')
  .addEventListener('click', () => gameInterface.render(scenes.menu));
