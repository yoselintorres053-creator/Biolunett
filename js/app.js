// ===== Biolunet — Lógica de la aplicación =====
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const esc = (s) => String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

// ---- Estado persistente ----
const KEY = 'biolunet_state_v1';
const state = loadState();
function loadState(){
  try { return JSON.parse(localStorage.getItem(KEY)) || def(); } catch(e){ return def(); }
}
function def(){ return { quizzes:{}, temas:{}, minutos:0, biblioteca:[], ultimaVisita:null }; }
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }

// Contador de minutos de estudio
let _start = Date.now();
setInterval(() => {
  const mins = Math.floor((Date.now() - _start) / 60000);
  if (mins >= 1){ state.minutos += mins; _start = Date.now(); save(); }
}, 60000);

function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(() => { t.hidden = true; }, 2200);
}

// ---- Fondo de estrellas ----
(function stars(){
  const c = $('#stars'), x = c.getContext('2d'); let w, h, pts = [];
  function rz(){ w = c.width = innerWidth; h = c.height = innerHeight;
    pts = Array.from({length: Math.round(w*h/9000)}, () => ({
      x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.4+0.3,
      a: Math.random(), s: Math.random()*0.02+0.004 })); }
  function loop(){ x.clearRect(0,0,w,h);
    for(const p of pts){ p.a += p.s; const o = 0.35 + Math.abs(Math.sin(p.a))*0.65;
      x.beginPath(); x.arc(p.x,p.y,p.r,0,7); x.fillStyle = 'rgba(255,255,255,'+o+')'; x.fill(); }
    requestAnimationFrame(loop); }
  addEventListener('resize', rz); rz(); loop();
})();

// ---- PWA ----
if ('serviceWorker' in navigator){
  addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(()=>{}));
}
let _deferred = null;
addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); _deferred = e; $('#installBtn').hidden = false; });
$('#installBtn').addEventListener('click', async () => {
  if(!_deferred) return; _deferred.prompt(); await _deferred.userChoice; _deferred = null; $('#installBtn').hidden = true;
});

// ---- Router ----
const app = $('#app');
const routes = {};
function go(name){
  location.hash = name;
}
function render(){
  const name = (location.hash.replace('#','') || 'home');
  const fn = routes[name] || routes.home;
  app.innerHTML = '';
  const view = el('<section class="view"></section>');
  fn(view);
  app.appendChild(view);
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.nav === name));
  scrollTo({ top: 0, behavior: 'smooth' });
}
addEventListener('hashchange', render);
document.querySelectorAll('[data-nav]').forEach(b => b.addEventListener('click', () => go(b.dataset.nav)));

// ---- Componentes reutilizables ----
function backBtn(){ const b = el('<button class="back">← Volver al inicio</button>'); b.onclick = () => go('home'); return b; }

function accordion(items){
  const wrap = el('<div></div>');
  items.forEach(([t, body]) => {
    const a = el('<div class="acc"><button>'+esc(t)+'<span>+</span></button><div class="body"><div>'+esc(body)+'</div></div></div>');
    a.querySelector('button').onclick = () => { a.classList.toggle('open'); a.querySelector('span').textContent = a.classList.contains('open') ? '−' : '+'; };
    wrap.appendChild(a);
  });
  return wrap;
}

function flashcards(cards){
  const wrap = el('<div class="grid"></div>');
  cards.forEach(([q, r]) => {
    const f = el('<div class="flash"><div class="flash-inner"><div class="flash-face flash-front">'+esc(q)+'</div><div class="flash-face flash-back">'+esc(r)+'</div></div></div>');
    f.onclick = () => f.classList.toggle('flip');
    wrap.appendChild(f);
  });
  return wrap;
}

// Quiz interactivo con retroalimentación y guardado de progreso
function quiz(materia, preguntas){
  const wrap = el('<div></div>');
  let idx = 0, aciertos = 0;
  const bar = el('<div class="progress-line"><i></i></div>');
  const box = el('<div></div>');
  wrap.append(bar, box);
  function pinta(){
    bar.querySelector('i').style.width = (idx/preguntas.length*100)+'%';
    if(idx >= preguntas.length){
      const pct = Math.round(aciertos/preguntas.length*100);
      state.quizzes[materia] = Math.max(state.quizzes[materia]||0, pct); save();
      box.innerHTML = '<div class="card" style="text-align:center"><h3>🎉 Resultado</h3><p class="big" style="font-size:2rem;font-weight:800">'+aciertos+' / '+preguntas.length+'</p><p class="muted">Aciertos: '+pct+'%</p></div>';
      const rep = el('<button class="btn sec">Repetir cuestionario</button>');
      rep.onclick = () => { idx=0; aciertos=0; pinta(); }; box.appendChild(rep);
      refreshAchievements();
      return;
    }
    const [q, ops, ok, fb] = preguntas[idx];
    box.innerHTML = '<div class="card"><p class="muted">Pregunta '+(idx+1)+' de '+preguntas.length+'</p><h3>'+esc(q)+'</h3></div>';
    const cont = box.querySelector('.card');
    let contestada = false;
    ops.forEach((op, i) => {
      const b = el('<button class="quiz-opt">'+esc(op)+'</button>');
      b.onclick = () => {
        if(contestada) return; contestada = true;
        const btns = cont.querySelectorAll('.quiz-opt');
        btns[ok].classList.add('correct');
        if(i === ok){ aciertos++; } else { b.classList.add('wrong'); }
        cont.appendChild(el('<div class="quiz-feedback">'+(i===ok?'✅ ¡Correcto! ':'❌ ')+esc(fb)+'</div>'));
        const next = el('<button class="btn" style="margin-top:12px">'+(idx+1<preguntas.length?'Siguiente →':'Ver resultado')+'</button>');
        next.onclick = () => { idx++; pinta(); }; cont.appendChild(next);
      };
      cont.appendChild(b);
    });
  }
  pinta();
  return wrap;
}

// Marca un tema como explorado (para estadísticas)
function marcarTema(materia, tema){
  state.temas[materia] = state.temas[materia] || {};
  if(!state.temas[materia][tema]){ state.temas[materia][tema] = true; save(); refreshAchievements(); }
}

// Sistema de pestañas
function tabbed(defs){
  const wrap = el('<div></div>');
  const nav = el('<div class="tabs"></div>');
  const body = el('<div></div>');
  wrap.append(nav, body);
  defs.forEach(([label, builder], i) => {
    const b = el('<button>'+esc(label)+'</button>');
    b.onclick = () => {
      nav.querySelectorAll('button').forEach(x => x.classList.remove('active'));
      b.classList.add('active'); body.innerHTML = ''; body.appendChild(builder());
    };
    nav.appendChild(b);
    if(i === 0) setTimeout(() => b.click());
  });
  return wrap;
}

// Encabezado de sección con intro inspiradora
function sectionHead(view, ico, titulo, intro){
  view.appendChild(backBtn());
  view.appendChild(el('<h1 class="section-title">'+ico+' '+esc(titulo)+'</h1>'));
  view.appendChild(el('<p class="intro">'+esc(intro)+'</p>'));
}

// ================= HOME =================
routes.home = (view) => {
  const hero = el('<div class="hero"></div>');
  hero.appendChild(el('<div class="logo">🌙</div>'));
  hero.appendChild(el('<h1>Biolunet</h1>'));
  hero.appendChild(el('<canvas class="dna-wrap" id="dnaCanvas"></canvas>'));
  hero.appendChild(el('<p class="lead">Hay millones de especies, millones de ecosistemas y miles de millones de organismos vivos. Sin embargo, entre todo lo que existe, encontré a una persona capaz de dedicar horas a comprender cómo funciona la vida. Por eso nació Biolunet.</p>'));
  const cta = el('<button class="cta">Entrar al laboratorio 🧪</button>');
  cta.onclick = () => go('genetica');
  hero.appendChild(cta);
  view.appendChild(hero);

  view.appendChild(el('<h2 class="section-title" style="margin-top:24px">📚 Materias · 3.° semestre</h2>'));
  const grid = el('<div class="grid"></div>');
  DATA.subjects.forEach(([id, ico, nom, desc]) => {
    const pct = progresoMateria(id);
    const c = el('<div class="card subject-card"><div class="ico">'+ico+'</div><h3>'+esc(nom)+'</h3><p>'+esc(desc)+'</p><div class="bar"><i></i></div><small class="muted">'+pct+'% explorado</small></div>');
    c.querySelector('.bar>i').style.width = pct+'%';
    c.onclick = () => go(id); grid.appendChild(c);
  });
  view.appendChild(grid);

  // Biblioteca + progreso rápido
  const quick = el('<div class="grid" style="margin-top:16px"></div>');
  const b1 = el('<div class="card subject-card"><div class="ico">🏅</div><h3>Mi progreso</h3><p>Estadísticas y logros</p></div>');
  b1.onclick = () => go('progreso');
  const b2 = el('<div class="card subject-card"><div class="ico">📖</div><h3>Biblioteca</h3><p>Apuntes, PDFs y enlaces</p></div>');
  b2.onclick = () => go('biblioteca');
  quick.append(b1, b2); view.appendChild(quick);

  view.appendChild(el('<p class="footer-note">Desarrollado especialmente para una futura bióloga extraordinaria 🌱</p>'));
  setTimeout(drawDNA, 30);
};

// Hélice de ADN animada en la portada
function drawDNA(){
  const c = $('#dnaCanvas'); if(!c) return; const x = c.getContext('2d');
  const W = c.width = c.offsetWidth, H = c.height = 70; let t = 0;
  (function loop(){
    if(!document.body.contains(c)) return;
    x.clearRect(0,0,W,H); t += 0.04;
    for(let i=0;i<=W;i+=6){
      const ph = i*0.05 + t;
      const y1 = H/2 + Math.sin(ph)*24, y2 = H/2 + Math.sin(ph+Math.PI)*24;
      if(i%18===0){ x.strokeStyle='rgba(120,255,120,.35)'; x.beginPath(); x.moveTo(i,y1); x.lineTo(i,y2); x.stroke(); }
      x.fillStyle = '#66BB6A'; x.beginPath(); x.arc(i,y1,2.2,0,7); x.fill();
      x.fillStyle = '#42a5f5'; x.beginPath(); x.arc(i,y2,2.2,0,7); x.fill();
    }
    requestAnimationFrame(loop);
  })();
}

// ================= GENÉTICA =================
routes.genetica = (view) => {
  const d = DATA.genetica;
  sectionHead(view, '🧬', 'Bases Genéticas de la Vida', d.intro);
  marcarTema('genetica', 'intro');
  view.appendChild(tabbed([
    ['📘 Resúmenes', () => { marcarTema('genetica','resumenes'); const c=el('<div class="card"></div>'); c.appendChild(accordion(d.resumenes)); return c; }],
    ['🃏 Flashcards', () => { marcarTema('genetica','flashcards'); return flashcards(d.flashcards); }],
    ['📖 Glosario', () => { marcarTema('genetica','glosario'); const c=el('<div class="card"></div>'); c.appendChild(accordion(d.glosario)); return c; }],
    ['🧮 Punnett', () => { marcarTema('genetica','punnett'); return punnett(); }],
    ['❓ Quiz', () => quiz('genetica', d.quiz)]
  ]));
};

// Calculadora de cuadros de Punnett
function punnett(){
  const wrap = el('<div class="card"></div>');
  wrap.appendChild(el('<h3>Calculadora de cuadros de Punnett</h3><p class="muted">Selecciona el genotipo de cada progenitor.</p>'));
  const row = el('<div class="row"></div>');
  const mk = (id, lab) => '<div><label>'+lab+'</label><select id="'+id+'"><option>AA</option><option>Aa</option><option>aa</option></select></div>';
  row.innerHTML = mk('p1','Progenitor 1') + mk('p2','Progenitor 2');
  const btn = el('<div><label>&nbsp;</label><button class="btn">Calcular</button></div>');
  row.appendChild(btn); wrap.appendChild(row);
  const out = el('<div></div>'); wrap.appendChild(out);
  btn.querySelector('button').onclick = () => {
    const g1 = $('#p1').value, g2 = $('#p2').value;
    const a1 = g1.split(''), a2 = g2.split('');
    const grid = el('<div class="punnett"></div>');
    grid.appendChild(el('<div class="cell corner"></div>'));
    a2.forEach(a => grid.appendChild(el('<div class="cell head">'+a+'</div>')));
    const conteo = {};
    a1.forEach(x => {
      grid.appendChild(el('<div class="cell head">'+x+'</div>'));
      a2.forEach(y => {
        const geno = [x,y].sort((p,q)=> (p===q?0:(p==='A'?-1:1))).join('');
        conteo[geno] = (conteo[geno]||0)+1;
        grid.appendChild(el('<div class="cell">'+geno+'</div>'));
      });
    });
    out.innerHTML = '';
    out.appendChild(grid);
    // Genotipos
    const chipsG = el('<div class="result-chips"></div>');
    Object.entries(conteo).forEach(([g,n]) => chipsG.appendChild(el('<span class="pill">'+g+': '+(n/4*100)+'%</span>')));
    out.appendChild(el('<h4>Genotipos</h4>')); out.appendChild(chipsG);
    // Fenotipos (A dominante)
    const dom = (conteo.AA||0)+(conteo.Aa||0), rec = conteo.aa||0;
    const chipsF = el('<div class="result-chips"></div>');
    chipsF.appendChild(el('<span class="pill">Dominante (A_): '+(dom/4*100)+'%</span>'));
    chipsF.appendChild(el('<span class="pill">Recesivo (aa): '+(rec/4*100)+'%</span>'));
    out.appendChild(el('<h4>Fenotipos</h4>')); out.appendChild(chipsF);
    toast('Cuadro calculado ✓');
  };
  return wrap;
}

// ================= DINÁMICA TERRESTRE =================
routes.tierra = (view) => {
  const d = DATA.tierra;
  sectionHead(view, '🌎', 'Dinámica Terrestre y Organismos Afines', d.intro);
  marcarTema('tierra','intro');
  view.appendChild(tabbed([
    ['⏳ Línea del tiempo', () => {
      marcarTema('tierra','timeline');
      const c = el('<div class="card"><p class="muted">Toca cada era para ver detalles y organismos representativos.</p></div>');
      const tl = el('<div class="timeline"></div>');
      d.eras.forEach(([nom, rango, desc, org]) => {
        const e = el('<div class="era"><div class="era-head">'+esc(nom)+' <span class="muted" style="font-weight:400">· '+esc(rango)+'</span></div><div class="era-body"><p>'+esc(desc)+'</p><p><strong>Organismos:</strong> '+esc(org)+'</p></div></div>');
        e.querySelector('.era-head').onclick = () => e.classList.toggle('open');
        tl.appendChild(e);
      });
      c.appendChild(tl); return c;
    }],
    ['💀 Extinciones', () => {
      marcarTema('tierra','extinciones');
      const c = el('<div class="card"><h3>Extinciones masivas</h3></div>');
      c.appendChild(accordion(d.extinciones.map(([n,t,x]) => [n+' · '+t, x])));
      return c;
    }],
    ['❓ Quiz', () => quiz('tierra', d.quiz)]
  ]));
};

// ================= ECOLOGÍA =================
routes.ecologia = (view) => {
  const d = DATA.ecologia;
  sectionHead(view, '🌿', 'Ecología', d.intro);
  marcarTema('ecologia','intro');
  view.appendChild(tabbed([
    ['🌍 Ecosistemas', () => {
      marcarTema('ecologia','ecosistemas');
      const g = el('<div class="grid"></div>');
      d.ecosistemas.forEach(([n, ico, desc]) => g.appendChild(el('<div class="card"><div class="ico" style="font-size:2rem">'+ico+'</div><h3>'+esc(n)+'</h3><p class="muted">'+esc(desc)+'</p></div>')));
      return g;
    }],
    ['🤝 Relaciones', () => { marcarTema('ecologia','relaciones'); const c=el('<div class="card"></div>'); c.appendChild(accordion(d.relaciones)); return c; }],
    ['♻️ Ciclos', () => { marcarTema('ecologia','ciclos'); const c=el('<div class="card"></div>'); c.appendChild(accordion(d.ciclos)); return c; }],
    ['🍴 Cadena', () => { marcarTema('ecologia','cadena'); return foodChain(); }],
    ['🃏 Flashcards', () => flashcards(d.flashcards)],
    ['❓ Quiz', () => quiz('ecologia', d.quiz)]
  ]));
};

// Simulador simple de cadena alimenticia
function foodChain(){
  const wrap = el('<div class="card"></div>');
  wrap.appendChild(el('<h3>Simulador de cadena alimenticia</h3><p class="muted">Ajusta el número de productores y observa cómo se distribuye la energía (≈10% por nivel).</p>'));
  const lab = el('<label>Energía de productores: <b id="pv">1000</b> unidades</label>');
  const rng = el('<input type="range" min="100" max="10000" step="100" value="1000" style="width:100%">');
  wrap.append(lab, rng);
  const chain = el('<div class="foodchain"></div>');
  wrap.appendChild(chain);
  const niveles = [['🌱 Productores',1],['🐇 Consumidor 1.º',0.1],['🦊 Consumidor 2.º',0.01],['🦅 Consumidor 3.º',0.001]];
  function pinta(){
    const base = +rng.value; $('#pv').textContent = base;
    chain.innerHTML = '';
    niveles.forEach(([nom, f], i) => {
      if(i) chain.appendChild(el('<div class="arrow">→</div>'));
      const val = Math.round(base*f);
      chain.appendChild(el('<div class="trophic"><div class="n">'+nom.split(' ')[0]+'</div><small>'+esc(nom.slice(2))+'</small><div style="font-weight:800;color:#78ff78">'+val+' u</div></div>'));
    });
  }
  rng.oninput = pinta; pinta();
  return wrap;
}

// ================= BIOMATEMÁTICOS =================
routes.biomate = (view) => {
  const d = DATA.biomate;
  sectionHead(view, '📈', 'Modelos Biomatemáticos I', d.intro);
  marcarTema('biomate','intro');
  view.appendChild(tabbed([
    ['🧮 Calculadora', () => { marcarTema('biomate','calc'); return calcPoblacion(); }],
    ['📐 Fórmulas', () => { marcarTema('biomate','formulas'); const c=el('<div class="card"></div>'); d.formulas.forEach(([n,f,x]) => c.appendChild(el('<div style="margin-bottom:14px"><h3>'+esc(n)+'</h3><p style="font-family:monospace;color:#78ff78">'+esc(f)+'</p><p class="muted">'+esc(x)+'</p></div>'))); return c; }],
    ['📝 Ejercicios', () => { marcarTema('biomate','ejercicios'); const c=el('<div></div>'); d.ejercicios.forEach(([q,pasos]) => { const card=el('<div class="card"><p><strong>'+esc(q)+'</strong></p></div>'); const ol=el('<ol style="line-height:1.8;color:#a9c2b5"></ol>'); pasos.forEach(p=>ol.appendChild(el('<li>'+esc(p)+'</li>'))); card.appendChild(ol); c.appendChild(card); }); return c; }],
    ['❓ Quiz', () => quiz('biomate', d.quiz)]
  ]));
};

// Calculadora de crecimiento poblacional con gráfica en canvas
function calcPoblacion(){
  const wrap = el('<div class="card"></div>');
  wrap.appendChild(el('<h3>Crecimiento poblacional</h3>'));
  const row = el('<div class="row"></div>');
  row.innerHTML = '<div><label>Población inicial (N₀)</label><input type="number" id="n0" value="100"></div>'+
    '<div><label>Tasa de crecimiento (r)</label><input type="number" id="rr" value="0.5" step="0.01"></div>'+
    '<div><label>Tiempo (t)</label><input type="number" id="tt" value="12"></div>'+
    '<div><label>Modelo</label><select id="mod"><option value="exp">Exponencial</option><option value="log">Logístico</option></select></div>';
  wrap.appendChild(row);
  const kdiv = el('<div id="kwrap" style="display:none"><label>Capacidad de carga (K)</label><input type="number" id="kk" value="1000"></div>');
  wrap.appendChild(kdiv);
  const btn = el('<button class="btn" style="margin-top:12px">Calcular y graficar</button>');
  wrap.appendChild(btn);
  const out = el('<div></div>'); const cv = el('<canvas class="chart"></canvas>');
  wrap.append(out, cv);
  row.querySelector('#mod').onchange = (e) => { kdiv.style.display = e.target.value==='log' ? 'block':'none'; };
  btn.onclick = () => {
    const N0=+$('#n0').value, r=+$('#rr').value, T=+$('#tt').value, mod=$('#mod').value, K=+$('#kk').value;
    const pts=[]; for(let t=0;t<=T;t++){ let N; if(mod==='exp'){ N=N0*Math.exp(r*t); } else { N=K/(1+((K-N0)/N0)*Math.exp(-r*t)); } pts.push(N); }
    const fin=pts[pts.length-1];
    out.innerHTML = '<div class="quiz-feedback">Al tiempo t='+T+' la población es <b style="color:#78ff78">'+Math.round(fin).toLocaleString('es-MX')+'</b> individuos.</div>';
    drawChart(cv, pts, mod==='log'?K:null);
  };
  setTimeout(()=>btn.click(),30);
  return wrap;
}

// Dibuja una gráfica de línea sencilla
function drawChart(cv, pts, K){
  const x = cv.getContext('2d'); const W = cv.width = cv.offsetWidth, H = cv.height = 240;
  const pad=34; x.clearRect(0,0,W,H);
  const max = Math.max(...pts, K||0)*1.05, min=0;
  const px = i => pad + i/(pts.length-1)*(W-pad*1.4);
  const py = v => H-pad - (v-min)/(max-min)*(H-pad*1.6);
  // ejes
  x.strokeStyle='rgba(255,255,255,.18)'; x.beginPath(); x.moveTo(pad,10); x.lineTo(pad,H-pad); x.lineTo(W-8,H-pad); x.stroke();
  // K
  if(K){ x.strokeStyle='rgba(229,150,57,.6)'; x.setLineDash([6,4]); x.beginPath(); x.moveTo(pad,py(K)); x.lineTo(W-8,py(K)); x.stroke(); x.setLineDash([]); x.fillStyle='#e59639'; x.font='11px sans-serif'; x.fillText('K',W-20,py(K)-4); }
  // curva
  const grad=x.createLinearGradient(0,0,W,0); grad.addColorStop(0,'#66BB6A'); grad.addColorStop(1,'#42a5f5');
  x.strokeStyle=grad; x.lineWidth=3; x.beginPath();
  pts.forEach((v,i)=>{ i?x.lineTo(px(i),py(v)):x.moveTo(px(i),py(v)); }); x.stroke();
  // puntos
  x.fillStyle='#78ff78'; pts.forEach((v,i)=>{ x.beginPath(); x.arc(px(i),py(v),2.5,0,7); x.fill(); });
  x.fillStyle='rgba(255,255,255,.5)'; x.font='10px sans-serif'; x.fillText('N',pad-24,py(max)+10); x.fillText('t',W-14,H-pad+16);
}

// ================= PROGRESO =================
const TEMAS_TOTALES = { genetica:6, tierra:4, ecologia:7, biomate:5 };
function progresoMateria(id){
  const done = Object.keys(state.temas[id]||{}).length;
  return Math.min(100, Math.round(done/(TEMAS_TOTALES[id]||6)*100));
}
function progresoGeneral(){
  const ids = Object.keys(TEMAS_TOTALES);
  return Math.round(ids.reduce((a,id)=>a+progresoMateria(id),0)/ids.length);
}
function quizzesCompletados(){ return Object.values(state.quizzes).filter(p=>p>0).length; }
function temasDominados(){
  let n=0; for(const id in state.temas){ n += Object.keys(state.temas[id]).length; } return n;
}

const LOGROS = [
  ['gen','🏵️','Genetista Novata', s => (s.quizzes.genetica||0) >= 50],
  ['eco','🌿','Exploradora de Ecosistemas', s => progresoMateria('ecologia') >= 60],
  ['paleo','🦴','Maestra del Paleozoico', s => (s.quizzes.tierra||0) >= 50],
  ['mate','📊','Analista Biomatemática', s => (s.quizzes.biomate||0) >= 50],
  ['dedic','⏰','Estudiante Dedicada', s => s.minutos >= 15],
  ['todo','🌟','Bióloga Estelar', () => progresoGeneral() >= 100]
];
function refreshAchievements(){ if((location.hash.replace('#','')||'home')==='progreso') render(); }

routes.progreso = (view) => {
  view.appendChild(backBtn());
  view.appendChild(el('<h1 class="section-title">🏅 Mi progreso</h1>'));
  const gen = progresoGeneral();
  const ring = el('<div class="card" style="text-align:center"><h3>Avance general</h3><div class="ring"><span>'+gen+'%</span></div><p class="muted">¡Sigue así!</p></div>');
  ring.querySelector('.ring').style.setProperty('--p', gen);
  view.appendChild(ring);

  const stats = el('<div class="stats"></div>');
  stats.appendChild(el('<div class="stat"><div class="big">'+state.minutos+'</div><small class="muted">minutos de estudio</small></div>'));
  stats.appendChild(el('<div class="stat"><div class="big">'+quizzesCompletados()+'</div><small class="muted">cuestionarios hechos</small></div>'));
  stats.appendChild(el('<div class="stat"><div class="big">'+temasDominados()+'</div><small class="muted">temas explorados</small></div>'));
  view.appendChild(el('<div class="card"></div>')).appendChild(stats);

  view.appendChild(el('<h2 class="section-title">Materias</h2>'));
  const mg = el('<div class="card"></div>');
  DATA.subjects.forEach(([id,ico,nom]) => {
    const p = progresoMateria(id);
    const line = el('<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between"><span>'+ico+' '+esc(nom)+'</span><b>'+p+'%</b></div><div class="progress-line"><i style="width:'+p+'%"></i></div></div>');
    mg.appendChild(line);
  });
  view.appendChild(mg);

  view.appendChild(el('<h2 class="section-title">🏆 Logros</h2>'));
  const bg = el('<div class="badges"></div>');
  LOGROS.forEach(([id,e,nom,cond]) => {
    const on = cond(state);
    bg.appendChild(el('<div class="badge '+(on?'on':'')+'"><div class="e">'+e+'</div><div><b>'+esc(nom)+'</b></div><small>'+(on?'¡Desbloqueado!':'Por conseguir')+'</small></div>'));
  });
  view.appendChild(bg);

  // Observación final
  view.appendChild(el('<div class="card" style="margin-top:18px;text-align:center;background:linear-gradient(135deg,rgba(46,125,50,.3),rgba(21,101,192,.25))"><h3>🔬 Observación Final</h3><p class="intro" style="border:none;font-size:1.05rem">“Después de analizar ecosistemas, organismos, genes y modelos matemáticos, Biolunet concluye que algunas personas tienen la curiosidad necesaria para cambiar el mundo. Sigue explorando. 🌱”</p></div>'));
};

// ================= BIBLIOTECA =================
routes.biblioteca = (view) => {
  view.appendChild(backBtn());
  view.appendChild(el('<h1 class="section-title">📖 Biblioteca</h1>'));
  view.appendChild(el('<p class="intro">Guarda tus apuntes, enlaces, PDFs, videos y bibliografía, organizados por materia.</p>'));

  const form = el('<div class="card"><h3>Añadir recurso</h3></div>');
  const row = el('<div class="row"></div>');
  row.innerHTML = '<div><label>Título</label><input type="text" id="lt" placeholder="Ej. Apuntes de mitosis"></div>'+
    '<div><label>Enlace (opcional)</label><input type="text" id="lu" placeholder="https://..."></div>'+
    '<div><label>Materia</label><select id="lm"><option>Genética</option><option>Dinámica Terrestre</option><option>Ecología</option><option>Biomatemáticas</option><option>General</option></select></div>'+
    '<div><label>Categoría</label><select id="lc"><option>Resúmenes</option><option>Apuntes</option><option>Videos</option><option>Ejercicios</option><option>Bibliografía</option></select></div>';
  form.appendChild(row);
  const add = el('<button class="btn" style="margin-top:12px">Guardar recurso</button>');
  form.appendChild(add); view.appendChild(form);

  const listWrap = el('<div></div>'); view.appendChild(listWrap);
  const search = el('<input type="text" placeholder="🔍 Buscar en la biblioteca..." style="width:100%;margin:8px 0 14px">');
  view.insertBefore(search, listWrap);

  function pinta(filtro){
    listWrap.innerHTML='';
    const items = state.biblioteca.filter(r => !filtro || (r.t+r.m+r.c).toLowerCase().includes(filtro.toLowerCase()));
    if(!items.length){ listWrap.appendChild(el('<p class="muted" style="text-align:center">Aún no hay recursos. ¡Añade el primero! 📚</p>')); return; }
    items.forEach((r) => {
      const item = el('<div class="lib-item"><div><div><span class="pill">'+esc(r.m)+'</span><span class="pill">'+esc(r.c)+'</span></div><div style="margin-top:6px"><b>'+esc(r.t)+'</b></div>'+(r.u?'<a href="'+esc(r.u)+'" target="_blank" rel="noopener">'+esc(r.u)+'</a>':'')+'</div></div>');
      const del = el('<button class="del">Eliminar</button>');
      del.onclick = () => { state.biblioteca = state.biblioteca.filter(z=>z!==r); save(); pinta(search.value); toast('Recurso eliminado'); };
      item.appendChild(del); listWrap.appendChild(item);
    });
  }
  add.onclick = () => {
    const t=$('#lt').value.trim(); if(!t){ toast('Escribe un título'); return; }
    let u=$('#lu').value.trim(); if(u && !/^https?:\/\//i.test(u)) u='https://'+u;
    state.biblioteca.push({ t, u, m:$('#lm').value, c:$('#lc').value }); save();
    $('#lt').value=''; $('#lu').value=''; pinta(search.value); toast('Recurso guardado ✓');
  };
  search.oninput = () => pinta(search.value);
  pinta('');
};

// ---- Arranque ----
state.ultimaVisita = new Date().toISOString(); save();
render();
