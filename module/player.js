function Player(name) {
  let pScore = 0;
  let pName = name;
  let pFigure = null;

  return {
    get name() { return pName; },
    get score() { return pScore; },
    get figure() { return pFigure; },
    setFigure(figure) { pFigure = figure; },
    changeName(newName) { pName = newName; },
    incScore() { pScore += 1; },
    reset() {
      pScore = 0;
      pFigure = null;
    },
  };
}

export default Player;
