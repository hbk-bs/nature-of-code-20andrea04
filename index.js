let particles = [];
let barrierRadius;

function setup(){
  const canvas = createCanvas(400,400);
  canvas.parent("sketch");
  background("black");
  barrierRadius = width * 0.4;
}

function draw() {
 // Add semi-transparent background for trail effect
 background(0, 20);

 drawBarrier();
  
 // Add new particles occasionally
 if (random(1) < 0.5) {

  const startX = random (0, width/4);
   particles.push(new Particle(startX, height));
 }
 
 // Update and display all particles
 for (let i = particles.length - 1; i >= 0; i--) {
   particles[i].update();

   particles[i].checkBarrierCollision();

   particles[i].display();
   
   // Remove particles that are off-screen
   if (particles[i].isOffScreen()) {
     particles.splice(i, 1);
   }
 }
}

function drawBarrier() {
    // Verschiebe das Zentrum des Halbkreises in Richtung der oberen rechten Ecke
    let centerX = width * 0.7;   // Weiter nach rechts (von 0.5 auf 0.7)
    let centerY = height * 0.3;  // Weiter nach oben (von 0.5 auf 0.3)
  
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

 checkBarrierCollision() {
  // Berechne die Distanz vom Partikelmittelpunkt zum Zentrum der Barriere
  let centerX = width * 0.7;
  let centerY = height * 0.3;
  let d = dist(this.pos.x, this.pos.y, centerX, centerY);
  
  // Überprüfe, ob das Partikel in Kontakt mit der Barriere ist
  // und ob es sich im unteren Halbkreis befindet (y > centerY)
  if (d <= barrierRadius && this.pos.y > centerY) {
   // Partikel soll sofort verschwinden, setze Lebensdauer auf 0
   this.lifespan = 0;
    
    // Optional: Zeichne einen kleinen Lichteffekt an der Kollisionsstelle
    fill(255, 255, 255, 100);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.size * 1.5);
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
