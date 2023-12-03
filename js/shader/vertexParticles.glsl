uniform sampler2D uPositions;
uniform float time;

varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vColor;

float PI = 3.141592653589793238;

void main() {
  vUv = uv;
  vPosition = position;
  vec4 pos = texture2D(uPositions, uv);
  float angle = atan(pos.y, pos.x);

  // depending on the position of the particle on the circle, it will
  // iterate through opacities on a sine curve
  // trying to make opacity movement the same as particle movement
  vColor = 0.7 * vec4(0.5 + 0.42 * sin(angle + time * 0.35));

  vec4 mvPosition = modelViewMatrix * vec4(pos.xyz, 1.0);

  gl_PointSize = 1.0 * (1.0 / - mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}