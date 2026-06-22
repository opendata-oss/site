// Client logic for LatencyVsIngest.astro. Standalone module (imported by the
// component's <script>) so Vite's dep scanner parses clean TS, not the .astro
// template, when used inside MDX. Log y-axis so the p99 tail's climb past the
// cache-residency point is legible alongside p50.

// ── DATA ──────────────────────────────────────────────────────────────
// TODO: replace with real benchmark numbers. Fixed cardinality, swept ingest.
// Below the cache-residency point (~5 MB/s) the live tail is cache-resident and
// polls are quick; above it reads spill to object storage and latency climbs —
// p99 from tens of ms toward seconds, p50 from a few ms into the tens.
const ING = [1.25, 2.5, 5, 7.5, 10, 15, 20, 25]; // MB/s
const P50 = [3, 3.2, 4, 7, 12, 20, 28, 36]; // ms
const P99 = [14, 16, 22, 60, 140, 380, 900, 2200]; // ms
const THRESHOLD = 5; // MB/s — cache-residency point

const SVGNS = "http://www.w3.org/2000/svg";
const W = 680, H = 380;
const M = { l: 56, r: 22, t: 22, b: 48 };
const PW = W - M.l - M.r;
const PH = H - M.t - M.b;
const ING_MAX = 26;
const LMIN = 1, LMAX = 3000; // log y-axis domain (ms)
const TICKS = [1, 10, 100, 1000];

const lg = (v: number) => Math.log10(v);
const yLat = (v: number) => M.t + PH * (1 - (lg(v) - lg(LMIN)) / (lg(LMAX) - lg(LMIN)));
const xIng = (v: number) => M.l + PW * (v / ING_MAX);

const el = (name: string, attrs: Record<string, string | number> = {}) => {
  const e = document.createElementNS(SVGNS, name);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  return e;
};

function patternDefs(uid: string) {
  const defs = el("defs");
  const hatch = el("pattern", { id: `${uid}-hatch`, width: 5, height: 5, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
  hatch.appendChild(el("rect", { width: 5, height: 5, fill: "#fff" }));
  hatch.appendChild(el("line", { x1: 0, y1: 0, x2: 0, y2: 5, stroke: "#111", "stroke-width": 1.6 }));
  const dots = el("pattern", { id: `${uid}-dots`, width: 4, height: 4, patternUnits: "userSpaceOnUse" });
  dots.appendChild(el("rect", { width: 4, height: 4, fill: "#fff" }));
  dots.appendChild(el("circle", { cx: 2, cy: 2, r: 1, fill: "#111" }));
  const band = el("pattern", { id: `${uid}-band`, width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
  band.appendChild(el("line", { x1: 0, y1: 0, x2: 0, y2: 8, stroke: "#cfcfcf", "stroke-width": 1 }));
  defs.appendChild(hatch);
  defs.appendChild(dots);
  defs.appendChild(band);
  return defs;
}

function init(root: HTMLElement, idx: number) {
  const svg = root.querySelector(".lvi-svg") as SVGSVGElement;
  const tip = root.querySelector(".lvi-tip") as HTMLElement;
  const uid = `lvi${idx}`;

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

    // grid + log y labels
    TICKS.forEach((v) => {
      const y = yLat(v);
      svg.appendChild(el("line", { x1: M.l, y1: y, x2: M.l + PW, y2: y, stroke: "#ededed", "stroke-width": 1 }));
      const lbl = el("text", { x: M.l - 9, y: y + 3.5, "text-anchor": "end", "font-size": 11, fill: "#666" });
      lbl.textContent = String(v);
      svg.appendChild(lbl);
    });

    // axis frame
    svg.appendChild(el("line", { x1: M.l, y1: M.t, x2: M.l, y2: M.t + PH, stroke: "#111", "stroke-width": 1.5 }));
    svg.appendChild(el("line", { x1: M.l, y1: M.t + PH, x2: M.l + PW, y2: M.t + PH, stroke: "#111", "stroke-width": 1.5 }));
    const yTitle = el("text", { x: 14, y: M.t + PH / 2, "font-size": 11, fill: "#111", "text-anchor": "middle", transform: `rotate(-90 14 ${M.t + PH / 2})` });
    yTitle.textContent = "poll latency (ms, log)";
    svg.appendChild(yTitle);

    // x ticks + title
    [0, 5, 10, 15, 20, 25].forEach((v) => {
      const t = el("text", { x: xIng(v), y: M.t + PH + 18, "text-anchor": "middle", "font-size": 11, fill: "#666" });
      t.textContent = String(v);
      svg.appendChild(t);
    });
    const xTitle = el("text", { x: M.l + PW / 2, y: H - 8, "text-anchor": "middle", "font-size": 11, fill: "#111" });
    xTitle.textContent = "ingest rate (MB/s)  ·  fixed cardinality";
    svg.appendChild(xTitle);

    // cache-residency threshold
    const xth = xIng(THRESHOLD);
    svg.appendChild(el("line", { x1: xth, y1: M.t, x2: xth, y2: M.t + PH, stroke: "#111", "stroke-width": 1, "stroke-dasharray": "4 3", opacity: 0.4 }));
    const thl = el("text", { x: xth + 5, y: M.t + 11, "font-size": 10, fill: "#111", opacity: 0.7 });
    thl.textContent = "cache-residency ~5 MB/s";
    svg.appendChild(thl);

    // p50–p99 band
    const top = P99.map((v, i) => `${i ? "L" : "M"}${xIng(ING[i])} ${yLat(v)}`).join(" ");
    const bottom = P50.map((_, i) => { const j = P50.length - 1 - i; return `L${xIng(ING[j])} ${yLat(P50[j])}`; }).join(" ");
    svg.appendChild(el("path", { d: `${top} ${bottom} Z`, fill: `url(#${uid}-band)`, stroke: "none" }));

    // series lines
    svg.appendChild(el("path", { d: P99.map((v, i) => `${i ? "L" : "M"}${xIng(ING[i])} ${yLat(v)}`).join(" "), fill: "none", stroke: "#111", "stroke-width": 1.5 }));
    svg.appendChild(el("path", { d: P50.map((v, i) => `${i ? "L" : "M"}${xIng(ING[i])} ${yLat(v)}`).join(" "), fill: "none", stroke: "#111", "stroke-width": 1.5, "stroke-dasharray": "2 4", "stroke-linecap": "round" }));

    // markers + hotspots
    const drawMarkers = (vals: number[], texId: string, label: string) => {
      vals.forEach((v, i) => {
        const x = xIng(ING[i]), y = yLat(v);
        const g = el("g", { transform: `translate(${x} ${y})` });
        g.appendChild(el("rect", { x: -5.5, y: -5.5, width: 11, height: 11, fill: `url(#${texId})`, stroke: "#111", "stroke-width": 1.5 }));
        const hot = el("rect", { x: -11, y: -11, width: 22, height: 22, fill: "transparent", style: "cursor:pointer" });
        hot.addEventListener("mouseenter", () => showTip(x, y, `<b>${label}</b><br>${ING[i]} MB/s<br>${v} ms`));
        hot.addEventListener("mouseleave", hideTip);
        g.appendChild(hot);
        svg.appendChild(g);
      });
    };
    drawMarkers(P99, `${uid}-hatch`, "p99 latency");
    drawMarkers(P50, `${uid}-dots`, "p50 latency");

    // inline labels at the right end
    const lp99 = el("text", { x: xIng(ING.at(-1)!) - 2, y: yLat(P99.at(-1)!) - 9, "font-size": 10, fill: "#111", "text-anchor": "end" });
    lp99.textContent = "p99";
    svg.appendChild(lp99);
    const lp50 = el("text", { x: xIng(ING.at(-1)!) - 2, y: yLat(P50.at(-1)!) - 9, "font-size": 10, fill: "#111", "text-anchor": "end" });
    lp50.textContent = "p50";
    svg.appendChild(lp50);
  }

  render();
}

document.querySelectorAll<HTMLElement>("[data-lvi]").forEach(init);
