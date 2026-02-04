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
