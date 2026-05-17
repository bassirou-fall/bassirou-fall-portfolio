document.addEventListener("DOMContentLoaded", () => {
    // Scroll reveal
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));

    // Animated counters (when visible)
    const counters = document.querySelectorAll("[data-counter]");

    const formatNumber = (n) => {
        try {
            return new Intl.NumberFormat("fr-FR").format(n);
        } catch {
            return String(n);
        }
    };

    const animateCounter = (el) => {
        const target = Number(el.getAttribute("data-counter-target") || 0);
        const duration = Number(el.getAttribute("data-counter-duration") || 1100);
        const suffix = el.getAttribute("data-counter-suffix") || "";
        const prefix = el.getAttribute("data-counter-prefix") || "";
        const start = 0;
        const startTime = performance.now();

        const step = (now) => {
            const t = Math.min(1, (now - startTime) / duration);
            const value = start + (target - start) * (t * (2 - t)); // easeOutQuad
            el.textContent = `${prefix}${formatNumber(Math.round(value))}${suffix}`;
            if (t < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    if (!el.dataset.counterAnimated) {
                        el.dataset.counterAnimated = "true";
                        animateCounter(el);
                    }
                    obs.unobserve(el);
                }
            });
        },
        { threshold: 0.4 }
    );

    counters.forEach(el => counterObserver.observe(el));
});

