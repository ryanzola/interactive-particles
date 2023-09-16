import { BufferAttribute, BufferGeometry, DoubleSide, Points, ShaderMaterial, TextureLoader } from 'three';

import vertexParticles from './shader/particles/vertex.glsl';
import fragmentParticles from './shader/particles/fragment.glsl';

import sphere from '../img/sphere-normal.jpg';

const { random } = Math

export default class Particles {
  constructor(options) {
    this.scene = options.scene
    this.number = 10000

    this.addObjects()
  }

  addObjects() {
    this.geometry = new BufferGeometry();
    this.material = new ShaderMaterial({
      side: DoubleSide,
      uniforms: {
        time: { value: 0 },
        uNormals: { value: new TextureLoader().load(sphere) }
      },
      vertexShader: vertexParticles,
      fragmentShader: fragmentParticles,
      depthTest: false,
      transparent: true,
    })

    this.positions = new Float32Array(this.number * 3);
    this.randoms = new Float32Array(this.number * 3);
    this.sizes = new Float32Array(this.number * 1);

    for (let i = 0; i < this.number * 3; i++) {
      this.positions[i * 3 + 0] = (random() - 0.5);
      this.positions[i * 3 + 1] = (random() - 0.5);
      this.positions[i * 3 + 2] = (random() - 0.5);

      this.randoms[i * 3 + 0] = random();
      this.randoms[i * 3 + 1] = random();
      this.randoms[i * 3 + 2] = random();

      this.sizes[i + 0] = 0.5 + 0.5 * random();

      this.geometry.setAttribute('position', new BufferAttribute(this.positions, 3));
      this.geometry.setAttribute('aRandom', new BufferAttribute(this.randoms, 3));
      this.geometry.setAttribute('aSize', new BufferAttribute(this.sizes, 1));
    }

    this.mesh = new Points(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.time.value += 0.02
  }
}