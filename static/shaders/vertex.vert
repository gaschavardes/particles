attribute vec3 position;
attribute vec3 offsets;
attribute float index;
attribute float random;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform float uWay;
uniform float uFactor;
uniform mat4 projectionMatrix;
uniform float uTime;
varying vec4 vRandom;
varying vec4 Pos;
uniform float uTextureSize;
uniform sampler2D uTouch;
void main() {
    //vRandom = random;
    

    // positions are 0->1, so make -1->1
    vec3 pos = offsets * 2.0 - 1.0;;
    
    // Scale towards camera to be more interesting
    //pos.z *= 10.0;
    
    vec2 rightUv = offsets.xy * (1. - uTextureSize);

    // modelMatrix is one of the automatically attached uniforms when using the Mesh class
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    vec2 puv = vec2((offsets.x + uWay * 0.25), offsets.y );

    // add some movement in world space

    float m = texture2D(uTouch, puv).r;

    float t = uTime * 0.01;
    mPos.x += sin(t * random + random) * 0.005 * uFactor + uWay * 0.5 + cos(random) * m * random * 0.03;
    mPos.y += sin(t * random + random) * 0.005 * uFactor + sin(random) * m * random * 0.03;
    mPos.z += abs(sin(t * random));
    
    Pos = mPos;
    mPos.z *= 0.01;
    // get the model view position so that we can scale the points off into the distance
    vec4 mvPos = viewMatrix * mPos;
    //gl_PointSize = 300.0 / length(mvPos.xyz) * (random + 0.1);
    gl_PointSize = 300.0 / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
}