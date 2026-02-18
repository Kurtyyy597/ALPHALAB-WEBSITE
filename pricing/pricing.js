// =======================================================
// PRICING.JS — Dark Theme Enhancements
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
  // 3) PRICE CARD HOVER FOCUS
  // ============================
  const priceCards = document.querySelectorAll(".price-card");

  priceCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      priceCards.forEach((c) => c.classList.remove("active-card"));
      card.classList.add("active-card");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("active-card");
    });
  });

  // ============================
  // 4) FEATURED CARD SUBTLE POP
  // ============================
  const featured = document.querySelector(".price-card.featured");
  if (featured) {
    featured.classList.add("featured-pop");
    setTimeout(() => featured.classList.remove("featured-pop"), 600);
  }
});
