/**
 * Object class abstraction for objects in system (particles, springs)
 */
class Object {
  constructor() {
    this.id = String(Math.floor(Math.random() * 100000)); // We risk collisions here
  }
}
