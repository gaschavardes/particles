precision highp float;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vMPos;
uniform vec2 u_mapResolution;
uniform vec2 u_resolution;
uniform sampler2D tMap;
uniform sampler2D tNormal;
uniform float uNormalScale;
uniform float uNormalUVScale;

void main() {
 	vec2 uv = vUv;
	vec2 pos = (uv.xy-0.5);
	vec2 cir = ((pos.xy*pos.xy+sin(uv.x*18.0+uTime)/25.0*sin(uv.y*7.0+uTime*1.5)/1.0)+uv.x*sin(uTime)/16.0+uv.y*sin(uTime*1.2)/16.0);
	float circles = (sqrt(abs(cir.x+cir.y*0.5)*25.0)*5.0);
	gl_FragColor = vec4(sin(circles*1.25+2.0),abs(sin(circles*1.0-1.0)-sin(circles)),abs(sin(circles)*1.0),1.0);
}