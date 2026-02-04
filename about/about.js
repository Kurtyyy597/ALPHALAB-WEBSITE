// ============================
// SCROLL PROGRESS BAR (TOP)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // Create bar
  const progressBar = document.createElement("div");
  progressBar.id = "scrollProgress";
  document.body.appendChild(progressBar);

  // Update on scroll
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = (scrollTop / docHeight) * 100;
    progressBar.style.width = progress + "%";
  });
});

document.addEventListener("DOMContentLoaded", () => {

  // ============================
  // SCROLL REVEAL ANIMATIONS
  // ============================
  const revealItems = document.querySelectorAll(
    ".story-container, .gallery-card, .mission-vision-card, .about-why-card, .stat-box, .about-cta"
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
  // ANIMATED STATS COUNTER
  // ============================
  const statBoxes = document.querySelectorAll(".stat-box h2");

  const statsObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStat(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statBoxes.forEach((stat) => statsObserver.observe(stat));

  function animateStat(el) {
    const raw = el.textContent.replace(/\D/g, "");
    const target = parseInt(raw);
    let count = 0;
    const speed = Math.max(10, target / 100);

    const interval = setInterval(() => {
      count += speed;
      if (count >= target) {
        el.textContent = el.textContent.includes("+")
          ? target + "+"
          : target;
        clearInterval(interval);
      } else {
        el.textContent = Math.floor(count);
      }
    }, 20);
  }

  // ============================
  // GALLERY LIGHTBOX
  // ============================
  const images = document.querySelectorAll(".img-gallery");

  const lightbox = document.createElement("div");
  lightbox.id = "lightbox";
  lightbox.innerHTML = `
    <div class="lightbox-backdrop"></div>
    <img class="lightbox-img" />
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector(".lightbox-img");

  images.forEach((img) => {
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  // ============================
  // CORE VALUES HOVER GLOW
  // ============================
  document.querySelectorAll(".values-list li").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.classList.add("glow");
    });

    item.addEventListener("mouseleave", () => {
      item.classList.remove("glow");
    });
  });
});

