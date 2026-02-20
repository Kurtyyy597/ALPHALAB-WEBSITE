// ============================
// WELCOME MESSAGE
// ============================
const welcomeEl = document.getElementById("welcomeMessage");

function setWelcomeMessage() {
  if (!welcomeEl) return;

  const hour = new Date().getHours();
  let message = "Welcome to Alpha Gym!";

  if (hour < 12) message = "Good morning! Start your day strong 💪";
  else if (hour < 18) message = "Good afternoon! Keep pushing 🔥";
  else message = "Good evening! Finish strong 🌙";

  welcomeEl.textContent = message;
}

setWelcomeMessage();

// ============================
// GYM OPEN / CLOSED STATUS + COUNTDOWN
// ============================
const statusEl = document.getElementById("gymStatus");

function updateGymStatus() {
  if (!statusEl) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday
  const hour = now.getHours();
  const minutes = now.getMinutes();

  let openTime, closeTime;

  // Sunday
  if (day === 0) {
    openTime = { h: 9, m: 0 }; // 9:00 AM
    closeTime = { h: 21, m: 0 }; // 9:00 PM
  } else {
    // Monday - Saturday
    openTime = { h: 8, m: 0 }; // 8:00 AM
    closeTime = { h: 23, m: 0 }; // 11:00 PM
  }

  const currentMinutes = hour * 60 + minutes;
  const openMinutes = openTime.h * 60 + openTime.m;
  const closeMinutes = closeTime.h * 60 + closeTime.m;

  statusEl.classList.remove("open", "closed");

  if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
    const minutesLeft = closeMinutes - currentMinutes;
    const hrs = Math.floor(minutesLeft / 60);
    const mins = minutesLeft % 60;

    statusEl.textContent = `OPEN 🟢 — Closes in ${hrs > 0 ? hrs + "h " : ""}${mins}m`;
    statusEl.classList.add("open");
  } else {
    let minutesUntilOpen;

    if (currentMinutes < openMinutes) {
      minutesUntilOpen = openMinutes - currentMinutes;
    } else {
      const tomorrow = (day + 1) % 7;
      const nextOpenMinutes = tomorrow === 0 ? 9 * 60 : 8 * 60;
      minutesUntilOpen = 24 * 60 - currentMinutes + nextOpenMinutes;
    }

    const hrs = Math.floor(minutesUntilOpen / 60);
    const mins = minutesUntilOpen % 60;

    statusEl.textContent = `CLOSED 🔴 — Opens in ${hrs > 0 ? hrs + "h " : ""}${mins}m`;
    statusEl.classList.add("closed");
  }
}

updateGymStatus();
setInterval(updateGymStatus, 60000);

// ============================
// SCROLL REVEAL ANIMATIONS
// ============================
const revealItems = document.querySelectorAll(
  ".train-card, .testimonial-card, .hero-title, .hero-paragraph, .join-box, .program-card, .stat-box, .faq-item",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("show");
    });
  },
  { threshold: 0.15 },
);

revealItems.forEach((el) => revealObserver.observe(el));

// ============================
// STICKY HEADER + SCROLL PROGRESS BAR
// ============================
const header = document.querySelector("header");

let progressBar = document.getElementById("scrollProgress");
if (!progressBar) {
  progressBar = document.createElement("div");
  progressBar.id = "scrollProgress";
  document.body.appendChild(progressBar);
}

window.addEventListener("scroll", () => {
  if (header) header.classList.toggle("sticky", window.scrollY > 50);

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = progress + "%";
});

// ============================
// TESTIMONIAL AUTO SLIDER
// ============================
const testimonials = document.querySelectorAll(".testimonial-card");
let currentTesti = 0;

function showTestimonial(index) {
  testimonials.forEach((card, i) => {
    card.style.display = i === index ? "block" : "none";
  });
}

if (testimonials.length > 0) {
  showTestimonial(currentTesti);
  setInterval(() => {
    currentTesti = (currentTesti + 1) % testimonials.length;
    showTestimonial(currentTesti);
  }, 5000);
}

// ============================
// JOIN BUTTON EFFECT + SOUND
// ============================
const joinButtons = document.querySelectorAll(".join-box");
const clickSound = new Audio(
  "https://www.soundjay.com/buttons/sounds/button-16.mp3",
);

joinButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.add("pulse");
    try {
      clickSound.currentTime = 0;
      clickSound.play();
    } catch (_) {}
    setTimeout(() => btn.classList.remove("pulse"), 200);
  });
});

// ============================
// BMI CALCULATOR + MODAL
// ============================
const bmiButton = document.getElementById("bmiButton");
const bmiModal = document.getElementById("bmiModal");
const calcBtn = document.getElementById("calcBMI");
const closeBtn = document.getElementById("closeBMI");
const backdrop = document.querySelector(".bmi-backdrop");

function openBMI() {
  if (!bmiModal) return;
  bmiModal.style.display = "flex";
  bmiModal.classList.add("open");
}

function closeBMI() {
  if (!bmiModal) return;
  bmiModal.classList.remove("open");
  bmiModal.style.display = "none";
}

if (bmiButton) bmiButton.addEventListener("click", openBMI);
if (closeBtn) closeBtn.addEventListener("click", closeBMI);
if (backdrop) backdrop.addEventListener("click", closeBMI);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeBMI();
});

if (calcBtn) {
  calcBtn.addEventListener("click", () => {
    const height = parseFloat(document.getElementById("bmiHeight")?.value);
    const weight = parseFloat(document.getElementById("bmiWeight")?.value);

    const resultEl = document.getElementById("bmiResult");
    const suggestionEl = document.getElementById("bmiSuggestion");

    if (!resultEl || !suggestionEl) return;

    if (!height || !weight) {
      resultEl.textContent = "Please enter valid height and weight.";
      resultEl.style.color = "#ff3c3c";
      suggestionEl.textContent = "";
      return;
    }

    const bmi = weight / (height / 100) ** 2;
    const rounded = bmi.toFixed(1);

    let category = "";
    let color = "#22c55e";
    let suggestion = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "#4da6ff";
      suggestion = `
🔹 Focus on strength training (3–4x/week)
🔹 Eat calorie-dense, protein-rich meals
🔹 Compound lifts: Squats, Bench, Deadlifts
🔹 Rest 7–9 hours per night
      `;
    } else if (bmi < 25) {
      category = "Normal (Healthy)";
      color = "#22c55e";
      suggestion = `
🔹 Mix strength + cardio (4–5x/week)
🔹 Progressive overload in workouts
🔹 Core training + flexibility work
🔹 Balanced nutrition and hydration
      `;
    } else if (bmi < 30) {
      category = "Overweight";
      color = "#fbbf24";
      suggestion = `
🔹 Start with low-impact cardio (walking, cycling)
🔹 Full-body strength training (3x/week)
🔹 Focus on calorie control and protein intake
🔹 Stretching and mobility work
      `;
    } else {
      category = "Obese";
      color = "#ef4444";
      suggestion = `
🔹 Begin with light cardio (10–20 mins/day)
🔹 Bodyweight exercises (wall push-ups, squats)
🔹 Consistency over intensity
🔹 Consult a trainer for a guided plan
      `;
    }

    resultEl.textContent = `Your BMI is ${rounded} — ${category}`;
    resultEl.style.color = color;

    suggestionEl.innerHTML = `
      <strong>Workout Suggestions:</strong><br>
      ${suggestion.trim().replace(/\n/g, "<br>")}
    `;
    suggestionEl.style.color = "rgba(232,238,247,0.85)";
  });
}

// ============================
// GALLERY LIGHTBOX
// ============================
document.addEventListener("DOMContentLoaded", function () {
  const galleryImages = document.querySelectorAll(".gallery-grid img");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  if (!galleryImages.length || !lightbox || !lightboxImg || !lightboxClose)
    return;

  galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
      lightbox.style.display = "flex";
      lightboxImg.src = img.src;
      document.body.style.overflow = "hidden";
    });
  });

  function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
});

// =============================
// Branches: Lightbox + Map Modal
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  const mapModal = document.getElementById("mapModal");
  const mapBackdrop = document.getElementById("mapBackdrop");
  const mapClose = document.getElementById("mapClose");
  const mapTitle = document.getElementById("mapTitle");
  const mapFrame = document.getElementById("mapFrame");

  const openLightbox = (src, alt = "Branch Image") => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.style.display = "flex";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.style.display = "none";
    lightboxImg.src = "";
  };

  const openMap = (title, mapUrl) => {
    if (!mapModal || !mapFrame) return;
    mapTitle.textContent = title || "Branch Location";
    mapFrame.src = mapUrl || "";
    mapModal.classList.add("show");
    mapModal.setAttribute("aria-hidden", "false");
  };

  const closeMap = () => {
    if (!mapModal || !mapFrame) return;
    mapModal.classList.remove("show");
    mapModal.setAttribute("aria-hidden", "true");
    mapFrame.src = "";
  };

  document.querySelectorAll(".branch-card").forEach((card) => {
    const imgSrc = card.getAttribute("data-img");
    const branchName = card.getAttribute("data-branch");
    const mapUrl = card.getAttribute("data-map");

    const viewBtn = card.querySelector(".branch-view");
    const mapBtn = card.querySelector(".branch-map");
    const imgEl = card.querySelector(".branch-media img");

    if (viewBtn)
      viewBtn.addEventListener("click", () => openLightbox(imgSrc, branchName));
    if (imgEl) {
      imgEl.style.cursor = "zoom-in";
      imgEl.addEventListener("click", () => openLightbox(imgSrc, branchName));
    }
    if (mapBtn)
      mapBtn.addEventListener("click", () => openMap(branchName, mapUrl));
  });

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  if (mapClose) mapClose.addEventListener("click", closeMap);
  if (mapBackdrop) mapBackdrop.addEventListener("click", closeMap);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
      closeMap();
    }
  });
});

// =============================
// Barber Image → Lightbox
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  const barberImage = document.querySelector(".barber-lightbox");

  if (barberImage) {
    barberImage.style.cursor = "zoom-in";

    barberImage.addEventListener("click", () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = barberImage.src;
      lightboxImg.alt = barberImage.alt;
      lightbox.style.display = "flex";
    });
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
      if (!lightbox) return;
      lightbox.style.display = "none";
    });
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) lightbox.style.display = "none";
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox) lightbox.style.display = "none";
  });
});

// ============================
// FREE ALPHA FITNESS CHATBOT (NO API)
// Full Upgrade Pack:
// 1) Dynamic Quick Replies (chips)
// 2) Last topic/plan + "tomorrow" followups
// 3) Goal Tracker (weight/steps/calories) + stats
// 4) Gym FAQ mode
// 5) Timers (timer/rest)
// 6) Exercise substitutions library
// 7) Form tips
// 8) Jokes/quotes/facts (daily fact)
// 9) Taglish detection + replies
// 10) Injury-safe assistant (non-red-flag)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const fab = document.getElementById("fitBotFab");
  const box = document.getElementById("fitBot");
  const closeBtn = document.getElementById("fitBotClose");
  const msgs = document.getElementById("fitBotMsgs");
  const form = document.getElementById("fitBotForm");
  const input = document.getElementById("fitBotText");
  const chips = document.getElementById("fitBotChips");
  const clearBtn = document.getElementById("fitBotClear");

  // Mode UI (requires updated HTML)
  const modeBtn = document.getElementById("fitBotMode");
  const subtitleEl = document.getElementById("fitBotSubtitle");

  const setupBtn = document.getElementById("fitBotSetup");
  const todayBtn = document.getElementById("fitBotToday");
  const mealsBtn = document.getElementById("fitBotMeals");
  const voiceBtn = document.getElementById("fitBotVoice");

  if (!fab || !box || !closeBtn || !msgs || !form || !input) return;

  // ---- storage keys
  const STORE_KEY = "alpha_fitbot_chat_v3";
  const PROFILE_KEY = "alpha_fitbot_profile_v3";
  const STREAK_KEY = "alpha_fitbot_streak_v1";
  const VOICE_KEY = "alpha_fitbot_voice_v1";
  const MODE_KEY = "alpha_fitbot_mode_v1"; // "friendly" | "fitness"
  const MEMORY_KEY = "alpha_fitbot_memory_v1"; // lastIntent,lastPlan,lastWorkoutDayIndex,lastGoal
  const TRACK_KEY = "alpha_fitbot_tracker_v1"; // logs
  const FACT_KEY = "alpha_fitbot_fact_day_v1";

  const profile = loadJson(PROFILE_KEY, {
    name: "",
    goal: "", // fatloss | muscle | strength
    level: "beginner", // beginner | intermediate | advanced
    days: 3,
    equipment: "gym", // gym | home
    minutes: 45,
  });

  let chatMode = loadJson(MODE_KEY, "friendly");

  const memory = loadJson(MEMORY_KEY, {
    lastIntent: "",
    lastPlan: "",
    lastWorkoutDayIndex: 0,
    lastGoal: "",
  });

  const tracker = loadJson(TRACK_KEY, {
    weight: [], // [{date, value}]
    steps: [], // [{date, value}]
    calories: [], // [{date, value}]
  });

  function saveMemory() {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  }
  function saveTracker() {
    localStorage.setItem(TRACK_KEY, JSON.stringify(tracker));
  }

  function updateModeUI() {
    if (modeBtn)
      modeBtn.textContent =
        chatMode === "fitness" ? "🔒 Fitness" : "🧠 Friendly";
    if (subtitleEl) {
      subtitleEl.textContent =
        chatMode === "fitness"
          ? "Fitness-only • Plans • Meals • Motivation"
          : "Friendly chat • Fitness plans • Meals • Motivation";
    }
  }
  updateModeUI();

  modeBtn?.addEventListener("click", () => {
    chatMode = chatMode === "friendly" ? "fitness" : "friendly";
    localStorage.setItem(MODE_KEY, JSON.stringify(chatMode));
    updateModeUI();
    bot(
      chatMode === "fitness"
        ? "Fitness-only mode enabled 🔒 Ask about workouts, meals, recovery, timers, or type **today**."
        : "Friendly mode enabled 🧠 Basic chat + fitness coaching 💪",
    );
    renderQuickReplies("default");
  });

  let voiceOn = loadJson(VOICE_KEY, false);
  if (voiceBtn)
    voiceBtn.textContent = voiceOn ? "🔊 Voice: On" : "🔊 Voice: Off";

  // restore messages
  const saved = loadJson(STORE_KEY, []);
  saved.forEach((m) => add(m.role, m.text, false));
  if (!saved.length) intro();

  // open/close
  fab.addEventListener("click", () =>
    box.classList.contains("open") ? close() : open(),
  );
  closeBtn.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && box.classList.contains("open")) close();
  });

  function open() {
    box.classList.add("open");
    box.setAttribute("aria-hidden", "false");
    setTimeout(() => input.focus(), 0);
  }

  function close() {
    box.classList.remove("open");
    box.setAttribute("aria-hidden", "true");
  }

  // chips send (dynamic)
  chips?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const msg = btn.getAttribute("data-msg");
    if (msg) send(msg);
  });

  // tools
  setupBtn?.addEventListener("click", () => startSetup());
  todayBtn?.addEventListener("click", () => {
    const w = makeTodaysWorkout(profile);
    memory.lastIntent = "workout";
    memory.lastPlan = w;
    memory.lastWorkoutDayIndex = 0;
    saveMemory();
    bot(w);
    renderQuickReplies("workout");
  });

  mealsBtn?.addEventListener("click", () => {
    const m = makeMealIdeas(profile.goal || "muscle");
    memory.lastIntent = "meals";
    memory.lastPlan = m;
    saveMemory();
    bot(m);
    renderQuickReplies("meals");
  });

  voiceBtn?.addEventListener("click", () => {
    voiceOn = !voiceOn;
    localStorage.setItem(VOICE_KEY, JSON.stringify(voiceOn));
    voiceBtn.textContent = voiceOn ? "🔊 Voice: On" : "🔊 Voice: Off";
    bot(
      voiceOn
        ? "Voice enabled ✅ I can speak my replies."
        : "Voice disabled ✅",
    );
  });

  // clear
  clearBtn?.addEventListener("click", () => {
    localStorage.removeItem(STORE_KEY);
    msgs.innerHTML = "";
    intro();
  });

  // submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    send(text);
  });

  // ===== setup mode machine =====
  let mode = "normal"; // setup_name, setup_goal, setup_level, setup_equipment, setup_days, setup_minutes

  function startSetup() {
    bot("Coach Setup 🧠\nWhat’s your name? (or type **skip**)");
    mode = "setup_name";
    renderQuickReplies("default");
  }

  // ===== message rendering =====
  function add(role, text, persist = true) {
    const row = document.createElement("div");
    row.className = "fit-msg " + (role === "user" ? "user" : "bot");

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = escapeHtml(text).replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>",
    );
    row.appendChild(bubble);

    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;

    if (persist) {
      const current = loadJson(STORE_KEY, []);
      current.push({ role, text });
      localStorage.setItem(STORE_KEY, JSON.stringify(current.slice(-90)));
    }

    if (role === "bot" && voiceOn) speak(stripHtml(text));
    return row;
  }

  function addWithNode(role, node, persist = true) {
    const row = document.createElement("div");
    row.className = "fit-msg " + (role === "user" ? "user" : "bot");

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.appendChild(node);
    row.appendChild(bubble);

    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;

    if (persist) {
      const current = loadJson(STORE_KEY, []);
      current.push({ role, text: "[timer]" });
      localStorage.setItem(STORE_KEY, JSON.stringify(current.slice(-90)));
    }
    return row;
  }

  function user(text) {
    add("user", text);
  }
  function bot(text) {
    add("bot", text);
  }

  function typingRow() {
    const row = document.createElement("div");
    row.className = "fit-msg bot";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = `<span class="typing"><span></span><span></span><span></span></span>`;
    row.appendChild(bubble);
    msgs.appendChild(row);
    msgs.scrollTop = msgs.scrollHeight;
    return row;
  }

  // ===== utilities =====
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }
  function stripHtml(str) {
    return String(str).replace(/<[^>]+>/g, "");
  }

  function loadJson(key, fallback) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      return v ?? fallback;
    } catch {
      return fallback;
    }
  }

  function saveProfile() {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }
  function cap(s) {
    return (s || "").slice(0, 1).toUpperCase() + (s || "").slice(1);
  }

  function speak(text) {
    try {
      if (!("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    } catch {}
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ============================
  // 1) Dynamic Quick Replies
  // ============================
  const quickSets = {
    default: [
      { label: "⚙️ Setup", msg: "setup" },
      { label: "🏋️ Today", msg: "today" },
      { label: "🍱 Meals", msg: "meals" },
      { label: "🔥 Streak", msg: "streak" },
      { label: "⏱️ Rest 60", msg: "rest 60" },
      { label: "😂 Joke", msg: "joke" },
    ],
    meals: [
      { label: "🥩 High protein", msg: "high protein meals" },
      { label: "💸 Budget meals", msg: "meal ideas budget" },
      { label: "1200 cals", msg: "meal plan 1200 calories" },
      { label: "1800 cals", msg: "meal plan 1800 calories" },
      { label: "🥗 Fat loss", msg: "meal ideas for fat loss" },
      { label: "🍚 Muscle", msg: "meal ideas for muscle gain" },
    ],
    workout: [
      { label: "Push day", msg: "push day workout" },
      { label: "Pull day", msg: "pull day workout" },
      { label: "Leg day", msg: "leg day workout" },
      { label: "🏠 Home", msg: "home workout plan" },
      { label: "🏋️ Gym", msg: "gym workout plan" },
      { label: "⏱️ Timer 60", msg: "timer 60" },
    ],
    tired: [
      { label: "💪 Motivate me", msg: "motivate me" },
      { label: "20-min workout", msg: "20 minute workout" },
      { label: "🧘 Recovery tips", msg: "recovery tips" },
      { label: "☕ Low energy", msg: "no energy" },
      { label: "😴 Sleep tips", msg: "sleep tips" },
      { label: "✅ Done", msg: "done" },
    ],
    faq: [
      { label: "💰 Pricing", msg: "how much is membership" },
      { label: "📍 Branches", msg: "where are your branches" },
      { label: "🕒 Hours", msg: "what time do you open" },
      { label: "🧑‍🏫 Trainers", msg: "do you offer personal training" },
      { label: "☎️ Contact", msg: "how can i contact you" },
      { label: "🗺️ View branches", msg: "branches" },
    ],
    tracker: [
      { label: "Log weight", msg: "log weight 70" },
      { label: "Log steps", msg: "log steps 8000" },
      { label: "Log calories", msg: "log calories 1900" },
      { label: "📊 Stats", msg: "stats" },
      { label: "🔥 Streak", msg: "streak" },
      { label: "⏱️ Rest 90", msg: "rest 90" },
    ],
  };

  function renderQuickReplies(kind = "default") {
    if (!chips) return;
    const set = quickSets[kind] || quickSets.default;

    chips.innerHTML = "";
    set.forEach((c) => {
      const b = document.createElement("button");
      b.className = "chip";
      b.setAttribute("data-msg", c.msg);
      b.type = "button";
      b.textContent = c.label;
      chips.appendChild(b);
    });
  }

  // show default initially
  renderQuickReplies("default");

  // ============================
  // 4) Gym FAQ mode
  // ============================
  const gymFAQ = [
    {
      keys: ["hours", "open", "close", "operating", "what time", "schedule"],
      answer:
        "Alpha Gym hours (based on your status logic):\n" +
        "• **Mon–Sat:** 8:00 AM – 11:00 PM\n" +
        "• **Sunday:** 9:00 AM – 9:00 PM\n\n" +
        "Tip: check the **Status** section on the page for live open/close countdown.",
    },
    {
      keys: [
        "price",
        "pricing",
        "membership",
        "how much",
        "rates",
        "monthly",
        "annual",
      ],
      answer:
        "For membership pricing, please check the **Pricing** page 😊\n" +
        "If you tell me **monthly** or **annual**, I’ll guide you what to look for.",
    },
    {
      keys: ["branch", "branches", "location", "where", "map", "address"],
      answer:
        "We have multiple branches (Maypajo Main, Recto, Longos, Malabon, Sangandaan).\n" +
        "Scroll to **Our Branches** and tap **View Map** on any branch card 📍",
    },
    {
      keys: [
        "trainer",
        "coach",
        "personal training",
        "pt",
        "1 on 1",
        "one on one",
      ],
      answer:
        "Yes ✅ We offer personal coaching.\n" +
        "Check **Trainers & Staffs** page or message us on the **Contact** page to book.",
    },
    {
      keys: ["contact", "message", "inquiry", "book", "schedule tour", "tour"],
      answer:
        "You can contact Alpha Gym via the **Contact** page on this website.\n" +
        "Want a quick message template? Type: **contact template**",
    },
  ];

  function matchGymFAQ(text) {
    const t = text.toLowerCase();
    for (const item of gymFAQ) {
      if (item.keys.some((k) => t.includes(k))) return item.answer;
    }
    return "";
  }

  function contactTemplate() {
    return (
      "Here’s a simple message you can send:\n\n" +
      "**Hi Alpha Gym!** I’d like to inquire about (membership / personal training / branch visit).\n" +
      "My preferred branch: ____\n" +
      "Schedule/time: ____\n" +
      "Name: ____\n" +
      "Contact: ____\n"
    );
  }

  // ============================
  // 6) Exercise library + substitutions
  // ============================
  const substitutions = [
    {
      keys: ["squat", "squats"],
      body:
        "If you can’t do **squats**, try:\n" +
        "• Leg Press (gym)\n" +
        "• Goblet Squat\n" +
        "• Split Squat / Bulgarian Split Squat\n" +
        "• Box Squat (reduce depth)\n" +
        "If knee pain: keep range comfortable + slow tempo.",
    },
    {
      keys: ["deadlift", "deadlifts", "hinge"],
      body:
        "Deadlift alternatives:\n" +
        "• Romanian Deadlift (RDL)\n" +
        "• Trap Bar Deadlift (if available)\n" +
        "• Hip Thrust / Glute Bridge\n" +
        "• Cable Pull-through\n" +
        "If back feels bad: lighter weight + perfect brace + shorter range.",
    },
    {
      keys: ["bench", "bench press"],
      body:
        "Bench alternatives:\n" +
        "• Dumbbell Bench Press\n" +
        "• Push-ups (add incline/decline)\n" +
        "• Machine Chest Press\n" +
        "Shoulder discomfort: tuck elbows ~45° + reduce range.",
    },
    {
      keys: ["pull up", "pullup", "pull-ups", "pullups"],
      body:
        "Pull-up alternatives:\n" +
        "• Lat Pulldown\n" +
        "• Assisted Pull-up\n" +
        "• Band-assisted pull-ups\n" +
        "• Inverted Rows",
    },
  ];

  function matchSubstitution(text) {
    const t = text.toLowerCase();
    for (const s of substitutions) {
      if (s.keys.some((k) => t.includes(k))) return s.body;
    }
    return "";
  }

  // ============================
  // 7) Form tips
  // ============================
  const formTips = [
    {
      keys: ["bench form", "bench press form", "bench technique"],
      body:
        "**Bench Press Form Tips:**\n" +
        "Cues:\n• Feet planted, slight arch\n• Shoulder blades **back & down**\n• Touch lower chest, press up\n\n" +
        "Common mistakes:\n1) Elbows flared 90°\n2) Bouncing bar\n3) Losing upper-back tightness\n\n" +
        "Safety: stop if sharp shoulder pain.",
    },
    {
      keys: ["deadlift form", "deadlift technique"],
      body:
        "**Deadlift Form Tips:**\n" +
        "Cues:\n• Brace core like you’re getting punched\n• Bar close to legs\n• Push the floor away\n\n" +
        "Common mistakes:\n1) Rounded lower back\n2) Bar drifting forward\n3) Jerking the pull\n\n" +
        "Safety: reduce load if back pain appears.",
    },
    {
      keys: ["squat form", "squat depth", "squat technique"],
      body:
        "**Squat Form Tips:**\n" +
        "Cues:\n• Tripod foot (heel + big toe + little toe)\n• Knees track over toes\n• Control down, drive up\n\n" +
        "Common mistakes:\n1) Heels lifting\n2) Knees collapsing inward\n3) Butt-wink from going too deep\n\n" +
        "Safety: use box squat if depth hurts.",
    },
  ];

  function matchFormTips(text) {
    const t = text.toLowerCase();
    for (const f of formTips) {
      if (f.keys.some((k) => t.includes(k))) return f.body;
    }
    return "";
  }

  // ============================
  // 8) Jokes / Quotes / Daily fact
  // ============================
  const jokes = [
    "Why did the dumbbell break up with the treadmill? Too much running around 😂",
    "Gym rule #1: If you can still talk, add 2 more reps 😄",
    "I lift because punching people is frowned upon 💀",
  ];
  const quotes = [
    "“Discipline beats motivation.” 💪",
    "“Small progress is still progress.” ✅",
    "“You don’t have to be extreme, just consistent.” 🔥",
  ];
  const facts = [
    "Gym fact: Muscle recovery happens when you rest + sleep — training is the stimulus, recovery is the growth.",
    "Gym fact: Walking (Zone 2) is one of the best fat-loss tools because it’s easy to recover from.",
    "Gym fact: Creatine is one of the most researched supplements for strength & performance (optional).",
  ];

  function dailyFact() {
    const today = new Date().toDateString();
    const last = loadJson(FACT_KEY, { date: "", fact: "" });
    if (last.date === today && last.fact)
      return `✅ Today’s fact: ${last.fact}`;
    const f = pick(facts);
    localStorage.setItem(FACT_KEY, JSON.stringify({ date: today, fact: f }));
    return `✅ Today’s fact: ${f}`;
  }

  // ============================
  // 9) Taglish detection
  // ============================
  function isTagalogish(text) {
    const t = text.toLowerCase();
    const words = [
      "ano",
      "paano",
      "saan",
      "nakakatamad",
      "pagod",
      "tara",
      "kaya",
      "gusto",
      "ayoko",
      "salamat",
      "wala",
    ];
    return words.some((w) => t.includes(w));
  }

  function taglishify(text) {
    // small style helper: not translating everything, just flavor
    if (!isTagalogish(text)) return "";
    return "Taglish mode 😄 Sige! ";
  }

  // ============================
  // 10) Injury-safe assistant (non-red-flag pain)
  // ============================
  function injuryAdvice(text) {
    const t = text.toLowerCase();

    const painWords = [
      "pain",
      "sakit",
      "masakit",
      "hurt",
      "injury",
      "sumasakit",
    ];
    const body = [
      "knee",
      "tuhod",
      "shoulder",
      "balikat",
      "back",
      "likod",
      "elbow",
      "siko",
      "wrist",
      "pulso",
    ];

    if (!painWords.some((w) => t.includes(w))) return "";

    // Red flags handled elsewhere; here = safe guidance
    const area = body.find((b) => t.includes(b)) || "that area";

    return (
      `For **${area} pain**, try this safer approach (not medical advice):\n` +
      "1) **Stop** the movement that causes sharp pain\n" +
      "2) Reduce range of motion + lighten weight\n" +
      "3) Swap to a similar but safer exercise\n" +
      "4) Keep pain ≤ 3/10, avoid spikes\n\n" +
      "If it’s getting worse or sharp/tingly — consult a professional."
    );
  }

  // ============================
  // 5) Workout Timer inside chat
  // ============================
  function startTimer(seconds, label = "Timer") {
    const sec = Math.max(1, Math.min(60 * 60, seconds || 60));

    const wrap = document.createElement("div");
    wrap.style.display = "flex";
    wrap.style.flexDirection = "column";
    wrap.style.gap = "8px";

    const title = document.createElement("div");
    title.innerHTML = `<strong>${escapeHtml(label)}</strong>`;
    wrap.appendChild(title);

    const timeEl = document.createElement("div");
    timeEl.style.fontSize = "18px";
    timeEl.style.fontWeight = "700";
    wrap.appendChild(timeEl);

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "8px";

    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.textContent = "Stop";
    stopBtn.style.cursor = "pointer";

    btnRow.appendChild(stopBtn);
    wrap.appendChild(btnRow);

    const row = addWithNode("bot", wrap, true);

    let remaining = sec;
    let stopped = false;

    function fmt(s) {
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${m}:${String(r).padStart(2, "0")}`;
    }

    timeEl.textContent = fmt(remaining);

    const id = setInterval(() => {
      if (stopped) return;
      remaining -= 1;
      timeEl.textContent = fmt(Math.max(0, remaining));
      if (remaining <= 0) {
        clearInterval(id);
        try {
          beep();
        } catch {}
        const done = document.createElement("div");
        done.innerHTML = "✅ Done! Great job.";
        wrap.appendChild(done);
      }
    }, 1000);

    stopBtn.addEventListener("click", () => {
      stopped = true;
      clearInterval(id);
      const done = document.createElement("div");
      done.innerHTML = "⏹️ Stopped.";
      wrap.appendChild(done);
    });

    // scroll
    msgs.scrollTop = msgs.scrollHeight;
  }

  function beep() {
    // simple beep using WebAudio
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, 220);
  }

  function parseTimer(text) {
    const t = text.toLowerCase().trim();
    const m = t.match(/^(timer|rest)\s+(\d{1,4})$/);
    if (!m) return null;
    const kind = m[1];
    const seconds = parseInt(m[2], 10);
    return { kind, seconds };
  }

  // ============================
  // 3) Mini Goal Tracker
  // ============================
  function todayKey() {
    // YYYY-MM-DD
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function addLog(type, value) {
    const v = Number(value);
    if (!Number.isFinite(v) || v <= 0) return false;

    const date = todayKey();
    // keep last entry for today (overwrite)
    tracker[type] = (tracker[type] || []).filter((x) => x.date !== date);
    tracker[type].push({ date, value: v });

    // trim to last 45 days
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 45);
    tracker[type] = tracker[type].filter((x) => new Date(x.date) >= cutoff);

    saveTracker();
    return true;
  }

  function parseLog(text) {
    const t = text.toLowerCase().trim();
    // log weight 70
    const m = t.match(/^log\s+(weight|steps|calories)\s+([\d.]+)$/);
    if (!m) return null;
    return { type: m[1], value: m[2] };
  }

  function lastNDays(n) {
    const days = [];
    const d = new Date();
    for (let i = 0; i < n; i++) {
      const x = new Date(d);
      x.setDate(d.getDate() - i);
      const yyyy = x.getFullYear();
      const mm = String(x.getMonth() + 1).padStart(2, "0");
      const dd = String(x.getDate()).padStart(2, "0");
      days.push(`${yyyy}-${mm}-${dd}`);
    }
    return days.reverse();
  }

  function avgFor(type, days = 7) {
    const keys = new Set(lastNDays(days));
    const arr = (tracker[type] || []).filter((x) => keys.has(x.date));
    if (!arr.length) return 0;
    const sum = arr.reduce((a, b) => a + Number(b.value), 0);
    return sum / arr.length;
  }

  function latestFor(type) {
    const arr = tracker[type] || [];
    if (!arr.length) return null;
    const sorted = [...arr].sort((a, b) => (a.date > b.date ? -1 : 1));
    return sorted[0];
  }

  function statsText() {
    const w = latestFor("weight");
    const s = latestFor("steps");
    const c = latestFor("calories");

    const wAvg = avgFor("weight", 7);
    const sAvg = avgFor("steps", 7);
    const cAvg = avgFor("calories", 7);

    const streak = loadJson(STREAK_KEY, { date: "", streak: 0 });

    return (
      "**📊 Your Stats (last 7 days)**\n" +
      `• Weight: ${w ? `${w.value} kg (latest)` : "—"} | avg: ${wAvg ? wAvg.toFixed(1) + " kg" : "—"}\n` +
      `• Steps: ${s ? `${s.value} (latest)` : "—"} | avg: ${sAvg ? Math.round(sAvg) : "—"}\n` +
      `• Calories: ${c ? `${c.value} (latest)` : "—"} | avg: ${cAvg ? Math.round(cAvg) : "—"}\n\n` +
      `🔥 Workout streak: **${streak.streak}** (last log: ${streak.date || "none"})\n\n` +
      "Commands:\n• `log weight 70`\n• `log steps 8000`\n• `log calories 1900`"
    );
  }

  // ===== guardrails =====
  const fitnessWords = [
    "workout",
    "exercise",
    "gym",
    "fitness",
    "training",
    "lift",
    "muscle",
    "fat",
    "loss",
    "bulk",
    "cut",
    "cardio",
    "hiit",
    "nutrition",
    "diet",
    "protein",
    "calorie",
    "macros",
    "sleep",
    "recovery",
    "stretch",
    "mobility",
    "supplement",
    "creatine",
    "whey",
    "bench",
    "squat",
    "deadlift",
    "push",
    "pull",
    "legs",
    "bmi",
    "steps",
    "hydration",
    "abs",
    "core",
    "timer",
    "rest",
    "pain",
    "hurt",
    "injury",
  ];

  const redFlags = [
    "chest pain",
    "faint",
    "passing out",
    "severe pain",
    "numbness",
    "tingling",
    "blood",
    "fracture",
    "broken",
    "pregnant",
    "heart",
    "stroke",
  ];

  function isFitness(text) {
    const t = text.toLowerCase();
    return (
      fitnessWords.some((w) => t.includes(w)) ||
      t.includes("plan") ||
      t.includes("routine")
    );
  }
  function hasRedFlag(text) {
    const t = text.toLowerCase();
    return redFlags.some((w) => t.includes(w));
  }

  // ===== greetings/basic conversation =====
  function isGreeting(t) {
    return [
      "hi",
      "hello",
      "hey",
      "yo",
      "sup",
      "good morning",
      "good afternoon",
      "good evening",
    ].some((g) => t.includes(g));
  }
  function isNameQuestion(t) {
    return t.includes("your name") || t.includes("who are you");
  }
  function isHowAreYou(t) {
    return t.includes("how are you") || t.includes("how r u");
  }

  // ===== streak tracking =====
  function markDone() {
    const s = loadJson(STREAK_KEY, { date: "", streak: 0 });
    const today = new Date().toDateString();

    if (s.date === today) {
      bot(`You already logged today ✅ Streak: **${s.streak}** 🔥`);
      return;
    }

    const y = new Date();
    y.setDate(y.getDate() - 1);
    const yesterday = y.toDateString();

    const next = {
      date: today,
      streak: s.date === yesterday ? s.streak + 1 : 1,
    };
    localStorage.setItem(STREAK_KEY, JSON.stringify(next));
    bot(`Workout logged ✅ Your streak is now **${next.streak}** 🔥`);
    renderQuickReplies("tracker");
  }

  // ===== basic chat (friendly) =====
  function basicChatReply(rawText) {
    const t = rawText.toLowerCase().trim();

    const thanks = ["thanks", "thank you", "ty", "salamat", "tenkyu"];
    const bye = [
      "bye",
      "goodbye",
      "see you",
      "later",
      "good night",
      "goodnight",
    ];
    const lol = ["lol", "lmao", "haha", "hehe", "😂", "🤣"];

    if (thanks.some((w) => t.includes(w)))
      return pick(["You’re welcome! 🙌", "No problem 😄", "Anytime! 💪"]);
    if (bye.some((w) => t.includes(w)))
      return pick([
        "Goodbye! Stay consistent 💪",
        "See you! Hydrate 💧",
        "Goodnight! Recover well 😴",
      ]);
    if (lol.some((w) => t.includes(w)))
      return pick(["HAHA 😂", "Love the energy 😄", "😂😂 What’s up?"]);

    if (
      t.includes("help") ||
      t.includes("what can you do") ||
      t.includes("commands")
    ) {
      return (
        "Here’s what I can do:\n" +
        "• **today** — today’s workout\n" +
        "• **setup** — personalize plan\n" +
        "• “make me a **4-day muscle plan**”\n" +
        "• “meal ideas for fat loss”\n" +
        "• **streak** / **done** — track consistency 🔥\n" +
        "• **timer 60** / **rest 90** — countdown\n" +
        "• **log weight/steps/calories** — tracker\n" +
        "• **stats** — weekly averages\n" +
        "• **joke**, **quote**, **fact**\n" +
        "• Toggle Mode: Friendly/Fitness 🔁"
      );
    }

    if (t.length <= 2) return "👀";
    return pick([
      "Tell me more 🙂",
      "Okay 😄 What do you want to do next?",
      "Got it ✅",
      "I’m here 💪 What’s up?",
    ]);
  }

  // ============================
  // 2) Last Topic + “tomorrow” follow-up
  // ============================
  function isTomorrowFollowup(text) {
    const t = text.toLowerCase();
    return (
      t.includes("tomorrow") ||
      t.includes("next") ||
      t.includes("day 2") ||
      t.includes("day2")
    );
  }

  function nextDayFromPlan() {
    // Works best when lastPlan is a multi-day plan string
    // We'll respond with a simple "Next day suggestion" based on lastGoal
    const goal = memory.lastGoal || profile.goal || "strength";
    const level = profile.level || "beginner";
    const eq = profile.equipment || "gym";

    memory.lastWorkoutDayIndex = (memory.lastWorkoutDayIndex || 0) + 1;
    saveMemory();

    // rotate day types
    const idx = memory.lastWorkoutDayIndex % 3;

    if (goal === "muscle") {
      const days = [pushDay(level, eq), pullDay(level, eq), legsDay(level, eq)];
      return (
        `**Tomorrow / Next Workout (Day ${memory.lastWorkoutDayIndex + 1})**\n` +
        days[idx]
      );
    }

    if (goal === "fatloss") {
      const sessions = [
        "Full Body Circuit:\n• Squat x12\n• Push-ups xAMRAP\n• Row x12\n• Lunges x10/side\n• Plank 40s\nFinish: 10–15 min incline walk",
        "Cardio + Core:\n• 25–35 min Zone 2\n• Dead Bug 3x10/side\n• Side Plank 3x30s/side\n• Stretch 5 mins",
        "Strength + Intervals:\n• Squat 3x8–10\n• DB Press 3x8–12\n• Row 3x10–12\n• RDL 3x10\nFinish: 8 min bike intervals",
      ];
      return `**Tomorrow / Next Workout (Day ${memory.lastWorkoutDayIndex + 1})**\n${sessions[idx]}`;
    }

    // strength
    const sessions = [
      "Squat Focus:\n• Squat 5x3–5\n• Split Squat 3x8/side\n• Core 3 sets\n• Easy cardio 8–10 mins",
      "Bench Focus:\n• Bench 5x3–5\n• Row 4x6–8\n• Triceps 3x10–12\n• Shoulder accessory 2–3 sets",
      "Deadlift Focus:\n• Deadlift 5x2–4\n• RDL 3x6–8\n• Lats 3x10–12\n• Core 3 sets",
    ];
    return `**Tomorrow / Next Workout (Day ${memory.lastWorkoutDayIndex + 1})**\n${sessions[idx]}`;
  }

  // ===== main send =====
  function send(text) {
    user(text);

    const t = text.toLowerCase().trim();
    const tagPrefix = taglishify(text);

    // -------- commands: jokes/quotes/facts
    if (t === "joke") {
      bot(tagPrefix + pick(jokes));
      renderQuickReplies("default");
      return;
    }
    if (t === "quote") {
      bot(tagPrefix + pick(quotes));
      renderQuickReplies("default");
      return;
    }
    if (t === "fact" || t === "gym fact") {
      bot(tagPrefix + dailyFact());
      renderQuickReplies("default");
      return;
    }

    // contact template
    if (t.includes("contact template")) {
      bot(tagPrefix + contactTemplate());
      renderQuickReplies("faq");
      return;
    }

    // -------- timer commands
    const timerCmd = parseTimer(t);
    if (timerCmd) {
      bot(
        tagPrefix + `Starting ${timerCmd.kind} for **${timerCmd.seconds}s** ⏱️`,
      );
      startTimer(timerCmd.seconds, timerCmd.kind === "rest" ? "Rest" : "Timer");
      renderQuickReplies("workout");
      return;
    }

    // -------- tracker commands
    const logCmd = parseLog(t);
    if (logCmd) {
      const ok = addLog(logCmd.type, logCmd.value);
      if (!ok) {
        bot(
          tagPrefix + "Please enter a valid number. Example: `log steps 8000`",
        );
        return;
      }
      bot(
        tagPrefix +
          `Logged ✅ **${logCmd.type}** = **${Number(logCmd.value)}** (today)`,
      );
      renderQuickReplies("tracker");
      return;
    }
    if (t === "stats") {
      bot(tagPrefix + statsText());
      renderQuickReplies("tracker");
      return;
    }

    // -------- default commands
    if (t === "setup") {
      startSetup();
      return;
    }
    if (t === "today") {
      const w = makeTodaysWorkout(profile);
      memory.lastIntent = "workout";
      memory.lastGoal = profile.goal || "strength";
      memory.lastPlan = w;
      memory.lastWorkoutDayIndex = 0;
      saveMemory();
      bot(tagPrefix + w);
      renderQuickReplies("workout");
      return;
    }
    if (t === "meals" || t === "meal ideas") {
      const m = makeMealIdeas(profile.goal || "muscle");
      memory.lastIntent = "meals";
      memory.lastGoal = profile.goal || "muscle";
      memory.lastPlan = m;
      saveMemory();
      bot(tagPrefix + m);
      renderQuickReplies("meals");
      return;
    }
    if (t === "done") {
      markDone();
      return;
    }
    if (t === "streak") {
      const s = loadJson(STREAK_KEY, { date: "", streak: 0 });
      bot(
        tagPrefix +
          `Current streak: **${s.streak}** 🔥 (last log: ${s.date || "none"})`,
      );
      renderQuickReplies("tracker");
      return;
    }

    // BMI integration
    if (t.includes("bmi")) {
      const bmiBtn = document.getElementById("bmiButton");
      if (bmiBtn) bmiBtn.click();
      bot(
        tagPrefix +
          "I opened the BMI calculator 🧮\nAfter you calculate, tell me your BMI result and goal (fat loss or muscle gain).",
      );
      renderQuickReplies("default");
      return;
    }

    // Gym FAQ mode (works in both modes)
    const faq = matchGymFAQ(text);
    if (faq) {
      bot(tagPrefix + faq);
      renderQuickReplies("faq");
      return;
    }

    // Red flags
    if (hasRedFlag(text)) {
      bot(
        tagPrefix +
          "If you have **severe pain, chest pain, dizziness, numbness, bleeding**, or serious symptoms — " +
          "stop training and consult a medical professional.\n\n" +
          "If you want, tell me what exercise caused it and I’ll suggest safer alternatives.",
      );
      renderQuickReplies("tired");
      return;
    }

    // Injury safe advice (non-red-flag)
    const injury = injuryAdvice(text);
    if (injury) {
      bot(tagPrefix + injury);
      renderQuickReplies("workout");
      return;
    }

    // setup flow
    if (mode !== "normal") {
      handleSetup(text);
      return;
    }

    // greetings
    if (isGreeting(t)) {
      bot(
        tagPrefix +
          `Hi ${profile.name ? profile.name : "there"}! 👋 I’m Alpha Fitness Bot. Type **today** or ask for a plan.`,
      );
      renderQuickReplies("default");
      return;
    }
    if (isNameQuestion(t)) {
      bot(
        tagPrefix +
          "I’m **Alpha Fitness Bot** 💪 Your assistant for workouts, nutrition tips, motivation, and gym info.",
      );
      renderQuickReplies("default");
      return;
    }
    if (isHowAreYou(t)) {
      bot(
        tagPrefix +
          "I’m doing great — ready to coach you 💪 What’s your goal today: **fat loss**, **muscle gain**, or **strength**?",
      );
      renderQuickReplies("default");
      return;
    }

    // substitutions
    const sub = matchSubstitution(text);
    if (sub) {
      bot(tagPrefix + sub);
      renderQuickReplies("workout");
      return;
    }

    // form tips
    const form = matchFormTips(text);
    if (form) {
      bot(tagPrefix + form);
      renderQuickReplies("workout");
      return;
    }

    // “tomorrow” follow-up from last plan
    if (
      isTomorrowFollowup(text) &&
      (memory.lastIntent === "workout" || memory.lastIntent === "plan")
    ) {
      bot(tagPrefix + nextDayFromPlan());
      renderQuickReplies("workout");
      return;
    }

    // tired / low energy quick reply set
    if (
      t.includes("tired") ||
      t.includes("pagod") ||
      t.includes("nakakatamad") ||
      t.includes("no energy")
    ) {
      bot(tagPrefix + motivation());
      renderQuickReplies("tired");
      return;
    }

    // Friendly mode: basic chat
    if (!isFitness(text)) {
      if (chatMode === "fitness") {
        bot(
          tagPrefix +
            "I’m in **Fitness-only mode** 🔒\n" +
            "Ask me about workouts, meals, recovery, timers, tracking, or gym info.\n\n" +
            "Try: “Make me a **4-day muscle plan**” or type **setup**.",
        );
        renderQuickReplies("default");
        return;
      }

      const typing = typingRow();
      setTimeout(() => {
        typing.remove();
        bot(tagPrefix + basicChatReply(text));
        renderQuickReplies("default");
      }, 350);
      return;
    }

    // typing then route intent
    const typing = typingRow();
    setTimeout(() => {
      typing.remove();
      routeIntent(text);
    }, 450);
  }

  function handleSetup(text) {
    const t = text.trim();
    const lower = t.toLowerCase();

    if (mode === "setup_name") {
      if (lower !== "skip") profile.name = t;
      saveProfile();
      bot("Goal? Type: **fat loss**, **muscle gain**, or **strength**.");
      mode = "setup_goal";
      renderQuickReplies("default");
      return;
    }

    if (mode === "setup_goal") {
      if (lower.includes("fat")) profile.goal = "fatloss";
      else if (
        lower.includes("muscle") ||
        lower.includes("gain") ||
        lower.includes("bulk")
      )
        profile.goal = "muscle";
      else profile.goal = "strength";
      saveProfile();
      bot("Level? **beginner / intermediate / advanced**");
      mode = "setup_level";
      renderQuickReplies("default");
      return;
    }

    if (mode === "setup_level") {
      if (lower.includes("inter")) profile.level = "intermediate";
      else if (lower.includes("adv")) profile.level = "advanced";
      else profile.level = "beginner";
      saveProfile();
      bot("Train where? **home** or **gym**");
      mode = "setup_equipment";
      renderQuickReplies("default");
      return;
    }

    if (mode === "setup_equipment") {
      profile.equipment = lower.includes("home") ? "home" : "gym";
      saveProfile();
      bot("How many days per week? (2–6)");
      mode = "setup_days";
      renderQuickReplies("default");
      return;
    }

    if (mode === "setup_days") {
      const n = parseInt(lower, 10);
      profile.days = Number.isFinite(n) ? Math.min(6, Math.max(2, n)) : 3;
      saveProfile();
      bot("How many minutes per workout? (20–90)");
      mode = "setup_minutes";
      renderQuickReplies("default");
      return;
    }

    if (mode === "setup_minutes") {
      const n = parseInt(lower, 10);
      profile.minutes = Number.isFinite(n) ? Math.min(90, Math.max(20, n)) : 45;
      saveProfile();
      mode = "normal";

      bot(
        `Setup complete ✅\n` +
          `Name: **${profile.name || "Athlete"}**\n` +
          `Goal: **${profile.goal || "strength"}**\n` +
          `Level: **${profile.level}** • Days: **${profile.days}** • ${profile.equipment.toUpperCase()} • **${profile.minutes} mins**\n\n` +
          `Type **today** for your workout, or “make me a plan”.`,
      );

      renderQuickReplies("default");
      return;
    }
  }

  function routeIntent(text) {
    const t = text.toLowerCase();

    // plan/routine
    if (t.includes("plan") || t.includes("routine") || t.includes("program")) {
      const goal = inferGoal(t) || profile.goal || "strength";
      const days = inferDays(t, profile.days);

      const plan = makePlan(goal, days, profile.level, profile.equipment);
      memory.lastIntent = "plan";
      memory.lastGoal = goal;
      memory.lastPlan = plan;
      memory.lastWorkoutDayIndex = 0;
      saveMemory();

      bot(plan);
      bot(
        "Type **today** for today’s workout. Type **done** after training to build a streak 🔥",
      );
      renderQuickReplies("workout");
      return;
    }

    if (t.includes("push") && t.includes("day")) {
      memory.lastIntent = "workout";
      saveMemory();
      bot(pushDay(profile.level, profile.equipment));
      renderQuickReplies("workout");
      return;
    }
    if (t.includes("pull") && t.includes("day")) {
      memory.lastIntent = "workout";
      saveMemory();
      bot(pullDay(profile.level, profile.equipment));
      renderQuickReplies("workout");
      return;
    }
    if (t.includes("legs") || t.includes("leg day")) {
      memory.lastIntent = "workout";
      saveMemory();
      bot(legsDay(profile.level, profile.equipment));
      renderQuickReplies("workout");
      return;
    }

    if (
      t.includes("meal") ||
      t.includes("eat") ||
      t.includes("diet") ||
      t.includes("protein") ||
      t.includes("macros") ||
      t.includes("calories")
    ) {
      const m = makeMealIdeas(inferGoal(t) || profile.goal || "muscle");
      memory.lastIntent = "meals";
      memory.lastPlan = m;
      memory.lastGoal = inferGoal(t) || profile.goal || "muscle";
      saveMemory();
      bot(m);
      renderQuickReplies("meals");
      return;
    }

    if (t.includes("recovery") || t.includes("sleep tips")) {
      bot(
        "Recovery tips ✅\n" +
          "• Sleep 7–9 hours\n" +
          "• Protein daily\n" +
          "• Light walking on rest days\n" +
          "• Stretch tight areas 5–10 mins\n" +
          "• Don’t max out every session",
      );
      renderQuickReplies("tired");
      return;
    }

    if (
      t.includes("motivat") ||
      t.includes("lazy") ||
      t.includes("no energy") ||
      t.includes("nakakatamad")
    ) {
      bot(motivation());
      renderQuickReplies("tired");
      return;
    }

    if (
      t.includes("creatine") ||
      t.includes("supplement") ||
      t.includes("whey")
    ) {
      bot(supplements());
      renderQuickReplies("default");
      return;
    }

    // fallback
    bot(
      `I got you, ${profile.name || "Athlete"} 💪\n` +
        "Try one of these:\n" +
        "• **today** (today’s workout)\n" +
        "• “make me a **4-day muscle plan**”\n" +
        "• “meal ideas for fat loss”\n" +
        "• **timer 60** or **rest 90**\n" +
        "• **log steps 8000** then **stats**",
    );
    renderQuickReplies("default");
  }

  function inferGoal(t) {
    if (t.includes("fat") || t.includes("loss") || t.includes("cut"))
      return "fatloss";
    if (
      t.includes("muscle") ||
      t.includes("bulk") ||
      t.includes("hypertrophy") ||
      t.includes("gain")
    )
      return "muscle";
    if (t.includes("strength") || t.includes("stronger")) return "strength";
    return "";
  }

  function inferDays(t, fallback) {
    const m = t.match(/([2-6])\s*(day|days)/);
    return m ? parseInt(m[1], 10) : fallback || 3;
  }

  // ===== content generators =====
  function intro() {
    bot(
      "Hey! I’m **Alpha Fitness Bot** 💪\n" +
        "I can generate workout plans, meal ideas, timers, tracking, and answer gym questions.\n\n" +
        "Say **hi**, type **setup**, or type **today**.",
    );
    bot("Daily habit: type **done** after your workout to build a streak 🔥");
    bot("Try: **stats**, **timer 60**, **joke**, **quote**, or **fact** ✅");
    renderQuickReplies("default");
  }

  function makeTodaysWorkout(p) {
    const goal = p.goal || "strength";
    const level = p.level || "beginner";
    const eq = p.equipment || "gym";
    const mins = p.minutes || 45;

    const day = new Date().getDay(); // 0-6
    const pickIdx = day % 3;

    const header = `**Today’s Workout (${cap(goal)}, ${cap(level)}, ${eq.toUpperCase()} • ${mins} mins)**`;

    if (goal === "fatloss") {
      const sessions = [
        "Full Body Circuit (3–4 rounds):\n• Squat x12\n• Push-ups xAMRAP\n• Row x12\n• Lunges x10/side\n• Plank 40s\nFinish: 10–15 min incline walk",
        "Cardio + Core:\n• 25–35 min Zone 2\n• Dead Bug 3x10/side\n• Side Plank 3x30s/side\n• Stretch 5 mins",
        "Full Body Strength:\n• Squat 3x8–10\n• DB Press 3x8–12\n• Row 3x10–12\n• RDL 3x10\nFinish: 8 min bike intervals",
      ];
      return `${header}\n${sessions[pickIdx]}\n\nType **done** after you finish to build your streak 🔥`;
    }

    if (goal === "muscle") {
      const sessions = [
        "Push:\n• Bench 4x6–10\n• Incline DB 3x8–12\n• Lateral Raise 3x12–20\n• Triceps 3x10–15\n• Optional: push-ups 2 sets",
        "Pull:\n• Pulldown/Pull-ups 4 sets\n• Row 4 sets\n• Face Pull 3x12–20\n• Curls 3x10–15",
        "Legs:\n• Squat 4x6–10\n• RDL 3x8–12\n• Leg Press 3x10–15\n• Calves 4x10–15\n• Core 3 sets",
      ];
      return `${header}\n${sessions[pickIdx]}\n\nType **done** after you finish to build your streak 🔥`;
    }

    const sessions = [
      "Squat Focus:\n• Squat 5x3–5\n• Split Squat 3x8/side\n• Core 3 sets\n• Easy cardio 8–10 mins",
      "Bench Focus:\n• Bench 5x3–5\n• Row 4x6–8\n• Triceps 3x10–12\n• Shoulder accessory 2–3 sets",
      "Deadlift Focus:\n• Deadlift 5x2–4\n• RDL 3x6–8\n• Lats 3x10–12\n• Core 3 sets",
    ];
    return `${header}\n${sessions[pickIdx]}\n\nType **done** after you finish to build your streak 🔥`;
  }

  function makePlan(
    goal = "strength",
    days = 3,
    level = "beginner",
    equipment = "gym",
  ) {
    const d = Math.max(2, Math.min(6, days));
    const eq = equipment === "home" ? "Home" : "Gym";
    const lv = cap(level);

    if (goal === "fatloss") {
      return [
        `**${d}-Day Fat Loss Plan (${lv}, ${eq})**`,
        "Warm-up: 5–8 mins + dynamic stretches",
        "Day 1: Full Body A — Squat 3x10, Push 3xAMRAP, Row 3x12, Plank 3x40s",
        "Day 2: Cardio + Core — 20–30 min Zone 2 + core 10 mins",
        "Day 3: Full Body B — Hinge 3x10, Press 3x10, Row 3x12, Carry 3x40m",
        d >= 4 ? "Day 4: HIIT — 10 rounds: 20s hard / 40s easy" : "",
        d >= 5
          ? "Day 5: Full Body C — Lunge 3x10/side, Press 3x10, Pulldown 3x12"
          : "",
        d >= 6 ? "Day 6: Steps — 45–60 min easy walk" : "",
        "Progress weekly: +reps or small weight when form stays clean.",
      ]
        .filter(Boolean)
        .join("\n");
    }

    if (goal === "muscle") {
      return [
        `**${d}-Day Muscle Gain Plan (${lv}, ${eq})**`,
        "Warm-up: 5–8 mins + ramp-up sets",
        "Day 1: Push — Bench 4x6–10, Incline 3x8–12, Lateral 3x12–20, Triceps 3x10–15",
        "Day 2: Pull — Row 4x6–10, Pulldown 3x8–12, Face Pull 3x12–20, Biceps 3x10–15",
        "Day 3: Legs — Squat 4x6–10, RDL 3x8–12, Leg Press 3x10–15, Calves 4x10–15",
        d >= 4 ? "Day 4: Upper — DB Bench 3x8–12, Row 3x8–12, Arms 3 sets" : "",
        d >= 5
          ? "Day 5: Lower — Hack/Front Squat 3x6–10, Ham Curl 4x10–15, Core"
          : "",
        d >= 6 ? "Day 6: Weak points — rear delts/arms/calves (pump work)" : "",
        "Progress weekly: +1–2 reps or +2.5kg when you hit top reps.",
      ]
        .filter(Boolean)
        .join("\n");
    }

    return [
      `**${d}-Day Strength Plan (${lv}, ${eq})**`,
      "Day 1: Squat Focus — Squat 5x3–5, Split Squat 3x8, Core 3 sets",
      "Day 2: Bench Focus — Bench 5x3–5, Row 4x6–8, Triceps 3x10–12",
      "Day 3: Deadlift Focus — Deadlift 5x2–4, RDL 3x6–8, Lats 3x10–12",
      d >= 4
        ? "Day 4: Overhead — OHP 5x3–5, Pull-ups 4 sets, Lateral 3x15"
        : "",
      "Progress: add weight slowly with good form.",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function pushDay(level, equipment) {
    return [
      `**Push Day (${cap(level)}, ${equipment === "home" ? "Home" : "Gym"})**`,
      "1) Bench / Push-ups — 4 sets",
      "2) Incline DB Press — 3x8–12",
      "3) Overhead Press — 3x6–10",
      "4) Lateral Raises — 3x12–20",
      "5) Triceps Pushdowns / Dips — 3x10–15",
    ].join("\n");
  }

  function pullDay(level, equipment) {
    return [
      `**Pull Day (${cap(level)}, ${equipment === "home" ? "Home" : "Gym"})**`,
      "1) Pull-ups / Lat Pulldown — 4 sets",
      "2) Row variation — 4 sets",
      "3) Rear delts (face pulls / fly) — 3x12–20",
      "4) Biceps curls — 3x10–15",
    ].join("\n");
  }

  function legsDay(level, equipment) {
    return [
      `**Leg Day (${cap(level)}, ${equipment === "home" ? "Home" : "Gym"})**`,
      "1) Squat / Goblet Squat — 4 sets",
      "2) RDL / Hip hinge — 3 sets",
      "3) Lunges — 3x10/side",
      "4) Step-ups / Leg Press — 3x10–15",
      "5) Calf raises — 4x10–15",
      "Core: plank 3x40s",
    ].join("\n");
  }

  function makeMealIdeas(goal) {
    // Support calorie messages (simple)
    if (goal.includes("1200")) {
      return (
        "**Sample 1200-cal day (budget-friendly)**\n" +
        "• Breakfast: eggs + oats\n" +
        "• Lunch: chicken + rice (small) + veggies\n" +
        "• Snack: yogurt or banana\n" +
        "• Dinner: tuna + veggies\n\n" +
        "Tip: keep protein high + lots of veggies."
      );
    }
    if (goal.includes("1800")) {
      return (
        "**Sample 1800-cal day (budget-friendly)**\n" +
        "• Breakfast: eggs + oats + banana\n" +
        "• Lunch: chicken adobo + rice + veggies\n" +
        "• Snack: milk + peanut butter sandwich\n" +
        "• Dinner: giniling + rice + veggies\n\n" +
        "Tip: add 1 snack if training hard."
      );
    }

    if (goal === "fatloss") {
      return (
        "**Meal Ideas (Fat Loss, budget-friendly)**\n" +
        "• Tuna + rice + veggies\n" +
        "• Chicken breast + kangkong + rice (controlled portion)\n" +
        "• Eggs + oats + banana\n" +
        "• Tofu + mixed veggies stir-fry\n\n" +
        "Tip: protein every meal + lots of veggies."
      );
    }
    return (
      "**Meal Ideas (Muscle Gain, budget-friendly)**\n" +
      "• Chicken adobo + rice + eggs\n" +
      "• Giniling + rice + veggies\n" +
      "• Tuna pasta + olive oil\n" +
      "• Peanut butter sandwich + banana + milk\n\n" +
      "Tip: add 1 extra snack: milk + banana or yogurt."
    );
  }

  function supplements() {
    return (
      "**Supplements (optional)**\n" +
      "• Creatine monohydrate: 3–5g daily\n" +
      "• Whey protein: helps hit protein\n" +
      "• Caffeine: moderate for performance\n\n" +
      "Basics first: training + protein + sleep."
    );
  }

  function motivation() {
    return (
      "Let’s make it easy 💪\n" +
      "**5-minute rule:** warm up for 5 minutes, then do 1 main lift.\n" +
      "Most of the time, you’ll keep going once you start.\n\n" +
      "Tell me your time today (20/30/45/60 mins) and your goal."
    );
  }
});
