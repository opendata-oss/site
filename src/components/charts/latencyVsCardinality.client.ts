// Client logic for LatencyVsCardinality.astro. Kept in a standalone module so
// Vite's dep scanner parses clean TS rather than the .astro template when the
// component is used inside MDX.

// ── DATA ──────────────────────────────────────────────────────────────
// Real run: fixed ~20 MB/s ingest, key count swept 100K → 1M. p50 poll latency
// stays in the tens of ms and doesn't grow with cardinality — the null result.
// (p99 for these runs is multiple seconds, dominated by the cache-miss tail, so
// it can't share an axis with p50 and isn't shown here. For reference the runs
// also logged read-amp ~8.6–9.6× and 1.7–3.0 segments/poll across the sweep.)
const CARDS = ["100K", "250K", "500K", "1M"];
const P50 = [38.9, 39.0, 39.8, 39.7]; // ms  (fixed ~20 MB/s ingest)
const LAT_MAX = 60; // ms (y-axis ceiling)

const SVGNS = "http://www.w3.org/2000/svg";
const W = 680, H = 380;
const M = { l: 50, r: 20, t: 22, b: 48 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;

const yLat = (v: number) => M.t + PH * (1 - v / LAT_MAX);
const xCard = (i: number) => M.l + PW * (0.12 + 0.76 * (i / (CARDS.length - 1)));

const el = (name: string, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(SVGNS, name);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
};

function patternDefs(uid: string) {
  const defs = el("defs");
  // p50 = dot stipple
  const dots = el("pattern", { id: `${uid}-dots`, width: 4, height: 4, patternUnits: "userSpaceOnUse" });
  dots.appendChild(el("rect", { width: 4, height: 4, fill: "#fff" }));
  dots.appendChild(el("circle", { cx: 2, cy: 2, r: 1, fill: "#111" }));
  defs.appendChild(dots);
  return defs;
}

function init(root: HTMLElement, idx: number) {
  const svg = root.querySelector(".rac-svg") as SVGSVGElement;
  const tip = root.querySelector(".rac-tip") as HTMLElement;
  const uid = `rac${idx}`;

  const showTip = (x: number, y: number, html: string) => {
    const r = svg.getBoundingClientRect();
    tip.innerHTML = html;
    tip.style.left = `${(x / W) * r.width}px`;
    tip.style.top = `${(y / H) * r.height}px`;
    tip.hidden = false;
  };
  const hideTip = () => { tip.hidden = true; };

  function render() {
    svg.innerHTML = "";
    svg.appendChild(patternDefs(uid));

    // ── grid + y axis (ms) ────────────────────────────────────────────
    for (let v = 0; v <= LAT_MAX; v += 20) {
      const y = yLat(v);
      svg.appendChild(el("line", { x1: M.l, y1: y, x2: M.l + PW, y2: y, stroke: "#ededed", "stroke-width": 1 }));
      const lbl = el("text", { x: M.l - 9, y: y + 3.5, "text-anchor": "end", "font-size": 11, fill: "#666" });
      lbl.textContent = String(v);
      svg.appendChild(lbl);
    }

    // axis frame
    svg.appendChild(el("line", { x1: M.l, y1: M.t, x2: M.l, y2: M.t + PH, stroke: "#111", "stroke-width": 1.5 }));
    svg.appendChild(el("line", { x1: M.l, y1: M.t + PH, x2: M.l + PW, y2: M.t + PH, stroke: "#111", "stroke-width": 1.5 }));

    const yTitle = el("text", { x: 15, y: M.t + PH / 2, "font-size": 11, fill: "#111", "text-anchor": "middle", transform: `rotate(-90 15 ${M.t + PH / 2})` });
    yTitle.textContent = "poll latency p50 (ms)";
    svg.appendChild(yTitle);

    // x ticks + title
    CARDS.forEach((c, i) => {
      const t = el("text", { x: xCard(i), y: M.t + PH + 18, "text-anchor": "middle", "font-size": 11, fill: "#666" });
      t.textContent = c;
      svg.appendChild(t);
    });
    const xTitle = el("text", { x: M.l + PW / 2, y: H - 8, "text-anchor": "middle", "font-size": 11, fill: "#111" });
    xTitle.textContent = "key cardinality  ·  fixed 20 MB/s ingest";
    svg.appendChild(xTitle);

    // ── p50 line + markers ────────────────────────────────────────────
    svg.appendChild(el("path", { d: P50.map((v, i) => `${i ? "L" : "M"}${xCard(i)} ${yLat(v)}`).join(" "), fill: "none", stroke: "#111", "stroke-width": 2 }));
    P50.forEach((v, i) => {
      const x = xCard(i), y = yLat(v);
      const g = el("g", { transform: `translate(${x} ${y})` });
      g.appendChild(el("rect", { x: -6, y: -6, width: 12, height: 12, fill: `url(#${uid}-dots)`, stroke: "#111", "stroke-width": 1.5 }));
      const hot = el("rect", { x: -11, y: -11, width: 22, height: 22, fill: "transparent", style: "cursor:pointer" });
      hot.addEventListener("mouseenter", () => showTip(x, y, `<b>p50 latency</b><br>${CARDS[i]} keys &middot; 20 MB/s<br>${v.toFixed(1)} ms`));
      hot.addEventListener("mouseleave", hideTip);
      g.appendChild(hot);
      svg.appendChild(g);
    });
  }

  render();
}

document.querySelectorAll<HTMLElement>("[data-rac]").forEach(init);
