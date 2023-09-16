import { FrontSide, Mesh, PlaneGeometry, RepeatWrapping, ShaderMaterial, TextureLoader, Vector2 } from "three"

import vertexCaustics from "./shader/caustics/vertex.glsl"
import fragmentCaustics from "./shader/caustics/fragment.glsl"

import noise from "../img/noise.png"

export default class Caustics {
  constructor(options) {
    this.scene = options.scene

    this.addObjects()
  }

  addObjects() {
    let noiseTexture = new TextureLoader().load(noise)
    noiseTexture.wrapS = noiseTexture.wrapT = RepeatWrapping;

    this.geometry = new PlaneGeometry(20, 10)
    this.material = new ShaderMaterial({
      side: FrontSide,
      uniforms: {
        time: { value: 0 },
        uTexture: { value: noiseTexture }
      },
      vertexShader: vertexCaustics,
      fragmentShader: fragmentCaustics,
      transparent: true,
    })

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.z = -2

    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.time.value += 0.02
  }
}