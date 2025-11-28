/* =========================================================
   1) PARALLAX + SMOOTH SCROLL + THEME TOGGLE
========================================================= */
(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll
  document.querySelectorAll(".nav a").forEach(a => {
    a.addEventListener("click", e => {
      e.preventDefault();
      document.querySelector(a.getAttribute("href")).scrollIntoView({
        behavior: "smooth"
      });
    });
  });

  // Parallax system
  const depthFactor = 0.06;
  const parallaxLayers = document.querySelectorAll(
    ".layer-back, .layer-front, .layer-mid"
  );

  function onScroll() {
    const scrollY = window.scrollY;

    parallaxLayers.forEach(el => {
      const speed = el.classList.contains("layer-back")
        ? -0.9
        : el.classList.contains("layer-front")
        ? 1.1
        : 0.3;

      el.style.transform = `translateY(${scrollY * speed * depthFactor}px)`;
    });
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Theme toggle
  const toggle = document.getElementById("toggleTheme");

  toggle?.addEventListener("click", () => {
    document.documentElement.classList.toggle("light");

    const light = document.documentElement.classList.contains("light");

    const vars = {
      "--bg": light ? "#f6fbff" : "",
      "--card": light ? "#ffffff" : "",
      "--muted": light ? "#425063" : "",
      "--accent": light ? "#0066cc" : ""
    };

    for (const v in vars) {
      if (vars[v]) document.documentElement.style.setProperty(v, vars[v]);
      else document.documentElement.style.removeProperty(v);
    }
  });

  onScroll();
})();

/* =========================================================
   2) 3D CAROUSEL ENGINE + ACTIVE SLIDE
========================================================= */

let angle = 0,
  velocity = 0,
  isDragging = false,
  startX = 0,
  isSnapping = false;

const carousel = document.getElementById("carousel");
const slides = carousel?.children || [];
const total = slides.length;

const slideColors = ["#00c8ff", "#ff6f61", "#8fff5a", "#c56bff"];

/* --------- Background Color Reaction ---------- */
function updateBackground(active) {
  document.body.style.transition = "background 1.4s ease";
  document.body.style.background = `
    radial-gradient(circle at 20% 30%, ${slideColors[active]}22, transparent 60%),
    linear-gradient(180deg, var(--bg) 0%, #071018 100%)
  `;
}

/* --------- Carousel Update Core ---------- */
function updateCarousel() {
  if (!carousel) return;

  const rotateAngle = 360 / total;

  for (let i = 0; i < total; i++) {
    slides[i].style.transform = `
      translate(-50%, -50%)
      rotateY(${rotateAngle * i}deg)
      translateZ(350px)
    `;
    slides[i].classList.remove("active");
  }

  let activeIndex = Math.round((-angle / rotateAngle) % total);
  if (activeIndex < 0) activeIndex += total;

  slides[activeIndex].classList.add("active");

  carousel.style.transform = `translateZ(-350px) rotateY(${angle}deg)`;

  updateBackground(activeIndex);
}

updateCarousel();

/* =========================================================
   3) AUTO ROTATE + DRAG / SWIPE + SNAP PHYSICS
========================================================= */

let autoRotate = setInterval(() => {
  angle -= 360 / total;
  updateCarousel();
}, 5000);

carousel?.addEventListener("mouseenter", () => clearInterval(autoRotate));
carousel?.addEventListener("mouseleave", () => {
  autoRotate = setInterval(() => {
    angle -= 360 / total;
    updateCarousel();
  }, 5000);
});

/* --------- Drag ---------- */
carousel?.addEventListener("mousedown", e => {
  isDragging = true;
  startX = e.clientX;
  clearInterval(autoRotate);
});

window.addEventListener("mousemove", e => {
  if (!isDragging) return;

  const delta = e.clientX - startX;
  velocity = delta * 0.06;
  angle -= velocity;

  updateCarousel();
  startX = e.clientX;
});

window.addEventListener("mouseup", () => {
  if (isDragging) snapToNearest();
  isDragging = false;
});

/* --------- Touch ---------- */
carousel?.addEventListener("touchstart", e => {
  isDragging = true;
  startX = e.touches[0].clientX;
  clearInterval(autoRotate);
});

carousel?.addEventListener("touchmove", e => {
  if (!isDragging) return;

  const delta = e.touches[0].clientX - startX;
  velocity = delta * 0.06;
  angle -= velocity;

  updateCarousel();
  startX = e.touches[0].clientX;
});

carousel?.addEventListener("touchend", () => {
  if (isDragging) snapToNearest();
  isDragging = false;
});

/* --------- Snap Physics ---------- */
function snapToNearest() {
  if (isSnapping) return;
  isSnapping = true;

  const rotateAngle = 360 / total;
  const target = Math.round(angle / rotateAngle) * rotateAngle;

  const snapInterval = setInterval(() => {
    const diff = target - angle;
    angle += diff * 0.12;

    updateCarousel();

    if (Math.abs(diff) < 0.5) {
      clearInterval(snapInterval);
      angle = target;
      updateCarousel();
      isSnapping = false;
    }
  }, 16);
}

/* =========================================================
   4) KEYBOARD CONTROL
========================================================= */
window.addEventListener("keydown", e => {
  if (e.key === "ArrowRight") {
    velocity = -6;
    angle += velocity;
    updateCarousel();
    snapToNearest();
  } else if (e.key === "ArrowLeft") {
    velocity = 6;
    angle += velocity;
    updateCarousel();
    snapToNearest();
  }
});

/* =========================================================
   5) PROJECT MODAL POPUP
========================================================= */

/* ================================
   PROJECT MODAL – FIXED & IMPROVED
=================================== */

const modal = document.getElementById("projectModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalDemo = document.getElementById("modalDemo");
const modalCode = document.getElementById("modalCode");
const closeBtn = document.querySelector(".close");

/* Correct file names (.jpeg instead of .jpg) */
const projectInfo = [
  {
    title: "Fuel Delivery",
    desc: "Full fuel ordering system with payments & tracking.",
    img: "images/fuel.jpeg",
    demo: "#",
    code: "#"
  },
  {
    title: "Hotel Management",
    desc: "Complete hotel room booking & dashboard system.",
    img: "images/hotel.jpeg",
    demo: "#",
    code: "#"
  },
  {
    title: "Breakfast Hotel",
    desc: "Menu, orders, PHP backend & responsive layout.",
    img: "images/breakfast.jpeg",
    demo: "#",
    code: "#"
  },
  {
    title: "Student Login System",
    desc: "Role-based login using PHP + MySQL.",
    img: "images/student.jpeg",
    demo: "#",
    code: "#"
  }
];

/* OPEN MODAL ONLY ON ACTIVE SLIDE */
Array.from(slides).forEach((slide, index) => {
  slide.addEventListener("click", () => {

    if (!slide.classList.contains("active")) return; // block inactive slide click

    modal.style.display = "flex";
    modal.classList.add("show");

    modalImage.src = projectInfo[index].img;
    modalTitle.textContent = projectInfo[index].title;
    modalDescription.textContent = projectInfo[index].desc;
    modalDemo.href = projectInfo[index].demo;
    modalCode.href = projectInfo[index].code;

    document.body.style.overflow = "hidden"; // stop background scroll
  });
});

/* CLOSE BUTTON */
closeBtn?.addEventListener("click", closeModal);

/* CLICK OUTSIDE TO CLOSE */
modal?.addEventListener("click", e => {
  if (e.target === modal) closeModal();
});

/* ESC KEY TO CLOSE */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModal();
});

/* CLOSE FUNCTION */
function closeModal() {
  modal.classList.remove("show");
  modal.style.display = "none";
  document.body.style.overflow = "auto"; // restore scroll
}

/* =========================================================
   6) ACTIVE SLIDE TILT (Improved)
========================================================= */
let activeSlide = null;

function trackActiveSlide() {
  const rotateAngle = 360 / total;
  let index = Math.round((-angle / rotateAngle) % total);
  if (index < 0) index += total;
  activeSlide = slides[index];
}

window.addEventListener("mousemove", e => {
  trackActiveSlide();
  if (!activeSlide) return;

  const rect = activeSlide.getBoundingClientRect();
  const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
  const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

  activeSlide.style.transform += ` rotateX(${y * -12}deg) rotateY(${x * 12}deg)`;
});

window.addEventListener("mouseleave", () => {
  if (activeSlide) {
    activeSlide.style.transform = activeSlide.style.transform
      .replace(/rotateX\(.*?\)/, "")
      .replace(/rotateY\(.*?\)/, "");
  }
});

/* =========================================================
   7) RESUME MODAL
========================================================= */

const resumeModal = document.getElementById("resumeModal");
const resumeBtn = document.querySelector(".resume-btn");
const resumeClose = document.querySelector(".resume-close");

resumeBtn?.addEventListener("click", e => {
  e.preventDefault();
  resumeModal.style.display = "flex";
});

resumeClose?.addEventListener("click", () => (resumeModal.style.display = "none"));
resumeModal?.addEventListener("click", e => {
  if (e.target === resumeModal) resumeModal.style.display = "none";
});

/* =========================================================
   8) PARTICLE BACKGROUND (Optimized)
========================================================= */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let w, h, particles;

function initParticles() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;

  particles = Array.from({ length: 40 }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    color: "rgba(0,200,255,0.6)"
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > w) p.speedX *= -1;
    if (p.y < 0 || p.y > h) p.speedY *= -1;

    ctx.beginPath();
    ctx.shadowBlur = 12;
    ctx.shadowColor = p.color;
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", initParticles);
initParticles();
animateParticles();

/* =========================================================
   9) TYPING EFFECT
========================================================= */

const typedText = document.getElementById("typed");
const typingLines = [
  "Web Developer",
  "PHP & MySQL Programmer",
  "UI / UX Designer",
  "Problem Solver",
  "CSBS Student at Vignan's"
];

let lineIndex = 0,
  charIndex = 0,
  deleting = false;

function typeEffect() {
  if (!typedText) return;

  const currentLine = typingLines[lineIndex];

  typedText.textContent = deleting
    ? currentLine.substring(0, charIndex--)
    : currentLine.substring(0, charIndex++);

  if (!deleting && charIndex === currentLine.length) {
    deleting = true;
    setTimeout(typeEffect, 900);
    return;
  }

  if (deleting && charIndex === 0) {
    deleting = false;
    lineIndex = (lineIndex + 1) % typingLines.length;
  }

  setTimeout(typeEffect, deleting ? 50 : 120);
}
typeEffect();

/* =========================================================
   10) SCROLL PROGRESS BAR
========================================================= */

const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const width = (scrollTop / docHeight) * 100;
  progressBar.style.width = `${width}%`;
});

/* =========================================================
   11) SECTION REVEAL ANIMATION
========================================================= */

const reveals = document.querySelectorAll(".reveal");

function revealSections() {
  for (let r of reveals) {
    if (r.getBoundingClientRect().top < window.innerHeight - 60) {
      r.classList.add("active");
    }
  }
}

window.addEventListener("scroll", revealSections);
revealSections();
/* =========================================================
   GITHUB REPOS WIDGET (public repos; caches 10min)
   Usage: enter username in input OR set defaultUsername below
========================================================= */

(function(){
  const defaultUsername = "your-github-username"; // <-- change to your username (optional)

  const statusEl = document.getElementById("gh-status");
  const gridEl = document.getElementById("gh-grid");
  const input = document.getElementById("gh-username");
  const btn = document.getElementById("gh-refresh");

  // load username from localStorage or use default
  const storedUser = localStorage.getItem("gh_user") || defaultUsername;
  if (input) input.value = storedUser || "";

  async function fetchRepos(username){
    if (!username) {
      statusEl.textContent = "Enter a GitHub username above and click Fetch.";
      return;
    }

    statusEl.textContent = "Fetching repositories...";
    gridEl.innerHTML = "";

    // caching key
    const cacheKey = `gh_cache_${username}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed._fetched;
        if (age < 10 * 60 * 1000) { // 10 minutes
          renderRepos(parsed.repos);
          statusEl.textContent = `Loaded from cache (${parsed.repos.length} repos).`;
          return;
        }
      } catch(e){ /* ignore parse errors */ }
    }

    try {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const repos = await res.json();

      // minimal mapping and filtering (skip forks optionally)
      const map = repos
        .filter(r => !r.archived)    // skip archived
        .slice(0, 20)                // show up to 20
        .map(r => ({
          name: r.name,
          url: r.html_url,
          desc: r.description || "",
          stars: r.stargazers_count,
          forks: r.forks_count,
          lang: r.language
        }));

      // cache
      localStorage.setItem(cacheKey, JSON.stringify({ _fetched: Date.now(), repos: map }));

      renderRepos(map);
      statusEl.textContent = `Fetched ${map.length} repos.`;
    } catch (err) {
      console.error("GitHub fetch error:", err);
      statusEl.textContent = "Failed to fetch GitHub repos. (rate limit or network issue)";
      gridEl.innerHTML = `<div style="color:var(--muted);text-align:center">Unable to load repos — try later or set a username.</div>`;
    }
  }

  function renderRepos(list){
    gridEl.innerHTML = "";
    if (!list || list.length === 0) {
      gridEl.innerHTML = `<div style="color:var(--muted); text-align:center">No recent repositories to show.</div>`;
      return;
    }

    for (const r of list){
      const card = document.createElement("a");
      card.className = "gh-card";
      card.href = r.url;
      card.target = "_blank";
      card.rel = "noopener";

      const title = document.createElement("h4");
      title.textContent = r.name;

      const desc = document.createElement("p");
      desc.textContent = r.desc;

      const meta = document.createElement("div");
      meta.className = "gh-meta";
      meta.innerHTML = `
        <span title="Language">${r.lang || "—"}</span>
        <span title="Stars">⭐ ${r.stars}</span>
        <span title="Forks">🍴 ${r.forks}</span>
        <span style="margin-left:auto" class="gh-open">Open →</span>
      `;

      card.appendChild(title);
      if (r.desc) card.appendChild(desc);
      card.appendChild(meta);
      gridEl.appendChild(card);
    }
  }

  // initial fetch if username provided
  const initialUser = (input && input.value) || defaultUsername;
  if (initialUser) {
    fetchRepos(initialUser);
    if (input) input.value = initialUser;
  }

  btn?.addEventListener("click", () => {
    const user = (input && input.value.trim()) || "";
    if (!user) { statusEl.textContent = "Please enter a GitHub username."; return; }
    localStorage.setItem("gh_user", user);
    fetchRepos(user);
  });

})();
/* =========================================================
   MOUSE GLOW TRAIL
========================================================= */

const glow = document.getElementById("cursor-glow");
let glowTimeout;

window.addEventListener("mousemove", (e) => {
  if (!glow) return;

  // Show glow on movement
  document.body.classList.add("mouse-moving");

  // Move with smoothing (lerp)
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;

  // Hide when mouse stops for 1 sec
  clearTimeout(glowTimeout);
  glowTimeout = setTimeout(() => {
    document.body.classList.remove("mouse-moving");
  }, 1000);
});
/* =========================================================
   GITHUB SECTION COLLAPSE / EXPAND
========================================================= */

const ghWrapper = document.getElementById("gh-wrapper");
const ghToggle = document.getElementById("gh-toggle");

// store full height
let ghOpenHeight = 0;

window.addEventListener("load", () => {
  if (ghWrapper) {
    ghOpenHeight = ghWrapper.scrollHeight;
    ghWrapper.style.height = ghOpenHeight + "px";
  }
});

ghToggle?.addEventListener("click", () => {
  if (!ghWrapper) return;

  const isClosed = ghToggle.classList.toggle("closed");

  if (isClosed) {
    // collapse
    ghWrapper.style.height = "0px";
  } else {
    // expand
    ghWrapper.style.height = ghWrapper.scrollHeight + "px";
  }
});
