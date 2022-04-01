
export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target: 'static',
  env: {
    STRIPE_PK: process.env.STRIPE_PK,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Les Furidays',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Le festival des Furieux' },
      { name: 'og:url', content: 'https://furidays.bzh' },
      { name: 'og:type', content: 'website' },
      { name: 'og:description', content: 'Le festival des Furieux' },
      { name: 'og:image', content: 'https://furidays.bzh/shareImg.jpg' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  
  router: {
    base: '/',
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'home',
        path: '/',
        component: `~/pages/Home/home.vue`
      })
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/vue-stripe.js', ssr: false },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    filenames: {
      chunk: ({ isDev }) => isDev ? '[name].js' : '[chunkhash].js'
    },
    extractCSS: true,
    transpile: ['gsap', 'ogl', 'Raf'],
    extend (config, {
      isDev,
      isClient
    }) {
      // ..
      config.module.rules.push({
        test: /\.(glsl|vs|fs|frag|vert)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader'
        ]
      })
      // Sets webpack's mode to development if `isDev` is true.
      if (isDev) {
        config.mode = 'development'
      }
    }
  }
}
