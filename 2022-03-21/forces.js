/**
 * Force class abstraction
 */
class Force {
  constructor() {}
  applyTo(pSystem) {
    if (!(pSystem instanceof ParticleSystem)) {
      throw "pSystem not instance of ParticleSystem";
    }
  }
}

/**
 * A constant gravity force
 */
class GravityForce extends Force {
  constructor(g) {
    super();
    this.force = g;
  }

  applyTo(pSystem) {
    super.applyTo(pSystem);
    const particles = pSystem.particles;
    // Clear forces
    for (const particle of particles) {
      const mass = particle.mass;
      particle.applyForce(new Vec2(0, this.g * mass));
    }
  }
}
