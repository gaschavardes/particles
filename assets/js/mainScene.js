import {
  Renderer,
  Camera,
  Transform,
  Orbit
} from 'ogl'
import Emitter from 'event-emitter'
import Bowser from 'bowser'
class Scene {
  constructor () {
    this.time = 0
    this.scroll = 0
    this.scrollTarget = 0
    this.isMobile = Bowser.getParser(window.navigator.userAgent).parsedResult.platform.type !== 'desktop'
    this.windowHeight = window.innerHeight
    // import('./intersection').then((el) => {
    //   this.intersection = el.default
    //   this.intersection.on('setBubble', (val) => {
    //     if (this.Raf) {
    //       val ? this.Raf.suscribe('scene', () => { this.update() }, 30) : this.Raf.unsuscribe('scene')
    //     }
    //   })
    // })
  }

  init () {
    this.emitter = {}
    Emitter(this.emitter)
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.renderer = new Renderer({
      dpr: window.devicePixelRatio,
      alpha: true,
      transparency: true
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.gl = this.renderer.gl
    
    this.container = document.createElement('div')
    this.container.classList.add('canvas-container')
    this.container.style.height = window.innerHeight + 'px'
    this.container.style.width = window.innerWidth + 'px'
    this.container.appendChild(this.gl.canvas)
    document.body.appendChild(this.container)
    // this.intersection.init()
    //   this.container.style.top = this.$el.getBoundingClientRect().y + this.$el.getBoundingClientRect().height * 0.5 + 'px'
    //   this.container.style.left = window.innerWidth * 0.5 + 'px'
    //   this.container.style.left = this.$el.getBoundingClientRect().x + this.$el.getBoundingClientRect().width * 0.5 + 'px'
    
    this.gl.clearColor(1, 0, 0, 0)
   
    this.camera = new Camera(this.gl, {
      fov: 15
    })
   
    this.camera.position.set(0, 0, 5)
    this.camera.lookAt([0, 0, 0])
    this.controls = new Orbit(this.camera);
    this.scene = new Transform()
    this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });

    import('./Raf').then((el) => {
      this.Raf = el.default
    //   this.Raf.suscribe('scene', () => { this.update() }, 40)
    //   this.Raf.suscribe('sceneScroll', () => { this.updateScroll() })
    })

    // this.camera.position.z = 100
    this.scene = new Transform()
    

    // this.size = this.$el.getBoundingClientRect()
    window.addEventListener('resize', this.resize.bind(this))
  }
  

  setSize (container) {
    container.height = container.getBoundingClientRect().height
    if (container.height > window.innerHeight) {
      this.gl.canvas.style.height = container.height + 'px'
    }
    setTimeout(() => {
      this.container.style.top = container.getBoundingClientRect().y + window.scrollY + 'px'
    }, 500)
  }

  setController () {
    this.DebugController.addConfig(this.config, 'Position')
  }

  resize () {
    if (!this.isMobile) {
      this.container.style.height = window.innerHeight + 'px'
      this.container.style.width = window.innerWidth + 'px'
    }
  }

  scrollListen (e) {
  }

  destroy () {
    if (this.Raf) {
      setTimeout(() => {
        this.scene.children.forEach((el) => {
          this.scene.removeChild(el)
          requestAnimationFrame(() => {
            this.update()
          })
        })
        this.Raf.unsuscribe('scene')
        this.scene.children = []
      }, 1000)
    }
  }

  resume () {
    if (this.Raf) {
      this.Raf.suscribe('scene', () => { this.update() }, 30)
    } else {
      import('./Raf').then((el) => {
        this.Raf = el.default
        this.Raf.suscribe('scene', () => { this.update() }, 30)
      //   this.Raf.suscribe('sceneScroll', () => { this.updateScroll() })
      })
    }
  }

  update () {
    this.time++
    // this.controls.update()
    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
  }

  updateScroll () {

  }
}
const out = new Scene()
export default out
