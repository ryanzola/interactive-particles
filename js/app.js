import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
    this.renderer.setClearColor(0x222222, 1);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000);
    this.camera.position.z = 2;

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // smooth controls
    this.controls.enableDamping = true;

    this.mouse = { x: 0, y: 0 };

    this.setupResize();
    this.resize();
    this.mouseEvents();
    this.addObjects();
    this.render()
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
      this.mouse.x = (e.clientX - window.innerWidth / 2);
      this.mouse.y = (e.clientY - window.innerHeight / 2);
    });
  }

  addObjects() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    this.material = new THREE.MeshNormalMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }


  render() {
    this.controls.update();

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({ dom: document.getElementById('container') });