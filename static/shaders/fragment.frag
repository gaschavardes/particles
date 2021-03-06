precision highp float;
uniform float uTime;
uniform vec3 uColor;
//varying vec4 vRandom;
varying vec4 Pos;
varying vec2 vOffset;
uniform sampler2D uTouch;

void main() {
    vec2 uv = gl_PointCoord.xy;
    float m = texture2D(uTouch, vOffset).r;

    float circle = smoothstep(0.05, 0., length(uv - 0.5)) * 0.8;
    
    //gl_FragColor.rgb = 0.8 + 0.2 * sin(uv.yxx + uTime + vRandom.y * 6.28) + vec3(0.1, 0.0, 0.3);
    vec3 color = mix( vec3(1., 1., 1.), uColor, -Pos.z * 20.);
    gl_FragColor.rgb = color;
    gl_FragColor.a = circle;
}