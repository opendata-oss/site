// Client interactivity for the homepage. The initial paint is server-rendered
// (active = Log), so this only re-renders the diagram + panel on selection and
// wires up the mobile nav toggle. See family.data.ts for the renderers.
import { diagramHTML, panelHTML } from './family.data';

function initFamily() {
  const diagram = document.getElementById('family-diagram');
  const panel = document.getElementById('family-panel');
  if (!diagram || !panel) return;

  let active = 0;
  const render = () => {
    diagram.innerHTML = diagramHTML(active);
    panel.innerHTML = panelHTML(active);
  };

  diagram.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest('[data-db]');
    if (!target) return;
    const next = Number(target.getAttribute('data-db'));
    if (Number.isNaN(next) || next === active) return;
    active = next;
    render();
  });
}

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.classList.toggle('hidden', !open);
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

initFamily();
initMobileNav();
