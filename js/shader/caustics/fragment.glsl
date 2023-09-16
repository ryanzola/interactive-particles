varying vec3 vWorldPosition;
varying vec2 vUv;

uniform float time;
uniform sampler2D uTexture;

void main() {
  vec4 tt = texture2D(uTexture, vUv);

  vec2 godray = vWorldPosition.xy - vec2(0.0, 10.0);
  float uvDirection = atan(godray.y, godray.x);

  float c = texture2D(uTexture, vec2(uvDirection, 0.0) + 0.04 * time).x;
  float c1 = texture2D(uTexture, vec2(1.0, uvDirection) + 0.04 * time * 1.5).x;
  float alpha = min(c, c1);
  float fade = smoothstep(0.35, 0.86, abs(vUv.y));

  gl_FragColor = vec4(vec3(alpha), alpha * 0.3 * fade);
}