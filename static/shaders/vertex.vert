attribute vec3 position;
attribute vec3 offsets;
attribute vec2 uv;
attribute float random;
uniform mat4 modelViewMatrix;
uniform mat4 viewMatrix;
uniform float uWay;
uniform float uFactor;
uniform mat4 projectionMatrix;
uniform float uTime;
varying vec4 vRandom;
varying vec3 Pos;
uniform vec2 uTextureSize;
uniform sampler2D uTouch;

varying vec2 vUv;
void main() {
    vUv = uv;
    
    // copy position so that we can modify the instances
    vec3 pos = position;
    
    // scale first
    //pos *= 0.9;
    
    // rotate around y axis
    //rotate2d(pos.xz, random * 6.28 + 4.0 * uTime * (random - 0.5));
    
    // rotate around x axis just to add some extra variation
    //rotate2d(pos.zy, rando * 0.5 * sin(uTime * random.x + random.z * 3.14));
    
    pos += offsets;
    Pos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}