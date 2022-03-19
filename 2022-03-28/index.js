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

  ctx.canvas.width = canvas.parentElement.clientWidth;
  ctx.canvas.height = canvas.parentElement.clientHeight;

  const particleSystem = new ParticleSystem();

  /** * Intialize Particles and Springs */
  const p1 = new Particle(5, new Vec2(400, 805), false);
  const p2 = new Particle(5, new Vec2(500, 805), false);
  const spring1 = new Spring(p1, p2, 100, 2, 0.5);
  const p3 = new Particle(10, new Vec2(500, 235), true);
  const spring2 = new Spring(p2, p3, 100, 2, 0.5);

  particleSystem.connect(p1, p2, spring1);
  particleSystem.connect(p2, p3, spring2);

  /** * Intialize Global forces */
  particleSystem.addForce(new GravityForce(9.81));

  let deltaTs = 0;
  let lastElapsedTs = 0;

  canvas.addEventListener("pointerdown", (event) => {
    const cursorPosition = getCursorPosition(canvas, event);
    particleSystem.particles.forEach((p) => p.checkIfClicked(cursorPosition));
  });

  canvas.addEventListener("pointerup", (event) => {
    particleSystem.particles.forEach((p) => (p.dragging = false));
  });

  canvas.addEventListener("pointermove", (event) => {
    const cursorPosition = getCursorPosition(canvas, event);
    particleSystem.particles.forEach((p) => {
      if (p.dragging) {
        p.drag(cursorPosition);
      }
    });
  });

  // Calculate new positions, then draw frame
  const run = (currentElapsedTs) => {
    clearCanvas(ctx);

    // Store deltaTs, as that acts as our step time
    deltaTs = (currentElapsedTs - lastElapsedTs) / 100;
    lastElapsedTs = currentElapsedTs;

    // Solve the system, then draw it.
    particleSystem.solve(deltaTs);
    particleSystem.draw(ctx);

    // Loop back
    requestAnimationFrame(run);
  };

  requestAnimationFrame(run);
};

main();
