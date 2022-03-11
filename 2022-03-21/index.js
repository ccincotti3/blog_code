/**
 * Particle Simulations in Canvas - Part 1
 * by Carmen Cincotti, carmencincotti.com
 * March 11th, 2022
 */

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
    const canvas = document.getElementById("container")
    const ctx = canvas.getContext("2d")

    const animate = (elaspedTs) => {
        clearCanvas(ctx)
        drawGrid(ctx)
        ctx.save()

        // circle params
        const velocity = .5
        const radius = 25
        const diameter = radius * 2

        // Force stop at bottom (atleast until we have some sort of collision bounce)
        const translateY = Math.min(elaspedTs * velocity, ctx.canvas.height - diameter)
        ctx.translate(0, translateY)
        drawCircle(ctx, 50, 25, 25, 'red', 'black', 1)
        ctx.restore()
        requestAnimationFrame(animate)
    }

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    drawCircle(ctx, 50, 50, 25, 'red', 'black', 1)
    drawGrid(ctx)

    animate()
}

main()

