class Spring extends Object {
  constructor(particleOne, particleTwo, restLength, kSpring, kDamping) {
    super();
    this.ks = kSpring;
    this.kd = kDamping;
    this.p1 = particleOne;
    this.p2 = particleTwo;
    this.r = restLength;
  }

  draw(ctx) {
    drawSpring(ctx, this.p1.position, this.p2.position);
  }
}
