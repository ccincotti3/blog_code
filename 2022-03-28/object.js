class Object {
  constructor() {
    this.id = String(Math.floor(Math.random() * 100000)); // We risk collisions here
  }
}
