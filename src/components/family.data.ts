// Shared model + renderers for the homepage "database family" diagram.
//
// The ASCII diagram and detail panel are generated as plain HTML strings so the
// exact same code can run server-side (Astro frontmatter, for the initial
// paint) and client-side (family.client.ts, on selection). Dynamic markup uses
// inline styles rather than Tailwind classes so it never depends on the
// Tailwind content scanner picking up class names inside a .ts file.

// Product icons mirror the docs (opendata-docs/docs.json), which uses these
// FontAwesome free-solid glyphs per product. Paths inlined so the homepage
// stays self-contained (no icon-font dependency).
export type Icon = { vb: string; path: string };

export const ICONS: Record<string, Icon> = {
  // fa-scroll
  log: {
    vb: '0 0 576 512',
    path: 'M0 80l0 48c0 17.7 14.3 32 32 32l16 0 48 0 0-80c0-26.5-21.5-48-48-48S0 53.5 0 80zM112 32c10 13.4 16 30 16 48l0 304c0 35.3 28.7 64 64 64s64-28.7 64-64l0-5.3c0-32.4 26.3-58.7 58.7-58.7L480 320l0-192c0-53-43-96-96-96L112 32zM464 480c61.9 0 112-50.1 112-112c0-8.8-7.2-16-16-16l-245.3 0c-14.7 0-26.7 11.9-26.7 26.7l0 5.3c0 53-43 96-96 96l176 0 96 0z',
  },
  // fa-brain
  vector: {
    vb: '0 0 512 512',
    path: 'M184 0c30.9 0 56 25.1 56 56l0 400c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56l0-400c0-30.9 25.1-56 56-56z',
  },
  // fa-right-to-bracket
  buffer: {
    vb: '0 0 512 512',
    path: 'M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z',
  },
  // fa-chart-line
  timeseries: {
    vb: '0 0 512 512',
    path: 'M64 64c0-17.7-14.3-32-32-32S0 46.3 0 64L0 400c0 44.2 35.8 80 80 80l400 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 416c-8.8 0-16-7.2-16-16L64 64zm406.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L320 210.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L240 221.3l57.4 57.4c12.5 12.5 32.8 12.5 45.3 0l128-128z',
  },
  // fa-layer-group
  engine: {
    vb: '0 0 576 512',
    path: 'M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z',
  },
  // fa-cloud
  storage: {
    vb: '0 0 640 512',
    path: 'M0 336c0 79.5 64.5 144 144 144l368 0c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336z',
  },
};

export type Database = {
  key: string;
  name: string;
  full: string;
  desc: string;
  facets: string[];
  href: string;
};

// Renders a product icon inside a dark rounded tile (white glyph).
export function iconTile(key: string, tile: number, glyph: number): string {
  const ic = ICONS[key];
  if (!ic) return '';
  return (
    `<span style="display:inline-flex;align-items:center;justify-content:center;` +
    `width:${tile}px;height:${tile}px;background:#1a1a1a;border-radius:${Math.round(tile * 0.24)}px;flex-shrink:0">` +
    `<svg viewBox="${ic.vb}" width="${glyph}" height="${glyph}" fill="#fff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="${ic.path}"/></svg>` +
    `</span>`
  );
}

// Order is left-to-right in the diagram. Log sits rightmost — nearest the
// detail panel — and is the default selection, so the box↔panel link reads on
// load (see DEFAULT_SELECTION).
export const databases: Database[] = [
  {
    key: 'vector',
    name: 'Vector',
    full: 'OpenData Vector',
    desc:
      'An open-source vector database for fast ANN and full-text search on object storage.',
    facets: [
      'Serve vector search from stateless nodes',
      'Get low-latency queries at 100M-vector scale',
      'Run production search for hundreds, not thousands, per month',
    ],
    href: '/blog/introducing-vector',
  },
  {
    key: 'buffer',
    name: 'Buffer',
    full: 'OpenData Buffer',
    desc:
      'A durable ingestion buffer for high-throughput data pipelines. No Kafka required.',
    facets: [
      'Build HA pipelines with stateless producers and consumers',
      'Use object storage as the durable handoff between systems',
      'Cut broker infrastructure from your ingestion path',
    ],
    href: '/blog/buffer-ha-pipelines-without-kafka',
  },
  {
    key: 'timeseries',
    name: 'Timeseries',
    full: 'OpenData Timeseries',
    desc:
      'A Prometheus-compatible metrics database that keeps the architecture simple, even at high cardinality.',
    facets: [
      'Ingest metrics with one writer and stateless readers',
      'Handle millions of active series without a distributed cluster',
      'Query with PromQL, Grafana, Prometheus, and OpenTelemetry',
    ],
    href: '/blog/introducing-timeseries',
  },
  {
    key: 'log',
    name: 'Log',
    full: 'OpenData Log',
    desc:
      'A durable event streaming database for millions of ordered, keyed streams. Built directly on object storage.',
    facets: [
      'Route events by key, not partitions',
      'Serve millions of keys and tens of thousands of followers from one node',
      'Give every key its own isolated and durable stream',
    ],
    href: '/blog/announcing-opendata-log',
  },
];

const COLORS = {
  active: '#4971ab',
  // Unselected boxes sit back as a muted gray so the one blue selected box
  // clearly pops — the monospace stand-in for the mockup's focus scrim.
  gray: '#878f9c',
  rail: '#cdd2da',
  shadow: '#dde1e8',
  shadowActive: '#d6d7d9',
  engineDim: '#c2c3c6',
};

// A selection is the key of the box currently highlighted in the diagram:
// a database key ('log' | 'vector' | 'buffer' | 'timeseries'), or one of the
// two foundation boxes ('engine' | 'storage'). Exactly one is selected.
export type Selection = string;
export const DEFAULT_SELECTION: Selection = 'log';

// Diagram row layout (shared across the grid builder).
const RAIL = 7, ENG = 11, OS = 21;
const DIAG_ROWS = 26;          // total grid rows (must match H in buildDiagramLines)

type Seg = { t: string; c?: string; b?: boolean; anim?: boolean; click?: string };

const ctr = (s: string, n: number) => {
  if (s.length >= n) return s.slice(0, n);
  const t = n - s.length;
  const l = Math.floor(t / 2);
  return ' '.repeat(l) + s + ' '.repeat(t - l);
};

type Cell = { ch: string; col: string | null; b: boolean; anim: boolean; click: string | null };

// Run-length groups each grid row into styled segments, trimming trailing blanks.
function gridToLines(grid: Cell[][]): Seg[][] {
  return grid.map((row) => {
    let last = row.length - 1;
    while (last >= 0 && row[last].ch === ' ' && row[last].col == null) last--;
    const segs: Seg[] = [];
    let cur: (Seg & { k: string }) | null = null;
    for (let c = 0; c <= last; c++) {
      const cell = row[c];
      const k = `${cell.col || ''}|${cell.b ? 1 : 0}|${cell.anim ? 1 : 0}|${cell.click ?? ''}`;
      if (cur && cur.k === k) {
        cur.t += cell.ch;
      } else {
        cur = {
          k,
          t: cell.ch,
          c: cell.col || undefined,
          b: cell.b,
          anim: cell.anim,
          click: cell.click == null ? undefined : cell.click,
        };
        segs.push(cur);
      }
    }
    return segs.map(({ k, ...s }) => s);
  });
}

// Builds the diagram by painting onto a fixed character grid, so double-border
// boxes, drop shadows, and the active highlight path can be placed by exact
// coordinate. The active database lights a path: box → drop → rail → trunk.
export function buildDiagramLines(active: Selection): Seg[][] {
  const C = COLORS;
  const W = 74, H = DIAG_ROWS, TRUNK = 37;
  const grid: Cell[][] = Array.from({ length: H }, () =>
    Array.from({ length: W }, () => ({ ch: ' ', col: null, b: false, anim: false, click: null }))
  );
  type Opt = { b?: boolean; anim?: boolean; click?: string | null };
  const set = (r: number, c: number, ch: string, col: string | null, o: Opt = {}) => {
    if (r < 0 || r >= H || c < 0 || c >= W) return;
    grid[r][c] = { ch, col, b: !!o.b, anim: !!o.anim, click: o.click == null ? null : o.click };
  };
  const row = (r: number, c0: number, c1: number, ch: string, col: string | null, o: Opt = {}) => {
    for (let c = c0; c <= c1; c++) set(r, c, ch, col, o);
  };
  const put = (r: number, c: number, s: string, col: string | null, o: Opt = {}) => {
    for (let k = 0; k < s.length; k++) set(r, c + k, s[k], col, o);
  };

  // Vertical layout (line-height is 1, so half-block shadows tile flush). Rows:
  //  0 top · 1 pad · 2 name · 3 pad · 4 bottom(┬)
  //  5 shadow+drop · 6 drop · 7 rail · 8-10 trunk
  //  11 eng top · 12 pad · 13 title · 14 gap · 15 sub · 16 pad · 17 eng bottom(┬)
  //  18-20 trunk · 21 os top · 22 pad · 23 os text · 24 pad · 25 os bottom

  // ── database boxes (double border + drop shadow) ───────────────────────
  // Every box is clickable (tagged with its selection key) and renders neutral
  // gray unless it is the selected box, which lights blue + bold.
  databases.forEach((d, i) => {
    const left = 2 + i * 18;
    const on = d.key === active;
    const col = on ? C.active : C.gray;
    const conn = left + 8;
    const o: Opt = { b: on, click: d.key };
    // box (5 rows tall: top, pad, name, pad, bottom)
    set(0, left, '╔', col, o); row(0, left + 1, left + 14, '═', col, o); set(0, left + 15, '╗', col, o);
    const lines = ['', d.name, ''];
    for (let k = 0; k < 3; k++) {
      const r = 1 + k;
      set(r, left, '║', col, o);
      row(r, left + 1, left + 14, ' ', col, { click: d.key });
      if (lines[k]) put(r, left + 1, ctr(lines[k], 14), col, o);
      set(r, left + 15, '║', col, o);
    }
    set(4, left, '╚', col, o); row(4, left + 1, left + 7, '═', col, o); set(4, left + 8, '┬', col, o); row(4, left + 9, left + 14, '═', col, o); set(4, left + 15, '╝', col, o);
    // drop shadow — thin solid half-block strips hugging the box (right + below),
    // matching the dialog's tight `5px 5px 0` offset box-shadow.
    const sh = on ? C.shadowActive : C.shadow;
    for (let r = 1; r <= 4; r++) set(r, left + 16, '▌', sh);
    row(5, left + 1, left + 15, '▀', sh);
    set(5, left + 16, '▘', sh);
    // drop connector down to the rail (structural — stays neutral)
    set(5, conn, '│', C.rail);
    set(6, conn, '│', C.rail);
  });

  // ── manifold rail + trunk (structural plumbing — always neutral) ─────────
  row(RAIL, 10, 64, '─', C.rail);
  set(RAIL, 10, '└', C.rail); set(RAIL, 28, '┴', C.rail); set(RAIL, TRUNK, '┬', C.rail); set(RAIL, 46, '┴', C.rail); set(RAIL, 64, '┘', C.rail);
  // trunk down to the engine
  set(8, TRUNK, '│', C.rail); set(9, TRUNK, '│', C.rail); set(10, TRUNK, '│', C.rail);

  // ── storage engine (heavy border, 7 rows: title + gap + subtitle) ────────
  {
    const L = 12, R = 61;
    const on = active === 'engine';
    const col = on ? C.active : C.gray;
    const sub = on ? C.engineDim : C.gray;
    const e: Opt = { click: 'engine' };
    set(ENG, L, '┏', col, e); row(ENG, L + 1, R - 1, '━', col, e); set(ENG, TRUNK, '▼', C.rail, e); set(ENG, R, '┓', col, e);
    set(ENG + 1, L, '┃', col, e); row(ENG + 1, L + 1, R - 1, ' ', col, e); set(ENG + 1, R, '┃', col, e);
    set(ENG + 2, L, '┃', col, e); row(ENG + 2, L + 1, R - 1, ' ', col, e); put(ENG + 2, L + 1, ctr('OpenData Storage Engine', R - L - 1), col, { b: true, click: 'engine' }); set(ENG + 2, R, '┃', col, e);
    set(ENG + 3, L, '┃', col, e); row(ENG + 3, L + 1, R - 1, ' ', col, e); set(ENG + 3, R, '┃', col, e);
    set(ENG + 4, L, '┃', col, e); row(ENG + 4, L + 1, R - 1, ' ', col, e); put(ENG + 4, L + 1, ctr('built on SlateDB', R - L - 1), sub, e); set(ENG + 4, R, '┃', col, e);
    set(ENG + 5, L, '┃', col, e); row(ENG + 5, L + 1, R - 1, ' ', col, e); set(ENG + 5, R, '┃', col, e);
    set(ENG + 6, L, '┗', col, e); row(ENG + 6, L + 1, R - 1, '━', col, e); set(ENG + 6, TRUNK, '┬', C.rail, e); set(ENG + 6, R, '┛', col, e);
  }
  // trunk down to object storage
  set(18, TRUNK, '│', C.rail); set(19, TRUNK, '│', C.rail); set(20, TRUNK, '│', C.rail);

  // ── object storage (double border, 5 rows) ──────────────────────────────
  {
    const L = 10, R = 63;
    const on = active === 'storage';
    const col = on ? C.active : C.gray;
    const s: Opt = { click: 'storage' };
    set(OS, L, '╔', col, s); row(OS, L + 1, R - 1, '═', col, s); set(OS, TRUNK, '▼', C.rail, { anim: true, click: 'storage' }); set(OS, R, '╗', col, s);
    set(OS + 1, L, '║', col, s); row(OS + 1, L + 1, R - 1, ' ', col, s); set(OS + 1, R, '║', col, s);
    set(OS + 2, L, '║', col, s); row(OS + 2, L + 1, R - 1, ' ', col, s); put(OS + 2, L + 1, ctr('Object Storage   ·   S3 · GCS · R2', R - L - 1), col, { b: true, click: 'storage' }); set(OS + 2, R, '║', col, s);
    set(OS + 3, L, '║', col, s); row(OS + 3, L + 1, R - 1, ' ', col, s); set(OS + 3, R, '║', col, s);
    set(OS + 4, L, '╚', col, s); row(OS + 4, L + 1, R - 1, '═', col, s); set(OS + 4, R, '╝', col, s);
  }

  return gridToLines(grid);
}

// Horizontal variant for the stacked layout (small/medium viewports). Same
// character-grid painter as buildDiagramLines: the four database boxes form a
// 2×2 cluster on the left, a manifold bus collects them and taps right into the
// storage engine, and object storage sits directly below the engine (the shared
// foundation reads as a vertical base). Kept compact (no drop shadows or
// per-box rails) since it renders below the panel.
export function buildDiagramLinesHorizontal(active: Selection): Seg[][] {
  const C = COLORS;
  const W = 61, H = 14;
  const grid: Cell[][] = Array.from({ length: H }, () =>
    Array.from({ length: W }, () => ({ ch: ' ', col: null, b: false, anim: false, click: null }))
  );
  type Opt = { b?: boolean; anim?: boolean; click?: string | null };
  const set = (r: number, c: number, ch: string, col: string | null, o: Opt = {}) => {
    if (r < 0 || r >= H || c < 0 || c >= W) return;
    grid[r][c] = { ch, col, b: !!o.b, anim: !!o.anim, click: o.click == null ? null : o.click };
  };
  const row = (r: number, c0: number, c1: number, ch: string, col: string | null, o: Opt = {}) => {
    for (let c = c0; c <= c1; c++) set(r, c, ch, col, o);
  };
  const put = (r: number, c: number, s: string, col: string | null, o: Opt = {}) => {
    for (let k = 0; k < s.length; k++) set(r, c + k, s[k], col, o);
  };

  // ── database boxes: 2×2 cluster (double border, inner 14) ────────────────
  // index → cell: 0 vector(top-left) 1 buffer(top-right) 2 timeseries(bottom-
  // left) 3 log(bottom-right). Selected box lights blue + bold, rest gray.
  databases.forEach((d, i) => {
    const bx = (i % 2) * 18;           // columns at 0 and 18
    const by = Math.floor(i / 2) * 6;  // rows at 0 and 6
    const on = d.key === active;
    const col = on ? C.active : C.gray;
    const o: Opt = { b: on, click: d.key };
    set(by, bx, '╔', col, o); row(by, bx + 1, bx + 14, '═', col, o); set(by, bx + 15, '╗', col, o);
    const lines = ['', d.name, ''];
    for (let k = 0; k < 3; k++) {
      const r = by + 1 + k;
      set(r, bx, '║', col, o);
      row(r, bx + 1, bx + 14, ' ', col, { click: d.key });
      if (lines[k]) put(r, bx + 1, ctr(lines[k], 14), col, o);
      set(r, bx + 15, '║', col, o);
    }
    set(by + 4, bx, '╚', col, o); row(by + 4, bx + 1, bx + 14, '═', col, o); set(by + 4, bx + 15, '╝', col, o);
  });

  // ── manifold: a vertical bus right of the cluster, spanning its full height
  //    and tapping right into the engine. Structural, so always neutral. ─────
  const BUS = 35;
  set(0, BUS, '╷', C.rail);
  for (let r = 1; r <= 9; r++) set(r, BUS, '│', C.rail);
  set(10, BUS, '╵', C.rail);
  set(5, BUS, '├', C.rail);
  row(5, BUS + 1, BUS + 2, '─', C.rail); set(5, BUS + 3, '►', C.rail);

  // ── storage engine (heavy border), centered on the bus tap (rows 3–7) ────
  const L = 40, R = 60, TRUNK = 50;  // inner 41..59 (19 wide); trunk at center
  {
    const on = active === 'engine';
    const col = on ? C.active : C.gray;
    const sub = on ? C.engineDim : C.gray;
    const e: Opt = { click: 'engine' };
    set(3, L, '┏', col, e); row(3, L + 1, R - 1, '━', col, e); set(3, R, '┓', col, e);
    for (let r = 4; r <= 6; r++) { set(r, L, '┃', col, e); row(r, L + 1, R - 1, ' ', col, e); set(r, R, '┃', col, e); }
    put(4, L + 1, ctr('OpenData', R - L - 1), col, { click: 'engine' });
    put(5, L + 1, ctr('Storage Engine', R - L - 1), col, { b: true, click: 'engine' });
    put(6, L + 1, ctr('built on SlateDB', R - L - 1), sub, e);
    set(7, L, '┗', col, e); row(7, L + 1, R - 1, '━', col, e); set(7, TRUNK, '┬', C.rail); set(7, R, '┛', col, e);
  }

  // engine → object storage: trunk drops straight down (animated arrow in) ───
  set(8, TRUNK, '│', C.rail);

  // ── object storage (double border, rows 9–13), directly below the engine ──
  {
    const on = active === 'storage';
    const col = on ? C.active : C.gray;
    const s: Opt = { click: 'storage' };
    set(9, L, '╔', col, s); row(9, L + 1, R - 1, '═', col, s); set(9, TRUNK, '▼', C.rail, { anim: true }); set(9, R, '╗', col, s);
    for (let r = 10; r <= 12; r++) { set(r, L, '║', col, s); row(r, L + 1, R - 1, ' ', col, s); set(r, R, '║', col, s); }
    put(10, L + 1, ctr('Object Storage', R - L - 1), col, { b: true, click: 'storage' });
    put(12, L + 1, ctr('S3 · GCS · R2', R - L - 1), col, s);
    set(13, L, '╚', col, s); row(13, L + 1, R - 1, '═', col, s); set(13, R, '╝', col, s);
  }

  return gridToLines(grid);
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function linesToHTML(lines: Seg[][]): string {
  let out = '';
  for (const line of lines) {
    for (const s of line) {
      const style =
        `color:${s.c || '#444'};font-weight:${s.b ? 700 : 400};` +
        (s.click != null ? 'cursor:pointer;' : '');
      const cls = s.anim ? ' class="fam-anim"' : '';
      const data = s.click != null ? ` data-db="${s.click}"` : '';
      out += `<span style="${style}"${cls}${data}>${esc(s.t)}</span>`;
    }
    out += '\n';
  }
  return out;
}

export function diagramHTML(active: Selection): string {
  return linesToHTML(buildDiagramLines(active));
}

export function diagramHTMLHorizontal(active: Selection): string {
  return linesToHTML(buildDiagramLinesHorizontal(active));
}

type PanelSpec = {
  iconKey: string;
  title: string;
  desc: string;
  facets: string[];
  buttons: { href: string; label: string; primary: boolean; external?: boolean }[];
};

function renderPanel(p: PanelSpec): string {
  const facets = p.facets
    .map(
      (f) =>
        `<div style="display:flex;gap:9px;margin-bottom:4px">` +
        `<span style="flex-shrink:0;width:5px;height:5px;border-radius:50%;background:#4971ab;margin-top:7px"></span>` +
        `<span style="font-size:13px;color:#555;line-height:1.5">${esc(f)}</span>` +
        `</div>`
    )
    .join('');

  const buttons = p.buttons
    .map((b) => {
      const ext = b.external ? ' target="_blank" rel="noopener"' : '';
      return b.primary
        ? `<a href="${b.href}"${ext} style="font-family:var(--font-mono);border:1px solid #1a1a1a;background:#1a1a1a;color:#fff;font-size:12px;font-weight:500;padding:10px 16px;text-decoration:none">${esc(b.label)}</a>`
        : `<a href="${b.href}"${ext} style="font-family:var(--font-mono);color:#4971ab;font-size:12px;text-decoration:none">${esc(b.label)}</a>`;
    })
    .join('');

  // Subtle floating card: soft drop shadow + hairline border (styling in
  // .fam-panel, index.astro), tied to the selected (blue) box by the matching
  // blue accent on the panel's edge facing the diagram.
  // The product name sits on the panel's top border as a tab (.fam-title) rather
  // than as a large in-body heading — keeps the dialog compact. Padding lives in
  // .fam-panel (index.astro) so it can shrink on the stacked layout.
  return (
    `<div class="fam-panel" style="position:relative;display:flex;flex-direction:column;background:#fff">` +
    `<div class="fam-title">${esc(p.title)}</div>` +
    `<div style="font-size:14px;line-height:1.6;color:#555;margin-bottom:14px">${esc(p.desc)}</div>` +
    `<div style="border-top:1px dashed #dde2ec;padding-top:14px">${facets}</div>` +
    `<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-top:auto;padding-top:16px">${buttons}</div>` +
    `</div>`
  );
}

// Panel content for the two foundation boxes (the databases come from `databases`).
const FOUNDATION: Record<string, PanelSpec> = {
  engine: {
    iconKey: 'engine',
    title: 'OpenData Storage Engine',
    desc:
      'The shared database core behind every OpenData system. Every database compiles down to ordered SlateDB records, so every product inherits the same operating model.',
    facets: [
      'One storage engine for data, indexes, compaction, and checkpoints',
      'Scale readers independently from writers',
      'Learn one operational model',
    ],
    buttons: [
      { href: '/docs/overview/architecture', label: '[ learn more → ]', primary: true },
      { href: 'https://www.slatedb.io/', label: 'slatedb.io →', primary: false, external: true },
    ],
  },
  storage: {
    iconKey: 'storage',
    title: 'Object Storage',
    desc:
      'The durable foundation underneath every OpenData database. Your bucket becomes the source of truth, while compute stays simple, replaceable, and easy to scale.',
    facets: [
      'Store durable state in your own bucket in S3, GCS, and others',
      'Object Storage solves replication, durability, and storage availability',
      'Elastically scale compute without moving data',
    ],
    buttons: [{ href: '/docs/overview/storage', label: '[ learn more → ]', primary: true }],
  },
};

function panelSpec(active: Selection): PanelSpec {
  const found = FOUNDATION[active];
  if (found) return found;

  const act = databases.find((d) => d.key === active) ?? databases[0];
  return {
    iconKey: act.key,
    title: act.full,
    desc: act.desc,
    facets: act.facets,
    buttons: [
      { href: act.href, label: `[ read about ${act.name} → ]`, primary: true },
      { href: `/docs/${act.key}`, label: 'view docs →', primary: false },
    ],
  };
}

// Every selectable key, in diagram order (foundation first, then the products).
export const ALL_KEYS: Selection[] = ['engine', 'storage', ...databases.map((d) => d.key)];

export function panelHTML(active: Selection): string {
  return renderPanel(panelSpec(active));
}

// Renders ALL panels stacked in the same grid cell so the container always
// reserves space for the tallest one. Only the active layer is visible; the
// rest stay laid out (visibility:hidden) so switching never resizes the box.
export function panelsHTML(active: Selection): string {
  const layers = ALL_KEYS.map((key) => {
    const on = key === active;
    const vis = on ? 'visible' : 'hidden';
    return (
      `<div class="fam-layer" data-panel="${key}" ` +
      `style="grid-area:1/1;visibility:${vis}">` +
      renderPanel(panelSpec(key)) +
      `</div>`
    );
  }).join('');
  return `<div class="fam-stack" style="display:grid">${layers}</div>`;
}
