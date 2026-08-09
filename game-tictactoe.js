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
