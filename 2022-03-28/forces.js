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
    this.g = g;
  }

  applyTo(pSystem) {
    super.applyTo(pSystem);
    const particles = pSystem.particles;

    for (const particle of particles) {
      const mass = particle.mass;
      particle.applyForce(new Vec2(0, this.g * mass));
    }
  }
}

/**
 * A spring force between two particles
 */
class SpringForce extends Force {
  constructor(particleOne, particleTwo) {
    super();
    this.p1 = particleOne;
    this.p2 = particleTwo;
  }

  applyTo(_pSystem) {
    super.applyTo(_pSystem);
    // const particles = pSystem.particles;

    // for (const particle of particles) {
    //   const mass = particle.mass;
    //   particle.applyForce(new Vec2(0, this.g * mass));
    // }
  }
}
