(function () {
  "use strict";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initAuthBackground(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || prefersReducedMotion()) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function spawn(total = 70) {
      particles = Array.from({ length: total }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.6 + 0.3,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        a: Math.random() * 0.4 + 0.08,
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      frame += 0.004;

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, height * 0.55 + i * 60);
        for (let x = 0; x <= width; x += 8) {
          const y = height * 0.55 + i * 60
            + Math.sin(x * 0.008 + frame + i * 1.2) * 28
            + Math.cos(x * 0.004 + frame * 0.7) * 14;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(21,87,245,${0.04 - i * 0.01})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${(1 - dist / 130) * 0.14})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > width) p.dx *= -1;
        if (p.y < 0 || p.y > height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${p.a})`;
        ctx.fill();
      }

      window.requestAnimationFrame(draw);
    }

    resize();
    spawn();
    draw();
    window.addEventListener("resize", () => {
      resize();
      spawn();
    });
  }

  function reveal(selector, delayStep = 55) {
    if (prefersReducedMotion()) return;

    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal-ready");
      element.style.setProperty("--reveal-delay", `${index * delayStep}ms`);
      window.requestAnimationFrame(() => element.classList.add("reveal-in"));
    });
  }

  function pulseElement(element, className = "status-updated") {
    if (!element || prefersReducedMotion()) return;
    element.classList.remove(className);
    void element.offsetWidth;
    element.classList.add(className);
  }

  window.InfoLabAnimations = {
    initAuthBackground,
    reveal,
    pulseElement,
  };
})();
