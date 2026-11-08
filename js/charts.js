(() => {
  if (typeof Chart === "undefined") return;
  Chart.defaults.color = "#b9b4aa";
  Chart.defaults.borderColor = "#2a2a2a";
  Chart.defaults.font.family = "Inter, Arial, sans-serif";
  const make = (id, config) => {
    const canvas = document.getElementById(id);
    if (canvas) new Chart(canvas, config);
  };
  const bar = (labels, datasets) => ({ type: "bar", data: { labels, datasets }, options: { responsive: true, plugins: { legend: { labels: { color: "#f2efe9" } } }, scales: { x: { grid: { color: "#2a2a2a" } }, y: { beginAtZero: true, grid: { color: "#2a2a2a" } } } } });
  make("streetChart", bar(["2024", "2025"], [
    { label: "Registered incidents", data: [71105, 64323], backgroundColor: ["#b3202f", "#b9b4aa"] }
  ]));
  make("harmChart", bar(["Deaths", "Injuries"], [
    { label: "2024", data: [99, 400], backgroundColor: "#b3202f" },
    { label: "2025", data: [70, 290], backgroundColor: "#b9b4aa" }
  ]));
  let vehicleMode = "Cars";
  let vehicleChart;
  const vehicleCanvas = document.getElementById("vehicleChart");
  const renderVehicle = () => {
    if (!vehicleCanvas) return;
    vehicleChart?.destroy();
    const cars = vehicleMode === "Cars";
    vehicleChart = new Chart(vehicleCanvas, bar(["2022-23", "2024", "2025"], [
      { label: "Theft", data: cars ? [2042, 1702, 1859] : [53357, 41858, 38513], backgroundColor: "#b3202f" },
      { label: "Snatching", data: cars ? [219, 283, 309] : [6014, 8204, 6419], backgroundColor: "#b9b4aa" }
    ]));
  };
  renderVehicle();
  document.getElementById("vehicleToggle")?.addEventListener("click", event => {
    vehicleMode = vehicleMode === "Cars" ? "Motorcycles" : "Cars";
    event.currentTarget.textContent = `Switch to ${vehicleMode === "Cars" ? "motorcycles" : "cars"}`;
    renderVehicle();
  });
  make("recoverChart", { type: "line", data: { labels: ["2023", "2024", "2025"], datasets: [
    { label: "Cars", data: [834, 708, 618], borderColor: "#d62839", backgroundColor: "#d62839", tension: .25 },
    { label: "Motorcycles", data: [4715, 2598, 1631], borderColor: "#b9b4aa", backgroundColor: "#b9b4aa", tension: .25 }
  ] }, options: { responsive: true, plugins: { legend: { labels: { color: "#f2efe9" } } }, scales: { x: { grid: { color: "#2a2a2a" } }, y: { beginAtZero: true, grid: { color: "#2a2a2a" } } } } });
  if (typeof SurveyData !== "undefined") {
    const data = SurveyData;
    const banner = document.getElementById("surveyBanner");
    if (banner && data.sampleData) { banner.hidden = false; banner.textContent = "Sample data for demonstration. Replace with real survey results."; }
    const disclaimer = document.getElementById("surveyDisclaimer");
    if (disclaimer) disclaimer.textContent = `These results reflect the experiences and perceptions of ${data.totalRespondents} respondents. They are not official statistics and may be affected by sample size and who chose to respond.`;
    const labels = Object.keys(data.financialImpact);
    make("surveyImpactChart", { type: "bar", data: { labels, datasets: [{ label: "Respondents", data: Object.values(data.financialImpact), backgroundColor: "#b3202f" }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: "#2a2a2a" } }, y: { beginAtZero: true, grid: { color: "#2a2a2a" } } } } });
    make("surveyPerceptionChart", { type: "bar", data: { labels: ["Feels safe (1–5)", "Trust in justice (1–5)", ...Object.keys(data.mentalImpact)], datasets: [{ label: "Sample values", data: [data.feelsSafeScale, data.trustInJustice, ...Object.values(data.mentalImpact)], backgroundColor: "#b3202f" }] }, options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { grid: { color: "#2a2a2a" } }, y: { beginAtZero: true, grid: { color: "#2a2a2a" } } } } });
    const detail = document.getElementById("surveyDataText");
    if (detail) detail.textContent = labels.map(key => `${key}: ${data.financialImpact[key]}`).join("; ");
    const perception = document.getElementById("surveyPerceptionText");
    if (perception) perception.textContent = `Average feels-safe scale: ${data.feelsSafeScale}/5; trust in justice: ${data.trustInJustice}/5. Reported: ${data.reportingBehaviour.reported}; not reported: ${data.reportingBehaviour.notReported}.`;
  }
})();
