<template>
  <div class="tpl-home">
  </div>
</template>
<script>
import './home.less'
import Bowser from 'bowser'
import gsap from 'gsap'
import {Texture, Plane, Sphere, Mesh, Program, Vec2, TextureLoader, Geometry }  from 'ogl'

//SHADERS
import planeFrag from '@/static/shaders/plane.frag'
import planeVert from '@/static/shaders/plane.vert'

import fragment from '@/static/shaders/fragment.frag'
import vertex from '@/static/shaders/vertex.vert'


import RugbyText from '@/static/images/rugbyText.png'


const vertexNull = /* glsl */ `
    attribute vec3 position;
    attribute vec3 normal;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    uniform mat3 normalMatrix;
    varying vec3 vNormal;
    void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

const fragmentNull = /* glsl */ `
    precision highp float;
    varying vec3 vNormal;
    void main() {
        vec3 normal = normalize(vNormal);
        float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
        gl_FragColor.rgb = vec3(0.);
        gl_FragColor.a = 0.;
    }
`

export default {
  name: 'Home',
  data(){
    return {
      width: window.innerWidth * 0.3,
      height: window.innerHeight * 0.3
    }
  },
  mounted() {
    import('../../assets/js/Raf').then((el) => {
      this.Raf = el.default
      this.Raf.suscribe('webgl', this.update.bind(this))
    })
   
    this.initOgl()
  },
  methods: {
   
    initOgl() {
       import('../../assets/js/mainScene').then((el) => {
        this.Scene = el.default
        this.Scene.init()
        this.Scene.resume()
        // this.initOgl()
        requestAnimationFrame(() => {
          // this.initTexts()
          this.initNull()
          this.initPoints()
        })
      })
    },

    initNull () {
      const program = new Program(this.Scene.gl, {
        vertex: vertexNull,
        fragment: fragmentNull,
        cullFace: null,
        transparent: true
      })
      const geometry = new Sphere(this.Scene.gl)
      this.null = new Mesh(this.Scene.gl, { geometry, program })
      this.null.position.set(0, 0, this.originalPosition)
      this.null.setParent(this.Scene.scene)
    },

  initPoints() {
    this.numPoints = this.width * this.height;

		// let numVisible = this.numPoints;
		this.threshold = 0;
		// let originalColors;

    // discard pixels darker than this.threshold #22
    this.numVisible = 0;
    this.threshold = 100;

    let image = new Image()
    image.src = RugbyText
    image.onload = () => {
      const img = image;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    document.documentElement.appendChild(canvas)
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, this.width, this.height * -1);
    // ctx.beginPath();
    // ctx.fillStyle = "black"
    ctx.fillRect(0, 0,  this.width,  this.height);
    // ctx.fill();
    // ctx.closePath();

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.originalColors = Float32Array.from(imgData.data);
    console.log(this.originalColors, this.numPoints)
    for (let i = 0; i < this.numPoints; i++) {
      if (this.originalColors[i * 4 + 0] + this.originalColors[i * 4 + 2] + this.originalColors[i * 4 + 3]  < this.threshold) this.numVisible++;
      }
			// console.log('numVisible', numVisible, this.numPoints);
      this.setOffsets()
    }
  },

  setOffsets() {
    this.indices = new Uint16Array(this.numVisible);
		this.offsets = new Float32Array(this.numVisible * 3);
		this.angles = new Float32Array(this.numVisible);
    for (let i = 0, j = 0; i < this.numPoints; i++) {
			if (this.originalColors[i * 4 + 0] <= this.threshold) continue;

			this.offsets[j * 3 + 0] = i % this.width * 0.01;
			this.offsets[j * 3 + 1] = Math.floor(i / this.width) * 0.01;

			this.indices[j] = i;

			this.angles[j] = Math.random() * Math.PI;

			j++;
		}
    console.log('Offsets', this.offsets)
    this.initParticles()
  },

  initParticles() {
      console.log('INIT')
      const geometry = new Geometry(this.Scene.gl, {
          position: { size: 3, data: this.offsets },
          //random: { size: 4, data: random },
      });
      const program = new Program(this.Scene.gl, {
          vertex,
          fragment,
          uniforms: {
              uTime: { value: 0 },
          },
          transparent: true,
          depthTest: false,
      });

      // Make sure mode is gl.POINTS
      const particles = new Mesh(this.Scene.gl, { mode: this.Scene.gl.POINTS, geometry, program });
      console.log(particles, this.Scene, this.Scene.gl.POINTS)
      particles.setParent(this.Scene.scene)
  },
   
  clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  },
  appear() {
   
  },
  update() {
   
  }
  }
}
</script>