/**
 * Particle Simulations in Canvas - Part 1
 * by Carmen Cincotti, carmencincotti.com
 * March 11th, 2022
 */

class Vec2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
}

class Force {
    constructor() {}
    applyTo(pSystem) {
        if(!(pSystem instanceof ParticleSystem)) {
            throw("pSystem not instance of ParticleSystem")
        }
    }
}

class GravityForce extends Force {
    constructor(g) {
       super()
       this.g = g 
    }

    applyTo(pSystem) {
        super.applyTo(pSystem)
        const particles = pSystem.particles
        // Clear forces
        for(const particle of particles) {
            const mass = particle.m
            particle.applyForce(new Vec2(0, this.g * mass))
        }
    }
}

class Particle {
    #f = new Vec2(0, 0)
    constructor(m, x) {
        if(!(x instanceof Vec2)) {
            throw("x not instance of Vec2")
        }
        this.m = m;
        this.x = x; 
        this.v = new Vec2(0, 0)
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
        // circle params
        // const velocity = .001
        // const radius = 25
        // const diameter = radius * 2
        // const acceleration = (elapsedTs * velocity) 
        // this.x.y = this.x.y + acceleration

        // Force stop at bottom (atleast until we have some sort of collision bounce)
        // const translateY = Math.min(this.x.y, ctx.canvas.height - diameter)
        // ctx.translate(0, translateY)
        drawCircle(ctx, this.x.x, this.x.y, 25, 'red', 'black', 1)
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
        if(!(force instanceof Force)) {
            throw("Cannot addForce. Please use a real force")
        }

        this.forces.push(force)
    }

    draw(ctx) {
        this.particles.forEach(p => p.draw(ctx))
    }

    solve(deltaTs) {
        // Clear forces
        for(const particle of this.particles) {
            particle.clearForceAccumulator()
        }

        this.forces.forEach(f => {
            f.applyTo(this)
        })

        this.particles.forEach((p) => {
            // v, m, f, x
            // we know f, m, last v, last x
            const a = new Vec2(
                p.f.x / p.m,
                p.f.y / p.m
            )

            p.v.x = p.v.x + a.x * deltaTs
            p.v.y = p.v.y + a.y * deltaTs

            p.x.x = p.x.x + p.v.x * deltaTs
            p.x.y = p.x.y + p.v.y * deltaTs
        })

    }
}



function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    if (fill) {
        ctx.fillStyle = fill
        ctx.fill()
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth
        ctx.strokeStyle = stroke
        ctx.stroke()
    }
}

const drawGrid = (ctx) => {
    const s = 28
    const pL = s
    const pT = s
    const pR = s
    const pB = s

    ctx.strokeStyle = 'lightgrey'
    ctx.lineWidth = 1;
    ctx.beginPath()
    for (let x = pL; x <= ctx.canvas.width - pR; x += s) {
        ctx.moveTo(x, pT)
        ctx.lineTo(x, ctx.canvas.height - pB)
    }
    for (let y = pT; y <= ctx.canvas.height - pB; y += s) {
        ctx.moveTo(pL, y)
        ctx.lineTo(ctx.canvas.width - pR, y)
    }
    ctx.stroke()
}

const clearCanvas = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

const main = () => {
    let deltaTs = 0;
    let lastTs = 0;
    const canvas = document.getElementById("container")
    const ctx = canvas.getContext("2d")
    const particleSystem = new ParticleSystem()

    particleSystem.addParticle(new Vec2(50, 25))
    particleSystem.addForce(new GravityForce(.000981))

    const animate = (elapsedTs) => {
        clearCanvas(ctx)
        drawGrid(ctx)
        ctx.save()

        deltaTs = elapsedTs - lastTs
        lastTs = elapsedTs

        particleSystem.solve(deltaTs)
        particleSystem.draw(ctx)
        // console.log(particleSystem)
        ctx.restore()
        requestAnimationFrame(animate)
    }

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    drawGrid(ctx)

    requestAnimationFrame(animate)
}

main()


const solve = (pSystem, deltaT) => {
    // void EulerStep(ParticleSystem p, float DeltaT){
    // ParticleDeriv(p,temp1); /* get deriv */
    // ScaleVector(temp1,DeltaT) /* scale it */
    // ParticleGetState(p,temp2); /* get state */
    // AddVectors(temp1,temp2,temp2); /* add -> temp2 */
    // ParticleSetState(p,temp2); /* update state */
    // p->t += DeltaT; /* update time */
    // }


    // Get/set derivatives
    const particles = pSystem.particles
    const forces = pSystem.forces

    const derivatives = new Array(numParticles)

    // Clear forces
    for(const particle of particles) {
        particle.clearForceAccumulator()
    }

    // Compute forces
    for(const force of forces) {
        force.applyForce(pSystem)
    }

    // for(const [i, particle] of particles.entries()) {
    //     // Compute forces
    //     derivatives[i] = {
    //         x_dot: particle.v,
    //         v_dot: particle.f, // assuming mass = 1
    //     }
    // }
}