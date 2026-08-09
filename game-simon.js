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
