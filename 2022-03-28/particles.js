/**
 * Particle class which lives within a particle system
 */
class Particle extends Object {
  #f = new Vec2(0, 0); // force
  #dragging = false; // boolean describing if a particle is being dragged

  // Store an offset to use when updating the position on drag so center of circle
  // is not drawn where mouse is located.
  #draggingPositionOffset = new Vec2(0, 0);
  constructor(mass, position, staticNode) {
    super();
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
      this.static ? "gray" : "red",
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
