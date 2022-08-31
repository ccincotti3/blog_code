const TIME_STEP = 0.01; // Hard code for now
const STEPS = 1; // number of substeps

const particles = [
  {
    m: 1, // mass
    w: 1, // hard code mass inverse
    x: [2, 2, 0], // position
    p: [2, 2, 0], // temp position
    f: [0, 0, 0], // force
    v: [0, 0, 0], // velocity
  },
  {
    m: 1,
    w: 1,
    x: [-2, -2, 0],
    p: [-2, -2, 0],
    v: [0, 0, 0],
    f: [0, 0, 0],
  },
];

const printParticlePos = () => {
  console.log(
    "POSITION P1: ",
    particles[0].x.map((l) => l.toFixed(4)),
    "\nPOSITION P2: ",
    particles[1].x.map((l) => l.toFixed(4))
  );
};

const vecScale = (a, s) => {
  return a.map((el) => el * s);
};

const vecAdd = (a, b) => {
  const out = [];

  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];

  return out;
};

const vecSub = (a, b) => {
  const out = [];
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];

  return out;
};

const distanceConstraint = (compliance, dt) => {
  const alpha = compliance / dt / dt;

  const [p0, p1] = particles;
  const w = p0.w + p1.w;

  // Init the gradient vector as the distance vector from p1 towards p0.
  const grad = [p0.p[0] - p1.p[0], p0.p[1] - p1.p[1], p0.p[2] - p1.p[2]];

  // Get length of the grad vector before normalization
  const length = Math.sqrt(grad[0] ** 2 + grad[1] ** 2 + grad[2] ** 2);

  // Normalize gradient vector to just the direction
  grad[0] /= length;
  grad[1] /= length;
  grad[2] /= length;

  const restLen = 1; // hard code rest length
  const C = length - restLen; // calculate the current constraint value

  // Recall that we do not need the gradient here because ∇CᵀC = 1 here
  // due to the fact that the gradient has been normalized.
  const deltaLagrangianMultiplier = -C / (w + alpha);

  // Update positions
  p0.p[0] += grad[0] * deltaLagrangianMultiplier * p0.w;
  p0.p[1] += grad[1] * deltaLagrangianMultiplier * p0.w;
  p0.p[2] += grad[2] * deltaLagrangianMultiplier * p0.w;

  p1.p[0] += grad[0] * -deltaLagrangianMultiplier * p1.w;
  p1.p[1] += grad[1] * -deltaLagrangianMultiplier * p1.w;
  p1.p[2] += grad[2] * -deltaLagrangianMultiplier * p1.w;
};

console.log("BEFORE APPLYING XPBD LOOP");
console.log("-------------------------");
printParticlePos();
for (let i = 0; i < STEPS; i++) {
  // Calculate velocity
  for (const particle of particles) {
    particle.v = vecAdd(
      particle.v,
      vecScale(particle.f, (TIME_STEP / STEPS) * particle.w)
    );
  }

  // Calculate predicted position
  for (const particle of particles) {
    particle.p = vecAdd(particle.x, vecScale(particle.v, TIME_STEP / STEPS));
  }

  distanceConstraint(0.01, 1 / 60);

  // Update positions
  for (const particle of particles) {
    particle.v = vecScale(
      vecSub(particle.p, particle.x),
      1.0 / (TIME_STEP / STEPS)
    );
    particle.x = particle.p;
  }
}

console.log("\nAFTER APPLYING XPBD LOOP");
console.log("------------------------");
printParticlePos();
