varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float time;
uniform sampler2D uDots;
uniform sampler2D uStripes;

void main(){
  float time1 = time * 0.05;
  float texture1 = texture2D(uStripes, vUv - time1).r;
  float texture2 = texture2D(uStripes, vUv - time1 * 0.5).r;
  float texture3 = texture2D(uDots, vUv * vec2(8.0, 4.0) - time1 * 1.5).r;
  float alpha = min(texture1, texture2) + texture3;

  vec3 color = vec3(0.156, 0.559, 0.832);
  vec3 color1 = vec3(0.579, 0.903, 0.983);

  vec3 viewDir = - normalize(vWorldPosition - cameraPosition);
  float fresnel = dot(viewDir, vNormal);
  fresnel = pow(fresnel, 3.0);

  gl_FragColor = vec4(vUv, 0.0, 1.0);
  gl_FragColor = vec4(color1, alpha * fresnel);
}