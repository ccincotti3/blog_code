/**
 * Particle Simulations in Canvas - Part 1
 * by Carmen Cincotti, carmencincotti.com
 * March 21th, 2022
 */

/**
 * Entry function that when called initializes the particle system
 * Also runs the main animation loop, thus this function never terminates
 * unless an error is thrown.
 */
const main = () => {
  const canvas = document.getElementById("container");
  const ctx = canvas.getContext("2d");

  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  const particleSystem = new ParticleSystem();
  const p1 = new Particle(5, new Vec2(400, 805), false);
  particleSystem.addParticle(p1);
  const p2 = new Particle(5, new Vec2(500, 805), false);
  particleSystem.addParticle(p2);
  const spring = new Spring(
    p1, p2, 100, 5, .98
  ) 
  particleSystem.addSpring(spring)
  particleSystem.addForce(new SpringForce(spring))

  const p3 = new Particle(10, new Vec2(500, 235), true);
  particleSystem.addParticle(p3);
  const spring2 = new Spring(
    p2, p3, 100, 5, .98
  ) 
  particleSystem.addSpring(spring2)
  particleSystem.addForce(new SpringForce(spring2))

  particleSystem.addForce(new GravityForce(9.81));

  canvas.addEventListener("click", (event) => {
    particleSystem.addParticle(new Vec2(event.clientX, event.clientY));
  });

  let deltaTs = 0;
  let lastElapsedTs = 0;

  // Calculate new positions, then draw frame
  const run = (currentElapsedTs) => {
    unimportantCanvasDrawStuff(ctx);

    // Store deltaTs, as that acts as our step time
    deltaTs = (currentElapsedTs - lastElapsedTs) / 100;
    // deltaTs = 0.05; 
    lastElapsedTs = currentElapsedTs;

    // Solve the system, then draw it.
    ctx.save();
    particleSystem.solve(deltaTs);
    particleSystem.draw(ctx);
    ctx.restore();

    // Loop back
    requestAnimationFrame(run);
  };

  requestAnimationFrame(run);
};

main();
