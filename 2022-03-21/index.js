/**
 * Particle Simulations in Canvas - Part 1
 * by Carmen Cincotti, carmencincotti.com
 * March 11th, 2022
 */


/**
 * Entry function that when called initializes the particle system
 * Also runs the main animation loop, thus this function never terminates
 * unless an error is thrown.
 */
const main = () => {
    let deltaTs = 0;
    let lastTs = 0;
    const canvas = document.getElementById("container")
    const ctx = canvas.getContext("2d")

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    const particleSystem = new ParticleSystem()
    particleSystem.addParticle(new Vec2(50, 25))
    particleSystem.addParticle(new Vec2(100, 25))
    particleSystem.addForce(new GravityForce(.000981))

    const animate = (elapsedTs) => {
        clearCanvas(ctx)
        drawGrid(ctx)
        ctx.save()

        deltaTs = elapsedTs - lastTs
        lastTs = elapsedTs

        particleSystem.solve(deltaTs)
        particleSystem.draw(ctx)
        ctx.restore()
        requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
}

main()
