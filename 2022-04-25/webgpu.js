const { mat4, mat3, vec3, vec4 } = glMatrix;

const shaderCode = `
struct VertexOut {
    @builtin(position) position : vec4<f32>,
    @location(0) @interpolate(flat) vNormal: vec3<i32>,
};

struct Uniforms {
    viewMatrix: mat4x4<f32>,
    projectionMatrix: mat4x4<f32>,
};

@binding(0) @group(0) var<uniform> u : Uniforms;

@stage(vertex)
fn vertex_main(@location(0) position: vec4<f32>,
               @location(1) normal: vec3<i32>
) -> VertexOut
{
    var output : VertexOut;
    output.position = u.projectionMatrix * u.viewMatrix * position;
    output.vNormal = normal;
    return output;
} 

@stage(fragment)
fn fragment_main(fragData: VertexOut) -> @location(0) vec4<f32>
{
    var color : vec3<f32> = abs(
        vec3<f32>(
            f32(fragData.vNormal.x),
            f32(fragData.vNormal.y),
            f32(fragData.vNormal.z),
        )
    );
    return vec4(color, 1.0);
} 
`;

class WebGPU {
  constructor(device, context, adapter) {
    this._device = device;
    this._context = context;
    this._adapter = adapter;
  }
  // ~~ INITIALIZE ~~ Make sure we can initialize WebGPU
  static async init() {
    if (!navigator.gpu) {
      console.error("WebGPU cannot be initialized - navigator.gpu not found");
      return null;
    }
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      console.error("WebGPU cannot be initialized - Adapter not found");
      return null;
    }
    const device = await adapter.requestDevice();
    device.lost.then(() => {
      console.error("WebGPU cannot be initialized - Device has been lost");
      return null;
    });

    const canvas = document.getElementById("canvas-container");
    const context = canvas.getContext("webgpu");
    if (!context) {
      console.error(
        "WebGPU cannot be initialized - Canvas does not support WebGPU"
      );
      return null;
    }

    return new WebGPU(device, context, adapter);
  }

  draw({ mesh }) {
    const createBuffer = (arr, usage) => {
      const buffer = this._device.createBuffer({
        size: arr.byteLength,
        usage: usage | GPUBufferUsage.COPY_DST,
        mappedAtCreation: true,
      });

      let writeArray;

      switch (true) {
        case arr instanceof Uint16Array:
          writeArray = new Uint16Array(buffer.getMappedRange());
          break;
        case arr instanceof Float32Array:
          writeArray = new Float32Array(buffer.getMappedRange());
          break;
        case arr instanceof Int32Array:
          writeArray = new Int32Array(buffer.getMappedRange());
          break;
      }

      writeArray.set(arr);
      buffer.unmap();
      return buffer;
    };

    // Configures CanvasContext and swap chain (under the hood)
    const configureContext = (presentationFormat) => {
        const devicePixelRatio = window.devicePixelRatio || 1;
        const presentationSize = [
            this._context.canvas.clientWidth * devicePixelRatio,
            this._context.canvas.clientHeight * devicePixelRatio,
        ];

        // Configure the canvas with the device object to make it a suitable texture
        this._context.configure({
            device: this._device,
            format: presentationFormat,
            size: presentationSize,
        });
    }

    const { vertices, indices, normals } = mesh;
    const presentationFormat = this._context.getPreferredFormat(this._adapter);
    configureContext(presentationFormat)

    const vertexBuffer = createBuffer(vertices, GPUBufferUsage.VERTEX);
    const indexBuffer = createBuffer(indices, GPUBufferUsage.INDEX);
    const normalsBuffer = createBuffer(normals, GPUBufferUsage.VERTEX);

    const bufferDescriptors = [
      {
        attributes: [
          {
            shaderLocation: 0,
            offset: 0,
            format: "float32x4",
          },
        ],
        arrayStride: 16,
        stepMode: "vertex",
      },
      {
        attributes: [
          {
            shaderLocation: 1,
            offset: 0,
            format: "sint32x3",
          },
        ],
        arrayStride: Int32Array.BYTES_PER_ELEMENT * 3,
        stepMode: "vertex",
      },
    ];

    // ~~ DEFINE BASIC SHADERS ~~
    const shaderModule = this._device.createShaderModule({
      code: shaderCode,
    });

    // ~~ CREATE RENDER PIPELINE ~~
    const pipeline = this._device.createRenderPipeline({
      vertex: {
        module: shaderModule,
        entryPoint: "vertex_main",
        buffers: bufferDescriptors,
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragment_main",
        targets: [
          {
            format: presentationFormat,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
      },
    });

    // ~~ CREATE UNIFORMS FOR TRANSFORMATION MATRIX ~~
    const uniformBufferSize = Float32Array.BYTES_PER_ELEMENT * 2 * 16; // Bytes * number of matrices * 16 els in 4x4 matrix
    const uniformBuffer = this._device.createBuffer({
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    const uniformBindGroup = this._device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformBuffer,
          },
        },
      ],
    });

    // ~~ CREATE RENDER PASS DESCRIPTOR ~~
    const renderPassDescriptor = {
      colorAttachments: [
        {
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
        },
      ],
    };

    const aspect = this._context.canvas.width / this._context.canvas.height;
    const projectionMatrix = mat4.create();
    const fovy = (2 * Math.PI) / 5
    {
      mat4.perspective(projectionMatrix, fovy, aspect, 1, 100.0);
    }

    const lookAtMatrix = mat4.create();

    {
      const forwardVector = vec3.create();
      const positionOfCamera = vec3.fromValues(0, 4, 4);
      {
        const positionOfTarget = vec3.fromValues(0, 0, 0);
        vec3.subtract(forwardVector, positionOfCamera, positionOfTarget);
        vec3.normalize(forwardVector, forwardVector);
      }

      const rightVector = vec3.create();
      {
        const tempUpVector = vec3.fromValues(0, 1, 0);
        vec3.cross(rightVector, tempUpVector, forwardVector);
        vec3.normalize(rightVector, rightVector);
      }

      const upVector = vec3.create();
      {
        vec3.cross(upVector, forwardVector, rightVector);
        vec3.normalize(upVector, upVector);
      }

      const translationX = vec3.dot(positionOfCamera, rightVector);
      const translationY = vec3.dot(positionOfCamera, upVector);
      const translationZ = vec3.dot(positionOfCamera, forwardVector);
      mat4.set(
        lookAtMatrix,
        rightVector[0],
        upVector[0],
        forwardVector[0],
        0,
        rightVector[1],
        upVector[1],
        forwardVector[1],
        0,
        rightVector[2],
        upVector[2],
        forwardVector[2],
        0,
        -translationX,
        -translationY,
        -translationZ,
        1
      );
    }
    {
      const mill = (ok) => {
        mat4.multiply(ok, lookAtMatrix, ok)
        mat4.multiply(ok, projectionMatrix, ok)
        console.log(ok)
      }
      mill(vec4.fromValues(1, 3, 1, 1))
      mill(vec4.fromValues(2, 2, 1, 1))
      mill(vec4.fromValues(2, 3, 1, 1))
      // console.log(projectionMatrix)
      // const ta = Math.tan(fovy / 2)
      // const mine = mat4.fromValues(
      //   1 / (ta * aspect), 0, 0, 0,
      //   0, 1/ta, 0, 0,
      //   0, 0, -(101)/(99), -1,
      //   0, 0, -2*(100*1)/99, 0
      // )
      // console.log(mine)
    }

    const getViewMatrix = () => {
      const viewMatrix = mat4.create();
      const now = Date.now() / 1000;
      mat4.rotateY(viewMatrix, lookAtMatrix, Math.sin(now) * Math.PI * 2);

      // console.log(viewMatrix[12], viewMatrix[13], viewMatrix[14])
      return viewMatrix;
    };

    // ~~ DEFINE RENDER LOOP ~~
    const frame = () => {
      const viewMatrix = getViewMatrix();
      this._device.queue.writeBuffer(
        uniformBuffer,
        0,
        viewMatrix.buffer,
        viewMatrix.byteOffset,
        viewMatrix.byteLength
      );
      this._device.queue.writeBuffer(
        uniformBuffer,
        64,
        projectionMatrix.buffer,
        projectionMatrix.byteOffset,
        projectionMatrix.byteLength
      );

      // For each rendered frame, get a new texture and view and bind it to the render channel
      renderPassDescriptor.colorAttachments[0].view = this._context
        .getCurrentTexture()
        .createView();
      const commandEncoder = this._device.createCommandEncoder();
      const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

      passEncoder.setPipeline(pipeline);
      passEncoder.setBindGroup(0, uniformBindGroup);
      passEncoder.setVertexBuffer(0, vertexBuffer);
      passEncoder.setVertexBuffer(1, normalsBuffer);
      passEncoder.setIndexBuffer(indexBuffer, "uint16");
      passEncoder.drawIndexed(36);
      passEncoder.end();

      this._device.queue.submit([commandEncoder.finish()]);
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
  }
}
