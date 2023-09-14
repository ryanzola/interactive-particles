import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

import vertex from './shader/vertexParticles.glsl';
import fragment from './shader/fragment.glsl';

// https://en.wikipedia.org/wiki/Trefoil_knot

export default class Sketch {
  constructor(options) {
    this.container = options.dom;
    this.scene = new THREE.Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x05233c, 1);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000);
    this.camera.position.z = 3;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.time = 0;
    this.mouse = new THREE.Vector2();

    this.setupSettings();
    this.setupResize();
    this.resize();
    this.mouseEvents();
    this.addObjects();
    this.render()
  }

  setupSettings() {
    this.settings = {
      progress: 0,
    }

    this.gui = new GUI();
    this.gui.add(this.settings, 'progress', 0, 1, 0.01).onChange((val) => {
      this.material.uniforms.progress.value = val;

      this.material.needsUpdate = true;
    });
  }

  setupResize() {
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  mouseEvents() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = (e.clientX / this.width) * 2 - 1;
      this.mouse.y = -(e.clientY / this.height) * 2 + 1;
    });
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      uniforms: {
        progress: { value: 0 },
        mouse: { value: new THREE.Vector2() },
        time: { value: 0 },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
    })

    let number = 10000

    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(number * 3);
    this.randoms = new Float32Array(number * 3);
    this.sizes = new Float32Array(number * 1);

    for (let i = 0; i < number * 3; i++) {
      this.positions[i * 3 + 0] = (Math.random() - 0.5);
      this.positions[i * 3 + 1] = (Math.random() - 0.5);
      this.positions[i * 3 + 2] = (Math.random() - 0.5);

      this.randoms[i * 3 + 0] = Math.random();
      this.randoms[i * 3 + 1] = Math.random();
      this.randoms[i * 3 + 2] = Math.random();

      this.sizes[i + 0] = 0.5 + 0.5 * Math.random();

      this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
      this.geometry.setAttribute('aRandom', new THREE.BufferAttribute(this.randoms, 3));
      this.geometry.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
    }

    this.mesh = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.mesh);
  }

  render() {
    this.time += 0.05;

    this.material.uniforms.mouse.value = this.mouse;
    this.material.uniforms.time.value = this.time * 0.5;

    this.renderer.render(this.scene, this.camera); // Added this line
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({ dom: document.getElementById('container') });