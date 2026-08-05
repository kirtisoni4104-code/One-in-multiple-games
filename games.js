// ===================================================================
// GAME TAB SWITCHING
// ===================================================================
const gameTabs = document.querySelectorAll(".game-tab");
const gamePanels = {
  ttt: document.getElementById("game-ttt"),
  memory: document.getElementById("game-memory"),
  rps: document.getElementById("game-rps"),
  snake: document.getElementById("game-snake"),
  twenty48: document.getElementById("game-twenty48"),
  whack: document.getElementById("game-whack"),
  simon: document.getElementById("game-simon"),
  guess: document.getElementById("game-guess"),
};

gameTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    gameTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    Object.values(gamePanels).forEach(panel => panel.hidden = true);
    gamePanels[tab.dataset.game].hidden = false;

    // Start snake loop only when its tab is opened, and pause otherwise
    if (tab.dataset.game === "snake") startSnake();
    else pauseSnake();

    // Stop whack-a-mole timer if leaving that tab
    if (tab.dataset.game !== "whack") whackStop();
  });
});

// ===================================================================
// TIC-TAC-TOE (you = X, computer = O)
// ===================================================================
const tttBoardEl = document.getElementById("tttBoard");
const tttStatusEl = document.getElementById("tttStatus");
const tttResetBtn = document.getElementById("tttReset");

let tttBoard = Array(9).fill(null);
let tttOver = false;

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function tttRender() {
  tttBoardEl.innerHTML = "";
  tttBoard.forEach((val, i) => {
    const cell = document.createElement("div");
    cell.className = "ttt-cell" + (val ? " taken" : "");
    cell.textContent = val || "";
    cell.addEventListener("click", () => tttPlay(i));
    tttBoardEl.appendChild(cell);
  });
}

function tttWinner(board) {
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return { winner: board[a], line: [a,b,c] };
    }
  }
  if (board.every(v => v)) return { winner: "draw" };
  return null;
}

function tttPlay(i) {
  if (tttOver || tttBoard[i]) return;
  tttBoard[i] = "X";
  const result = tttWinner(tttBoard);
  if (result) return tttEnd(result);

  tttStatusEl.textContent = "Computer is thinking...";
  tttRender();

  setTimeout(() => {
    const move = tttBestMove();
    if (move !== -1) tttBoard[move] = "O";
    const result2 = tttWinner(tttBoard);
    if (result2) return tttEnd(result2);
    tttStatusEl.textContent = "Your turn — you are X";
    tttRender();
  }, 400);
}

// Simple AI: win if possible, block if needed, else center/corner/random
function tttBestMove() {
  const empty = tttBoard.map((v,i)=>v?null:i).filter(i=>i!==null);
  for (const i of empty) {
    const copy = [...tttBoard]; copy[i] = "O";
    if (tttWinner(copy)?.winner === "O") return i;
  }
  for (const i of empty) {
    const copy = [...tttBoard]; copy[i] = "X";
    if (tttWinner(copy)?.winner === "X") return i;
  }
  if (!tttBoard[4]) return 4;
  const corners = [0,2,6,8].filter(i => !tttBoard[i]);
  if (corners.length) return corners[Math.floor(Math.random()*corners.length)];
  return empty[Math.floor(Math.random()*empty.length)] ?? -1;
}

function tttEnd(result) {
  tttOver = true;
  if (result.winner === "draw") {
    tttStatusEl.textContent = "It's a draw!";
  } else {
    tttStatusEl.textContent = result.winner === "X" ? "You win! 🎉" : "Computer wins.";
    result.line?.forEach(i => {
      // mark winning cells after render
    });
  }
  tttRender();
  if (result.line) {
    result.line.forEach(i => tttBoardEl.children[i].classList.add("win"));
  }
}

tttResetBtn.addEventListener("click", () => {
  tttBoard = Array(9).fill(null);
  tttOver = false;
  tttStatusEl.textContent = "Your turn — you are X";
  tttRender();
});

tttRender();

// ===================================================================
// MEMORY MATCH
// ===================================================================
const memoryBoardEl = document.getElementById("memoryBoard");
const memoryStatusEl = document.getElementById("memoryStatus");
const memoryResetBtn = document.getElementById("memoryReset");

const MEMORY_ICONS = ["🌟","🍀","🎈","🐝","🌙","🍎","🎨","🚀"];
let memoryCards = [];
let memoryFlipped = [];
let memoryMatchedCount = 0;
let memoryLock = false;

function memoryShuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function memoryInit() {
  memoryCards = memoryShuffle([...MEMORY_ICONS, ...MEMORY_ICONS]);
  memoryFlipped = [];
  memoryMatchedCount = 0;
  memoryLock = false;
  memoryStatusEl.textContent = "Find all the matching pairs";
  memoryBoardEl.innerHTML = "";

  memoryCards.forEach((icon, i) => {
    const card = document.createElement("div");
    card.className = "memory-card";
    card.dataset.index = i;
    card.textContent = icon;
    card.addEventListener("click", () => memoryFlip(i));
    memoryBoardEl.appendChild(card);
  });
}

function memoryFlip(i) {
  if (memoryLock) return;
  const el = memoryBoardEl.children[i];
  if (el.classList.contains("flipped") || el.classList.contains("matched")) return;

  el.classList.add("flipped");
  memoryFlipped.push(i);

  if (memoryFlipped.length === 2) {
    memoryLock = true;
    const [a, b] = memoryFlipped;
    if (memoryCards[a] === memoryCards[b]) {
      memoryBoardEl.children[a].classList.add("matched");
      memoryBoardEl.children[b].classList.add("matched");
      memoryMatchedCount++;
      memoryFlipped = [];
      memoryLock = false;
      if (memoryMatchedCount === MEMORY_ICONS.length) {
        memoryStatusEl.textContent = "You found them all! 🎉";
      }
    } else {
      setTimeout(() => {
        memoryBoardEl.children[a].classList.remove("flipped");
        memoryBoardEl.children[b].classList.remove("flipped");
        memoryFlipped = [];
        memoryLock = false;
      }, 700);
    }
  }
}

memoryResetBtn.addEventListener("click", memoryInit);
memoryInit();

// ===================================================================
// ROCK PAPER SCISSORS
// ===================================================================
const rpsStatusEl = document.getElementById("rpsStatus");
const rpsScoreEl = document.getElementById("rpsScore");
const rpsButtons = document.querySelectorAll(".rps-btn");

let rpsUserScore = 0;
let rpsCompScore = 0;
const RPS_BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };
const RPS_EMOJI = { rock: "🪨", paper: "📄", scissors: "✂️" };

rpsButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const user = btn.dataset.choice;
    const options = ["rock", "paper", "scissors"];
    const comp = options[Math.floor(Math.random() * 3)];

    let outcome;
    if (user === comp) outcome = "It's a tie!";
    else if (RPS_BEATS[user] === comp) { outcome = "You win this round!"; rpsUserScore++; }
    else { outcome = "Computer wins this round."; rpsCompScore++; }

    rpsStatusEl.textContent = `You picked ${RPS_EMOJI[user]} — Computer picked ${RPS_EMOJI[comp]}. ${outcome}`;
    rpsScoreEl.textContent = `You: ${rpsUserScore} \u00b7 Computer: ${rpsCompScore}`;
  });
});

// ===================================================================
// SNAKE
// ===================================================================
const snakeCanvas = document.getElementById("snakeCanvas");
const snakeCtx = snakeCanvas.getContext("2d");
const snakeStatusEl = document.getElementById("snakeStatus");
const snakeResetBtn = document.getElementById("snakeReset");

const GRID = 16;
const CELLS = snakeCanvas.width / GRID;
let snake, direction, nextDirection, food, snakeScore, snakeTimer, snakeAlive;

function snakeRandomFood() {
  return {
    x: Math.floor(Math.random() * CELLS),
    y: Math.floor(Math.random() * CELLS)
  };
}

function snakeInit() {
  snake = [{ x: 7, y: 8 }, { x: 6, y: 8 }, { x: 5, y: 8 }];
  direction = "right";
  nextDirection = "right";
  food = snakeRandomFood();
  snakeScore = 0;
  snakeAlive = true;
  snakeStatusEl.textContent = "Score: 0 — use arrow keys or swipe";
  snakeDraw();
}

function snakeDraw() {
  snakeCtx.fillStyle = "#123332";
  snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);

  snakeCtx.fillStyle = "#E67E52";
  snakeCtx.fillRect(food.x * GRID, food.y * GRID, GRID - 2, GRID - 2);

  snakeCtx.fillStyle = "#F2E9D8";
  snake.forEach((seg, i) => {
    snakeCtx.fillStyle = i === 0 ? "#FFFDF9" : "#F2E9D8";
    snakeCtx.fillRect(seg.x * GRID, seg.y * GRID, GRID - 2, GRID - 2);
  });
}

function snakeStep() {
  if (!snakeAlive) return;
  direction = nextDirection;
  const head = { ...snake[0] };
  if (direction === "up") head.y--;
  if (direction === "down") head.y++;
  if (direction === "left") head.x--;
  if (direction === "right") head.x++;

  // Wall collision
  if (head.x < 0 || head.y < 0 || head.x >= CELLS || head.y >= CELLS) {
    return snakeGameOver();
  }
  // Self collision
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    return snakeGameOver();
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    snakeScore++;
    food = snakeRandomFood();
    snakeStatusEl.textContent = `Score: ${snakeScore} — use arrow keys or swipe`;
  } else {
    snake.pop();
  }

  snakeDraw();
}

function snakeGameOver() {
  snakeAlive = false;
  snakeStatusEl.textContent = `Game over — score: ${snakeScore}. Press Restart to try again.`;
}

function startSnake() {
  if (snakeTimer) return;
  snakeTimer = setInterval(snakeStep, 130);
}
function pauseSnake() {
  clearInterval(snakeTimer);
  snakeTimer = null;
}

const SNAKE_OPPOSITE = { up: "down", down: "up", left: "right", right: "left" };
document.addEventListener("keydown", (e) => {
  const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
  const dir = map[e.key];
  if (dir && SNAKE_OPPOSITE[dir] !== direction) {
    nextDirection = dir;
    e.preventDefault();
  }
});

// Basic swipe support for touch screens
let touchStartX = 0, touchStartY = 0;
snakeCanvas.addEventListener("touchstart", (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
snakeCanvas.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  let dir;
  if (Math.abs(dx) > Math.abs(dy)) dir = dx > 0 ? "right" : "left";
  else dir = dy > 0 ? "down" : "up";
  if (SNAKE_OPPOSITE[dir] !== direction) nextDirection = dir;
});

snakeResetBtn.addEventListener("click", snakeInit);
snakeInit();

// ===================================================================
// 2048
// ===================================================================
const t48BoardEl = document.getElementById("t48Board");
const t48StatusEl = document.getElementById("t48Status");
const t48ResetBtn = document.getElementById("t48Reset");
const T48_SIZE = 4;
let t48Grid, t48Score, t48Over;

function t48EmptyGrid() {
  return Array.from({ length: T48_SIZE }, () => Array(T48_SIZE).fill(0));
}

function t48AddTile() {
  const empty = [];
  for (let r = 0; r < T48_SIZE; r++)
    for (let c = 0; c < T48_SIZE; c++)
      if (t48Grid[r][c] === 0) empty.push([r, c]);
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  t48Grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

const T48_COLORS = {
  0: "#F2E9D8", 2: "#EFE6D5", 4: "#EADFC7", 8: "#E67E52",
  16: "#E0703F", 32: "#D4602E", 64: "#C4501F",
  128: "#1B4B4A", 256: "#164140", 512: "#123332",
  1024: "#0E2827", 2048: "#0A1D1C"
};

function t48Render() {
  t48BoardEl.innerHTML = "";
  for (let r = 0; r < T48_SIZE; r++) {
    for (let c = 0; c < T48_SIZE; c++) {
      const val = t48Grid[r][c];
      const tile = document.createElement("div");
      tile.className = "t48-tile";
      tile.style.background = T48_COLORS[val] || "#0A1D1C";
      tile.style.color = val <= 4 ? "#232323" : "#FFFDF9";
      tile.textContent = val || "";
      t48BoardEl.appendChild(tile);
    }
  }
  t48StatusEl.textContent = (t48Over ? "No more moves — game over. " : "") + `Score: ${t48Score} — use arrow keys to slide tiles`;
}

function t48Slide(row) {
  let arr = row.filter(v => v !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      t48Score += arr[i];
      arr.splice(i + 1, 1);
    }
  }
  while (arr.length < T48_SIZE) arr.push(0);
  return arr;
}

function t48Move(dir) {
  if (t48Over) return;
  const before = JSON.stringify(t48Grid);
  let grid = t48Grid;

  function rotate(g) {
    const n = g.length;
    const res = t48EmptyGrid();
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) res[c][n - 1 - r] = g[r][c];
    return res;
  }

  let rotations = { left: 0, down: 1, right: 2, up: 3 }[dir];
  for (let i = 0; i < rotations; i++) grid = rotate(grid);
  grid = grid.map(t48Slide);
  for (let i = 0; i < (4 - rotations) % 4; i++) grid = rotate(grid);

  t48Grid = grid;
  if (JSON.stringify(t48Grid) !== before) {
    t48AddTile();
    if (t48IsGameOver()) t48Over = true;
  }
  t48Render();
}

function t48IsGameOver() {
  for (let r = 0; r < T48_SIZE; r++) {
    for (let c = 0; c < T48_SIZE; c++) {
      if (t48Grid[r][c] === 0) return false;
      if (c < T48_SIZE - 1 && t48Grid[r][c] === t48Grid[r][c + 1]) return false;
      if (r < T48_SIZE - 1 && t48Grid[r][c] === t48Grid[r + 1][c]) return false;
    }
  }
  return true;
}

function t48Init() {
  t48Grid = t48EmptyGrid();
  t48Score = 0;
  t48Over = false;
  t48AddTile();
  t48AddTile();
  t48Render();
}

document.addEventListener("keydown", (e) => {
  if (gamePanels.twenty48.hidden) return;
  const map = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right" };
  if (map[e.key]) {
    e.preventDefault();
    t48Move(map[e.key]);
  }
});

t48ResetBtn.addEventListener("click", t48Init);
t48Init();

// ===================================================================
// WHACK-A-MOLE
// ===================================================================
const whackGridEl = document.getElementById("whackGrid");
const whackStatusEl = document.getElementById("whackStatus");
const whackStartBtn = document.getElementById("whackStart");
const WHACK_HOLES = 9;
let whackScore = 0, whackTimeLeft = 20, whackMoleTimer = null, whackClockTimer = null, whackActiveHole = -1;

function whackRenderHoles() {
  whackGridEl.innerHTML = "";
  for (let i = 0; i < WHACK_HOLES; i++) {
    const hole = document.createElement("div");
    hole.className = "whack-hole";
    hole.dataset.index = i;
    hole.innerHTML = '<div class="whack-mole"></div>';
    hole.addEventListener("click", () => whackHit(i));
    whackGridEl.appendChild(hole);
  }
}
whackRenderHoles();

function whackHit(i) {
  if (i !== whackActiveHole) return;
  whackScore++;
  whackActiveHole = -1;
  whackGridEl.children[i].classList.remove("up");
  whackStatusEl.textContent = `Score: ${whackScore} — Time: ${whackTimeLeft}s`;
}

function whackPopRandom() {
  if (whackActiveHole !== -1) whackGridEl.children[whackActiveHole].classList.remove("up");
  whackActiveHole = Math.floor(Math.random() * WHACK_HOLES);
  whackGridEl.children[whackActiveHole].classList.add("up");
}

function whackStart() {
  whackStop();
  whackScore = 0;
  whackTimeLeft = 20;
  whackStatusEl.textContent = `Score: 0 — Time: ${whackTimeLeft}s`;
  whackMoleTimer = setInterval(whackPopRandom, 750);
  whackClockTimer = setInterval(() => {
    whackTimeLeft--;
    whackStatusEl.textContent = `Score: ${whackScore} — Time: ${whackTimeLeft}s`;
    if (whackTimeLeft <= 0) {
      whackStop();
      whackStatusEl.textContent = `Time's up! Final score: ${whackScore}`;
    }
  }, 1000);
}

function whackStop() {
  clearInterval(whackMoleTimer);
  clearInterval(whackClockTimer);
  whackMoleTimer = null;
  whackClockTimer = null;
  if (whackActiveHole !== -1 && whackGridEl.children[whackActiveHole]) {
    whackGridEl.children[whackActiveHole].classList.remove("up");
  }
  whackActiveHole = -1;
}

whackStartBtn.addEventListener("click", whackStart);

// ===================================================================
// SIMON SAYS
// ===================================================================
const simonStatusEl = document.getElementById("simonStatus");
const simonStartBtn = document.getElementById("simonStart");
const simonPads = document.querySelectorAll(".simon-pad");
let simonSequence = [], simonUserStep = 0, simonAccepting = false, simonRound = 0;

function simonFlash(index) {
  return new Promise(resolve => {
    const pad = simonPads[index];
    pad.classList.add("lit");
    setTimeout(() => {
      pad.classList.remove("lit");
      setTimeout(resolve, 200);
    }, 400);
  });
}

async function simonPlaySequence() {
  simonAccepting = false;
  simonStatusEl.textContent = `Round ${simonRound} — watch closely...`;
  await new Promise(r => setTimeout(r, 500));
  for (const step of simonSequence) {
    await simonFlash(step);
  }
  simonUserStep = 0;
  simonAccepting = true;
  simonStatusEl.textContent = `Round ${simonRound} — your turn`;
}

function simonStart() {
  simonSequence = [];
  simonRound = 0;
  simonNextRound();
}

function simonNextRound() {
  simonRound++;
  simonSequence.push(Math.floor(Math.random() * 4));
  simonPlaySequence();
}

simonPads.forEach((pad, i) => {
  pad.addEventListener("click", () => {
    if (!simonAccepting) return;
    pad.classList.add("lit");
    setTimeout(() => pad.classList.remove("lit"), 200);

    if (i === simonSequence[simonUserStep]) {
      simonUserStep++;
      if (simonUserStep === simonSequence.length) {
        simonAccepting = false;
        setTimeout(simonNextRound, 700);
      }
    } else {
      simonAccepting = false;
      simonStatusEl.textContent = `Game over — you reached round ${simonRound}. Press Start to try again.`;
    }
  });
});

simonStartBtn.addEventListener("click", simonStart);

// ===================================================================
// GUESS THE NUMBER
// ===================================================================
const guessStatusEl = document.getElementById("guessStatus");
const guessInputEl = document.getElementById("guessInput");
const guessSubmitBtn = document.getElementById("guessSubmit");
const guessTriesEl = document.getElementById("guessTries");
const guessResetBtn = document.getElementById("guessReset");
let guessTarget, guessTries, guessSolved;

function guessInit() {
  guessTarget = Math.floor(Math.random() * 100) + 1;
  guessTries = 0;
  guessSolved = false;
  guessStatusEl.textContent = "I'm thinking of a number between 1 and 100";
  guessTriesEl.textContent = "Tries: 0";
  guessInputEl.value = "";
}

function guessSubmit() {
  if (guessSolved) return;
  const val = Number(guessInputEl.value);
  if (!val || val < 1 || val > 100) {
    guessStatusEl.textContent = "Enter a number between 1 and 100";
    return;
  }
  guessTries++;
  guessTriesEl.textContent = `Tries: ${guessTries}`;

  if (val === guessTarget) {
    guessSolved = true;
    guessStatusEl.textContent = `Correct! The number was ${guessTarget}. 🎉`;
  } else if (val < guessTarget) {
    guessStatusEl.textContent = "Higher than that — try again";
  } else {
    guessStatusEl.textContent = "Lower than that — try again";
  }
}

guessSubmitBtn.addEventListener("click", guessSubmit);
guessInputEl.addEventListener("keydown", (e) => { if (e.key === "Enter") guessSubmit(); });
guessResetBtn.addEventListener("click", guessInit);
guessInit();

