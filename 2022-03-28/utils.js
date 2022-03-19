/**
 * Vec2 utility class
 *
 * There's probably a way better way to handle updating the
 * targets, but this will get us to a working Vec2 class
 * for now
 */
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  some(cb) {
    return cb(this.x) || cb(this.y);
  }

  divide(byVec) {
    this.x / byVec.x;
    this.y / byVec.y;
    return this;
  }

  add(byVec) {
    this.x += byVec.x;
    this.y += byVec.y;
    return this;
  }

  sub(byVec) {
    this.x -= byVec.x;
    this.y -= byVec.y;
    return this;
  }

  addScalar(scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  divideScalar(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  abs() {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  dot(byVec) {
    return this.x * byVec.x + this.y * byVec.y;
  }

  normalize() {
    const magnitude = this.magnitude();
    this.divideScalar(magnitude);
    return this;
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
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
  ctx.restore();
}

function drawSpring(ctx, p1Pos, p2Pos) {
  ctx.save();
  const x_diff = p2Pos.x - p1Pos.x;
  const y_diff = p2Pos.y - p1Pos.y;
  // ctx.rotate(Math.atan2(y_diff, x_diff));
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(p1Pos.x, p1Pos.y);
  // ctx.bezierCurveTo()
  ctx.lineTo(p2Pos.x, p2Pos.y);
  ctx.stroke();
  ctx.restore();
}

/**
 * Helper function to draw grid on canvas
 * @param {Canvas2DContext} ctx
 */
const drawGrid = (ctx) => {
  const s = 28;
  const pL = s;
  const pT = s;
  const pR = s;
  const pB = s;

  ctx.strokeStyle = "lightgrey";
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = pL; x <= ctx.canvas.width - pR; x += s) {
    ctx.moveTo(x, pT);
    ctx.lineTo(x, ctx.canvas.height - pB);
  }
  for (let y = pT; y <= ctx.canvas.height - pB; y += s) {
    ctx.moveTo(pL, y);
    ctx.lineTo(ctx.canvas.width - pR, y);
  }
  ctx.stroke();
};

const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

/**
 * Where all draw calls are done to set up canvas in animation loop
 * @param {Canvas2DContext} ctx
 */
function unimportantCanvasDrawStuff(ctx) {
  clearCanvas(ctx);
  drawGrid(ctx);
}
