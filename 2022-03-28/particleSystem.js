/**
 * ParticleSystem maintains particles and forces within a system.
 */
class ParticleSystem {
  #springs = [];
  #particles = [];
  #forces = [];
  constructor(particles, springs, additionalForces) {
    this.#particles = particles;
    this.#forces = additionalForces;
    this.addSprings(springs);
  }

  get forces() {
    return this.#forces;
  }

  get particles() {
    return this.#particles;
  }

  get springs() {
    return this.#springs;
  }

  get nparticles() {
    return this.particles.length;
  }

  get nforces() {
    return this.forces.length;
  }

  /**
   * Add particles to system
   * @param {Particle[]} particles
   */
  addParticles(particles) {
    this.#particles = this.#particles.concat(particles);
  }

  /**
   * Add spring and force to system
   * @param {Spring[]} springs
   */
  addSprings(springs) {
    springs.forEach((s) => {
      this.#springs.push(s);
      this.addForce(new SpringForce(s));
    });
  }

  addGlobalForces(forces) {
    this.#forces = this.#forces.concat(forces);
  }

  /**
   * Add force to system
   * @param {Force[]} force
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
    this.springs.forEach((s) => s.draw(ctx));
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
