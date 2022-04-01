precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float progress;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vMPos;


void main() {
     vUv = uv;
    vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
} 