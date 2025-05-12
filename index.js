let particles = [];
let barrierRadius;
let barrierWidth, barrierHeight;
let barrierWidth2, barrierHeight2; // Zweite Barriere
let t = 0; // Zeitvariable für Bewegung

function setup(){
  const canvas = createCanvas(400,400);
  canvas.parent("sketch");
  background("black");
  barrierWidth = width * 0.9; // Breite der Ellipse
  barrierHeight = height * 0.7; // Höhe der Ellipse
  barrierWidth2 = width * 0.5; // Breite der zweiten Ellipse
  barrierHeight2 = height * 0.3; // Höhe der zweiten Ellipse
}

function draw() {
  // Add semi-transparent background for trail effect
  background(0, 20);

  // Dynamische Breite und Höhe der ersten Ellipse
  let dynamicWidth = width * 0.6 + sin(t * 2) * (width * 0.2);
  let dynamicHeight = height * 0.3 + cos(t * 2) * (height * 0.1);

  // Tausche Breite und Höhe periodisch für die erste
  if (sin(t) > 0) {
    barrierWidth = dynamicWidth;
    barrierHeight = dynamicHeight;
  } else {
    barrierWidth = dynamicHeight;
    barrierHeight = dynamicWidth;
  }

    // Dynamische Breite und Höhe der zweiten Ellipse
    let dynamicWidth2 = width * 0.5 + cos(t * 1.5) * (width * 0.15);
    let dynamicHeight2 = height * 0.4 + sin(t * 1.8) * (height * 0.12);
  
    // Tausche Breite und Höhe periodisch für die zweite Ellipse
    if (cos(t) > 0) {
      barrierWidth2 = dynamicWidth2;
      barrierHeight2 = dynamicHeight2;
    } else {
      barrierWidth2 = dynamicHeight2;
      barrierHeight2 = dynamicWidth2;
    }

 // Update dynamische Barriere
 let centerX = width * 0.6 + sin(t * 0.8) * 80;
 let centerY = height * 0.3 + cos(t * 0.6) * 40;

   // Position der zweiten Barriere
   let centerX2 = width * 0.5 + sin(t * 0.3) * (width * 0.4); // Größere horizontale Bewegung
   let centerY2 = height * 0.5 + cos(t * 0.25) * (height * 0.4); // Größere vertikale Bewegung

  // Zeichne beide Barrieren
  drawBarrier(centerX, centerY, barrierWidth, barrierHeight);
  drawBarrier(centerX2, centerY2, barrierWidth2, barrierHeight2);
 t += 0.005;
 
 // Neue Partikel erzeugen
 if (random(1) < 0.5) {
   const startX = random(0, width / 4);
   particles.push(new Particle(startX, height));
 }

 // Partikel aktualisieren und anzeigen
 for (let i = particles.length - 1; i >= 0; i--) {
   particles[i].update();
   particles[i].checkBarrierCollision(centerX, centerY, barrierWidth, barrierHeight);
   particles[i].checkBarrierCollision(centerX2, centerY2, barrierWidth2, barrierHeight2);
   particles[i].display();
   
   // Remove particles that are off-screen
   if (particles[i].isOffScreen()) {
     particles.splice(i, 1);
   }
 }
}

function drawBarrier(x, y, w, h) {
  //noFill();
  //stroke(255, 100);
  //strokeWeight(2);
  //ellipse(x, y, w, h);
}

class Particle {
 constructor(x, y) {
   this.pos = createVector(x, y);
   this.vel = createVector(random(0.2, 1.0), random(-2, -0.1));
   this.acc = createVector(0, 0);
   this.size = random(4, 10);
   this.color = color(255,255,255);
   this.lifespan = 255;
   this.stopped = false;
 }
 
 update() {
  if (!this.stopped) {
   this.vel.add(this.acc);
   this.pos.add(this.vel);
   this.acc.mult(0);
  }
   this.lifespan -= 0.5;
 }
 checkBarrierCollision(centerX, centerY, w, h) {
  // Berechne die normierten Abstände
  let dx = (this.pos.x - centerX) / (w / 2);
  let dy = (this.pos.y - centerY) / (h / 2);
  
  // Prüfe auf Kollision mit der Ellipse
  if (dx * dx + dy * dy <= 1) {
    // Wir sind innerhalb der Ellipse - berechne Normalvektor
    // Skaliere entsprechend der Ellipsenform
    let nx = dx * (h / w);
    let ny = dy * (w / h);
    
    // Normalisiere den Normalvektor
    let nLength = sqrt(nx * nx + ny * ny);
    nx /= nLength;
    ny /= nLength;
    
    // Berechne Reflexion der Geschwindigkeit
    let dotProduct = this.vel.x * nx + this.vel.y * ny;
    
    // Berechne den reflektierten Geschwindigkeitsvektor
    // v' = v - 2(v·n)n
    this.vel.x = this.vel.x - 2 * dotProduct * nx;
    this.vel.y = this.vel.y - 2 * dotProduct * ny;
    
    // Optional: Verstärke Geschwindigkeit leicht, um sicherzustellen, dass die Partikel schnell wegfliegen
    this.vel.mult(1.2);
    
    // Optional: Markiere Kollisionsstelle mit kleinem Effekt
    fill(255, 200);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size * 0.8);
    
    // Verschiebe Partikel leicht nach außen, um Mehrfachkollisionen zu vermeiden
    this.pos.x += nx * 2;
    this.pos.y += ny * 2;
  }
}

 
 display() {
   noStroke();
   fill(this.color, this.lifespan);
   ellipse(this.pos.x, this.pos.y, this.size);
 }
 
 isOffScreen() {
   return (
     this.pos.x < -this.size ||
     this.pos.x > width + this.size ||
     this.pos.y < -this.size ||
     this.pos.y > height + this.size ||
     this.lifespan <= 0
   );
 }
}

