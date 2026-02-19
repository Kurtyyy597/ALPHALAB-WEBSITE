// =======================================================
// TRAINERS.JS — Dark Theme Enhancements
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // 1) SCROLL PROGRESS BAR (TOP)
  // ============================
  let progressBar = document.getElementById("scrollProgress");
  if (!progressBar) {
    progressBar = document.createElement("div");
    progressBar.id = "scrollProgress";
    document.body.appendChild(progressBar);
  }

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  }

  window.addEventListener("scroll", updateScrollProgress);
  updateScrollProgress();

  // ============================
  // 2) REVEAL ANIMATIONS
  // ============================
  const revealItems = document.querySelectorAll(".reveal");
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
  // 3) HOVER FOCUS (optional)
  // ============================
  const focusCards = document.querySelectorAll(
    ".big-boss-card, .staff-card, .barbers-card",
  );

  focusCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      focusCards.forEach((c) => c.classList.remove("active-card"));
      card.classList.add("active-card");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("active-card");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // ===== LIGHTBOX =====
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

  document.querySelectorAll(".open-lightbox").forEach((img) => {
    img.addEventListener("click", () => openLightbox(img.src, img.alt));
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ===== SEARCH + FILTER =====
  const search = document.getElementById("teamSearch");
  const filter = document.getElementById("teamFilter");
  const cards = Array.from(document.querySelectorAll(".team-card"));

  const apply = () => {
    const q = (search?.value || "").toLowerCase().trim();
    const type = filter?.value || "all";

    cards.forEach((card) => {
      const data = (card.getAttribute("data-name") || "").toLowerCase();
      const ctype = card.getAttribute("data-type") || "all";

      const matchText = !q || data.includes(q);
      const matchType = type === "all" || ctype === type;

      card.style.display = matchText && matchType ? "" : "none";
    });
  };

  search?.addEventListener("input", apply);
  filter?.addEventListener("change", apply);
  apply();
});

