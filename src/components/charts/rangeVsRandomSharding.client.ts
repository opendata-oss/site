// Client logic for RangeVsRandomSharding.astro. Kept in a standalone module
// (imported by the component's <script>) so Vite's dep scanner parses clean TS
// rather than trying to parse the .astro template when the component is used
// inside MDX. The chart plots read amplification; the stats table keeps GETs/poll
// and p50 latency as the downstream "so what" behind it.

// ── DATA ──────────────────────────────────────────────────────────────
// Endpoints are from the partition-sweep artifact (fixed 25 MB/s ingest, 1M
// keys): read-amp ~9× baseline → 3.9× for range / flat ~9× for random; GETs/poll
// 0.15 → 0.07; p50 latency ~2.7 ms (range) vs 3.5–6.4 ms (random). The per-P
// curves between those endpoints are interpolated — replace with real per-P data.
const P_STEPS = [1, 2, 4, 8, 16];
const D = {
  range:  { amp: [9.0, 6.5, 5.0, 4.3, 3.9], gets: [0.15, 0.11, 0.09, 0.08, 0.07], p50: [3.5, 3.1, 2.9, 2.8, 2.7] },
  random: { amp: [9.0, 9.0, 8.9, 9.1, 9.0], gets: [0.15, 0.15, 0.15, 0.16, 0.15], p50: [3.5, 4.4, 5.2, 5.9, 6.4] },
};
const SVGNS = "http://www.w3.org/2000/svg";
const W = 680, H = 320;
const M = { l: 56, r: 20, t: 22, b: 46 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;
const AMP_MAX = 10;

const yAmp = (a: number) => M.t + PH * (1 - a / AMP_MAX);
const xP = (i: number) => M.l + PW * (0.08 + 0.84 * (i / (P_STEPS.length - 1)));

const el = (name: string, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(SVGNS, name);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
};

function init(root: HTMLElement) {
  const svg = root.querySelector(".rvs-svg") as SVGSVGElement;
  const tip = root.querySelector(".rvs-tip") as HTMLElement;
  let sel = 4; // index into P_STEPS; start at P=16 to show the full effect

  // stepper buttons are rendered statically (so Astro's scoped styles apply);
  // here we just wire up the clicks.
  root.querySelectorAll<HTMLButtonElement>(".rvs-step").forEach((b) =>
    b.addEventListener("click", () => { sel = Number(b.dataset.i); update(); }));

  const showTip = (x: number, y: number, html: string) => {
    const r = svg.getBoundingClientRect();
    tip.innerHTML = html;
    tip.style.left = `${(x / W) * r.width}px`;
    tip.style.top = `${(y / H) * r.height}px`;
    tip.hidden = false;
  };
  const hideTip = () => { tip.hidden = true; };

  function drawChart() {
    svg.innerHTML = "";

    // grid + y labels
    for (let a = 0; a <= AMP_MAX; a += 2) {
      const y = yAmp(a);
      svg.appendChild(el("line", { x1: M.l, y1: y, x2: M.l + PW, y2: y, stroke: "#ededed", "stroke-width": 1 }));
      const lbl = el("text", { x: M.l - 9, y: y + 3.5, "text-anchor": "end", "font-size": 11, fill: "#666" });
      lbl.textContent = `${a}×`;
      svg.appendChild(lbl);
    }
    // axes
    svg.appendChild(el("line", { x1: M.l, y1: M.t, x2: M.l, y2: M.t + PH, stroke: "#111", "stroke-width": 1.5 }));
    svg.appendChild(el("line", { x1: M.l, y1: M.t + PH, x2: M.l + PW, y2: M.t + PH, stroke: "#111", "stroke-width": 1.5 }));
    const yTitle = el("text", { x: 14, y: M.t + PH / 2, "font-size": 11, fill: "#111", "text-anchor": "middle", transform: `rotate(-90 14 ${M.t + PH / 2})` });
    yTitle.textContent = "read amplification";
    svg.appendChild(yTitle);
    P_STEPS.forEach((p, i) => {
      const t = el("text", { x: xP(i), y: M.t + PH + 18, "text-anchor": "middle", "font-size": 11, fill: "#666" });
      t.textContent = String(p);
      svg.appendChild(t);
    });
    const xTitle = el("text", { x: M.l + PW / 2, y: H - 8, "text-anchor": "middle", "font-size": 11, fill: "#111" });
    xTitle.textContent = "reader range size (1/P)";
    svg.appendChild(xTitle);

    // selected-P cursor
    svg.appendChild(el("line", { x1: xP(sel), y1: M.t, x2: xP(sel), y2: M.t + PH, stroke: "#111", "stroke-width": 1, "stroke-dasharray": "4 3", opacity: 0.3 }));

    const drawLine = (key: "range" | "random") => {
      const dat = D[key];
      const path = dat.amp.map((a, i) => `${i ? "L" : "M"}${xP(i)} ${yAmp(a)}`).join(" ");
      const dash = key === "random" ? "5 4" : "0";
      svg.appendChild(el("path", { d: path, fill: "none", stroke: "#111", "stroke-width": key === "range" ? 2.5 : 1.6, "stroke-dasharray": dash }));
      dat.amp.forEach((a, i) => {
        const x = xP(i), y = yAmp(a);
        const active = i === sel;
        const g = el("g", { transform: `translate(${x} ${y})` });
        if (key === "range") {
          g.appendChild(el("rect", { x: -5, y: -5, width: 10, height: 10, fill: active ? "#111" : "#fff", stroke: "#111", "stroke-width": 1.8 }));
        } else {
          g.appendChild(el("circle", { r: active ? 5 : 4, fill: "#fff", stroke: "#111", "stroke-width": 1.8 }));
          if (active) g.appendChild(el("circle", { r: 1.6, fill: "#111" }));
        }
        const hot = el("rect", { x: -11, y: -11, width: 22, height: 22, fill: "transparent", style: "cursor:pointer" });
        hot.addEventListener("mouseenter", () => showTip(x, y, `<b>${key}</b> &middot; P=${P_STEPS[i]}<br>${a.toFixed(1)}× read-amp`));
        hot.addEventListener("mouseleave", hideTip);
        g.appendChild(hot);
        svg.appendChild(g);
      });
    };
    drawLine("range");
    drawLine("random");
  }

  function drawStats() {
    (["range", "random"] as const).forEach((key) => {
      const row = root.querySelector(`[data-row="${key}"]`) as HTMLElement;
      (row.querySelector("[data-amp]") as HTMLElement).textContent = `${D[key].amp[sel].toFixed(1)}×`;
      (row.querySelector("[data-gets]") as HTMLElement).textContent = D[key].gets[sel].toFixed(2);
      (row.querySelector("[data-p50]") as HTMLElement).textContent = `${D[key].p50[sel].toFixed(1)} ms`;
    });
  }

  function update() {
    root.querySelectorAll<HTMLButtonElement>(".rvs-step").forEach((b) =>
      b.classList.toggle("is-active", Number(b.dataset.i) === sel));
    hideTip();
    drawChart();
    drawStats();
  }

  update();
}

document.querySelectorAll<HTMLElement>("[data-rvs]").forEach(init);
