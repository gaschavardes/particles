<template>
  <div class="tpl-home">
  </div>
</template>
<script>
import './home.less'
import Bowser from 'bowser'
import gsap from 'gsap'
import {Texture, Plane, Sphere, Mesh, Program, Vec3, Vec2, TextureLoader, Geometry }  from 'ogl'

import Cursor from '@/assets/js/cursor';
//SHADERS
import planeFrag from '@/static/shaders/plane.frag'
import planeVert from '@/static/shaders/plane.vert'

import fragment from '@/static/shaders/fragment.frag'
import vertex from '@/static/shaders/vertex.vert'


//import RugbyText from '@/static/images/rugbyText.png'
import Toulouse from '@/static/images/logo2.png'
import Bristol from '@/static/images/bristol.png'
import bristolAlpha from '@/static/images/bristolAlpha.png'

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
      width: window.innerWidth,
      height: window.innerHeight,
      time: 0,
      particlesGroup: []
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
          this.hoverTexture = new Cursor(this)
          console.log('glgl', this.Scene.gl)
          // this.initNull()
          // this.initPoints('bristol', 1)
          this.initPoints('toulouse', 0)
           this.initPoints('toulouse', 0)
        })
      })
    },

    // initNull () {
    //   const program = new Program(this.Scene.gl, {
    //     vertex: vertexNull,
    //     fragment: fragmentNull,
    //     cullFace: null,
    //     transparent: true
    //   })
    //   const geometry = new Sphere(this.Scene.gl)
    //   this.null = new Mesh(this.Scene.gl, { geometry, program })
    //   this.null.position.set(0, 0, this.originalPosition)
    //   this.null.setParent(this.Scene.scene)
    // },

  initPoints(name, way) {

		// let numVisible = this.numPoints;
		this.threshold = 0;
		// let originalColors;

    // discard pixels darker than this.threshold #22
    
    this.threshold = 10;

    let image = new Image()

    image.src = name === 'bristol' ? bristolAlpha : Toulouse
    image.onload = () => {
      this.numVisible = 0;
      const img = image;
    // this.height = image.naturalHeight
    this.width = image.naturalWidth
    this.height = image.naturalHeight
    this.numPoints = this.width * this.height;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, this.width, this.height * -1);
  
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    this.originalColors = Float32Array.from(imgData.data);
    for (let i = 0; i < this.numPoints; i = i + 2) {

      // console.log(this.originalColors[i * 4 + 4])
      if (this.originalColors[i * 4 + 4]  > 200) {
        // console.log(this.originalColors[i * 4 + 4])
        this.numVisible++;
      }
      }
      this.setOffsets(name, way)
    }
  
  },

  setOffsets(name, way) {
    this.indices = new Uint16Array(this.numVisible);
		this.offsets = new Float32Array(this.numVisible * 3);
		this.angles = new Float32Array(this.numVisible);
    let j = 0;
    for (let i = 0; i < this.numPoints; i = i + 2) {
      // console.log(this.originalColors[i * 4 + 4])
			if (this.originalColors[i * 4 + 4] > 200) {
        this.offsets[j * 3 + 0] = (i % this.width) / this.width;
        this.offsets[j * 3 + 1] = Math.floor(i / this.width)/this.height;
        // this.offsets[j * 3 + 0] = 0
        // this.offsets[j * 3 + 1] = 0
        // console.log(i, (i % this.width), Math.floor(i / this.width))
        this.indices[j] = j;
        this.angles[j] = Math.random() * Math.PI ;
        j++;
      }
		}
    // this.indices.pop()
    this.initParticles(name, way)
  },

  initParticles(name, way) {
    console.log('GL', this.Scene.gl)
      let plane = new Plane(this.Scene.gl)
      console.log(this.offsets)
      const geometry = new Geometry(this.Scene.gl, {
          position:  {size: 3, data: plane.attributes.position.data},
          uv: {size: 2, data: plane.attributes.uv.data},
          index: {size: 1, data: plane.attributes.index.data},
          offsets: {instanced: 1, size: 3, data: this.offsets },
          //random: {instanced: 1, size: 1, data: this.angles },
          //index: {instanced: 1, size: 1, data: this.indices },
      });
      //const geometry =  new Plane(this.Scene.gl)
      const program = new Program(this.Scene.gl, {
          vertex,
          fragment,
          uniforms: {
              uTime: { value: 0 },
              uWay: { value: way },
              uColor: { value:name === 'bristol' ? new Vec3(0, 0, 1) : new Vec3(1, 0, 0) },
              uFactor: {value: 1},
              uTextureSize: { value: new Vec2(this.width, this.height) },
              uTouch: { value: null },
          },
          transparent: true,
          depthTest: false,
      });
      // Make sure mode is gl.POINTS
      let mesh = new Mesh(this.Scene.gl, {geometry, program });
      // let mesh = new Mesh(this.Scene.gl, { geometry, program });
      //console.log(particles, this.Scene, this.Scene.gl.POINTS)
      mesh.setParent(this.Scene.scene)
      mesh.position.set(0, 0, 0)
      mesh.scale.set(0.1, 0.1, 0.1)
      this.particlesGroup[this.particlesGroup.length + 1] = mesh
  },
   
  clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  },
  appear() {
   
  },
  update() {
   this.time++
  
   this.particlesGroup.forEach(el => {
     el.program.uniforms.uTime.value = this.time
      if(this.hoverTexture) {
        this.hoverTexture.update()
        el.program.uniforms.uTouch.value = this.hoverTexture.texture
      }
   })

  }
  }
}
</script>