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
  const p1 = particleSystem.addParticle(new Vec2(50, 25));
  const p2 = particleSystem.addParticle(new Vec2(50, 405));
  particleSystem.addForce(new SpringForce(
    p1, p2, 200, 0.1, .1)
  )
  // particleSystem.addForce(new GravityForce(0.000981));

  canvas.addEventListener("click", (event) => {
    particleSystem.addParticle(new Vec2(event.clientX, event.clientY));
  });

  let deltaTs = 0;
  let lastElapsedTs = 0;

  // Calculate new positions, then draw frame
  const run = (currentElapsedTs) => {
    unimportantCanvasDrawStuff(ctx);

    // Store deltaTs, as that acts as our step time
    // deltaTs = (currentElapsedTs - lastElapsedTs) / 1000;
    deltaTs = 0.5; 
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
