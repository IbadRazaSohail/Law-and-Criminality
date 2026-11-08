(() => {
  const data = PHASE1_SURVEY;
  const palette = ["#d62839", "#7a1420", "#b9b4aa", "#5c5750", "#f2efe9"];
  const percent = count => (count / data.total * 100).toFixed(1);
  const get = key => data[key];
  const sumYes = key => get(key).find(item => item.label === "Yes").count;
  const victims = data.robberyVictim.filter(item => item.label !== "No").reduce((sum, item) => sum + item.count, 0);
  const cctvNo = data.cctv.find(item => item.label === "No").count;
  const safeAlways = data.safeWalkingAtNight.find(item => item.label === "Yes").count;
  const affected = sumYes("affectedByGangFight");
  const heard = sumYes("heardOfRobbery");
  const lowestRating = data.policeRating.find(item => item.rating === 1).count;
  const masters = data.qualification.find(item => item.label === "Masters Degree").count;

  document.querySelectorAll("[data-percentage]").forEach(element => {
    const count = element.dataset.percentage === "lowestRating" ? lowestRating : masters;
    element.textContent = `${percent(count)}%`;
  });

  const counters = {
    heard: [heard, "%", `${percent(heard)}%`],
    victim: [victims, "%", `${percent(victims)}%`],
    affected: [affected, "%", `${percent(affected)}%`],
    cctv: [cctvNo, "%", `${percent(cctvNo)}%`],
    safe: [safeAlways, "%", `${percent(safeAlways)}%`],
    police: [data.policeRatingAverage, " / 5", `${data.policeRatingAverage.toFixed(2)} / 5`]
  };
  const animateCounter = (element, [target, suffix, finalText]) => {
    const render = value => {
      element.textContent = `${suffix === " / 5" ? value.toFixed(2) : value.toFixed(1)}${suffix}`;
      if (value >= target) element.textContent = finalText;
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = finalText;
      return;
    }
    const start = performance.now();
    const duration = 850;
    const frame = now => {
      const progress = Math.min(1, (now - start) / duration);
      render(target * (1 - (1 - progress) ** 3));
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  const statObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, counters[entry.target.dataset.stat]);
        statObserver.unobserve(entry.target);
      }
    }), { threshold: .6 })
    : null;
  document.querySelectorAll("[data-stat]").forEach(element => {
    if (statObserver) statObserver.observe(element);
    else animateCounter(element, counters[element.dataset.stat]);
  });

  const summary = document.getElementById("phase1Summary");
  if (summary) {
    summary.innerHTML = [
      ["Heard of a robbery nearby", heard],
      ["Reported a robbery victimisation", victims],
      ["Affected by a gang fight", affected]
    ].map(([label, count]) => `<article class="card"><span class="eyebrow">${label}</span><strong class="summary-number">${percent(count)}%</strong><p>${count} of ${data.total} respondents</p></article>`).join("");
  }
  const impactSummary = document.getElementById("impactSurveySummary");
  if (impactSummary) {
    impactSummary.innerHTML = `<p>In our survey, ${percent(victims)}% (${victims} of ${data.total}) reported a robbery victimisation. ${percent(affected)}% (${affected} of ${data.total}) said they had been affected by a gang fight. These findings describe this self-selected sample, not all Karachi households.</p><a class="button secondary" href="survey-results.html">See full survey results ↗</a>`;
  }

  if (typeof Chart === "undefined") return;
  Chart.defaults.color = "#b9b4aa";
  Chart.defaults.borderColor = "#2a2a2a";
  Chart.defaults.font.family = "Inter, Arial, sans-serif";
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) Chart.defaults.animation = false;

  const configs = {
    gender: {
      title: "Gender", type: "doughnut", values: data.gender,
      note: "Responses were close to evenly split between male and female respondents; two preferred not to say."
    },
    qualification: {
      title: "Qualification", type: "doughnut", values: data.qualification,
      note: "Thirty-one respondents reported a master's degree, the largest qualification group in this sample."
    },
    heardOfRobbery: {
      title: "Heard of a robbery in their area", type: "bar", values: data.heardOfRobbery,
      note: "Forty-two respondents answered yes to hearing of a robbery in their area."
    },
    robberyVictim: {
      title: "Robbery victimisation", type: "horizontalBar", values: data.robberyVictim,
      note: "Thirty-two respondents selected one of the robbery-victimisation categories; responses are self-reported."
    },
    witnessedGangFight: {
      title: "Witnessed a gang fight", type: "bar", values: data.witnessedGangFight,
      note: "Twenty respondents answered yes to witnessing a gang fight."
    },
    affectedByGangFight: {
      title: "Affected by a gang fight", type: "bar", values: data.affectedByGangFight,
      note: "Twenty-six respondents answered yes to being affected by a gang fight."
    },
    cctv: {
      title: "Proper CCTV supervision in the area", type: "bar", values: data.cctv,
      note: "Twenty-five respondents answered no; seven answered maybe."
    },
    safeWalkingAtNight: {
      title: "Feeling safe walking alone at night", type: "bar", values: data.safeWalkingAtNight,
      note: "Seventeen respondents answered yes; the other responses were sometimes, no, or not at all."
    },
    genderViolenceCommon: {
      title: "Gender-specific violence is common", type: "bar", values: data.genderViolenceCommon,
      note: "Answers were divided across yes, no, and a little bit; these are respondents' perceptions."
    },
    policeRating: {
      title: "Police rating (1–5)", type: "bar",
      values: data.policeRating.map(item => ({ label: `Rating ${item.rating}`, count: item.count })),
      note: `The average rating was ${data.policeRatingAverage.toFixed(2)} out of 5.`
    }
  };
  const chartColors = values => values.map((_, index) => palette[index % palette.length]);

  Object.entries(configs).forEach(([key, config]) => {
    const mount = document.querySelector(`[data-survey-chart="${key}"]`);
    if (!mount) return;
    const values = config.values.map(item => ({ ...item, percent: percent(item.count) }));
    const headingId = `chart-title-${key}`;
    const canvasId = `chart-canvas-${key}`;
    const chartLabels = values.map(item => `${item.label} · ${item.count} (${item.percent}%)`);
    const rows = values.map(item => `<tr><th scope="row">${item.label}</th><td>${item.count}</td><td>${item.percent}%</td></tr>`).join("");
    mount.innerHTML = `<article class="card phase-chart reveal"><div class="phase-chart-heading"><h3 id="${headingId}">${config.title}</h3><span>n = ${data.total}</span></div><canvas id="${canvasId}" role="img" aria-labelledby="${headingId}" aria-label="${config.title}, ${values.map(item => `${item.label}: ${item.count}, ${item.percent} percent`).join("; ")}"></canvas><p class="caption"><b>What this shows:</b> ${config.note}</p><details><summary>View data</summary><div class="table-wrap"><table><thead><tr><th scope="col">Response</th><th scope="col">Count</th><th scope="col">Percentage</th></tr></thead><tbody>${rows}</tbody></table></div></details></article>`;
    const horizontal = config.type === "horizontalBar";
    const doughnut = config.type === "doughnut";
    const context = document.getElementById(canvasId);
    new Chart(context, {
      type: doughnut ? "doughnut" : "bar",
      data: {
        labels: chartLabels,
        datasets: [{
          label: "Respondents",
          data: values.map(item => item.count),
          backgroundColor: chartColors(values),
          borderColor: "#121212",
          borderWidth: doughnut ? 2 : 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: horizontal ? "y" : "x",
        plugins: {
          legend: {
            display: doughnut,
            position: "bottom",
            labels: { color: "#f2efe9", boxWidth: 12, padding: 14 }
          },
          tooltip: {
            callbacks: {
              label: context => `${values[context.dataIndex].label}: ${values[context.dataIndex].count} (${values[context.dataIndex].percent}%)`
            }
          }
        },
        scales: doughnut ? {} : {
          x: horizontal ? { grid: { color: "#2a2a2a" }, ticks: { color: "#b9b4aa" } } : { grid: { color: "#2a2a2a" }, ticks: { color: "#f2efe9" } },
          y: horizontal ? {
            grid: { color: "#2a2a2a" }, beginAtZero: true,
            ticks: { color: "#f2efe9", callback: (value, index) => {
              const label = values[index]?.label || "";
              return label.length > 27 ? [label.slice(0, 27), label.slice(27)] : label;
            } }
          } : { grid: { color: "#2a2a2a" }, beginAtZero: true, ticks: { color: "#b9b4aa", precision: 0 } }
        }
      }
    });
  });
})();
