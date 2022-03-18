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
  const p1 = new Particle(1, new Vec2(200, 805), false);
  const p2 = new Particle(1, new Vec2(300, 405), false);
  const p3 = new Particle(1, new Vec2(300, 25), true);
  particleSystem.addParticle(p1);
  particleSystem.addParticle(p2);
  particleSystem.addParticle(p3);

  const spring = new Spring(
    p1, p2, 200, 5, 5
  ) 
  const spring2 = new Spring(
    p2, p3, 200, 5, 5
  ) 
  particleSystem.addSpring(spring)
  particleSystem.addSpring(spring2)
  particleSystem.addForce(new SpringForce(spring))
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
    deltaTs = (currentElapsedTs - lastElapsedTs) / 1000;
    // deltaTs = 0.5; 
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
