(function () {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DEMOS = window.DEMOS || {};
let LANG = 'en';
try { LANG = localStorage.getItem('lang') || (navigator.language || '').toLowerCase().startsWith('pt') && 'pt' || 'en'; } catch (e) {}

/* ---------- build project panels ---------- */
const track = document.getElementById('track');
track.innerHTML = PROJECTS.map(p => `<article class="panel" id="p-${p.id}"><div class="ptext"></div>
 <div class="demo"><div class="dm-tabs" role="tablist"></div><div class="dm-stage"></div><div class="dm-note"><i></i><span></span></div></div></article>`).join('');

function panelText(p) {
  const L = LANG;
  return `<span class="k">${p.kind[L]}</span><h2>${p.name}</h2><p>${p.desc[L]}</p><ul>${p.facts[L].map(f => `<li>${f}</li>`).join('')}</ul>
  <div class="chips">${p.stack.map(s => `<span class="${/Supabase|RLS|Edge|Storage/.test(s) ? 's' : ''}">${s}</span>`).join('')}</div>
  <a class="code" href="https://github.com/${p.repo}">${L === 'pt' ? 'Ver o código no GitHub' : 'View code on GitHub'}</a>`;
}
function noteText(p) {
  return LANG === 'pt'
    ? `Demonstração interativa com dados fictícios. O sistema real roda no Supabase e o acesso é restrito ${p.access.pt}.`
    : `Interactive demo with fictional data. The production app runs on Supabase and access is restricted to ${p.access.en}.`;
}

/* ---------- demo stages (iframes of demos/<id>/<file>) ---------- */
const frames = [];
function fit(item) {
  const s = item._screen, stage = item.parentElement, box = item.firstChild, fr = box.firstChild;
  const sw = stage.clientWidth, sh = stage.clientHeight, phone = s.w < 600;
  const k = Math.min(sw / s.w, (sh - (phone ? 20 : 0)) / s.h);
  box.style.width = s.w * k + 'px'; box.style.height = s.h * k + 'px';
  fr.style.transform = `scale(${k})`;
}
function buildDemo(p, panel) {
  const screens = DEMOS[p.id] || [];
  const tabs = panel.querySelector('.dm-tabs'), stage = panel.querySelector('.dm-stage');
  tabs.innerHTML = screens.map((s, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}">${s[LANG]}</button>`).join('');
  stage.innerHTML = '';
  const items = screens.map((s, i) => {
    const it = document.createElement('div'); it.className = 'dm-item' + (i === 0 ? ' on' : ''); it._screen = s;
    const box = document.createElement('div'); box.className = 'dm-box' + (s.w < 600 ? ' phone' : '');
    const fr = document.createElement('iframe');
    fr.width = s.w; fr.height = s.h; fr.title = `${p.name} · ${s.en}`; fr.loading = 'lazy'; fr.tabIndex = -1;
    fr.setAttribute('scrolling', 'no');
    fr.dataset.src = `demos/${p.id}/${s.file}#${LANG}`;
    if (i === 0) fr.src = fr.dataset.src;
    fr.addEventListener('load', () => fr.contentWindow && fr.contentWindow.postMessage({ lang: LANG }, '*'));
    box.appendChild(fr); it.appendChild(box); stage.appendChild(it); frames.push(fr);
    return it;
  });
  new ResizeObserver(() => items.forEach(fit)).observe(stage);
  tabs.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    tabs.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', x === b));
    items.forEach((it, i) => {
      const on = i == b.dataset.i; it.classList.toggle('on', on);
      const fr = it.querySelector('iframe'); if (on && !fr.src) fr.src = fr.dataset.src;
    });
  }));
}
PROJECTS.forEach(p => buildDemo(p, document.getElementById('p-' + p.id)));
document.getElementById('apps').innerHTML = PROJECTS.map(p => `<div class="app">${p.name}<small data-k="${p.id}"></small></div>`).join('');

/* ---------- language ---------- */
function splitH1() { const h = document.getElementById('h1'); h.innerHTML = h.textContent.split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' '); }
function applyLang(l, first) {
  LANG = l; try { localStorage.setItem('lang', l); } catch (e) {}
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-en]').forEach(el => el.textContent = el.dataset[l]);
  splitH1();
  PROJECTS.forEach(p => {
    const panel = document.getElementById('p-' + p.id);
    panel.querySelector('.ptext').innerHTML = panelText(p);
    panel.querySelector('.dm-note span').textContent = noteText(p);
    panel.querySelectorAll('.dm-tabs button').forEach((b, i) => b.textContent = DEMOS[p.id][i][l]);
  });
  document.querySelectorAll('.app small').forEach(s => s.textContent = PROJECTS.find(p => p.id === s.dataset.k).kind[l]);
  frames.forEach(fr => { fr.dataset.src = fr.dataset.src.replace(/#(en|pt)$/, '#' + l); if (fr.src && fr.contentWindow) fr.contentWindow.postMessage({ lang: l }, '*'); });
  const lg = document.getElementById('lang'); lg.dataset.lang = l;
  lg.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.set === l));
  if (!first && window.ScrollTrigger) ScrollTrigger.refresh();
}
document.querySelectorAll('#lang button').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.set === LANG) return;
  document.body.classList.add('switching');
  setTimeout(() => { applyLang(b.dataset.set); document.body.classList.remove('switching'); }, 200);
}));
applyLang(LANG, true);
addEventListener('scroll', () => document.getElementById('nav').classList.toggle('solid', scrollY > 40), { passive: true });

/* ---------- neural network background: always alive ---------- */
const c = document.getElementById('net'), x = c.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
let W, H, N = [], m = { x: -9999, y: -9999 }, lastY = scrollY, vel = 0, pulses = [];
function size() {
  W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
  const n = Math.round(Math.min(120, innerWidth * innerHeight / 11000));
  N = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35, z: .4 + Math.random() * .8 }));
}
size(); addEventListener('resize', size);
addEventListener('pointermove', e => { m.x = e.clientX * dpr; m.y = e.clientY * dpr; });
addEventListener('pointerleave', () => { m.x = m.y = -9999; });
addEventListener('pointerdown', e => pulses.push({ x: e.clientX * dpr, y: e.clientY * dpr, r: 0 }));
function draw() {
  const y = window.lenisY != null ? window.lenisY : scrollY; vel = vel * .88 + (y - lastY) * .12; lastY = y;
  x.clearRect(0, 0, W, H); const d = 150 * dpr;
  for (const n of N) {
    if (!reduce) { n.x += n.vx; n.y += n.vy - vel * .25 * n.z * dpr; }
    if (n.x < 0) n.x += W; if (n.x > W) n.x -= W; if (n.y < 0) n.y += H; if (n.y > H) n.y -= H;
    const dm = Math.hypot(n.x - m.x, n.y - m.y); if (dm < d * 1.3 && dm > 0) { n.x += (n.x - m.x) / dm * .7; n.y += (n.y - m.y) / dm * .7; }
    for (const p of pulses) { const dp = Math.hypot(n.x - p.x, n.y - p.y); if (Math.abs(dp - p.r) < 30 * dpr && dp > 0) { n.x += (n.x - p.x) / dp * 2.2; n.y += (n.y - p.y) / dp * 2.2; } }
  }
  for (let i = 0; i < N.length; i++) for (let j = i + 1; j < N.length; j++) {
    const a = N[i], b = N[j], dd = Math.hypot(a.x - b.x, a.y - b.y);
    if (dd < d) {
      const near = Math.hypot((a.x + b.x) / 2 - m.x, (a.y + b.y) / 2 - m.y) < d * 1.5;
      x.strokeStyle = near ? `rgba(165,148,255,${(1 - dd / d) * .9})` : `rgba(91,227,215,${(1 - dd / d) * .22})`;
      x.lineWidth = near ? 1.4 : .8; x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.stroke();
    }
  }
  for (const n of N) { x.fillStyle = `rgba(91,227,215,${.45 + .4 * n.z})`; x.beginPath(); x.arc(n.x, n.y, 1.6 * dpr * n.z, 0, 7); x.fill(); }
  pulses = pulses.filter(p => (p.r += 9 * dpr) < 420 * dpr);
  for (const p of pulses) { x.strokeStyle = `rgba(91,227,215,${.35 * (1 - p.r / (420 * dpr))})`; x.lineWidth = 1.5; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.stroke(); }
  requestAnimationFrame(draw);
}
draw();

/* ---------- scroll story ---------- */
gsap.registerPlugin(ScrollTrigger);
let lenis = null;
if (!reduce && window.Lenis) {
  lenis = new Lenis(); lenis.on('scroll', e => { window.lenisY = e.scroll; ScrollTrigger.update(); });
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  gsap.from('.hero h1 .w span', { yPercent: 110, duration: 1.1, stagger: .07, ease: 'expo.out', delay: .2 });
  gsap.from('.hero p,.hero .cta', { opacity: 0, y: 20, duration: 1, delay: .9, stagger: .15 });
}
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = document.querySelector(a.getAttribute('href')); if (!t) return; e.preventDefault();
  lenis ? lenis.scrollTo(t) : t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}));
/* demos forward their wheel events so the page keeps scrolling over them */
addEventListener('message', e => { if (e.data && typeof e.data.demoWheel === 'number') { lenis ? lenis.scrollTo(lenis.targetScroll + e.data.demoWheel) : scrollBy(0, e.data.demoWheel); } });

const mm = gsap.matchMedia();
mm.add('(min-width:901px)', () => {
  const n = PROJECTS.length;
  const tw = gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none', scrollTrigger: {
    trigger: '.track-wrap', pin: true, scrub: 1, end: () => '+=' + (track.scrollWidth - innerWidth) * 1.15, invalidateOnRefresh: true,
    snap: { snapTo: 1 / (n - 1), duration: { min: .3, max: .7 }, delay: .15, ease: 'power2.inOut' },
    onToggle: s => gsap.to('#prog,#ctr', { opacity: s.isActive ? 1 : 0 }),
    onUpdate: s => { gsap.set('#prog i', { width: s.progress * 100 + '%' }); document.getElementById('ctr').textContent = (Math.round(s.progress * (n - 1)) + 1) + ' / ' + n; }
  } });
  /* load each panel's first demo just before it arrives */
  document.querySelectorAll('.panel').forEach(p => {
    ScrollTrigger.create({ trigger: p, containerAnimation: tw, start: 'left 160%', onEnter: () => { const f = p.querySelector('.dm-item.on iframe'); if (f && !f.src) f.src = f.dataset.src; } });
    if (reduce) return;
    gsap.fromTo(p.querySelector('.dm-stage'), { rotateY: -26, scale: .86, opacity: .35, transformPerspective: 1600 }, { rotateY: 0, scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left 95%', end: 'left 25%', scrub: true } });
    gsap.from(p.querySelector('.ptext'), { xPercent: 18, opacity: 0, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left 85%', end: 'left 35%', scrub: true } });
  });
});
if (!reduce) {
  gsap.from('.photo', { opacity: 0, scale: .92, rotate: -3, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.about', start: 'top 75%' } });
  gsap.from('.facts div', { opacity: 0, y: 24, stagger: .08, duration: .7, scrollTrigger: { trigger: '.facts', start: 'top 85%' } });
  gsap.from('.app', { opacity: 0, y: 30, stagger: .1, duration: .7, scrollTrigger: { trigger: '.diagram', start: 'top 80%' } });
  gsap.from('.supa', { opacity: 0, y: 30, duration: .8, scrollTrigger: { trigger: '.supa', start: 'top 85%' } });
}
})();
