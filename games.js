// ===================================================================
// GAME TAB SWITCHING
// ===================================================================
const gameTabs = document.querySelectorAll(".game-tab");
const gamePanels = {
  ttt: document.getElementById("game-ttt"),
  memory: document.getElementById("game-memory"),
  rps: document.getElementById("game-rps"),
  snake: document.getElementById("game-snake"),
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
