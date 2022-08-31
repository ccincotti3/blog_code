const TIME_STEP = 0.01; // Hard code for now
const STEPS = 1; // number of substeps
const particles = [
  {
    m: 1.0, //mass
    x: [-0.9800577759742737, -1.0005555152893066, 0.0], // position
    p: [-0.9800577759742737, -1.0005555152893066, 0.0], // temp position,
    f: [0, 0, 0], // force
    v: [0, 0, 0], // velocity
    w: 0.5,
  },
  {
    m: 1.0,
    x: [-1.0000576972961426, -0.9805555939674377, 0.0],
    p: [-1.0000576972961426, -0.9805555939674377, 0.0],
    f: [0, 0, 0],
    v: [0, 0, 0],
    w: 1.0,
  },
  {
    m: 1.0,
    x: [-1.0000576972961426, -1.0005555152893066, 0.0],
    p: [-1.0000576972961426, -1.0005555152893066, 0.0],
    f: [0, 0, 0],
    v: [0, 0, 0],
    w: 1.0,
  },
  {
    m: 1.0,
    p: [-0.9800577163696289, -0.980555534362793, 0.0],
    x: [-0.9800577163696289, -0.980555534362793, 0.0],
    f: [0, 0, 0],
    v: [0, 0, 0],
    w: 1.0,
  },
];

const wMatrix = new Array(particles.length * 3);
for (let i = 0; i < particles.length * 3; i++) {
  wMatrix[i] = particles[Math.floor(i / 3)].w;
}

const printParticlePos = () => {
  console.log(
    "\n\nPOSITION P1: ",
    particles[0].x.map((l) => l.toFixed(4)),
    "\nPOSITION P2: ",
    particles[1].x.map((l) => l.toFixed(4)),
    "\nPOSITION P3: ",
    particles[2].x.map((l) => l.toFixed(4)),
    "\nPOSITION P4: ",
    particles[3].x.map((l) => l.toFixed(4))
  );

  console.log(
    "\n\nVELOCITY P1: ",
    particles[0].v.map((l) => l.toFixed(4)),
    "\nVELOCITY P2: ",
    particles[1].v.map((l) => l.toFixed(4)),
    "\nVELOCITY P3: ",
    particles[2].v.map((l) => l.toFixed(4)),
    "\nVELOCITY P4: ",
    particles[3].v.map((l) => l.toFixed(4))
  );
};

const vecAdd = (a, b) => {
  const out = [];

  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];

  return out;
};

const vecScale = (a, s) => {
  return a.map((el) => el * s);
};

const matrixScale = (a, s) => {
  return a.map((arr) => {
    return vecScale(arr, s);
  });
};

const vecSub = (a, b) => {
  const out = [];
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];

  return out;
};

const vecDot = (a, b) => {
  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }

  return sum;
};

const vecCross = (a, b) => {
  const out = [];
  out[0] = a[1] * b[2] - a[2] * b[1];
  out[1] = a[2] * b[0] - a[0] * b[2];
  out[2] = a[0] * b[1] - a[1] * b[0];
  return out;
};

const vecNorm = (a) => {
  return Math.sqrt(a.reduce((prev, curr) => prev + curr ** 2, 0));
};

const cotTheta = (a, b) => {
  const cosTheta = vecDot(a, b);
  const cross = vecCross(a, b);
  const sinTheta = vecNorm(cross);

  return cosTheta / sinTheta;
};

const multiply4dColumnVectorByTranspose = (a) => {
  const out = [[], [], [], []];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[i][j] = a[i] * a[j];
    }
  }

  return out;
};

const vecScalarWiseMultiply = (a, b) => {
  const out = [];
  for (let i = 0; i < a.length; i++) {
    out[i] = a[i] * b[i];
  }

  return out;
};

function transpose(a) {
  return Object.keys(a[0]).map(function (c) {
    return a.map(function (r) {
      return r[c];
    });
  });
}

const initBendingConstraint = () => {
  const x_0 = particles[0].p;
  const x_1 = particles[1].p;
  const x_2 = particles[2].p;
  const x_3 = particles[3].p;

  const e0 = vecSub(x_1, x_0);
  const e1 = vecSub(x_2, x_1);
  const e2 = vecSub(x_0, x_2);
  const e3 = vecSub(x_3, x_0);
  const e4 = vecSub(x_1, x_3);

  const cot01 = cotTheta(e0, vecScale(e1, -1));
  const cot02 = cotTheta(e0, vecScale(e2, -1));
  const cot03 = cotTheta(e0, e3);
  const cot04 = cotTheta(e0, e4);

  const K = [
    [cot01 + cot04],
    [cot02 + cot03],
    [-cot01 - cot02],
    [-cot03 - cot04],
  ];

  const A0 = 0.5 * vecNorm(vecCross(e0, e1));
  const A1 = 0.5 * vecNorm(vecCross(e0, e3));

  const Q = matrixScale(multiply4dColumnVectorByTranspose(K), 3.0 / (A0 + A1));

  console.log(multiply4dColumnVectorByTranspose(K));

  return Q;
};

const calculateConstraintValue = (Q) => {
  let sum = 0;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const sumC = vecDot(particles[i].p, particles[j].p);
      console.log("Q", Q[i][j]);
      console.log("SUMC", sumC);
      sum += Q[i][j] * vecDot(particles[i].p, particles[j].p);
      console.log("SUM", sum);
    }
  }
  console.log(sum);
  return 0.5 * sum;
};

const calculateGrad = (Q) => {
  const grad = [];
  for (let i = 0; i < 4; i++) {
    let sum = [0, 0, 0];
    for (let j = 0; j < 4; j++) {
      sum = vecAdd(sum, vecScale(particles[j].p, Q[i][j]));
    }

    grad[i] = sum;
  }

  return grad;
};

const bendingConstraint = (compliance, dt, Q) => {
  const alpha = compliance / (dt * dt);

  const [p0, p1, p2, p3] = particles;

  const C = calculateConstraintValue(Q); // calculate the current constraint value
  console.log(C);

  const grad = calculateGrad(Q).flat();
  // Stop if constraint value is extremely small
  if (vecNorm(grad) < 1e-12) {
    return;
  }
  console.log(grad);
  const deltaLagrangianMultiplier =
    -C / (vecDot(vecScalarWiseMultiply(grad, wMatrix), grad) + alpha);
  const deltaX = vecScalarWiseMultiply(
    vecScale(wMatrix, deltaLagrangianMultiplier),
    grad
  );

  // Update positions
  p0.p[0] += deltaX[0];
  p0.p[1] += deltaX[1];
  p0.p[2] += deltaX[2];

  p1.p[0] += deltaX[3];
  p1.p[1] += deltaX[4];
  p1.p[2] += deltaX[5];

  p2.p[0] += deltaX[6];
  p2.p[1] += deltaX[7];
  p2.p[2] += deltaX[8];

  p3.p[0] += deltaX[9];
  p3.p[1] += deltaX[10];
  p3.p[2] += deltaX[11];
};

const Q = initBendingConstraint();

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

  bendingConstraint(0, 1 / 60, Q);

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
