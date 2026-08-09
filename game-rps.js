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
