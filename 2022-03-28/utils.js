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

function drawSpring(ctx, p1Pos, p2Pos) {
  const x_diff = p2Pos.x - p1Pos.x;
  const y_diff = p2Pos.y - p1Pos.y;
  // ctx.rotate(Math.atan2(y_diff, x_diff));
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(p1Pos.x, p1Pos.y);
  // ctx.bezierCurveTo()
  ctx.lineTo(p2Pos.x, p2Pos.y);
  ctx.stroke();
}

const clearCanvas = (ctx) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.moveTo(0, 0);
};

const getCursorPosition = (canvas, event) => {
  const rect = canvas.getBoundingClientRect();
  return new Vec2(event.clientX - rect.x, event.clientY - rect.y);
};

const withCursorInformation = (event, canvas, particleSystem, cb) => {
  const cursorPosition = getCursorPosition(canvas, event);
  const withShiftModifier = event.shiftKey;
  const withCtrlModifier = event.ctrlKey;
  const mousedOverParticle = particleSystem.particles.find((p) =>
    p.wasMouseOver(cursorPosition)
  );
  return cb(
    mousedOverParticle,
    cursorPosition,
    withShiftModifier,
    withCtrlModifier
  );
};
