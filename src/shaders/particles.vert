// Particle vertex shader
uniform float uTime;
uniform float uPixelRatio;

attribute float aScale;
attribute vec3 aColor;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  
  // Floating animation
  float floatOffset = sin(uTime * 0.5 + modelPosition.x * 2.0) * 0.2;
  floatOffset += cos(uTime * 0.3 + modelPosition.z * 2.0) * 0.15;
  modelPosition.y += floatOffset;
  
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;
  
  // Size attenuation
  gl_PointSize = aScale * uPixelRatio * (200.0 / -viewPosition.z);
  gl_PointSize = max(gl_PointSize, 1.0);
  
  vColor = aColor;
  
  // Pulse alpha
  vAlpha = 0.5 + sin(uTime * 2.0 + position.x * 3.0) * 0.3;
}
