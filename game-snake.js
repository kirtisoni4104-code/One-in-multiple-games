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
