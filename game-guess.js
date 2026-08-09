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
