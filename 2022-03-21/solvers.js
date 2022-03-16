/**
 * Given a particle and a time step, this function updates the given particles
 * position and velocity properties determined by taking a EulerStep
 *
 * @param {Particle} p
 * @param {number} deltaTs
 */
function EulerStep(p, deltaTs) {
  // Calculate acceleration step
  const accelerationStep = new Vec2(0, 0);
  p.f.divideScalar(p.mass, accelerationStep); // F / m
  accelerationStep.multiplyScalar(deltaTs, accelerationStep);

  p.velocity.add(accelerationStep, p.velocity);

  // Calculate velocity step
  const velocityStep = p.velocity.clone();
  velocityStep.multiplyScalar(deltaTs, velocityStep);
  p.position.add(velocityStep, p.position);
}
