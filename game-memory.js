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
