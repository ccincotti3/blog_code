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
const startParticleSimulation = (canvas, particles, springs) => {
  const ctx = canvas.getContext("2d");

  ctx.canvas.width = canvas.parentElement.clientWidth;
  ctx.canvas.height = canvas.parentElement.clientHeight;

  const particleSystem = new ParticleSystem();

  let addSpringMode = false;
  let springToAdd = null;

  /** * Intialize Particles and Springs */
  particleSystem.addParticles(particles);
  particleSystem.addSprings(springs);

  /** * Intialize Global forces */
  particleSystem.addForce(new GravityForce(9.81));

  let deltaTs = 0;
  let lastElapsedTs = 0;

  canvas.addEventListener("pointerdown", (event) => {
    withCursorInformation(
      event,
      canvas,
      particleSystem,
      (
        clickedParticle,
        cursorPosition,
        withShiftModifier,
        withCtrlModifier
      ) => {
        if (clickedParticle) {
          if (withShiftModifier) {
            clickedParticle.static = !clickedParticle.static;
          } else if (withCtrlModifier) {
            addSpringMode = true;
            springToAdd = new Spring(
              clickedParticle,
              new Particle(5, cursorPosition, true),
              100,
              2,
              0.5
            );
          } else clickedParticle.isDragging = true;
        } else {
          particleSystem.addParticles([new Particle(5, cursorPosition, true)]);
        }
      }
    );
  });

  canvas.addEventListener("pointerup", (event) => {
    withCursorInformation(event, canvas, particleSystem, (targetParticle) => {
      if (addSpringMode) {
        if (targetParticle) {
          springToAdd.p2 = targetParticle;
          particleSystem.addSprings([springToAdd]);
        }
      }
      particleSystem.particles.forEach((p) => (p.isDragging = false));
      addSpringMode = false;
    });
  });

  canvas.addEventListener("pointermove", (event) => {
    withCursorInformation(
      event,
      canvas,
      particleSystem,
      (_, cursorPosition) => {
        if (addSpringMode) {
          springToAdd.p2.position.copy(cursorPosition);
          return;
        }
        particleSystem.particles.forEach((p) => {
          if (p.isDragging) {
            p.drag(cursorPosition);
          }
        });
      }
    );
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

    if (addSpringMode) {
      springToAdd.draw(ctx);
    }
    // Loop back
    requestAnimationFrame(run);
  };

  requestAnimationFrame(run);
};
