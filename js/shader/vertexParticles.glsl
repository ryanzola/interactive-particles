uniform float time;
uniform float progress;
uniform sampler2D texture1;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vRandom;
varying float vSize;

attribute vec3 aRandom;
attribute float aSize;

float PI = 3.141592653589793238;

vec3 getPos(float progress) {
  float angle = progress * PI * 2.0;

  float x = sin(angle) + 2.0 * sin(2.0 * angle);
  float y = cos(angle) - 2.0 * cos(2.0 * angle);
  float z = - sin(3.0 * angle);

  return vec3(x, y, z);
}

vec3 getTangent(float progress) {
  float angle = progress * PI * 2.0;

  float x = cos(angle) + 4.0 * cos(2.0 * angle);
  float y = - sin(angle) + 4.0 * sin(2.0 * angle);
  float z = 3.0 * - cos(3.0 * angle);

  return normalize(vec3(x, y, z));
}

vec3 getNormal(float progress) {
  float angle = progress * PI * 2.0;

  float x = - sin(angle) - 8.0 * sin(2.0 * angle);
  float y = - cos(angle) + 8.0 * cos(2.0 * angle);
  float z = 9.0 * sin(3.0 * angle);

  return normalize(vec3(x, y, z));
}

void main() {
    vec3 pos = position;
    float progress = fract(time * 0.01 + aRandom.x);
    pos = getPos(fract(time * 0.01 + aRandom.x));

    vec3 normal = getNormal(progress);
    vec3 tangent = getTangent(progress);
    vec3 binormal = normalize(cross(normal, tangent));

    pos += normal * aRandom.y * 0.1 + binormal * aRandom.z * 0.1;

    vUv = uv;
    vPosition = position;
    vRandom = aRandom;
    vSize = aSize;
    
    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

    gl_PointSize = 10.0 * ( 1.0 / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}