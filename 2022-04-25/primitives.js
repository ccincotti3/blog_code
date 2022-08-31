const Primitives = {};

Primitives.Cube = class {
  constructor(width, height, depth) {
    this.w = width;
    this.h = height;
    this.d = depth;
    this.mesh = this.buildMesh();
  }

  get verticesToDraw() {
    return this.vertices.length / 4;
  }

  buildMesh() {
    const { w, h, d } = this;
    const halfW = w / 2;
    const halfH = h / 2;
    const halfD = d / 2;

    const x0 = -halfW;
    const x1 = halfW;
    const y0 = -halfH;
    const y1 = halfH;
    const z0 = -halfD;
    const z1 = halfD;

    const vertices = [
      x0,
      y1,
      z1,
      1, //0 Front
      x0,
      y0,
      z1,
      1, //1
      x1,
      y0,
      z1,
      1, //2
      x1,
      y1,
      z1,
      1, //3

      x1,
      y1,
      z0,
      1, //4 Back
      x1,
      y0,
      z0,
      1, //5
      x0,
      y0,
      z0,
      1, //6
      x0,
      y1,
      z0,
      1, //7

      x0,
      y1,
      z0,
      1, //7 Left
      x0,
      y0,
      z0,
      1, //6
      x0,
      y0,
      z1,
      1, //1
      x0,
      y1,
      z1,
      1, //0

      x0,
      y0,
      z1,
      1, //1 Bottom
      x0,
      y0,
      z0,
      1, //6
      x1,
      y0,
      z0,
      1, //5
      x1,
      y0,
      z1,
      1, //2

      x1,
      y1,
      z1,
      1, //3 Right
      x1,
      y0,
      z1,
      1, //2
      x1,
      y0,
      z0,
      1, //5
      x1,
      y1,
      z0,
      1, //4

      x0,
      y1,
      z0,
      1, //7 Top
      x0,
      y1,
      z1,
      1, //0
      x1,
      y1,
      z1,
      1, //3
      x1,
      y1,
      z0,
      1, //4
    ];

    //Build the index of each quad [0,1,2, 2,3,0]
    const indices = [];
    for (let i = 0; i < vertices.length / 4; i += 2) {
      indices.push(i, i + 1, Math.floor(i / 4) * 4 + ((i + 2) % 4));
    }

    //Build Normal data for each vertex
    const normals = [
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1, //Front
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1, //Back
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0, //Left
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0,
      0,
      -1,
      0, //Bottom
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0, //Right
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      1,
      0, //Top
    ];

    return {
      vertices: new Float32Array(vertices),
      indices: new Uint16Array(indices),
      normals: new Int32Array(normals),
    };
  }
};
