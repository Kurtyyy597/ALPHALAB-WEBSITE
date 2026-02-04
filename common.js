// ============================
// GLOBAL SCROLL REVEAL SYSTEM (SMART MODE)
// ============================
document.addEventListener("DOMContentLoaded", () => {
  let revealItems = document.querySelectorAll(".reveal");

  // Fallback: auto-detect common sections/cards
  if (!revealItems.length) {
    revealItems = document.querySelectorAll(
      "section, .train-card, .testimonial-card, .contact-card, .pricing-card, .trainer-card, .gallery-card, .stat-box"
    );
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealItems.forEach((el) => revealObserver.observe(el));
});
