export const noiseGLSL = `
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  return value;
}
`;

export const backgroundVertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform float uIntensity;

varying vec2 vUv;
varying float vElevation;

void main() {
  vUv = uv;
  vec3 pos = position;

  float noise1 = snoise(vec2(pos.x * 2.0 + uTime * 0.1, pos.y * 2.0 + uTime * 0.08));
  float noise2 = fbm(vec2(pos.x * 1.5 + uTime * 0.05, pos.y * 1.5 - uTime * 0.06));

  float elevation = noise1 * 0.3 + noise2 * 0.2;

  vec2 mousePos = vec2(uMouse.x * 2.0, uMouse.y * 2.0);
  float dist = distance(vec2(pos.x, pos.y), mousePos);
  float mouseInfluence = smoothstep(1.5, 0.0, dist);
  float velocityMag = length(uVelocity) * 0.01;
  elevation += mouseInfluence * (0.3 + velocityMag) * sin(dist * 3.0 - uTime * 2.0);

  pos.z += elevation * uIntensity;
  vElevation = elevation;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const backgroundFragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

varying vec2 vUv;
varying float vElevation;

void main() {
  vec3 color = mix(uColor1, uColor2, vUv.y);

  float iridescence = sin(vElevation * 5.0 + uTime) * 0.5 + 0.5;
  color = mix(color, uColor3, iridescence * 0.3);

  vec2 mousePos = (uMouse + 1.0) * 0.5;
  float dist = distance(vUv, mousePos);
  float glow = smoothstep(0.5, 0.0, dist) * 0.15;
  color += vec3(glow * 0.5, glow * 0.8, glow);

  float vignette = 1.0 - smoothstep(0.3, 0.9, length(vUv - 0.5) * 1.2);
  color *= 0.8 + vignette * 0.2;

  gl_FragColor = vec4(color, 0.6);
}
`;
