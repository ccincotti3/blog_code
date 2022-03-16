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
  particleSystem.addParticle(new Vec2(50, 25));
  particleSystem.addForce(new GravityForce(0.000981));

  canvas.addEventListener("click", (event) => {
    particleSystem.addParticle(new Vec2(event.clientX, event.clientY));
  });

  let deltaTs = 0;
  let lastTs = 0;

  // Calculate new positions, then draw frame
  const run = (elapsedTs) => {
    unimportantCanvasDrawStuff(ctx);

    // Store deltaTs, as that acts as our step time
    deltaTs = elapsedTs - lastTs;
    lastTs = elapsedTs;

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
