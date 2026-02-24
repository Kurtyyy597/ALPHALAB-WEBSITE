// =======================================================
// TRAINERS.JS — Dark Theme Enhancements + Smart Filtering
// (Hides empty sections: Owner / Staff / Barbers)
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

  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
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

  // ============================
  // 4) LIGHTBOX
  // ============================
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

  // Event delegation: works for any image with .open-lightbox
  document.addEventListener("click", (e) => {
    const img = e.target.closest?.(".open-lightbox");
    if (!img) return;
    openLightbox(img.src, img.alt);
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });

  // ============================
  // 5) SEARCH + FILTER
  // - Searches: data-name + type + title + visible name + bio + tags
  // - Multi-word matching
  // - Hides empty sections (headings + subtext + grids)
  // ============================
  const search = document.getElementById("teamSearch");
  const filter = document.getElementById("teamFilter");
  if (!search || !filter) return;

  const normalize = (s = "") =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

  const debounce = (fn, delay = 120) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  };

  // Create "no results" message near top controls
  let noResults = document.getElementById("noResults");
  if (!noResults) {
    noResults = document.createElement("div");
    noResults.id = "noResults";
    noResults.className = "no-results is-hidden";
    noResults.textContent = "No matching team members found.";

    const toolsSection = document.querySelector(".team-tools-container");
    if (toolsSection?.parentNode) {
      toolsSection.parentNode.insertBefore(noResults, toolsSection.nextSibling);
    } else {
      document.querySelector("main")?.appendChild(noResults);
    }
  }

  // Index cards for fast searching
  let searchableText = new Map();

  const buildIndex = (cards) => {
    searchableText = new Map();

    cards.forEach((card) => {
      const dataName = card.getAttribute("data-name") || "";
      const type = card.getAttribute("data-type") || "";

      const title =
        card.querySelector(".img-title, .staff-title, .barbers-title")
          ?.textContent || "";
      const person =
        card.querySelector(".img-name, .staff-name, .barbers-name")
          ?.textContent || "";
      const bio =
        card.querySelector(".boss-bio, .staff-bio")?.textContent || "";
      const tags = Array.from(card.querySelectorAll(".tag"))
        .map((t) => t.textContent || "")
        .join(" ");

      const blob = normalize(
        [dataName, type, title, person, bio, tags].join(" "),
      );
      searchableText.set(card, blob);
    });
  };

  // Helper: hide whole section if no visible cards inside it
  const updateSectionsVisibility = () => {
    const sections = document.querySelectorAll("section.team-section");

    sections.forEach((section) => {
      const sectionCards = Array.from(section.querySelectorAll(".team-card"));
      const anyVisible = sectionCards.some(
        (c) => !c.classList.contains("is-hidden"),
      );

      // Hide the entire section: heading, subtext, grids, etc.
      section.classList.toggle("is-hidden", !anyVisible);
    });
  };

  const apply = () => {
    const cards = Array.from(document.querySelectorAll(".team-card"));
    if (cards.length !== searchableText.size) buildIndex(cards);

    const q = normalize(search.value || "");
    const words = q ? q.split(" ") : [];
    const selectedType = (filter.value || "all").toLowerCase();

    let shown = 0;

    cards.forEach((card) => {
      const cardType = (card.getAttribute("data-type") || "all").toLowerCase();
      const matchType = selectedType === "all" || cardType === selectedType;

      const haystack = searchableText.get(card) || "";
      const matchText =
        words.length === 0 || words.every((w) => haystack.includes(w));

      const show = matchType && matchText;
      card.classList.toggle("is-hidden", !show);
      if (show) shown++;
    });

    // Hide empty team sections (Owner / Staff / Barbers)
    updateSectionsVisibility();

    // Show "no results" message if nothing is visible anywhere
    noResults.classList.toggle("is-hidden", shown !== 0);
  };

  const applyDebounced = debounce(apply, 120);

  search.addEventListener("input", applyDebounced);
  filter.addEventListener("change", apply);

  // Initial indexing + run
  buildIndex(Array.from(document.querySelectorAll(".team-card")));
  apply();
});
