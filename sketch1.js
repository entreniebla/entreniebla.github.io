function sketchAbsurda(p) {
    /* 
    
    absurda y objetiva
     — entreniebla, 2014/2026 —
     las palabras no esperan ser leídas
    
     */
    const tintas = [
      ['#D88200', '#000000', '#ede0d4', '#9a031e', '#ede0d4'], // el día
      ['#000000', '#D88200', '#ede0d4', '#9a031e', '#ede0d4'], // la noche
      ['#ede0d4', '#000000', '#9a031e', '#D88200', '#000000'], // el silencio
      ['#9a031e', '#000000', '#D88200', '#ede0d4', '#ede0d4'], // la urgencia
      ['#000000', '#ede0d4', '#9a031e', '#D88200', '#9a031e'], // el abismo
      ['#D88200', '#9a031e', '#000000', '#ede0d4', '#000000'], // lo invertido
    ];
  
    let tinta, indiceTinta;
    let fuente, fuente2;
    let t = 0;
    let cadaCuantos = 30;
    let frameContador = 0;
    let ultimoReset = 0;
  
    // voz 1 — el giro
    const giro = [
      'silencio', 'giro', 'me', 'tumbo', 'escalera', 'fruta', 'madura',
      'la', 'madera', 'me', 'habla', '/ / / / /', 'sativa'
    ];
    // voz 2 — las mentiras
    const mentiras = [
      'entre', 'abre', 'me', 'fumo', 'tus', 'mentiras', '*',
      'adivina', 'quien', 'soy', 'tres', '+ + + + +', 'cuartos'
    ];
    // voz 3 — el silencio
    const silencio = [
      'nuestra', 'naturaleza', 'absurda', 'y', 'objetiva', 'fuego', 'en',
      'el', 'teclado', 'serie', 'del', 'pasado', 'giro'
    ];
    // voz 4 — teclado: el código como acto íntimo
    const teclado = [
      'void aparecer();', 'noise(semilla + t);', 'int alMundo;',
      't += 0.0012;', 'while (adentro);', 'return cuerpo;',
      'catch (el miedo);', 'boolean dormida = true;',
      'if (nadie) break;', 'void olvidar();', '*', '/ / / / /'
    ];
    // voz 5 — i'm the ocean, laraaji
    const territorio = [
      '*', 'el', 'agua', 'sin', 'orilla',
      'adentro', 'todo', 'afuera', 'todo',
      'no', 'hay', 'diferencia', 'fluyo', '~'
    ];
  
    // cualquier color menos el fondo
    function tintaLibre() {
      return p.color(tinta[p.int(p.random(1, tinta.length))]);
    }
  
    p.preload = function() {
      fuente  = p.loadFont('data/ABCFavoritLining-Medium.otf');
      fuente2 = p.loadFont('data/ABCFavoritLining-MediumItalic.otf');
    };
  
    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight);
      indiceTinta = 0;
      tinta       = tintas[0];
      p.background(p.color(tinta[0]));
      p.frameRate(60);
      p.noiseSeed(p.int(p.random(9999)));
    };
  
    function cambiarTinta() {
      let nuevo = indiceTinta;
      while (nuevo === indiceTinta) {
        nuevo = p.int(p.random(tintas.length));
      }
      indiceTinta = nuevo;
      tinta       = tintas[indiceTinta];
      p.background(p.color(tinta[0]));
    }
  
    function aparecer(voz, semilla, color, minimo, maximo) {
      // una palabra aparece — no pide permiso
      let cuerpo = p.map(p.noise(semilla + t), 0, 1, minimo, maximo);
      let x = p.random(-150, p.width + 162);
      let y = p.random(-150, p.height + 162);
      p.push();
      p.translate(x, y);
      p.noStroke();
      p.fill(color);
      p.textFont(p.random(1) > 0.5 ? fuente : fuente2);
      p.textSize(cuerpo);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(voz[p.int(p.random(voz.length))], 0, 0);
      p.pop();
    }
  
    function aparecerGrito(voz, semilla, color, minimo, maximo) {
      // lo que no cabe — desborda
      let cuerpo = p.map(p.noise(semilla + t), 0, 1, minimo, maximo);
      let x = p.random(-150, p.width + 162);
      let y = p.random(-p.height * 0.5, p.height * 1.2);
      p.push();
      p.translate(x, y);
      p.noStroke();
      p.fill(color);
      p.textFont(p.random(1) > 0.5 ? fuente : fuente2);
      p.textSize(cuerpo);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(voz[p.int(p.random(voz.length))], 0, 0);
      p.pop();
    }
  
    p.draw = function() {
      t += 0.0012;
  
      // cambia de tinta cada 72 segundos — sin avisar
      if (p.millis() - ultimoReset > 72000) {
        cambiarTinta();
        ultimoReset = p.millis();
      }
  
      frameContador++;
      if (frameContador >= cadaCuantos) {
        frameContador = 0;
        cadaCuantos   = p.int(p.random(10, 33));
  
        let cual  = p.int(p.random(5));
        let cual2 = p.int(p.random(5));
  
        // voces cotidianas — 22 a 52
        if (cual == 0) aparecer(giro,       0.0, tintaLibre(), 22, 52);
        if (cual == 1) aparecer(mentiras,   2.0, tintaLibre(), 22, 52);
        if (cual == 2) aparecer(silencio,   4.0, tintaLibre(), 22, 52);
        if (cual == 3) aparecer(teclado,    6.0, tintaLibre(), 22, 52);
        if (cual == 4) aparecer(territorio, 8.0, tintaLibre(), 22, 52);
  
        // segunda voz
        if (p.random(1) < 0.7) {
          if (cual2 == 0) aparecer(giro,       0.5, tintaLibre(), 42, 72);
          if (cual2 == 1) aparecer(mentiras,   2.5, tintaLibre(), 42, 72);
          if (cual2 == 2) aparecer(silencio,   4.5, tintaLibre(), 42, 72);
          if (cual2 == 3) aparecer(teclado,    6.5, tintaLibre(), 42, 72);
          if (cual2 == 4) aparecer(territorio, 8.5, tintaLibre(), 42, 72);
        }
  
        // interrupción mediana
        if (p.random(1) < 0.10) {
          let med = p.int(p.random(5));
          if (med == 0) aparecer(giro,       5.0, tintaLibre(), 72, 92);
          if (med == 1) aparecer(mentiras,   5.5, tintaLibre(), 72, 92);
          if (med == 2) aparecer(silencio,   6.0, tintaLibre(), 72, 92);
          if (med == 3) aparecer(teclado,    6.5, tintaLibre(), 42, 72);
          if (med == 4) aparecer(territorio, 8.0, tintaLibre(), 72, 92);
        }
  
        // ya se ve
        if (p.random(1) < 0.04) {
          let medio = p.int(p.random(4));
          if (medio == 0) aparecer(giro,       3.0, tintaLibre(), 92, 132);
          if (medio == 1) aparecer(mentiras,   3.5, tintaLibre(), 92, 132);
          if (medio == 2) aparecer(silencio,   4.2, tintaLibre(), 92, 132);
          if (medio == 3) aparecer(territorio, 8.2, tintaLibre(), 92, 132);
        }
  
        // casi 
        if (p.random(1) < 0.08) {
          let casi = p.int(p.random(4));
          if (casi == 0) aparecer(giro,       11.0, tintaLibre(), 132, 402);
          if (casi == 1) aparecer(mentiras,   11.5, tintaLibre(), 132, 402);
          if (casi == 2) aparecer(silencio,   12.0, tintaLibre(), 132, 402);
          if (casi == 3) aparecer(territorio, 12.5, tintaLibre(), 132, 402);
        }
  
        // la interrupción
        if (p.random(1) < 0.03) {
          let irrupcion = p.int(p.random(5));
          if (irrupcion == 0) aparecer(giro,       7.0, tintaLibre(), 402, 720);
          if (irrupcion == 1) aparecer(mentiras,   7.5, tintaLibre(), 402, 720);
          if (irrupcion == 2) aparecer(silencio,   8.0, tintaLibre(), 402, 720);
          if (irrupcion == 3) aparecer(teclado,    8.5, tintaLibre(),  42,  72);
          if (irrupcion == 4) aparecer(territorio, 9.0, tintaLibre(), 402, 720);
        }
  
        // lo que no cabe
        if (p.random(1) < 0.07) {
          let grito = p.int(p.random(4));
          if (grito == 0) aparecerGrito(giro,       9.0,  tintaLibre(), 1200, 1700);
          if (grito == 1) aparecerGrito(mentiras,   9.5,  tintaLibre(), 1200, 1700);
          if (grito == 2) aparecerGrito(silencio,   10.0, tintaLibre(), 1200, 1700);
          if (grito == 3) aparecerGrito(territorio, 10.5, tintaLibre(), 1200, 1700);
        }
      }
    };
  
    p.windowResized = function() {
      p.resizeCanvas(p.windowWidth, p.windowHeight);
      if (tinta) p.background(p.color(tinta[0]));
    };
  }