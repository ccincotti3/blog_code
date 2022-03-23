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
const startParticleSimulation = (ctx, particleSystem, drawCb) => {
  let deltaTs = 0;
  let lastElapsedTs = 0;

  // Calculate new positions, then draw frame
  const run = (currentElapsedTs) => {
    clearCanvas(ctx);

    // Store deltaTs, as that acts as our step time
    deltaTs = (currentElapsedTs - lastElapsedTs) / 100;
    lastElapsedTs = currentElapsedTs;

    // Solve the system, then draw it.
    particleSystem.solve(deltaTs);
    particleSystem.draw(ctx);

    if (drawCb) {
      drawCb();
    }
    // Loop back
    requestAnimationFrame(run);
  };

  requestAnimationFrame(run);
};
