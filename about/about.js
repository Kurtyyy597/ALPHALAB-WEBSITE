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

});

document.addEventListener("DOMContentLoaded", () => {
  // =============================
  // Existing Lightbox Elements
  // =============================
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxClose = document.getElementById("lightboxClose");

  const openLightbox = (src, alt = "Image") => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.style.display = "flex";
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.style.display = "none";
    if (lightboxImg) lightboxImg.src = "";
  };

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // =============================
  // Transformations -> Lightbox
  // =============================
  document.querySelectorAll(".open-lightbox").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  // =============================
  // Scroll Reveal (Sections + Items)
  // =============================
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 },
  );

  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));

  // Stagger items (timeline, cards)
  const items = document.querySelectorAll(".reveal-item");
  const itemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Stagger inside same container
        const siblings = entry.target.parentElement?.querySelectorAll(
          ".reveal-item",
        ) || [entry.target];
        siblings.forEach((sib, i) => {
          setTimeout(() => sib.classList.add("show"), i * 120);
        });

        itemObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.2 },
  );

  items.forEach((el) => itemObserver.observe(el));

  // =============================
  // Counter Animation (Stats)
  // =============================
  const counters = document.querySelectorAll(
    ".about-stats-container h2[data-target]",
  );

  const animateCounter = (el) => {
    const target = Number(el.getAttribute("data-target") || "0");
    const duration = 1200; // ms
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString();

      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach((c) => animateCounter(c));
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.35 },
  );

  const statsSection = document.querySelector(".about-stats-container");
  if (statsSection) counterObserver.observe(statsSection);

  // =============================
  // Parallax Background (Founder + Timeline)
  // =============================
  const parallaxSections = document.querySelectorAll(
    ".founder-container, .timeline-container",
  );

  const onScrollParallax = () => {
    parallaxSections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      const offset = (rect.top / window.innerHeight) * 30; // adjust intensity
      sec.style.setProperty("--parallaxY", `${offset}px`);
    });
  };

  // Apply CSS variable transform to ::before using inline style trick
  // We'll update the background pseudo-element by updating background-position via CSS variable.
  parallaxSections.forEach((sec) => {
    // This allows the CSS ::before to read a variable
    sec.style.setProperty("--parallaxY", "0px");
  });

  // Add CSS rule dynamically (so ::before can use var)
  const style = document.createElement("style");
  style.textContent = `
    .founder-container::before,
    .timeline-container::before {
      transform: translateY(var(--parallaxY));
    }
  `;
  document.head.appendChild(style);

  window.addEventListener("scroll", onScrollParallax, { passive: true });
  onScrollParallax();
});
