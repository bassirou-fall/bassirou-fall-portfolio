/* =========================================================
   Portfolio — Bassirou Fall
   ========================================================= */

/* ▼▼▼ À COMPLÉTER : tes liens personnels ▼▼▼
   Laisse vide ("") pour masquer automatiquement le lien. */
const LIENS = {
       linkedin: "https://www.linkedin.com/in/bassirou-fall-3074a7183/",
  whatsapp: "",   // numéro au format international sans "+", ex. "221781036379"
};
/* ▲▲▲ ------------------------------------------ ▲▲▲ */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Liens personnels ---------- */
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.dataset.link;
    const value = (LIENS[key] || "").trim();
    if (!value) { el.classList.add("is-hidden"); return; }
    const a = el.tagName === "A" ? el : el.querySelector("a");
    if (!a) return;
    a.href = key === "whatsapp"
      ? `https://wa.me/${value.replace(/\D/g, "")}?text=${encodeURIComponent("Bonjour Bassirou, je viens de voir votre portfolio.")}`
      : value;
  });

  /* ---------- Thème clair / sombre ---------- */
  const themeBtn = document.getElementById("theme-toggle");
  themeBtn?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* stockage indisponible */ }
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "light" ? "#f7f8fb" : "#0b0f17");
  });

  /* ---------- Barre de navigation ---------- */
  const topbar = document.getElementById("topbar");
  const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menu-toggle");
  const setMenu = (open) => {
    nav.classList.toggle("open", open);
    topbar.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };
  menuBtn?.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("open") && !topbar.contains(e.target)) setMenu(false);
  });

  /* ---------- Lien actif selon la section visible ---------- */
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Apparition au scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("visible"));
  } else {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  /* ---------- Copier l'email ---------- */
  const copyBtn = document.getElementById("copy-email");
  copyBtn?.addEventListener("click", async () => {
    const label = copyBtn.querySelector("span");
    const original = label.textContent;
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.email);
      label.textContent = "Adresse copiée ✓";
    } catch (e) {
      label.textContent = copyBtn.dataset.email;
    }
    setTimeout(() => { label.textContent = original; }, 2200);
  });

  /* ---------- Visionneuse d'image ---------- */
  const lightbox = document.getElementById("lightbox");
  if (lightbox && typeof lightbox.showModal === "function") {
    const img = lightbox.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach((btn) => {
      btn.addEventListener("click", () => {
        img.src = btn.dataset.lightbox;
        img.alt = btn.querySelector("img")?.alt || "";
        lightbox.showModal();
      });
    });
    lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });
  } else {
    // Navigateur sans <dialog> : ouvrir l'image dans un nouvel onglet
    document.querySelectorAll("[data-lightbox]").forEach((btn) => {
      btn.addEventListener("click", () => window.open(btn.dataset.lightbox, "_blank", "noopener"));
    });
  }

  /* ---------- Année du footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
