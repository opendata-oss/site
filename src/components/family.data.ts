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
};

export type Database = {
  key: string;
  name: string;
  full: string;
  approx: string;
  status: 'STABLE' | 'BETA';
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

export const databases: Database[] = [
  {
    key: 'log',
    name: 'Log',
    full: 'OpenData Log',
    approx: 'Kafka',
    status: 'STABLE',
    desc:
      'A durable, append-only log and streaming substrate that writes directly to object storage — no brokers and no local disks to manage.',
    facets: [
      'Exactly-once append semantics',
      'Replays straight from your bucket',
      'Throughput scales with the object store',
    ],
    href: '/blog/announcing-opendata-log',
  },
  {
    key: 'vector',
    name: 'Vector',
    full: 'OpenData Vector',
    approx: 'Pinecone',
    status: 'BETA',
    desc:
      'Vector search and embedding indexes that live in your bucket, so similarity search rides the same storage economics as everything else.',
    facets: [
      'ANN indexes persisted to object storage',
      'Metadata filtering built in',
      'No separate vector cluster to run',
    ],
    href: '/blog/introducing-vector',
  },
  {
    key: 'buffer',
    name: 'Buffer',
    full: 'OpenData Buffer',
    approx: 'Redis',
    status: 'BETA',
    desc:
      'A high-throughput ingestion buffer backed by object storage — absorb bursts and smooth out writes without an in-memory tier to babysit.',
    facets: [
      'Backpressure-aware ingestion',
      'Durable by default',
      'Drains into Log, Timeseries & more',
    ],
    href: '/blog/buffer-ha-pipelines-without-kafka',
  },
  {
    key: 'timeseries',
    name: 'Timeseries',
    full: 'OpenData Timeseries',
    approx: 'InfluxDB',
    status: 'STABLE',
    desc:
      'Time-series metrics and events stored at object-storage cost, with fast range scans over compacted columnar blocks.',
    facets: [
      'Columnar, time-partitioned blocks',
      'Downsampling & retention policies',
      'Cheap long-term history',
    ],
    href: '/blog/introducing-timeseries',
  },
];

const COLORS = {
  active: '#3a66d6',
  gray: '#aeb4bd',
  rail: '#c4cad3',
  shadow: '#bcc3ce',
  shadowActive: '#7385c2',
  engine: '#3a66d6',
  engineDim: '#89a3df',
  os: '#1a1a1a',
};

type Seg = { t: string; c?: string; b?: boolean; anim?: boolean; click?: number };

const ctr = (s: string, n: number) => {
  if (s.length >= n) return s.slice(0, n);
  const t = n - s.length;
  const l = Math.floor(t / 2);
  return ' '.repeat(l) + s + ' '.repeat(t - l);
};

type Cell = { ch: string; col: string | null; b: boolean; anim: boolean; click: number | null };

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
export function buildDiagramLines(active: number): Seg[][] {
  const C = COLORS;
  const W = 74, H = 17, TRUNK = 37;
  const grid: Cell[][] = Array.from({ length: H }, () =>
    Array.from({ length: W }, () => ({ ch: ' ', col: null, b: false, anim: false, click: null }))
  );
  type Opt = { b?: boolean; anim?: boolean; click?: number | null };
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

  // ── database boxes (double border + drop shadow) ───────────────────────
  databases.forEach((d, i) => {
    const left = 2 + i * 18;
    const on = i === active;
    const col = on ? C.active : C.gray;
    const conn = left + 8;
    // drop shadow (offset +1,+1, denser ▒ for emphasis; blue-tinted when selected)
    const sh = on ? C.shadowActive : C.shadow;
    set(1, left + 16, '▒', sh); set(2, left + 16, '▒', sh); set(3, left + 16, '▒', sh);
    row(4, left + 1, left + 16, '▒', sh);
    // box
    set(0, left, '╔', col, { b: on, click: i }); row(0, left + 1, left + 14, '═', col, { b: on, click: i }); set(0, left + 15, '╗', col, { b: on, click: i });
    set(1, left, '║', col, { b: on, click: i }); put(1, left + 1, ctr(d.name, 14), col, { b: on, click: i }); set(1, left + 15, '║', col, { b: on, click: i });
    set(2, left, '║', col, { b: on, click: i }); put(2, left + 1, ctr('≈ ' + d.approx, 14), col, { b: on, click: i }); set(2, left + 15, '║', col, { b: on, click: i });
    set(3, left, '╚', col, { b: on, click: i }); row(3, left + 1, left + 7, '═', col, { b: on, click: i }); set(3, left + 8, '┬', col, { b: on, click: i }); row(3, left + 9, left + 14, '═', col, { b: on, click: i }); set(3, left + 15, '╝', col, { b: on, click: i });
    // drop connector
    set(4, conn, '│', on ? C.active : C.rail, { b: on });
  });

  // ── manifold rail ──────────────────────────────────────────────────────
  row(5, 10, 64, '─', C.rail);
  set(5, 10, '└', C.rail); set(5, 28, '┴', C.rail); set(5, TRUNK, '┬', C.rail); set(5, 46, '┴', C.rail); set(5, 64, '┘', C.rail);
  // highlight the active database's path into the trunk
  const connA = 10 + active * 18;
  for (let c = Math.min(connA, TRUNK); c <= Math.max(connA, TRUNK); c++) {
    grid[5][c].col = C.active;
    grid[5][c].b = false;
  }
  // trunk down to the engine
  set(6, TRUNK, '│', C.active); set(7, TRUNK, '│', C.active);

  // ── storage engine (heavy border) ───────────────────────────────────────
  {
    const L = 12, R = 61;
    set(8, L, '┏', C.engine); row(8, L + 1, R - 1, '━', C.engine); set(8, TRUNK, '▼', C.engine); set(8, R, '┓', C.engine);
    set(9, L, '┃', C.engine); put(9, L + 1, ctr('OpenData Storage Engine', R - L - 1), C.engine, { b: true }); set(9, R, '┃', C.engine);
    set(10, L, '┃', C.engine); put(10, L + 1, ctr('shared by all four databases', R - L - 1), C.engineDim); set(10, R, '┃', C.engine);
    set(11, L, '┗', C.engine); row(11, L + 1, R - 1, '━', C.engine); set(11, TRUNK, '┬', C.engine); set(11, R, '┛', C.engine);
  }
  // trunk down to object storage
  set(12, TRUNK, '│', C.active); set(13, TRUNK, '│', C.active);

  // ── object storage (double border) ──────────────────────────────────────
  {
    const L = 10, R = 63;
    set(14, L, '╔', C.os); row(14, L + 1, R - 1, '═', C.os); set(14, TRUNK, '▼', C.engine, { anim: true }); set(14, R, '╗', C.os);
    set(15, L, '║', C.os); put(15, L + 1, ctr('Object Storage   ·   S3 · GCS · R2', R - L - 1), C.os, { b: true }); set(15, R, '║', C.os);
    set(16, L, '╚', C.os); row(16, L + 1, R - 1, '═', C.os); set(16, R, '╝', C.os);
  }

  return gridToLines(grid);
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function diagramHTML(active: number): string {
  let out = '';
  for (const line of buildDiagramLines(active)) {
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

export function panelHTML(active: number): string {
  const act = databases[active];
  const stable = act.status === 'STABLE';
  const statusColor = stable ? '#3a66d6' : '#b8860b';
  const statusBg = stable ? '#eef2fb' : '#fbf3e2';
  const idx = String(active + 1).padStart(2, '0');

  const facets = act.facets
    .map(
      (f, i) =>
        `<div style="display:flex;gap:11px;margin-bottom:11px">` +
        `<span style="font-size:11px;color:#3a66d6;font-weight:700">[${String(i + 1).padStart(2, '0')}]</span>` +
        `<span style="font-size:13px;color:#555;line-height:1.5">${esc(f)}</span>` +
        `</div>`
    )
    .join('');

  return (
    `<div style="animation:famFadeUp .35s ease">` +
    `<div style="font-size:11px;color:#9a9a9a;letter-spacing:.5px;margin-bottom:14px">DATABASE ${idx} / 04</div>` +
    `<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">` +
    iconTile(act.key, 38, 20) +
    `<div style="font-size:22px;font-weight:700;letter-spacing:-0.5px">${esc(act.full)}</div>` +
    `<span style="font-size:10px;color:${statusColor};background:${statusBg};padding:4px 9px;border-radius:6px;font-weight:700;letter-spacing:.5px">${act.status}</span>` +
    `</div>` +
    `<div style="font-size:14px;line-height:1.65;color:#555;margin-bottom:22px">${esc(act.desc)}</div>` +
    `<div style="border-top:1px solid #f0f0f0;padding-top:18px;margin-bottom:22px">${facets}</div>` +
    `<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">` +
    `<a href="${act.href}" style="background:#1a1a1a;color:#fff;font-size:12px;font-weight:500;padding:12px 18px;border-radius:8px;text-decoration:none">Read the ${esc(act.name)} post →</a>` +
    `<a href="/docs" style="color:#3a66d6;font-size:12px;text-decoration:none">View docs →</a>` +
    `</div>` +
    `</div>`
  );
}
