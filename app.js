// ===== In-memory "database" (resets on page reload — demo only) =====
let currentRole = "user";      // "user" or "admin"
let isLoggedIn = false;
let currentUser = { name: "", email: "", bio: "" };
let feedbackEntries = [];      // { name, rating, text }

// ===== Element references =====
const btnUser = document.getElementById("btnUser");
const btnAdmin = document.getElementById("btnAdmin");
const menuToggle = document.getElementById("menuToggle");
const navlinks = document.getElementById("navlinks");

const loginTitle = document.getElementById("loginTitle");
const loginSub = document.getElementById("loginSub");
const loginForm = document.getElementById("loginForm");
const logoutBtn = document.getElementById("logoutBtn");

const contactForm = document.getElementById("contactForm");
const contactStatus = document.getElementById("contactStatus");

const feedbackForm = document.getElementById("feedbackForm");
const userFeedbackList = document.getElementById("userFeedbackList");
const adminFeedbackPanel = document.getElementById("adminFeedbackPanel");
const adminFeedbackList = document.getElementById("adminFeedbackList");

const profileLocked = document.getElementById("profileLocked");
const profileForm = document.getElementById("profileForm");
const profileStatus = document.getElementById("profileStatus");
const adminUserPanel = document.getElementById("adminUserPanel");

// ===== Mobile menu toggle =====
menuToggle.addEventListener("click", () => {
  navlinks.classList.toggle("open");
});
navlinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => navlinks.classList.remove("open"));
});

// ===== Role switch (User / Admin) =====
function setRole(role) {
  currentRole = role;
  document.body.classList.toggle("admin-mode", role === "admin");

  btnUser.classList.toggle("active", role === "user");
  btnAdmin.classList.toggle("active", role === "admin");

  loginTitle.textContent = role === "admin" ? "Admin Login" : "User Login";
  loginSub.textContent = role === "admin"
    ? "Sign in to manage feedback and members."
    : "Sign in to see your profile and send feedback.";

  // Admin-only panels only show once logged in AND role is admin
  adminFeedbackPanel.hidden = !(isLoggedIn && role === "admin");
  adminUserPanel.hidden = !(isLoggedIn && role === "admin");
}

btnUser.addEventListener("click", () => setRole("user"));
btnAdmin.addEventListener("click", () => setRole("admin"));

// ===== Login / Logout =====
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("loginUsername").value.trim();
  if (!username) return;

  isLoggedIn = true;
  currentUser.name = username;

  loginForm.hidden = true;
  logoutBtn.style.display = "inline-block";
  loginSub.textContent = `Logged in as ${username} (${currentRole}).`;

  // Unlock profile section
  profileLocked.hidden = true;
  profileForm.hidden = false;
  document.getElementById("profileName").value = username;

  // Show admin panels if role is admin
  adminFeedbackPanel.hidden = !(currentRole === "admin");
  adminUserPanel.hidden = !(currentRole === "admin");

  renderFeedback();
});

logoutBtn.addEventListener("click", () => {
  isLoggedIn = false;
  currentUser = { name: "", email: "", bio: "" };

  loginForm.hidden = false;
  loginForm.reset();
  logoutBtn.style.display = "none";
  loginSub.textContent = currentRole === "admin"
    ? "Sign in to manage feedback and members."
    : "Sign in to see your profile and send feedback.";

  profileLocked.hidden = false;
  profileForm.hidden = true;
  adminFeedbackPanel.hidden = true;
  adminUserPanel.hidden = true;
});

// ===== Contact form =====
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  contactStatus.textContent = "Message sent. We'll reply soon.";
  contactForm.reset();
  setTimeout(() => { contactStatus.textContent = ""; }, 4000);
});

// ===== Feedback form =====
feedbackForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const rating = document.getElementById("feedbackRating").value;
  const text = document.getElementById("feedbackText").value.trim();
  if (!text) return;

  feedbackEntries.push({
    name: isLoggedIn ? currentUser.name : "Guest",
    rating: Number(rating),
    text
  });

  feedbackForm.reset();
  renderFeedback();
});

function renderFeedback() {
  // Public / user view: just the text and stars, no admin controls
  if (feedbackEntries.length === 0) {
    userFeedbackList.innerHTML = '<p class="empty-note">No feedback yet. Be the first to share yours.</p>';
    adminFeedbackList.innerHTML = '<p class="empty-note">Nothing submitted yet.</p>';
    return;
  }

  userFeedbackList.innerHTML = feedbackEntries.map(f => `
    <div class="feedback-item">
      <span class="stars">${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}</span>
      <p>${escapeHtml(f.text)}</p>
    </div>
  `).join("");

  // Admin view: same entries, plus who submitted them
  adminFeedbackList.innerHTML = feedbackEntries.map((f, i) => `
    <div class="feedback-item">
      <strong>${escapeHtml(f.name)}</strong> —
      <span class="stars">${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}</span>
      <p>${escapeHtml(f.text)}</p>
    </div>
  `).join("");
}

// ===== Profile form =====
profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  currentUser.name = document.getElementById("profileName").value.trim();
  currentUser.email = document.getElementById("profileEmail").value.trim();
  currentUser.bio = document.getElementById("profileBio").value.trim();

  profileStatus.textContent = "Profile saved.";
  setTimeout(() => { profileStatus.textContent = ""; }, 3000);
});

// ===== Helper: prevent HTML injection from user text =====
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ===== Init =====
setRole("user");
