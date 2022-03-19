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
      if (!particle.static) {
        const mass = particle.mass;
        particle.applyForce(new Vec2(0, this.g * mass));
      }
    }
  }
}

/**
 * A spring force between two particles
 */
class SpringForce extends Force {
  constructor(spring) {
    super();
    this.spring = spring;
  }

  applyTo(_pSystem) {
    const { p1, p2, ks, kd, r } = this.spring;
    const calculateForce = () => {
      // Vector pointing from particle 2 to particle 1
      const l = p1.position.clone().sub(p2.position);

      // distance between particles
      const distance = l.magnitude();

      // Find the time derivative of l (or p1.velocity - p2.velocity)
      const l_prime = p1.velocity.clone().sub(p2.velocity);

      // Calculate spring force magnitude ks * (|l| - r)
      // The spring force magnitude is proportional to the actual length and resting length
      const springForceMagnitude = ks * (distance - r);

      // Calculate damping force magnitude kd * ((l_prime * l) / l_magnitude)
      const l_dot = l_prime.dot(l);
      const dampingForceMagnitude = kd * (l_dot / distance);

      // Calculate final force vector
      // fa = − [springForceMag + dampingForceMag] * (l / |l|)
      const direction = l.clone().normalize();
      return direction.multiplyScalar(
        -1 * (springForceMagnitude + dampingForceMagnitude)
      );
    };
    const f1 = calculateForce();
    if (!p1.static) {
      p1.applyForce(f1);
    }

    const f2 = f1.clone().multiplyScalar(-1);
    if (!p2.static) {
      p2.applyForce(f2);
    }

    console.log({ f1, f2 });
  }
}
