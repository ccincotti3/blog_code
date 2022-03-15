/**
 * Vec2 utility class
 */
class Vec2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    divide(rightHand, target) {
        target.x = this.x / rightHand.x
        target.y = this.y / rightHand.y
    }

    add(rightHand, target) {
        target.x = this.x + rightHand.x
        target.y = this.y + rightHand.y
    }
    sub(rightHand, target) {
        target.x = this.x - rightHand.x
        target.y = this.y - rightHand.y
    }

    addScalar(scalar, target) {
        target.x = this.x + scalar
        target.y = this.y + scalar
    }
    multiplyScalar(scalar, target) {
        target.x = this.x * scalar
        target.y = this.y * scalar
    }

    divideScalar(scalar, target) {
        target.x = this.x / scalar
        target.y = this.y / scalar
    }

    clone() {
        return new Vec2(this.x, this.y)
    }
}

/**
 * Helper function to draw circle on canvas
 * @param {Canvas2DContext} ctx 
 * @param {number} x 
 * @param {number} y 
 * @param {number} radius 
 * @param {string} fill 
 * @param {string} stroke 
 * @param {number} strokeWidth 
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

/**
 * Helper function to draw grid on canvas
 * @param {Canvas2DContext} ctx 
 */
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

/**
 * Where all draw calls are done to set up canvas in animation loop
 * @param {Canvas2DContext} ctx 
 */
function unimportantCanvasDrawStuff(ctx) {
    clearCanvas(ctx)
    drawGrid(ctx)
}