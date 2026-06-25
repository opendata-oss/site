// Client interactivity for the homepage diagram. The initial paint is
// server-rendered (active = Log), so this only re-renders the diagram + panel
// on selection. See family.data.ts for the renderers. (Nav interactivity lives
// in Navbar.astro.)
import { diagramHTML, diagramHTMLHorizontal, DEFAULT_SELECTION } from './family.data';

function initFamily() {
  const diagram = document.getElementById('family-diagram');
  const diagramH = document.getElementById('family-diagram-h');
  const panel = document.getElementById('family-panel');
  if (!diagram || !panel) return;

  let active = DEFAULT_SELECTION;
  const render = () => {
    // Both layouts are always in the DOM (CSS shows one per breakpoint), so keep
    // them both up to date — a viewport resize can swap which one is visible.
    diagram.innerHTML = diagramHTML(active);
    if (diagramH) diagramH.innerHTML = diagramHTMLHorizontal(active);
    // Panels are all pre-rendered stacked; just flip which layer is visible so
    // the box keeps the tallest panel's height and never jitters on switch.
    panel.querySelectorAll<HTMLElement>('.fam-layer').forEach((layer) => {
      layer.style.visibility = layer.dataset.panel === active ? 'visible' : 'hidden';
    });
  };

  const onClick = (e: Event) => {
    const target = (e.target as HTMLElement).closest('[data-db]');
    if (!target) return;
    const next = target.getAttribute('data-db');
    if (!next || next === active) return;
    active = next;
    render();
  };
  diagram.addEventListener('click', onClick);
  diagramH?.addEventListener('click', onClick);
}

initFamily();
