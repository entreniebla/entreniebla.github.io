// sketch0.js — péptido
// — entreniebla, 2026 —
// lenguajes paralelos vuelven a mí

function sketchPeptido(p) {

  const tintas = [
    ['#ede0d4', '#000000', '#D88200', '#000000', '#D88200'], // el hueso
    ['#D88200', '#000000', '#ede0d4', '#000000', '#ede0d4'], // el dorado
    ['#000000', '#ede0d4', '#D88200', '#D88200', '#ede0d4']  // el abismo
  ];
  // [fondo, texto, membrana móvil, sinapsis1, sinapsis2]

  let indiceTinta = 0;
  let tinta;

  const niebla = ['lenguajes', 'paralelos', 'vuelven', 'a', 'mi'];

  let fuente;
  let t = 0;
  let tPalabra1 = 100, tPalabra2 = 200, tPalabra3 = 300, tPalabra4 = 400;
  let tGrande = 50, tAlpha = 500;
  let tCirculo = 0, tLatidoTrazo = 700;

  let cambio = 0, espacio = 625, velocidad = 2;
  let vozActiva = 0;
  let ultimaPalabra = 0;
  let membrana = 0;
  let ultimaMembrana = 0;
  let ultimoReset = 0;

  let latidoTamano = 0;
  let disipacion = 0.92;
  let latidoTrazo = 0;
  const disipacionTrazo = 0.76;

  let rangoMin = 0, rangoMax = 10;
  const rangos = [[0,10],[0,7],[3,13],[2,5]];
  const disipaciones = [0.92, 0.62];
  const idxVoz = [0, 3, 1, 4];

  function aplicarTinta() {
    p.background(p.color(tinta[0]));
  }

  function cambiarTinta() {
    let nuevo = indiceTinta;
    while (nuevo === indiceTinta) {
      nuevo = p.int(p.random(tintas.length));
    }
    indiceTinta = nuevo;
    tinta = tintas[indiceTinta];
    aplicarTinta();
  }

  function respirar() {
    const r = p.floor(p.random(rangos.length));
    rangoMin   = rangos[r][0];
    rangoMax   = rangos[r][1];
    disipacion = disipaciones[p.floor(p.random(disipaciones.length))];
  }

  p.preload = function() {
    fuente = p.loadFont('data/intervogue-soft-medium 2.otf');
  };

  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.textFont(fuente);
    p.frameRate(60);
    indiceTinta = 0;
    tinta = tintas[0];
    aplicarTinta();
    respirar();
  };

  p.draw = function() {
    t            += 0.004;
    tCirculo     += 0.09;
    tGrande      += 0.003;
    tAlpha       += 0.15;
    tLatidoTrazo += 0.028;

    // latido — pulso de tamaño que irrumpe y se disipa
    const nLatido = p.noise(tAlpha + 99);
    if (nLatido > 0.75) {
      latidoTamano = p.map(nLatido, 0.75, 1.0, 240, 800);
      respirar();
    }
    latidoTamano *= disipacion;
    const tamano = latidoTamano > 4
      ? latidoTamano
      : p.map(p.noise(tCirculo), 0, 1, rangoMin, rangoMax);

    cambio  += velocidad;
    espacio += velocidad * 0.6;
    if (cambio > p.width || cambio < 0 || espacio > p.height || espacio < 0) {
      velocidad = p.random(1) > 0.5 ? 2 : -2;
      espacio   = 50 + p.random(p.height);
      cambio    = 10 + p.random(p.width);
    }

    // membrana móvil
    p.noFill();
    p.strokeWeight(p.map(p.noise(tCirculo + 10), 0, 1, 0.2, 1.8));
    p.stroke(p.color(tinta[2]));
    p.ellipse(cambio, espacio, tamano, tamano);

    // latido de trazo
    const nLatidoTrazo = p.noise(tLatidoTrazo + 55);
    if (nLatidoTrazo > 0.70) {
      latidoTrazo = p.map(nLatidoTrazo, 0.70, 1.0, 18, 55);
    }
    latidoTrazo *= disipacionTrazo;

    // sinapsis — círculos distribuidos en el campo
    const ahora = p.millis();
    const intervaloSinapsis = p.map(p.noise(tGrande + 44), 0, 1, 600, 2000);
    if (ahora - ultimaMembrana > intervaloSinapsis) {
      ultimaMembrana = ahora;

      const nResonancia = p.noise(tGrande);
      let tamanoSinapsis;
      if      (nResonancia > 0.80) tamanoSinapsis = p.map(nResonancia, 0.80, 1.0, 220, 420);
      else if (nResonancia > 0.60) tamanoSinapsis = p.map(nResonancia, 0.60, 0.80, 80, 220);
      else if (nResonancia < 0.10) tamanoSinapsis = p.map(nResonancia, 0, 0.10, 0.5, 3);
      else if (nResonancia < 0.30) tamanoSinapsis = p.map(nResonancia, 0.10, 0.30, 3, 15);
      else                         tamanoSinapsis = p.map(nResonancia, 0.30, 0.60, 15, 80);

      const trazo = latidoTrazo > 3 ? latidoTrazo : (p.random(1) > 0.5 ? 2 : 4);

      p.noFill();
      p.strokeWeight(trazo);
      p.stroke(p.color(membrana % 2 === 0 ? tinta[3] : tinta[4]));
      p.ellipse(
        p.random(p.width  * 0.05, p.width  * 0.95),
        p.random(p.height * 0.05, p.height * 0.95),
        tamanoSinapsis, tamanoSinapsis
      );
      tGrande += 0.06;
      membrana++;
    }

    // emisión de texto
    const intervaloVoz = p.map(p.noise(t + 77), 0, 1, 300, 1200);
    if (ahora - ultimaPalabra > intervaloVoz) {
      ultimaPalabra = ahora;
      p.noStroke();
      p.textFont(fuente);
      p.textSize(14);
      p.textAlign(p.CENTER, p.CENTER);

      const px = p.random(p.width  * 0.05, p.width  * 0.95);
      const py = p.random(p.height * 0.03, p.height * 0.97);

      if (vozActiva === 0) {
        p.fill(p.color(tinta[1]));
        idxVoz[0] = (idxVoz[0] + p.floor(p.random(1, niebla.length))) % niebla.length;
        p.text(niebla[idxVoz[0]], px, py);
        tPalabra1 += 0.08;
      } else if (vozActiva === 1) {
        p.fill(p.color(tinta[1]));
        idxVoz[1] = (idxVoz[1] + p.floor(p.random(1, niebla.length))) % niebla.length;
        p.text(niebla[idxVoz[1]], px, py);
        tPalabra2 += 0.06;
      } else if (vozActiva === 2) {
        p.fill(p.color(tinta[1]));
        idxVoz[2] = (idxVoz[2] + p.floor(p.random(1, niebla.length))) % niebla.length;
        p.text(niebla[idxVoz[2]], px, py);
        tPalabra3 += 0.05;
      } else if (vozActiva === 3) {
        // voz susurrada
        if (p.noise(tPalabra4) > 0.7) {
          const c = p.color(tinta[1]);
          p.fill(p.red(c), p.green(c), p.blue(c), 40);
          idxVoz[3] = (idxVoz[3] + p.floor(p.random(1, niebla.length))) % niebla.length;
          p.text(niebla[idxVoz[3]], px, py);
        }
        tPalabra4 += 0.04;
      }
      vozActiva = (vozActiva + 1) % 4;
    }

    // ciclo — el sistema muta de tinta cada 168 segundos
    if (ahora - ultimoReset > 112000) {
      cambiarTinta();
      cambio       = p.random(p.width);
      espacio      = p.random(p.height);
      latidoTamano = 0;
      latidoTrazo  = 0;
      ultimoReset  = ahora;
    }
  };

  p.windowResized = function() {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    if (tinta) p.background(p.color(tinta[0]));
  };
}