/**
 * Given a particle and a time step, this function updates the given particles
 * position and velocity properties determined by taking a EulerStep
 *
 * @param {Particle} p
 * @param {number} deltaTs
 */
function EulerStep(p, deltaTs) {
  // Calculate acceleration step
  const accelerationStep = p.f
    .clone()
    .divideScalar(p.mass)
    .multiplyScalar(deltaTs); // aΔt = F / m

  p.velocity.add(accelerationStep); // vn = vo +  a*Δt
  p.velocity.multiplyScalar(p.damping);

  // Calculate velocity step
  const velocityStep = p.velocity.clone().multiplyScalar(deltaTs); // vn*Δt
  p.position.add(velocityStep); // xn = x0 + vn*Δt
}
