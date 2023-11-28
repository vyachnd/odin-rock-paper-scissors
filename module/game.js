import Player from './player.js';

function Game() {
  const players = [
    new Player("User"),
    new Player('Computer'),
  ];
  const figures = {
    ROCK: { weight: 0, name: 'Rock', symbol: '✊' },
    PAPER: { weight: 1, name: 'Paper', symbol: '✋' },
    SCISSORS: { weight: 2, name: 'Scissors', symbol: '✌' },
  };
  const maxRounds = 5;
  const rounds = [];

  return {
    get players() { return [...players]; },
    get figures() { return { ...figures }; },
    get rounds() { return [...rounds]; },
    get maxRounds() { return maxRounds; },
    get userName() { return players[0].name; },
    getFigure(number) {
      const figuresKey = Object.keys(figures);

      if (!figuresKey[number]) return null;

      return figures[figuresKey[number]];
    },
    changeName(name) { players[0].changeName(name); },
    randomFigure() {
      const figuresKey = Object.keys(figures);
      const rndValue = Math.floor(Math.random() * figuresKey.length);
      const figure = figures[figuresKey[rndValue]];

      return figure;
    },
    checkWinner(player, enemy) {
      let diff = player.figure.weight - enemy.figure.weight;

      if (diff !== 0 && !(Math.abs(diff) % 2)) diff = -diff;
      if (diff > 0) return player;
      if (diff < 0) return enemy;

      return null;
    },
    gameWinner() {
      const [user, computer] = players;

      if (user.score > computer.score) return user;
      if (user.score < computer.score) return computer;

      return null;
    },
    saveRound(roundData) { rounds.push(roundData); },
    playRound() {
      if (rounds.length < maxRounds) {
        const [user, computer] = players;

        computer.setFigure(this.randomFigure());

        const winner = this.checkWinner(user, computer);
        if (winner) winner.incScore();

        this.saveRound([
          { player: user, figure: user.figure, isWinner: user === winner, isDraw: !winner },
          { player: computer, figure: computer.figure, isWinner: computer === winner, isDraw: !winner },
        ]);

        return rounds[rounds.length - 1];
      }
    },
    playerChoice(figure) { players[0].setFigure(figure); },
    clear() {
      const [user, computer] = players;
      rounds.length = 0;

      user.reset();
      computer.reset();
    },
  };
}

export default Game;
