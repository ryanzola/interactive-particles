uniform float progress;
uniform sampler2D texture1;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;
varying vec3 vPosition;


attribute vec2 pixels;


float PI = 3.141592653589793238;

void main() {
  vUv = uv;
  vNormal = normal;
  vWorldPosition = (modelMatrix * vec4( position, 1.0 )).xyz;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}