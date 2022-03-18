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
  constructor(particleOne, particleTwo, restLength, kSpring, kDamping) {
    super();
    this.ks = kSpring;
    this.kd = kDamping;
    this.p1 = particleOne;
    this.p2 = particleTwo;
    this.r = restLength;
  }

  applyTo(_pSystem) {
    const calculateForce = () => {
      // Find distance between particles, save in l
      const l = new Vec2(0, 0);
      this.p1.position.sub(this.p2.position, l);

      const l_magnitude = l.magnitude();

      // Find the time derivative of l (or p1.velocity - p2.velocity)
      const l_prime = new Vec2(0, 0);
      this.p1.velocity.sub(this.p2.velocity, l_prime);

      // Calculate spring force magnitude ks * (|l| - r)
      // The spring force magnitude is proportional to the actual length and resting length
      const springForceMagnitude = this.ks * (l_magnitude - this.r);

      // Calculate damping force magnitude kd * ((l_prime * l) / l_magnitude)
      const l_dot = l_prime.dot(l);
      const dampingForceMagnitude = this.kd * (l_dot / l_magnitude);

      // Calculate final force vector
      // fa = − [springForceMag + dampingForceMag] * (l / |l|)
      const p1Force = new Vec2(0, 0);
      l.divideScalar(l_magnitude, p1Force);
      p1Force.multiplyScalar(
        -1 * (springForceMagnitude + dampingForceMagnitude),
        p1Force
      );
      debugger
      return p1Force
    };
    const f1 = calculateForce()
    this.p1.applyForce(f1)

    const f2 = f1.clone()
    this.p2.applyForce(f2.multiplyScalar(-1, f2))
    console.log(f1, f2)
  }
}
