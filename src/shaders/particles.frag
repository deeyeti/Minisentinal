// Particle fragment shader
precision highp float;

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Create circular point with soft edges
  vec2 uv = gl_PointCoord - 0.5;
  float dist = length(uv);
  
  // Soft circle with glow
  float circle = 1.0 - smoothstep(0.3, 0.5, dist);
  float glow = 1.0 - smoothstep(0.0, 0.5, dist);
  
  // Combine core and glow
  float alpha = circle * 0.8 + glow * 0.3;
  alpha *= vAlpha;
  
  vec3 color = vColor;
  
  // Add bright center
  color += vec3(1.0) * (1.0 - smoothstep(0.0, 0.2, dist)) * 0.5;
  
  gl_FragColor = vec4(color, alpha);
}
