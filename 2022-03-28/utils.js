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

  copy(vec) {
    this.x = vec.x;
    this.y = vec.y;
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
  const circle = new Path2D();
  circle.arc(x, y, radius, 0, 2 * Math.PI);

  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  ctx.stroke(circle);
  ctx.fill(circle);
  return circle;
}

/**
 * Helper function to draw lines between springs
 * @param {Canvas2DContext} ctx
 * @param {Vec2} p1Pos
 * @param {Vec2} p2Pos
 */
function drawSpring(ctx, p1Pos, p2Pos) {
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(p1Pos.x, p1Pos.y);
  ctx.lineTo(p2Pos.x, p2Pos.y);
  ctx.stroke();
}

/**
 * Helper function to clear canvas
 * @param {Canvas2DContext} ctx
 */
const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.moveTo(0, 0);
};

/**
 * Helper function to return mouse location on canvas element
 * @param {Canvas2DContext} canvas
 * @param {Event} event
 * @returns Vec2
 */
const getCursorPosition = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  return new Vec2(event.clientX - rect.x, event.clientY - rect.y);
};
