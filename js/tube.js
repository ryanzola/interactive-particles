import { CatmullRomCurve3, FrontSide, Mesh, RepeatWrapping, ShaderMaterial, TextureLoader, TubeGeometry, Vector3 } from 'three';

import vertexTube from './shader/tube/vertex.glsl';
import fragmentTube from './shader/tube/fragment.glsl';

import dots from '../img/dots.png';
import stripes from '../img/stripes.png';

const { sin, cos, PI } = Math;

// https://en.wikipedia.org/wiki/Trefoil_knot
export default class Tube {
  constructor(options) {
    this.scene = options.scene
    this.points = []

    this.addObjects()
  }

  addObjects() {
    for (let i = 0; i < 100; i++) {
      let angle = 2 * PI * i / 100;

      let x = sin(angle) + 2.0 * sin(2.0 * angle);
      let y = cos(angle) - 2.0 * cos(2.0 * angle);
      let z = - sin(3.0 * angle);

      this.points.push(new Vector3(x, y, z));
    }

    let dotsTexture = new TextureLoader().load(dots);
    let stripesTexture = new TextureLoader().load(stripes);

    dotsTexture.wrapS = dotsTexture.wrapT = RepeatWrapping;
    stripesTexture.wrapS = stripesTexture.wrapT = RepeatWrapping;

    let curve = new CatmullRomCurve3(this.points);
    this.geometry = new TubeGeometry(curve, 100, 0.4, 100, true);
    this.material = new ShaderMaterial({
      side: FrontSide,
      uniforms: {
        time: { value: 0 },
        uDots: { value: dotsTexture },
        uStripes: { value: stripesTexture }
      },
      vertexShader: vertexTube,
      fragmentShader: fragmentTube,
      transparent: true,
    })

    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.time.value += 0.02
  }
}