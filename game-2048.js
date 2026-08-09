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
