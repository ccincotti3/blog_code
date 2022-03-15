/**
 * Particle class which lives within a particle system
 */
class Particle {
    #f = new Vec2(0, 0) // force
    constructor(mass, position) {
        if (!(position instanceof Vec2)) {
            throw ("x not instance of Vec2")
        }
        this.mass = mass;
        this.position = position;
        this.velocity = new Vec2(0, 0)
    }

    get f() {
        return this.#f
    }

    applyForce(f) {
        this.#f.x += f.x
        this.#f.y += f.y
    }

    clearForceAccumulator() {
        this.#f.x = 0
        this.#f.y = 0
    }

    draw(ctx) {
        drawCircle(ctx, this.position.x, this.position.y, 25, 'red', 'black', 1)
    }
}

class ParticleSystem {
    constructor() {
        this.particles = []
        this.forces = []
        this.time = undefined
    }

    get nparticles() {
        return this.particles.length
    }

    get nforces() {
        return this.forces.length
    }

    addParticle(position) {
        this.particles.push(new Particle(
            1, position
        ))
    }

    addForce(force) {
        if (!(force instanceof Force)) {
            throw ("Cannot addForce. Please use a real force")
        }

        this.forces.push(force)
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx))
    }

    solve(deltaTs) {
        // Clear forces
        for (const particle of this.particles) {
            particle.clearForceAccumulator()
        }

        this.forces.forEach(f => {
            f.applyTo(this)
        })

        this.particles.forEach((p) => {
            // Calculate acceleration step
            const accelerationStep = new Vec2(0,0)
            p.f.divideScalar(p.mass, accelerationStep)
            accelerationStep.multiplyScalar(deltaTs, accelerationStep)

            p.velocity.add(accelerationStep, p.velocity)

            // Calculate velocty step
            const velocityStep = p.velocity.clone()
            velocityStep.multiplyScalar(deltaTs, velocityStep)
            p.position.add(velocityStep, p.position)
        })

    }
}

