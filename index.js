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
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours();
  const minutes = now.getMinutes();

  let openTime, closeTime;

  // Sunday
  if (day === 0) {
    openTime = { h: 9, m: 0 };   // 9:00 AM
    closeTime = { h: 21, m: 0 }; // 9:00 PM
  } 
  // Monday - Saturday
  else {
    openTime = { h: 8, m: 0 };   // 8:00 AM
    closeTime = { h: 23, m: 0 }; // 11:00 PM
  }

  // Convert everything to minutes
  const currentMinutes = hour * 60 + minutes;
  const openMinutes = openTime.h * 60 + openTime.m;
  const closeMinutes = closeTime.h * 60 + closeTime.m;

  let message = "";

  if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
    // Gym is OPEN
    const minutesLeft = closeMinutes - currentMinutes;

    const hrs = Math.floor(minutesLeft / 60);
    const mins = minutesLeft % 60;

    message = `OPEN 🟢 — Closes in ${hrs > 0 ? hrs + "h " : ""}${mins}m`;
  } else {
    // Gym is CLOSED
    let minutesUntilOpen;

    if (currentMinutes < openMinutes) {
      // Opens later today
      minutesUntilOpen = openMinutes - currentMinutes;
    } else {
      // Opens tomorrow
      let nextOpenMinutes;

      // Tomorrow schedule
      const tomorrow = (day + 1) % 7;

      if (tomorrow === 0) {
        nextOpenMinutes = 9 * 60; // Sunday 9:00 AM
      } else {
        nextOpenMinutes = 8 * 60; // Mon-Sat 8:00 AM
      }

      minutesUntilOpen = (24 * 60 - currentMinutes) + nextOpenMinutes;
    }

    const hrs = Math.floor(minutesUntilOpen / 60);
    const mins = minutesUntilOpen % 60;

    message = `CLOSED 🔴 — Opens in ${hrs > 0 ? hrs + "h " : ""}${mins}m`;
  }

  statusEl.textContent = message;
}

// Update every minute
setInterval(updateGymStatus, 10000);
updateGymStatus();

// ============================
// SCROLL REVEAL ANIMATIONS
// ============================
const revealItems = document.querySelectorAll(
  ".train-card, .testimonial-card, .hero-title, .hero-paragraph, .join-box"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((el) => revealObserver.observe(el));

// ============================
// STICKY HEADER + SCROLL BAR
// ============================
const header = document.querySelector("header");

// Create progress bar
const progressBar = document.createElement("div");
progressBar.id = "scrollProgress";
document.body.appendChild(progressBar);

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }

  const scrollTop = window.scrollY;
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = (scrollTop / docHeight) * 100;
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
  "https://www.soundjay.com/buttons/sounds/button-16.mp3"
);

joinButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.classList.add("pulse");
    clickSound.currentTime = 0;
    clickSound.play();
    setTimeout(() => btn.classList.remove("pulse"), 200);
  });
});

// ============================
// BMI CALCULATOR + WORKOUT SUGGESTIONS
// ============================
const bmiButton = document.getElementById("bmiButton");
const bmiModal = document.getElementById("bmiModal");
const calcBtn = document.getElementById("calcBMI");
const closeBtn = document.getElementById("closeBMI");

function openBMI() {
  bmiModal.style.display = "block";
}

function closeBMI() {
  bmiModal.style.display = "none";
}

bmiButton.addEventListener("click", openBMI);
closeBtn.addEventListener("click", closeBMI);

document
  .querySelector(".bmi-backdrop")
  .addEventListener("click", closeBMI);

calcBtn.addEventListener("click", () => {
  const height = parseFloat(
    document.getElementById("bmiHeight").value
  );
  const weight = parseFloat(
    document.getElementById("bmiWeight").value
  );

  const resultEl = document.getElementById("bmiResult");
  const suggestionEl = document.getElementById("bmiSuggestion");

  if (!height || !weight) {
    resultEl.textContent = "Please enter valid height and weight.";
    resultEl.style.color = "#ff3c3c";
    suggestionEl.textContent = "";
    return;
  }

  const bmi = weight / ((height / 100) ** 2);
  const rounded = bmi.toFixed(1);

  let category = "";
  let color = "#00ff88";
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
    color = "#00ff88";
    suggestion = `
      🔹 Mix strength + cardio (4–5x/week)
      🔹 Progressive overload in workouts
      🔹 Core training + flexibility work
      🔹 Balanced nutrition and hydration
    `;
  } else if (bmi < 30) {
    category = "Overweight";
    color = "#ffcc00";
    suggestion = `
      🔹 Start with low-impact cardio (walking, cycling)
      🔹 Full-body strength training (3x/week)
      🔹 Focus on calorie control and protein intake
      🔹 Stretching and mobility work
    `;
  } else {
    category = "Obese";
    color = "#ff3c3c";
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
    ${suggestion.replace(/\n/g, "<br>")}
  `;
  suggestionEl.style.color = "#ddd";
});



