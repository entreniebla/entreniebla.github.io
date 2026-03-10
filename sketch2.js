

function sketchLluvia(p) {

    // respirar (lluvia)
    // Tu aliento a lluvia contenida -
    // — el cielo —
    
    
      const tintas = [
        ['#D88200', '#000000', '#9a031e', '#ede0d4'],
        ['#000000', '#D88200', '#9a031e', '#ede0d4'],
        ['#ede0d4', '#000000', '#9a031e', '#D88200'],
        ['#9a031e', '#000000', '#D88200', '#ede0d4'],
        ['#000000', '#ede0d4', '#9a031e', '#D88200'],
        ['#D88200', '#9a031e', '#000000', '#ede0d4'],
      ];
    
      let tinta, indiceTinta;
      let fondo, respirar;
      let t = 0;
      let direccion = 1;
      let ciclo = 0;
      let cicloColor = 0;
      let cadaColor;
      let historial = [];
    
      p.setup = function() {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.colorMode(p.RGB);
        indiceTinta = 2;
        tinta       = tintas[2];
        fondo       = p.color('#ede0d4');
        respirar    = p.color(tinta[1]);
        direccion   = p.random(1) > 0.5 ? 1 : -1;
        p.background(fondo);
        historial   = [2];
        cadaColor   = p.int(p.random(30, 300));
        p.noiseSeed(p.int(p.random(9999)));
      };
    
      function cambiarTinta() {
        let nuevo = indiceTinta;
        let intentos = 0;
        while (historial.includes(nuevo) && intentos < 20) {
          nuevo = p.int(p.random(tintas.length));
          intentos++;
        }
        indiceTinta = nuevo;
        historial.push(nuevo);
        if (historial.length > 2) historial.shift();
        tinta     = tintas[indiceTinta];
        fondo     = p.color(tinta[0]);
        respirar  = p.color(tinta[p.int(p.random(1, tinta.length))]);
        direccion = p.random(1) > 0.5 ? 1 : -1;
        p.background(fondo);
      }
    
      p.draw = function() {
        t += 0.004;
    
        p.push();
        p.translate(p.random(-p.width * 0.3, p.width), p.random(-320, p.height * 0.3));
        p.noFill();
    
        let n = p.noise(t * 0.8 + 33);
        if (n > 0.5) {
          p.strokeWeight(p.random(3, 4));
        } else {
          p.strokeWeight(p.random(0.1, 0.7));
        }
    
        p.translate(0, p.random(-320, 1000));
        for (let latido = 0; latido < 200; latido++) {
          let pulso  = p.noise(latido * 0.01 + t * 1) * 0.5 - 0.5;
          let base   = p.random(5, 20);
          let deriva = base + Math.abs(pulso) * p.random(100, 333);
          p.translate(p.random(0), p.random(-320, 1000));
          p.strokeCap(p.ROUND);
          p.stroke(respirar);
          p.line(0, 0, deriva * direccion, deriva);
          p.translate(p.random(100), p.random(-320, 1000));
          p.stroke(respirar);
          p.line(0, 0, deriva * direccion, deriva);
        }
        p.pop();
    
        cicloColor++;
        if (cicloColor >= cadaColor) {
          cicloColor = 0;
          cadaColor  = p.int(p.random(30, 300));
          respirar   = p.color(tinta[p.int(p.random(1, tinta.length))]);
        }
    
        ciclo++;
        if (ciclo >= 2000) {
          cambiarTinta();
          ciclo = 0;
        }
      };
    
      p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        if (fondo) p.background(fondo);
      };
    }