import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import fragment from './shader/fragment.glsl';
import vertex from './shader/vertexParticles.glsl';

import simfragment from './shader/fbo/fragment.glsl';
import simvertex from './shader/fbo/vertex.glsl';

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
    this.renderer.setClearColor(0x010101, 1);
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 0.01, 1000);
    this.camera.position.z = 4;

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.time = 0.0;

    this.setupResize();
    this.resize();
    this.mouseEvents();
    this.setupFBO();
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
    this.dummy = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshBasicMaterial({ visible: false })
    )

    this.ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )

    // this.scene.add(this.ball);

    window.addEventListener('pointermove', (e) => {
      this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1; 
      this.pointer.y = - (e.clientY / window.innerHeight) * 2 + 1;

      
      this.raycaster.setFromCamera(this.pointer, this.camera);
      let intersects = this.raycaster.intersectObject(this.dummy);
      if (intersects.length > 0) {
        let { x, y } = intersects[0].point;
        this.fboMaterial.uniforms.uMouse.value = new THREE.Vector2(x, y);
        this.ball.position.set(x, y, 0);
      }
    });
  }

  getRenderTarget() {
    const renderTarget = new THREE.WebGLRenderTarget(
      this.width,
      this.height,
      {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
      }
    );

    return renderTarget;
  }

  setupFBO() {
    this.size = 1024;

    this.fbo1 = this.getRenderTarget();
    this.fbo2 = this.getRenderTarget();

    this.fboScene = new THREE.Scene();
    this.fboCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    this.fboCamera.position.set(0, 0, 0.5);
    this.fboCamera.lookAt(0, 0, 0);

    let geometry = new THREE.PlaneGeometry(2, 2);

    // data texture
    this.data = new Float32Array(this.size * this.size * 4);
    this.infoArray = new Float32Array(this.size * this.size * 4);

    for (let i = 0; i < this.size; i ++) {
    for (let j = 0; j < this.size; j ++) {
      let index = (i + j * this.size) * 4;
      let theta = Math.random() * Math.PI * 2;
      let r = 0.5 + 0.5 * Math.random();

      this.data[index + 0] = r * Math.cos(theta);
      this.data[index + 1] = r * Math.sin(theta);
      this.data[index + 2] = 1.0;
      this.data[index + 3] = 1.0;

      this.infoArray[index + 0] = 0.5 + Math.random();
      this.infoArray[index + 1] = 0.5 + Math.random();
      this.infoArray[index + 2] = 1.0;
      this.infoArray[index + 3] = 1.0;
    }}

    this.fboTexture = new THREE.DataTexture(
      this.data,
      this.size,
      this.size,
      THREE.RGBAFormat,
      THREE.FloatType
    );

    this.fboTexture.magFilter = THREE.NearestFilter;
    this.fboTexture.minFilter = THREE.NearestFilter;
    this.fboTexture.needsUpdate = true;

    this.info = new THREE.DataTexture(
      this.infoArray,
      this.size,
      this.size,
      THREE.RGBAFormat,
      THREE.FloatType
    );

    this.info.magFilter = THREE.NearestFilter;
    this.info.minFilter = THREE.NearestFilter;
    this.info.needsUpdate = true;

    // fbo material
    this.fboMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uPositions: { value: this.fboTexture },
        uInfo: { value: this.info },
        uMouse: { value: new THREE.Vector2() },
        time: { value: 0.0 },
      },
      vertexShader: simvertex,
      fragmentShader: simfragment,
    });
    
    let fboMesh = new THREE.Mesh(geometry, this.fboMaterial);

    this.fboScene.add(fboMesh);

    this.renderer.setRenderTarget(this.fbo1);
    this.renderer.render(this.fboScene, this.fboCamera);
    this.renderer.setRenderTarget(this.fbo2);
    this.renderer.render(this.fboScene, this.fboCamera);
  }

  addObjects() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        uPositions: { value: null },
      },
      transparent: true,
      side: THREE.DoubleSide,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.count = this.size**2;
    let geometry = new THREE.BufferGeometry();
    let positions = new Float32Array(this.count * 3);
    let uv = new Float32Array(this.count * 2);

    for (let i = 0; i < this.size; i++) {
    for (let j = 0; j < this.size; j++) {
      let index = (i + j * this.size);
      positions[index * 3 + 0] = Math.random();
      positions[index * 3 + 1] = Math.random();
      positions[index * 3 + 2] = 0.0;
      uv[index * 2 + 0] = i / this.size;
      uv[index * 2 + 1] = j / this.size;
    }}

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));

    this.material.uniforms.uPositions.value = this.fboTexture;
    this.points = new THREE.Points(geometry, this.material);
    this.scene.add(this.points);
  }

  render() {
    this.time += 0.05;

    this.material.uniforms.time.value = this.time;
    this.fboMaterial.uniforms.time.value = this.time;
    
    requestAnimationFrame(this.render.bind(this));

    this.fboMaterial.uniforms.uPositions.value = this.fbo2.texture;
    this.material.uniforms.uPositions.value = this.fbo1.texture;
    
    this.renderer.setRenderTarget(this.fbo1);
    this.renderer.render(this.fboScene, this.fboCamera);
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.scene, this.camera);
    
    // swap render targets
    let temp = this.fbo1;
    this.fbo1 = this.fbo2;
    this.fbo2 = temp;
  }
}

new Sketch({ dom: document.getElementById('container') });