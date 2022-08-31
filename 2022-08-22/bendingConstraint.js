const particles = [
  {
    m: 1.0, //mass
    x: [-0.98, -1.0, 0.0], // position
    p: [-0.98, -1.0, 0.0], // temp position,
    f: [0, 0, 0], // force
    v: [0, 0, 0], // velocity
    w: 1.0,
  },
  {
    m: 1.0,
    x: [-1.0, -0.98, 0.0],
    p: [-1.0, -0.98, 0.0],
    f: [0, 0, 0],
    v: [0, 0, 0],
    w: 1.0,
  },
  {
    m: 1.0,
    x: [-1.0, -1.0, 0.0],
    p: [-1.0, -1.0, 0.0],
    f: [0, 0, 0],
    v: [0, 0, 0],
    w: 1.0,
  },
  {
    m: 1.0,
    p: [-0.98, -0.98, 0.0],
    x: [-0.98, -0.98, 0.0],
    f: [0, 0, 0],
    v: [0, 0, 0],
    w: 1.0,
  },
];

// Update the positions of the unshared vertices in a configuration of two
// adjacent triangles like so

//     id2
//    /   \
//   /     \
// id0 --- id1
//   \     /
//    \   /
//     id3

const bendingConstraint = (compliance, dt) => {
  const alpha = compliance / dt / dt;

  const [_p1, p2, p3, _p4] = particles;
  const w = p2.w + p3.w;

  // Init the gradient vector as the distance vector from p3 towards p2.
  const grad = [p2.p[0] - p3.p[0], p2.p[1] - p3.p[1], p2.p[2] - p3.p[2]];

  // Get length of the grad vector before normalization
  const length = Math.sqrt(grad[0] ** 2 + grad[1] ** 2 + grad[2] ** 2);

  // Normalize gradient vector to just the direction
  grad[0] /= length;
  grad[1] /= length;
  grad[2] /= length;

  const restLen = 1; // hard code rest length for now
  const C = length - restLen; // calculate the current constraint value

  // Recall that we do not need the gradient here because ∇CᵀC = 1 here
  // due to the fact that the gradient has been normalized.
  const deltaLagrangianMultiplier = -C / (w + alpha);

  // Update positions
  p2.p[0] += grad[0] * deltaLagrangianMultiplier * p2.w;
  p2.p[1] += grad[1] * deltaLagrangianMultiplier * p2.w;
  p2.p[2] += grad[2] * deltaLagrangianMultiplier * p2.w;

  p3.p[0] += grad[0] * -deltaLagrangianMultiplier * p3.w;
  p3.p[1] += grad[1] * -deltaLagrangianMultiplier * p3.w;
  p3.p[2] += grad[2] * -deltaLagrangianMultiplier * p3.w;
};
