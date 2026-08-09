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
