// Client interactivity for the homepage diagram. The initial paint is
// server-rendered (active = Log), so this only re-renders the diagram + panel
// on selection. See family.data.ts for the renderers. (Nav interactivity lives
// in Navbar.astro.)
import { diagramHTML, panelHTML, DEFAULT_SELECTION } from './family.data';

function initFamily() {
  const diagram = document.getElementById('family-diagram');
  const panel = document.getElementById('family-panel');
  if (!diagram || !panel) return;

  let active = DEFAULT_SELECTION;
  const render = () => {
    diagram.innerHTML = diagramHTML(active);
    panel.innerHTML = panelHTML(active);
  };

  diagram.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-db]');
    if (!target) return;
    const next = target.getAttribute('data-db');
    if (!next || next === active) return;
    active = next;
    render();
  });
}

initFamily();
