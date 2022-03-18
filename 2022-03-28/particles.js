/**
 * Particle class which lives within a particle system
 */
class Particle {
  #f = new Vec2(0, 0); // force
  constructor(mass, position) {
    if (!(position instanceof Vec2)) {
      throw "x not instance of Vec2";
    }
    this.mass = mass;
    this.position = position;
    this.velocity = new Vec2(0, 0);
  }

  get f() {
    return this.#f;
  }

  applyForce(f) {
    this.#f.x += f.x;
    this.#f.y += f.y;
  }

  clearForceAccumulator() {
    this.#f.x = 0;
    this.#f.y = 0;
  }

  draw(ctx) {
    drawCircle(ctx, this.position.x, this.position.y, 25, "red", "black", 1);
  }
}

/**
 * ParticleSystem maintains particles and forces within a system.
 */
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.forces = [];
    this.time = undefined;
  }

  get nparticles() {
    return this.particles.length;
  }

  get nforces() {
    return this.forces.length;
  }

  /**
   * Add particle to system
   * @param {Vec2} position
   */
  addParticle(position) {
    this.particles.push(new Particle(1, position));
  }

  /**
   * Add force to system
   * @param {Vec2} force
   */
  addForce(force) {
    if (!(force instanceof Force)) {
      throw "Cannot addForce. Please use a real force";
    }

    this.forces.push(force);
  }

  /**
   * Draw all the particles in the system
   * @param {CanvasContext2D} ctx
   */
  draw(ctx) {
    this.particles.forEach((p) => p.draw(ctx));
  }

  /**
   * Solve the particle system, which updates all the particles's position
   * @param {number} deltaTs
   */
  solve(deltaTs) {
    // Clear force accumulators on all particles
    for (const particle of this.particles) {
      particle.clearForceAccumulator();
    }

    // Apply all the forces on all the particles
    this.forces.forEach((f) => {
      f.applyTo(this);
    });

    // Update particles velocity and positions given that now we know the acceleration
    // by way of force / mass: a = F / m
    this.particles.forEach((p) => {
      EulerStep(p, deltaTs);

      // verify values for debugging purposes
      if (p.f.some((val) => isNaN(val))) {
        throw "Force is not a number";
      }
      if (p.velocity.some((val) => isNaN(val))) {
        throw "Velocity is not a number";
      }
      if (p.position.some((val) => isNaN(val))) {
        throw "Position is not a number";
      }
    });
  }
}
