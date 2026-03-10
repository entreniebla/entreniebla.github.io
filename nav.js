// nav.js
// sistema de navegación entre piezas — entreniebla

const piezas = [
  { nombre: 'péptido',            sketch: sketchPeptido,  archivo: 'sketch.js' },
  { nombre: 'absurda y objetiva', sketch: sketchAbsurda,  archivo: 'sketch1.js' },
  { nombre: 'respirar (lluvia)',  sketch: sketchLluvia,   archivo: 'sketch2.js' },
];

const titulos            = document.getElementById('titulo');
const pantallaTransicion = document.getElementById('transicion');
const ventana            = document.getElementById('ventana');
const ventanaLabel       = document.getElementById('ventana-label');
const ventanaToggle      = document.getElementById('ventana-toggle');
const ventanaCuerpo      = document.getElementById('ventana-cuerpo');
const ventanaCodigo      = document.getElementById('ventana-codigo');
const ventanaHeader      = document.getElementById('ventana-header');
const ventanaInfo        = document.getElementById('ventana-info');
const ventanaInfoHeader  = document.getElementById('ventana-info-header');
const ventanaInfoToggle  = document.getElementById('ventana-info-toggle');
const ventanaInfoCuerpo  = document.getElementById('ventana-info-cuerpo');

let indiceActual    = 0;
let instanciaActual = null;
let enTransicion    = false;
let porcentaje      = 0;
let animFrameId     = null;
let mouseEnVentana  = false;

// — draggable factory —
function hacerArrastrable(ventanaEl, headerEl) {
  let arrastrando = false;
  let offX = 0, offY = 0;
  let seMueve = false;
  let yaMovida = false;

  headerEl.addEventListener('mousedown', (e) => {
    arrastrando = true;
    seMueve = false;
    const rect = ventanaEl.getBoundingClientRect();
    offX = e.clientX - rect.left;
    offY = e.clientY - rect.top;
    ventanaEl.style.cursor = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!arrastrando) return;
    if (!seMueve) {
      seMueve  = true;
      yaMovida = true;
      const rect = ventanaEl.getBoundingClientRect();
      ventanaEl.style.transform = '';
      ventanaEl.style.right  = 'auto';
      ventanaEl.style.bottom = 'auto';
      ventanaEl.style.left   = rect.left + 'px';
      ventanaEl.style.top    = rect.top  + 'px';
    }
    ventanaEl.style.left = (e.clientX - offX) + 'px';
    ventanaEl.style.top  = (e.clientY - offY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    arrastrando = false;
    ventanaEl.style.cursor = '';
  });

  return {
    getSeMueve:  () => seMueve,
    getYaMovida: () => yaMovida,
    setYaMovida: (v) => { yaMovida = v; }
  };
}

// — init draggables —
const dragVentana = hacerArrastrable(ventana,     ventanaHeader);
const dragInfo    = hacerArrastrable(ventanaInfo, ventanaInfoHeader);

// — detección de fondo —
function detectarFondo() {
  setTimeout(() => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const px = ctx.getImageData(10, 10, 1, 1).data;
      const oscuro = px[0] < 60 && px[1] < 60 && px[2] < 60;
      ventana.classList.toggle('fondo-oscuro', oscuro);
      ventanaInfo.classList.toggle('fondo-oscuro', oscuro);
    } catch(e) {}
  }, 600);
}

// — syntax color —
function pintarCodigo(txt) {
  txt = txt
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  txt = txt.replace(/(\/\*[\s\S]*?\*\/)/g,
    '<span class="cmnt">$1</span>');

  txt = txt.replace(/(\/\/[^\n]*)/g,
    '<span class="cmnt">$1</span>');

  const kw = [
    'void', 'return', 'boolean', 'int', 'float', 'String', 'color',
    'true', 'false', 'null', 'undefined', 'if', 'else', 'while', 'for',
    'break', 'continue', 'function', 'const', 'let', 'var', 'class',
    'new', 'this', 'catch', 'import', 'from'
  ];
  const kwRegex = new RegExp(`\\b(${kw.join('|')})\\b`, 'g');
  txt = txt.replace(kwRegex, '<span class="kw">$1</span>');

  return txt;
}

function cargarCodigo(archivo) {
  fetch(archivo)
    .then(r => r.text())
    .then(txt => {
      ventanaCodigo.innerHTML = pintarCodigo(txt);
    })
    .catch(() => {
      ventanaCodigo.innerHTML = '<span class="cmnt">// no se pudo cargar el archivo</span>';
    });
}

// — toggle ventana código —
function abrirVentana() {
  ventana.classList.remove('minimizado');
  ventanaToggle.textContent = '—';
  ventana.style.top       = '50%';
  ventana.style.left      = '50%';
  ventana.style.transform = 'translate(-50%, -50%)';
  ventana.style.right     = 'auto';
  ventana.style.bottom    = 'auto';
  dragVentana.setYaMovida(false);
}

function cerrarVentana() {
  ventana.classList.add('minimizado');
  ventanaToggle.textContent = '+';
}

ventanaLabel.addEventListener('click', () => {
  if (dragVentana.getSeMueve()) return;
  ventana.classList.contains('minimizado') ? abrirVentana() : cerrarVentana();
});
ventanaToggle.addEventListener('click', () => {
  if (dragVentana.getSeMueve()) return;
  ventanaLabel.click();
});

// — toggle ventana info —
function abrirInfo() {
  ventanaInfo.classList.remove('minimizado');
  ventanaInfoToggle.textContent = '—';

  requestAnimationFrame(() => {
    const rect   = ventanaInfo.getBoundingClientRect();
    const margen = 12;
    let top  = rect.top;
    let left = rect.left;
    if (rect.bottom > window.innerHeight - margen) top = window.innerHeight - rect.height - margen;
    if (top < margen) top = margen;
    if (rect.right > window.innerWidth - margen) left = window.innerWidth - rect.width - margen;
    if (left < margen) left = margen;
    if (top !== rect.top || left !== rect.left) {
      ventanaInfo.style.right  = 'auto';
      ventanaInfo.style.bottom = 'auto';
      ventanaInfo.style.top    = top  + 'px';
      ventanaInfo.style.left   = left + 'px';
      dragInfo.setYaMovida(true);
    }
  });
}

function cerrarInfo() {
  ventanaInfo.classList.add('minimizado');
  ventanaInfoToggle.textContent = '☰';
}

ventanaInfoHeader.addEventListener('click', () => {
  if (dragInfo.getSeMueve()) return;
  ventanaInfo.classList.contains('minimizado') ? abrirInfo() : cerrarInfo();
});

// rastrea mouse en ventanas
ventana.addEventListener('mouseenter',     () => { mouseEnVentana = true;  });
ventana.addEventListener('mouseleave',     () => { mouseEnVentana = false; });
ventanaInfo.addEventListener('mouseenter', () => { mouseEnVentana = true;  });
ventanaInfo.addEventListener('mouseleave', () => { mouseEnVentana = false; });

// scroll dentro de cuerpos — no navega
ventanaCuerpo.addEventListener('wheel',     (e) => { e.stopPropagation(); }, { passive: true });
ventanaInfoCuerpo.addEventListener('wheel', (e) => { e.stopPropagation(); }, { passive: true });

// — sketches —
function lanzarSketch(indice) {
  if (instanciaActual) {
    instanciaActual.remove();
    instanciaActual = null;
  }
  instanciaActual = new p5(piezas[indice].sketch);
  titulos.textContent = `entreniebla — ${piezas[indice].nombre}`;
  cargarCodigo(piezas[indice].archivo);
  detectarFondo();
}

function animarTransicion(hacia) {
  if (enTransicion) return;
  let siguiente = indiceActual + hacia;
  if (siguiente < 0 || siguiente >= piezas.length) return;
  enTransicion = true;
  porcentaje   = 0;
  pantallaTransicion.classList.add('visible');

  function paso() {
    porcentaje += 1.2;
    pantallaTransicion.textContent = `${Math.min(Math.floor(porcentaje), 100)}%`;
    if (porcentaje < 100) {
      animFrameId = requestAnimationFrame(paso);
    } else {
      pantallaTransicion.textContent = '100%';
      setTimeout(() => {
        indiceActual = siguiente;
        lanzarSketch(indiceActual);
        setTimeout(() => {
          pantallaTransicion.classList.remove('visible');
          pantallaTransicion.textContent = '';
          enTransicion = false;
        }, 300);
      }, 200);
    }
  }
  animFrameId = requestAnimationFrame(paso);
}

// scroll
window.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (mouseEnVentana) return;
  if (e.deltaY > 0) animarTransicion(1);
  else              animarTransicion(-1);
}, { passive: false });

// flechas
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown' || e.key === 'PageDown') animarTransicion(1);
  else if (e.key === 'ArrowUp' || e.key === 'PageUp') animarTransicion(-1);
});

// lanzar la primera pieza
lanzarSketch(0);