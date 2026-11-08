(() => {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === current) link.setAttribute("aria-current", "page");
  });
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), { threshold: .12 });
    revealItems.forEach(item => observer.observe(item));
  } else revealItems.forEach(item => item.classList.add("visible"));
  const counters = document.querySelectorAll(".stat-number");
  const runCounter = element => {
    const source = element.textContent;
    const matches = [...source.matchAll(/\d[\d,]*/g)];
    if (!matches.length) return;
    const targets = matches.map(match => Number(match[0].replaceAll(",", "")));
    const format = values => {
      let output = "";
      let cursor = 0;
      matches.forEach((match, index) => {
        output += source.slice(cursor, match.index) + Math.round(values[index]).toLocaleString();
        cursor = match.index + match[0].length;
      });
      element.textContent = output + source.slice(cursor);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { format(targets); return; }
    const start = performance.now();
    const duration = 900;
    const frame = now => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      format(targets.map(target => target * eased));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { runCounter(entry.target); counterObserver.unobserve(entry.target); }
    }), { threshold: .6 });
    counters.forEach(counter => counterObserver.observe(counter));
  } else counters.forEach(runCounter);
  const backTop = document.querySelector(".back-top");
  addEventListener("scroll", () => backTop?.classList.toggle("visible", scrollY > 500), { passive: true });
  backTop?.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  const calculator = ["itemValue", "repairValue", "workDays", "dailyIncome", "securityCost", "salary"].map(id => document.getElementById(id));
  const updateCost = () => {
    if (!calculator[0]) return;
    const [item, repair, days, daily, security, salary] = calculator.map(input => Math.max(0, Number(input.value) || 0));
    const total = item + repair + days * daily + security;
    document.getElementById("totalCost").textContent = Math.round(total).toLocaleString();
    document.getElementById("weeksCost").textContent = salary ? (total / (salary / 4.345)).toFixed(1) : "0";
  };
  calculator.forEach(input => input?.addEventListener("input", updateCost));
  document.getElementById("copyLink")?.addEventListener("click", async event => {
    try { await navigator.clipboard.writeText(location.href); event.currentTarget.textContent = "Link copied"; }
    catch { event.currentTarget.textContent = "Copy unavailable"; }
  });
  const share = document.getElementById("whatsappShare");
  if (share) {
    share.href = `https://wa.me/?text=${encodeURIComponent(document.title + " " + location.href)}`;
    share.target = "_blank";
    share.rel = "noopener noreferrer";
    share.setAttribute("aria-label", "Share this article on WhatsApp in a new tab");
  }
  const article = document.querySelector(".article");
  const reading = document.getElementById("readingTime");
  if (article && reading) reading.textContent = `${Math.max(1, Math.ceil(article.innerText.split(/\s+/).length / 220))} min read`;
  document.querySelectorAll(".todo").forEach(item => console.warn("Justice Unheard placeholder:", item.textContent.trim()));
})();
