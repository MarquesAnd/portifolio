(function () {
'use strict';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
const DEMOS = window.DEMOS || {};
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
let LANG = 'en';
try { LANG = localStorage.getItem('lang') || ((navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en'); } catch (e) {}

/* ================= content ================= */
const I = {
  code: '<path d="M8 6l-6 6 6 6M16 6l6 6-6 6M14 4l-4 16"/>',
  db: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  layout: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>'
};
const SKILLS = [
  { i: 'layout', en: ['Complete products', 'From the first conversation to a live app: requirements, data model, screens, deploy and support.'], pt: ['Produtos completos', 'Da primeira conversa ao app no ar: requisitos, modelo de dados, telas, publicação e suporte.'], t: ['Product design', 'Sprints', 'Docs'] },
  { i: 'db', en: ['Databases', 'Relational models in PostgreSQL, versioned SQL migrations, views, functions and triggers.'], pt: ['Banco de dados', 'Modelos relacionais em PostgreSQL, migrações SQL versionadas, views, funções e triggers.'], t: ['PostgreSQL', 'SQL', 'Supabase'] },
  { i: 'shield', en: ['Security & privacy', 'Row Level Security per role, auth with magic links, audit logs and LGPD-minded design.'], pt: ['Segurança e privacidade', 'Row Level Security por perfil, login com link mágico, auditoria e projeto pensado na LGPD.'], t: ['RLS', 'Auth', 'LGPD'] },
  { i: 'code', en: ['Front-end', 'Responsive interfaces in HTML, CSS and JavaScript, and React with TypeScript when the app needs it.'], pt: ['Front-end', 'Interfaces responsivas em HTML, CSS e JavaScript, e React com TypeScript quando o app pede.'], t: ['JavaScript', 'React', 'TypeScript', 'Tailwind'] },
  { i: 'phone', en: ['Installable apps', 'PWAs that install on the phone, work offline and feel native for daily use.'], pt: ['Apps instaláveis', 'PWAs que instalam no celular, funcionam offline e parecem nativos no uso diário.'], t: ['PWA', 'Service Worker', 'Vite'] },
  { i: 'spark', en: ['AI-assisted engineering', 'I write specs, direct coding agents, review every diff and automate with Edge Functions, Node and Python.'], pt: ['Engenharia com IA', 'Escrevo especificações, dirijo agentes de código, reviso cada mudança e automatizo com Edge Functions, Node e Python.'], t: ['Claude', 'Node.js', 'Python', 'Edge Functions'] }
];
const LEARN = [
  { en: ['Java', 'Object-oriented programming and back-end'], pt: ['Java', 'Orientação a objetos e back-end'] },
  { en: ['Full-stack development', 'Front-end, APIs and deployment end to end'], pt: ['Desenvolvimento full stack', 'Front-end, APIs e publicação de ponta a ponta'] },
  { en: ['Sankhya', 'ERP development and customization'], pt: ['Sankhya', 'Desenvolvimento e customização de ERP'] },
  { en: ['Information Systems', "Bachelor's degree, in progress"], pt: ['Sistemas de Informação', 'Graduação em andamento'] }
];
const ROT = { en: ['web apps.', 'databases.', 'dashboards.', 'mobile PWAs.', 'secure APIs.', 'with AI.'], pt: ['apps web.', 'bancos de dados.', 'dashboards.', 'apps para celular.', 'APIs seguras.', 'com IA.'] };
const MQ = ['Supabase', 'PostgreSQL', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'PWA', 'Tailwind', 'Vite', 'Git', 'AI agents'];

/* ================= build DOM ================= */
$('#mq').innerHTML = [...MQ, ...MQ, ...MQ].map(s => `<span>${s}</span><span>✦</span>`).join('');
const track = $('#track');
track.innerHTML = PROJECTS.map(p => `<article class="panel" id="p-${p.id}"><span class="ghost" aria-hidden="true">${p.name}</span><div class="ptext"></div>
 <div class="demo"><div class="dm-tabs" role="tablist"></div><div class="stage" tabindex="0" role="button"><div class="stage-in"><span class="shine"></span></div><span class="hint"></span></div><div class="dm-note"><i></i><span></span></div></div></article>`).join('');
$('#apps').innerHTML = PROJECTS.map(p => `<div class="app">${p.name}<small data-k="${p.id}"></small></div>`).join('');
// wires with travelling data pulses
(function () {
  const xs = [100, 300, 500, 700, 900];
  $('#wires').innerHTML = xs.map((x, i) => { const d = x === 500 ? 'M500 0 L500 80' : `M${x} 0 C${x} 45 500 35 500 80`; return `<path d="${d}"/><circle r="3"><animateMotion dur="${1.6 + i * .25}s" begin="${i * .3}s" repeatCount="indefinite" path="${d}"/></circle><circle r="2.5" style="fill:#A594FF"><animateMotion dur="${2.2 + i * .2}s" begin="${.8 + i * .2}s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear" path="${d}"/></circle>`; }).join('');
})();

const poster = (id, s, l) => `demos/posters/${id}-${s.file.replace('.html', '')}-${l}.webp`;
function buildDemo(p) {
  const panel = $('#p-' + p.id), screens = DEMOS[p.id] || [];
  const tabs = $('.dm-tabs', panel), inner = $('.stage-in', panel), stage = $('.stage', panel);
  tabs.innerHTML = screens.map((s, i) => `<button role="tab" aria-selected="${i === 0}" data-i="${i}"></button>`).join('');
  screens.forEach((s, i) => {
    const d = document.createElement('div'); d.className = 'shot' + (i === 0 ? ' on' : '');
    d.innerHTML = `<div class="frame${s.w < 600 ? ' phone' : ''}"><div class="bar"><i></i><i></i><i></i></div><img alt="" loading="lazy" decoding="async"></div>`;
    d._s = s; inner.appendChild(d);
  });
  panel._cur = 0;
  const fit = () => $$('.shot', inner).forEach(sh => {
    const s = sh._s, f = sh.firstChild, W = inner.clientWidth, H = inner.clientHeight, bar = s.w < 600 ? 0 : 26;
    const k = Math.min(W / s.w, (H - bar) / s.h) * (s.w < 600 ? .96 : 1);
    f.style.width = s.w * k + 'px'; f.style.height = s.h * k + bar + 'px';
  });
  new ResizeObserver(fit).observe(inner);
  $$('button', tabs).forEach(b => b.addEventListener('click', () => {
    panel._cur = +b.dataset.i;
    $$('button', tabs).forEach(x => x.setAttribute('aria-selected', x === b));
    $$('.shot', inner).forEach((sh, i) => sh.classList.toggle('on', i === panel._cur));
  }));
  const open = () => openViewer(p, panel._cur);
  stage.addEventListener('click', open);
  stage.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
}
PROJECTS.forEach(buildDemo);

/* ================= language ================= */
function panelText(p) {
  const L = LANG;
  return `<span class="k">${p.kind[L]}</span><h3>${p.name}</h3><p>${p.desc[L]}</p><ul>${p.facts[L].map(f => `<li>${f}</li>`).join('')}</ul>
  <div class="chips">${p.stack.map(s => `<span class="${/Supabase|RLS|Edge|Storage/.test(s) ? 's' : ''}">${s}</span>`).join('')}</div>
  <div class="links2"><button class="open" data-open="${p.id}">${L === 'pt' ? 'Explorar a demonstração' : 'Explore the demo'}</button><a class="code" href="https://github.com/${p.repo}">${L === 'pt' ? 'Ver o código' : 'View code'}</a></div>`;
}
function splitWords(el) { el.innerHTML = el.textContent.split(' ').map(w => `<span class="w"><span>${w}</span></span>`).join(' '); }
function splitChars(el) { el.innerHTML = el.textContent.split(' ').map(w => `<span style="display:inline-block;white-space:nowrap">${[...w].map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' '); }
function applyLang(l) {
  LANG = l; try { localStorage.setItem('lang', l); } catch (e) {}
  document.documentElement.lang = l === 'pt' ? 'pt-BR' : 'en';
  $$('[data-en]').forEach(el => el.textContent = el.dataset[l]);
  splitWords($('#h1')); splitChars($('#bye'));
  $('#cards').innerHTML = SKILLS.map(s => `<div class="card tilt"><div class="ic"><svg viewBox="0 0 24 24">${I[s.i]}</svg></div><h4>${s[l][0]}</h4><p>${s[l][1]}</p><div class="tech">${s.t.map(t => `<span>${t}</span>`).join('')}</div></div>`).join('');
  $('#learn').innerHTML = LEARN.map(s => `<div class="learn"><b>${s[l][0]}</b><small>${s[l][1]}</small><div class="bar"><i></i></div></div>`).join('');
  PROJECTS.forEach(p => {
    const panel = $('#p-' + p.id), screens = DEMOS[p.id] || [];
    $('.ptext', panel).innerHTML = panelText(p);
    $('.dm-note span', panel).textContent = l === 'pt'
      ? `Telas de demonstração com dados fictícios. O sistema real roda no Supabase e o acesso é restrito ${p.access.pt}.`
      : `Demo screens with fictional data. The production app runs on Supabase and access is restricted to ${p.access.en}.`;
    $('.hint', panel).textContent = l === 'pt' ? 'Clique para interagir' : 'Click to interact';
    $$('.dm-tabs button', panel).forEach((b, i) => b.textContent = screens[i][l]);
    $$('.shot', panel).forEach(sh => { const img = $('img', sh); img.src = poster(p.id, sh._s, l); img.alt = `${p.name} · ${sh._s[l]}`; });
  });
  $$('.app small').forEach(s => s.textContent = PROJECTS.find(p => p.id === s.dataset.k).kind[l]);
  $('#lang').dataset.lang = l; $$('#lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.set === l));
  if (viewer.p) { buildViewerTabs(); const f = $('iframe', vStage); if (f && f.contentWindow) f.contentWindow.postMessage({ lang: l }, '*'); }
  $('#cursor').dataset.label = l === 'pt' ? 'Abrir' : 'Open';
  bindTilt(); rotReset();
}
$$('#lang button').forEach(b => b.addEventListener('click', () => {
  if (b.dataset.set === LANG) return;
  document.body.classList.add('swap','switching');setTimeout(()=>document.body.classList.remove('swap'),700);
  setTimeout(() => { applyLang(b.dataset.set); requestAnimationFrame(() => document.body.classList.remove('switching')); window.ScrollTrigger && ScrollTrigger.refresh(); }, 230);
}));
document.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openViewer(PROJECTS.find(p => p.id === b.dataset.open), $('#p-' + b.dataset.open)._cur); });

/* ================= viewer (live interactive iframe) ================= */
const viewer = { p: null, i: 0 }, vEl = $('#viewer'), vStage = $('#vStage'), vTabs = $('#vTabs');
function buildViewerTabs() {
  const sc = DEMOS[viewer.p.id];
  $('#vTitle').textContent = viewer.p.name;
  vTabs.innerHTML = sc.map((s, i) => `<button role="tab" aria-selected="${i === viewer.i}" data-i="${i}">${s[LANG]}</button>`).join('');
  $$('button', vTabs).forEach(b => b.onclick = () => { viewer.i = +b.dataset.i; buildViewerTabs(); loadViewer(); });
}
function fitViewer() {
  const box = $('.vbox', vStage); if (!box) return; const s = box._s;
  const k = Math.min(vStage.clientWidth / s.w, vStage.clientHeight / s.h, s.w < 600 ? 1.1 : 1.25);
  box.style.width = s.w * k + 'px'; box.style.height = s.h * k + 'px'; $('iframe', box).style.transform = `scale(${k})`;
}
function loadViewer() {
  const s = DEMOS[viewer.p.id][viewer.i];
  vStage.innerHTML = `<div class="vbox${s.w < 600 ? ' phone' : ''}"><iframe width="${s.w}" height="${s.h}" title="${viewer.p.name} · ${s.en}" src="demos/${viewer.p.id}/${s.file}#${LANG}"></iframe></div>`;
  $('.vbox', vStage)._s = s; fitViewer();
  if (!reduce) gsap.fromTo('.vbox', { opacity: 0, scale: .92, rotateX: 8, transformPerspective: 1200 }, { opacity: 1, scale: 1, rotateX: 0, duration: .6, ease: 'expo.out' });
}
function openViewer(p, i) {
  viewer.p = p; viewer.i = i || 0; vEl.hidden = false; lenis && lenis.stop(); document.body.style.overflow = 'hidden';
  buildViewerTabs(); loadViewer(); $('#vClose').focus();
  if (!reduce) gsap.fromTo(vEl, { opacity: 0 }, { opacity: 1, duration: .3 });
}
function closeViewer() { vEl.hidden = true; vStage.innerHTML = ''; viewer.p = null; lenis && lenis.start(); document.body.style.overflow = ''; }
$('#vClose').onclick = closeViewer;
addEventListener('keydown', e => { if (e.key === 'Escape' && viewer.p) closeViewer(); });
vEl.addEventListener('click', e => { if (e.target === vEl || e.target === vStage) closeViewer(); });
addEventListener('resize', fitViewer);

/* ================= neural network background (always on, optimized) ================= */
const cv = $('#net'), ctx = cv.getContext('2d');
let W = 0, H = 0, nodes = [], mx = -1e4, my = -1e4, vel = 0, lastY = 0, pulses = [], running = true;
const LINK = 130;
function size() {
  W = cv.width = innerWidth; H = cv.height = innerHeight;
  const n = Math.round(Math.min(95, Math.max(40, W * H / 15000)));
  nodes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, z: .5 + Math.random() * .8 }));
}
size(); addEventListener('resize', size);
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
document.addEventListener('pointerleave', () => { mx = my = -1e4; });
addEventListener('pointerdown', e => { if (!e.target.closest('.viewer')) pulses.push({ x: e.clientX, y: e.clientY, r: 0 }); });
document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) requestAnimationFrame(draw); });
function draw() {
  if (!running) return;
  const y = lenis ? lenis.scroll : scrollY; vel += ((y - lastY) - vel) * .15; lastY = y;
  ctx.clearRect(0, 0, W, H);
  const grid = new Map(), cs = LINK;
  for (const n of nodes) {
    if (!reduce) { n.x += n.vx; n.y += n.vy - vel * .22 * n.z; }
    if (n.x < -10) n.x = W + 10; else if (n.x > W + 10) n.x = -10;
    if (n.y < -10) n.y = H + 10; else if (n.y > H + 10) n.y = -10;
    const dx = n.x - mx, dy = n.y - my, dm = dx * dx + dy * dy;
    if (dm < 32000 && dm > 1) { const d = Math.sqrt(dm); n.x += dx / d * 1.1; n.y += dy / d * 1.1; }
    for (const p of pulses) { const px = n.x - p.x, py = n.y - p.y, dp = Math.sqrt(px * px + py * py); if (Math.abs(dp - p.r) < 28 && dp > 0) { n.x += px / dp * 2.4; n.y += py / dp * 2.4; } }
    const k = ((n.x / cs) | 0) + ',' + ((n.y / cs) | 0); (grid.get(k) || grid.set(k, []).get(k)).push(n);
  }
  ctx.lineWidth = 1;
  for (const n of nodes) {
    const gx = (n.x / cs) | 0, gy = (n.y / cs) | 0;
    for (let ox = 0; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
      if (ox === 0 && oy < 0) continue;
      const cell = grid.get((gx + ox) + ',' + (gy + oy)); if (!cell) continue;
      for (const m of cell) {
        if (m === n || (ox === 0 && oy === 0 && m.x < n.x)) continue;
        const dx = n.x - m.x, dy = n.y - m.y, d2 = dx * dx + dy * dy; if (d2 > LINK * LINK) continue;
        const a = 1 - Math.sqrt(d2) / LINK, cx = (n.x + m.x) / 2 - mx, cy = (n.y + m.y) / 2 - my, near = cx * cx + cy * cy < 52000;
        ctx.strokeStyle = near ? `rgba(165,148,255,${a * .95})` : `rgba(91,227,215,${a * .24})`;
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
      }
    }
  }
  for (const n of nodes) { ctx.fillStyle = `rgba(91,227,215,${.4 + .45 * n.z})`; ctx.fillRect(n.x - n.z, n.y - n.z, n.z * 2.2, n.z * 2.2); }
  pulses = pulses.filter(p => (p.r += 10) < 460);
  for (const p of pulses) { ctx.strokeStyle = `rgba(91,227,215,${.4 * (1 - p.r / 460)})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.stroke(); ctx.lineWidth = 1; }
  requestAnimationFrame(draw);
}

/* ================= interactions ================= */
// custom cursor
const cur = $('#cursor');
if (fine && !reduce) {
  const qx = gsap.quickTo(cur, 'x', { duration: .35, ease: 'power3' }), qy = gsap.quickTo(cur, 'y', { duration: .35, ease: 'power3' });
  addEventListener('pointermove', e => { qx(e.clientX); qy(e.clientY); }, { passive: true });
  document.addEventListener('pointerover', e => {
    const st = e.target.closest('.stage'), a = e.target.closest('a,button,.card,.photo');
    cur.classList.toggle('big', !!(st || a)); cur.classList.toggle('view', !!st);
  });
}
// magnetic buttons
if (fine && !reduce) document.addEventListener('pointermove', e => {
  $$('.mag').forEach(b => {
    const r = b.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, dx = e.clientX - cx, dy = e.clientY - cy;
    const inR = Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 30;
    gsap.to(b, { x: inR ? dx * .28 : 0, y: inR ? dy * .35 : 0, duration: .5, ease: 'power3' });
  });
}, { passive: true });
// 3D tilt + glare
function tiltEl(el, max, target) {
  if (el._t) return; el._t = 1; const t = target || el;
  const rx = gsap.quickTo(t, 'rotationX', { duration: .6, ease: 'power3' }), ry = gsap.quickTo(t, 'rotationY', { duration: .6, ease: 'power3' });
  gsap.set(t, { transformPerspective: 1100 });
  el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; ry((px - .5) * max * 2); rx(-(py - .5) * max * 2); t.style.setProperty('--gx', px * 100 + '%'); t.style.setProperty('--gy', py * 100 + '%'); el.style.setProperty('--gx', px * 100 + '%'); el.style.setProperty('--gy', py * 100 + '%'); });
  el.addEventListener('pointerleave', () => { rx(0); ry(0); });
}
function bindTilt() { if (!fine || reduce) return; $$('.card').forEach(c => tiltEl(c, 9)); tiltEl($('#photo'), 10); $$('.stage').forEach(s => tiltEl(s, 7, $('.stage-in', s))); }
// hero 3D parallax
if (fine && !reduce) {
  const hx = gsap.quickTo('#heroIn', 'rotationY', { duration: 1, ease: 'power3' }), hy = gsap.quickTo('#heroIn', 'rotationX', { duration: 1, ease: 'power3' });
  $('.hero').addEventListener('pointermove', e => { hx((e.clientX / innerWidth - .5) * 8); hy(-(e.clientY / innerHeight - .5) * 6); });
  $('.hero').addEventListener('pointerleave', () => { hx(0); hy(0); });
}
// rotating word (typewriter)
let rotT, rotI = 0;
function rotReset() {
  clearTimeout(rotT); const el = $('#rotw'), words = ROT[LANG]; rotI = 0;
  if (reduce) { el.textContent = words.join(' · '); return; }
  const type = (w, n) => { el.textContent = w.slice(0, n); if (n < w.length) rotT = setTimeout(() => type(w, n + 1), 55); else rotT = setTimeout(() => erase(w, w.length), 1600); };
  const erase = (w, n) => { el.textContent = w.slice(0, n); if (n > 0) rotT = setTimeout(() => erase(w, n - 1), 28); else { rotI = (rotI + 1) % words.length; rotT = setTimeout(() => type(words[rotI], 0), 200); } };
  type(words[0], 0);
}

/* ================= scroll ================= */
gsap.registerPlugin(ScrollTrigger);
let lenis = null;
if (!reduce && window.Lenis) {
  lenis = new Lenis({ lerp: .09, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
}
applyLang(LANG);
draw();
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = document.querySelector(a.getAttribute('href')); if (!t) return; e.preventDefault();
  lenis ? lenis.scrollTo(t, { duration: 1.4 }) : t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
}));
// nav: solid + hide on scroll down
let lastNav = 0;
ScrollTrigger.create({ start: 0, end: 'max', onUpdate: s => {
  const y = s.scroll(); $('#nav').classList.toggle('solid', y > 40);
  if (!viewer.p) $('#nav').classList.toggle('hide', y > 300 && y > lastNav + 2); if (y < lastNav - 2) $('#nav').classList.remove('hide'); lastNav = y;
  gsap.set('#sbar', { scaleX: s.progress });
} });

// marquee driven by time + scroll velocity
if (!reduce) {
  const mqEl = $('#mq'); let mqX = 0;
  gsap.ticker.add(() => {
    const v = lenis ? lenis.velocity : 0; mqX -= .6 + Math.abs(v) * .35;
    const w = mqEl.scrollWidth / 3; if (-mqX > w) mqX += w;
    mqEl.style.transform = `translate3d(${mqX}px,0,0) skewX(${gsap.utils.clamp(-12, 12, -v * .6)}deg)`;
  });
}

if (!reduce) {
  // intro
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.tag', { y: 20, opacity: 0, duration: .8 }, .1)
    .from('#h1 .w>span', { yPercent: 115, rotate: 4, duration: 1.2, stagger: .06 }, .2)
    .from('.rot', { opacity: 0, y: 20, duration: .8 }, .7)
    .from('.hero p', { opacity: 0, y: 24, duration: .9 }, .8)
    .from('.hero .btn', { opacity: 0, y: 20, stagger: .08, duration: .8 }, .95);
  gsap.fromTo('.nav .logo,.nav .links,.nav .lang', { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'expo.out', delay: .2, clearProps: 'transform' });
  // hero leaves with depth
  gsap.to('#heroIn', { yPercent: -18, opacity: .15, scale: .94, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  // generic reveals
  ScrollTrigger.batch('.reveal', { start: 'top 88%', once: true, onEnter: b => gsap.fromTo(b, { y: 50, opacity: 0, rotateX: -18, transformPerspective: 900 }, { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: .1, ease: 'expo.out', overwrite: true }) });
  gsap.from('.photo', { opacity: 0, scale: .85, rotateY: -25, rotateX: 10, transformPerspective: 1100, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.about', start: 'top 75%' } });
  gsap.from('.facts div', { opacity: 0, y: 30, stagger: .08, duration: .8, ease: 'expo.out', scrollTrigger: { trigger: '.facts', start: 'top 90%' } });
  ScrollTrigger.create({ trigger: '#cards', start: 'top 85%', once: true, onEnter: () => gsap.from('.card', { opacity: 0, y: 70, rotateX: -25, transformPerspective: 1000, stagger: { each: .08, grid: 'auto', from: 'start' }, duration: 1.1, ease: 'expo.out' }) });
  ScrollTrigger.create({ trigger: '#learn', start: 'top 90%', once: true, onEnter: () => gsap.from('.learn', { opacity: 0, x: -40, stagger: .1, duration: .9, ease: 'expo.out' }) });
  gsap.from('.app', { opacity: 0, y: 40, scale: .9, stagger: .08, duration: .9, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.diagram', start: 'top 85%' } });
  gsap.from('.supa', { opacity: 0, y: 40, duration: .9, ease: 'expo.out', scrollTrigger: { trigger: '.supa', start: 'top 92%' } });
  // contact title: characters rise as it comes in
  ScrollTrigger.create({ trigger: '.contact', start: 'top 75%', once: true, onEnter: () => gsap.from('#bye .ch', { yPercent: 120, opacity: 0, rotate: 12, stagger: .02, duration: 1, ease: 'expo.out' }) });
}

// horizontal projects with 3D depth
const mm = gsap.matchMedia();
mm.add('(min-width:901px)', () => {
  const n = PROJECTS.length, dist = () => track.scrollWidth - innerWidth;
  const tw = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
    trigger: '#trackWrap', pin: true, scrub: .7, end: () => '+=' + dist(), invalidateOnRefresh: true, anticipatePin: 1,
    onToggle: s => gsap.to('#hud', { opacity: s.isActive ? 1 : 0, duration: .3 }),
    onUpdate: s => { gsap.set('#prog', { scaleX: s.progress }); $('#ctr').textContent = String(Math.round(s.progress * (n - 1)) + 1).padStart(2, '0') + ' / ' + String(n).padStart(2, '0'); }
  } });
  if (reduce) return;
  $$('.panel').forEach(p => {
    const st = $('.stage', p), txt = $('.ptext', p), ghost = $('.ghost', p);
    gsap.fromTo(st, { rotationY: 38, z: -260, scale: .82, opacity: .25 }, { rotationY: 0, z: 0, scale: 1, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left 100%', end: 'left 15%', scrub: true } });
    gsap.fromTo(st, { rotationY: 0, z: 0, opacity: 1 }, { rotationY: -30, z: -220, opacity: .2, ease: 'power2.in', immediateRender: false, scrollTrigger: { trigger: p, containerAnimation: tw, start: 'right 70%', end: 'right 0%', scrub: true } });
    gsap.fromTo(txt, { x: 140, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left 90%', end: 'left 30%', scrub: true } });
    gsap.fromTo(ghost, { x: 300 }, { x: -300, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: tw, start: 'left right', end: 'right left', scrub: true } });
  });
  gsap.set('.stage', { transformPerspective: 1600 });
});
mm.add('(max-width:900px)', () => {
  if (reduce) return;
  $$('.panel').forEach(p => gsap.from($('.stage', p), { opacity: 0, y: 60, rotateX: 18, transformPerspective: 900, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 70%' } }));
});
addEventListener('load', () => ScrollTrigger.refresh());
})();
