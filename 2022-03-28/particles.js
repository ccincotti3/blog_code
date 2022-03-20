/**
 * Particle class which lives within a particle system
 */
class Particle {
  #f = new Vec2(0, 0); // force
  #dragging = false; // boolean describing if a particle is being dragged

  // Store an offset to use when updating the position on drag so center of circle
  // is not drawn where mouse is located.
  #draggingPositionOffset = new Vec2(0, 0);
  constructor(mass, position, staticNode) {
    if (!(position instanceof Vec2)) {
      throw "x not instance of Vec2";
    }
    this.mass = mass;
    this.position = position;
    this.velocity = new Vec2(0, 0);
    this.static = staticNode;
    this.damping = 0.98;
    this.radius = 25;
  }

  get f() {
    return this.#f;
  }

  get isDragging() {
    return this.#dragging;
  }

  /**
   * @param {boolean} isDragging
   */
  set isDragging(isDragging) {
    this.#dragging = isDragging;
  }

  applyForce(f) {
    if (this.#dragging) return;
    this.#f.x += f.x;
    this.#f.y += f.y;
  }

  clearForceAccumulator() {
    this.#f.x = 0;
    this.#f.y = 0;
  }

  draw(ctx) {
    drawCircle(
      ctx,
      this.position.x,
      this.position.y,
      this.radius,
      "red",
      "black",
      1
    );
  }

  drag(/*Vec2 */ mousePos) {
    this.position.copy(mousePos).sub(this.#draggingPositionOffset);
  }

  wasMouseOver(/*Vec2*/ clickPos) {
    if (!this.#dragging) {
      this.#draggingPositionOffset = clickPos.clone().sub(this.position);
    }
    const distance = this.#draggingPositionOffset.magnitude();
    if (distance < this.radius) {
      return true;
    }

    return false;
  }
}

/**
 * ParticleSystem maintains particles and forces within a system.
 */
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.forces = [];
    this.springs = [];
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
    particles.forEach((p) => {
      this.particles.push(p);
    });
  }

  /**
   * Add spring and force to system
   * @param {Spring[]} springs
   */
  addSprings(springs) {
    springs.forEach((s) => {
      this.springs.push(s);
      this.addForce(new SpringForce(s));
    });
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
