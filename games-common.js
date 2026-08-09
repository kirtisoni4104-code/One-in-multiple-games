// ===================================================================
// GAME TAB SWITCHING (shared by all games)
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
