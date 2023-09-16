import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import Particles from './particles';
import Tube from './tube';
import Caustics from './caustics';

export default class Sketch {
  constructor(options) {
    this.container = options.dom;
    this.scene = new Scene();

    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;

    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x05233c, 1);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new PerspectiveCamera(70, this.width / this.height, 0.01, 1000);
    this.camera.position.z = 4;
    this.initZ = this.camera.position.z;
    this.cameraParams = {
      intensity: 0.001,
      ease: 0.08
    }

    this.mouse = { x: 0, y: 0 };

    this.setupResize();
    this.resize();
    this.mouseEvents();
    this.addParticles();
    this.addTube();
    this.addCaustics();
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
      this.mouse.x = (e.clientX - window.innerWidth / 2) * this.cameraParams.intensity;
      this.mouse.y = (e.clientY - window.innerHeight / 2) * this.cameraParams.intensity;
    });
  }

  addParticles() {
    this.particles = new Particles({
      scene: this.scene
    })
  }

  addTube() {
    this.tube = new Tube({
      scene: this.scene
    })
  }

  addCaustics() {
    this.caustics = new Caustics({
      scene: this.scene
    })
  }

  render() {
    this.camera.position.x += (this.mouse.x - this.camera.position.x) * this.cameraParams.ease;
    this.camera.position.y += (this.mouse.y - this.camera.position.y) * this.cameraParams.ease;
    this.camera.position.z += (this.initZ - this.camera.position.z) * this.cameraParams.ease;
    this.camera.lookAt(0, 0, 0);

    if (this.particles) this.particles.update();

    if (this.tube) this.tube.update();

    if (this.caustics) this.caustics.update();

    this.renderer.render(this.scene, this.camera);

    window.requestAnimationFrame(this.render.bind(this));
  }
}

new Sketch({ dom: document.getElementById('container') });