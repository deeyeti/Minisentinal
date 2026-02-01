// Cyberpunk Grid Background Shader
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uScrollProgress;

varying vec2 vUv;

// Noise functions
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  
  vec2 u = f * f * (3.0 - 2.0 * f);
  
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

// Grid function
float grid(vec2 uv, float spacing, float thickness) {
  vec2 grid = abs(fract(uv * spacing - 0.5) - 0.5) / fwidth(uv * spacing);
  return 1.0 - min(min(grid.x, grid.y), 1.0) * thickness;
}

// Scanline effect
float scanline(vec2 uv, float time) {
  float scan = sin(uv.y * uResolution.y * 0.5 + time * 2.0) * 0.5 + 0.5;
  return mix(0.95, 1.0, scan);
}

// Glow at intersections
float intersectionGlow(vec2 uv, float spacing, float time) {
  vec2 gridPos = fract(uv * spacing);
  vec2 dist = abs(gridPos - 0.5);
  float d = length(dist);
  float pulse = sin(time * 2.0 + length(floor(uv * spacing)) * 0.5) * 0.5 + 0.5;
  return smoothstep(0.5, 0.0, d) * pulse * 0.3;
}

void main() {
  vec2 uv = vUv;
  vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
  vec2 scaledUv = uv * aspect;
  
  // Background base color (pure black)
  vec3 color = vec3(0.0);
  
  // Main grid
  float mainGrid = grid(scaledUv + vec2(0.0, uTime * 0.02), 20.0, 0.15);
  vec3 gridColor = vec3(0.0, 1.0, 1.0); // Cyan
  color += mainGrid * gridColor * 0.15;
  
  // Secondary smaller grid
  float subGrid = grid(scaledUv + vec2(0.0, uTime * 0.02), 80.0, 0.1);
  color += subGrid * gridColor * 0.05;
  
  // Perspective grid (floor effect)
  vec2 perspUv = uv;
  perspUv.y = 1.0 - perspUv.y; // Flip
  float perspective = pow(perspUv.y, 2.0);
  float horizonGrid = grid(vec2(scaledUv.x, perspUv.y * 10.0 + uTime * 0.1), 10.0, 0.2);
  color += horizonGrid * gridColor * perspective * 0.1;
  
  // Intersection glow points
  float glow = intersectionGlow(scaledUv, 20.0, uTime);
  color += glow * vec3(0.0, 1.0, 0.6); // Cyan-green glow
  
  // Scanlines
  float scan = scanline(uv, uTime);
  color *= scan;
  
  // Noise overlay
  float noiseValue = noise(uv * 100.0 + uTime * 0.5) * 0.02;
  color += noiseValue;
  
  // Vignette
  float vignette = 1.0 - length((uv - 0.5) * 1.2);
  vignette = smoothstep(0.0, 0.7, vignette);
  color *= vignette;
  
  // Moving highlight line (vertical)
  float highlightX = sin(uTime * 0.3) * 0.3 + 0.5;
  float highlight = smoothstep(0.1, 0.0, abs(uv.x - highlightX)) * 0.1;
  color += highlight * vec3(0.0, 1.0, 1.0);
  
  // Scroll-based effects
  float scrollEffect = smoothstep(0.0, 1.0, uScrollProgress);
  color += vec3(0.0, 0.5, 0.3) * scrollEffect * 0.05;
  
  gl_FragColor = vec4(color, 1.0);
}
