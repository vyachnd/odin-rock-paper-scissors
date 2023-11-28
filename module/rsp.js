class UIElement {
  constructor(dataFn) {
    this.dataFn = dataFn;
    this.elements = {};
    this.oldData = {};
  }

  get data() { return this.dataFn(); }

  destroy() { }
  update() { }
  render() { }
}

class PlayerCard extends UIElement {
  constructor(dataFn) {
    super(dataFn);
  }

  updateHistory(historyArr) {
    const { history, historyItems } = this.elements;
    const max = Math.max(historyItems.length, historyArr.length);

    function setItem(item, data) {
      item.className = '';

      item.classList.add('player-card__history__item');
      item.textContent = data.figure.symbol;

      if (data.isWinner) item.classList.add('player-card__history__item_win');
      if (data.isDraw) item.classList.add('player-card__history__item_draw');
    }

    for (let i = 0; i < max; i += 1) {
      const newData = historyArr[i];
      const oldData = this.oldData.history?.[i];
      const item = historyItems?.[i];

      if (newData) {
        if (item) {
          if (newData !== oldData) {
            setItem(item, newData);
          }
        } else {
          const historyItem = document.createElement('span');
          setItem(historyItem, newData);

          historyItems.push(historyItem);
          history.append(historyItem);
        }
      } else {
        const { historyItems } = this.elements;
        const lastIndex = this.elements.historyItems.length;

        if (lastIndex) {
          historyItems[lastIndex - 1].remove();
          historyItems.pop();
        }
      }
    }
  }

  update() {
    const data = this.data;
    const { score, name } = this.elements;

    if (data.hasOwnProperty('score') && (data.score !== this.oldData.score)) {
      score.textContent = data.score;
    }
    if (data.hasOwnProperty('name') && (data.name !== this.oldData.name)) {
      name.textContent = data.name;
    }

    if (data.hasOwnProperty('history')) this.updateHistory(data.history);

    Object.assign(this.oldData, data);
  }

  render(parent, isRight) {
    const container = document.createElement('div');
    const header = document.createElement('div');
    const score = document.createElement('span');
    const name = document.createElement('h3');
    const history = document.createElement('div');

    container.classList.add('player-card');
    if (isRight) container.classList.add('player-card_right');
    header.classList.add('player-card__header');
    score.classList.add('player-card__score');
    name.classList.add('player-card__name');
    history.classList.add('player-card__history');

    header.append(score);
    header.append(name);
    container.append(header);
    container.append(history);

    this.elements = { score, name, history, historyItems: [] };
    this.update();

    parent.append(container);
  }
}

class RoundBoard extends UIElement {
  constructor(dataFn) {
    super(dataFn);
  }

  update() {
    const data = this.data;
    const { current, left } = this.elements;

    if (data.hasOwnProperty('current') && (data.current !== this.oldData.current)) {
      current.textContent = `Round ${data.current}`;
    }
    if (data.hasOwnProperty('left') && (data.left !== this.oldData.left)) {
      let msg = `${data.left} rounds left`;

      if (data.left <= 0) msg = 'Last round';

      left.textContent = msg;
    }

    Object.assign(this.oldData, data);
  }

  render(parent) {
    const container = document.createElement('div');
    const current = document.createElement('h2');
    const left = document.createElement('p');

    container.classList.add('round');
    current.classList.add('round__current');
    left.classList.add('round__left');

    container.append(current);
    container.append(left);

    this.elements = { current, left };
    this.update();

    parent.append(container);
  }
}

class Selector extends UIElement {
  constructor(dataFn) {
    super(dataFn);
  }

  unlock() {
    const { items } = this.elements;

    for (const item of items) {
      item.disabled = false;
    }
  }

  lock() {
    const { items } = this.elements;

    for (const item of items) {
      item.disabled = true;
    }
  }

  render(parent, callback) {
    const data = this.data;
    const container = document.createElement('div');
    container.classList.add('figure-selector');

    this.elements = { container, items: [] };

    for (const key in data.figures) {
      const figure = data.figures[key];
      const figureButton = document.createElement('button');
      figureButton.classList.add('figure-selector__figure-btn');

      figureButton.textContent = figure.symbol;
      figureButton.type = 'button';

      figureButton.addEventListener('click', () => callback(figure));

      container.append(figureButton);

      this.elements.items.push(figureButton);
    }

    parent.append(container);
  }
}

class FiguresChoiced extends UIElement {
  constructor(dataFn) {
    super(dataFn);
  }

  stopShake(callback, dealay = 1) {
    const { figureLeft, figureRight } = this.elements;

    const interval = setInterval(() => {
      clearInterval(interval);

      figureLeft.classList.remove('anim-shake');
      figureRight.classList.remove('anim-shake');

      if (callback) callback();
    }, dealay);
  }

  shake(callback, dealay = 1) {
    const { figureLeft, figureRight } = this.elements;

    const interval = setInterval(() => {
      clearInterval(interval);
      figureLeft.textContent = this.defaultFigure;
      figureRight.textContent = this.defaultFigure;

      figureLeft.classList.add('anim-shake');
      figureRight.classList.add('anim-shake');

      if (callback) callback();
    }, dealay);
  }

  update() {
    const data = this.data;
    const { figureLeft, figureRight } = this.elements;

    if (!data) {
      figureLeft.textContent = this.defaultFigure;
      figureRight.textContent = this.defaultFigure;
    } else {
      figureLeft.textContent = data[0].figure.symbol;
      figureRight.textContent = data[1].figure.symbol;
    }
  }

  render(parent, defaultFigure) {
    const container = document.createElement('div');
    const figureLeft = document.createElement('span');
    const figureRight = document.createElement('span');

    container.classList.add('figures-choiced');
    figureLeft.classList.add('figures-choiced__figure', 'anim-shake');
    figureRight.classList.add('figures-choiced__figure', 'figures-choiced__figure_right', 'anim-shake');

    figureLeft.textContent = defaultFigure;
    figureRight.textContent = defaultFigure;

    container.append(figureLeft);
    container.append(figureRight);

    this.elements = { figureLeft, figureRight };
    this.defaultFigure = defaultFigure;

    parent.append(container);
  }
}

class Modal extends UIElement {
  constructor(dataFn) {
    super(dataFn);
  }

  show() {
    const { container } = this.elements;

    container.classList.remove('modal_hidden');
    container.classList.add('modal_show');

    container.onanimationend = () => container.classList.remove('modal_show');
  }

  hide(callback) {
    const { container } = this.elements;
    const destroy = this.destroy.bind(this);

    container.classList.add('modal_hide');

    container.onanimationend = () => {
      container.classList.remove('modal_hide');
      destroy();

      if (callback) callback();
    }
  }

  destroy() {
    if (this.elements.container) this.elements.container.remove();
  }

  render(parent) {
    const data = this.data;
    const container = document.createElement('div');
    const blackout = document.createElement('div');
    const content = document.createElement('div');
    const contentHeader = document.createElement('div');
    const contentBody = document.createElement('div');
    const title = document.createElement('h3');
    const messageContainer = document.createElement('div');
    const submitBtn = document.createElement('button')

    container.classList.add('modal', 'modal_hidden');
    blackout.classList.add('modal__blackout');
    content.classList.add('modal__content');
    contentHeader.classList.add('modal__header');
    contentBody.classList.add('modal__body');
    title.classList.add('modal__title');
    messageContainer.classList.add('modal__message');
    submitBtn.classList.add('modal__submit');

    submitBtn.type = 'button';

    title.textContent = data.title;
    messageContainer.innerHTML = data.message;
    submitBtn.textContent = data.btnText;
    submitBtn.onclick = data.callback;

    contentHeader.append(title);
    contentBody.append(messageContainer);
    contentBody.append(submitBtn);
    content.append(contentHeader);
    content.append(contentBody);
    container.append(blackout);
    container.append(content);

    this.elements = { container, title, messageContainer, submitBtn };

    parent.append(container);
  }
}

const userWinMessage = (name) => `Congratulations, <strong class="lime">${name.toUpperCase()}</strong>, you have won! Do you want to try again?`;
const computerWinMessage = (name) => `Sorry, but the <strong class="red">${name.toUpperCase()}</strong> was luckier than you. Maybe it's worth trying again?`;
const drawMessage = () => `<strong>Draw</strong>... is friendship winning or do you want to play to the winner?`;

function GameUI(game, parent) {
  const [user, computer] = game.players;
  const leftRounds = () => game.maxRounds - (game.rounds.length + 1);

  const gameContainer = document.createElement('div');
  const gameHeader = document.createElement('div');
  const gameBody = document.createElement('div');
  const gameFooter = document.createElement('div');
  gameContainer.classList.add('game');
  gameHeader.classList.add('game__header');
  gameBody.classList.add('game__body');
  gameFooter.classList.add('game__footer');

  gameContainer.append(gameHeader);
  gameContainer.append(gameBody);
  gameContainer.append(gameFooter);

  const userCard = new PlayerCard(
    () => ({ name: user.name, score: user.score, history: game.rounds.map((round) => round[0]) }),
  );
  const computerCard = new PlayerCard(
    () => ({ name: computer.name, score: computer.score, history: game.rounds.map((round) => round[1]) })
  );
  const roundBoard = new RoundBoard(
    () => ({ current: Math.min(game.rounds.length + 1, game.maxRounds), left: leftRounds() })
  );
  const figuresChoiced = new FiguresChoiced(
    () => {
      const rounds = game.rounds;
      const lastRound = rounds[rounds.length - 1];

      return lastRound;
    }
  );
  const selector = new Selector(
    () => ({ figures: game.figures })
  );

  function update() {
    userCard.update();
    computerCard.update();
    roundBoard.update();
    figuresChoiced.update();
  }

  userCard.render(gameHeader);
  roundBoard.render(gameHeader);
  computerCard.render(gameHeader, true);
  figuresChoiced.render(gameBody, game.figures.ROCK.symbol);
  selector.render(gameFooter, (figure) => {
    const left = leftRounds();

    figuresChoiced.stopShake(() => {
      game.playerChoice(figure);
      game.playRound();

      selector.lock();

      update();

      if (left < 1) {
        const winner = game.gameWinner();
        let modalMessage = '';

        if (user === winner) modalMessage = userWinMessage(user.name);
        if (computer === winner) modalMessage = computerWinMessage(computer.name);
        if (winner === null) modalMessage = drawMessage();

        const modal = new Modal(
          () => ({
            title: 'Game end',
            message: modalMessage,
            btnText: 'Try again',
            callback() {
              game.clear();
              selector.unlock();
              figuresChoiced.shake();
              update();
              modal.hide();
            }
          })
        );

        modal.render(gameContainer);
        modal.show();
      } else {
        figuresChoiced.shake(() => {
          selector.unlock();
        }, 1000);
      }
    });
  });

  parent.append(gameContainer);
}

export default GameUI;