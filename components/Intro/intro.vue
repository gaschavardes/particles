<template>
  <div class="block-intro">
    <ul>
      <transition-group name="names" duration="10000">
        <li ref="names" v-for="(el, i) in list" :key="el" v-show="i === Math.floor(currentName + 1)">{{el}}</li>
      </transition-group>
    </ul>
  </div>
</template>

<script>
import './intro.less'
import SplitText from '../../assets/js/_libs/greensock/SplitText'
import gsap from 'gsap'
export default {
  name: 'intro',
  data(){
    return {
      list: ['nicolas', 'adele', 'pauline', 'Maxence', 'Alexandre', 'Gaspard', 'presentent: '],
      currentName: -2
      
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.split()
      setTimeout(() => {
        this.launch()
      }, 1000)
      

    })
  },
  methods: {
   split() {
      this.$refs.names.forEach(el => {
        el.split = new SplitText(el, {type: 'chars, lines', charsClass:"char"} )
        el.split.chars.forEach((el, i) => {
          el.style.transitionDelay = i * 0.05 + 's'
        })  
      });
   },
   launch() {
     gsap.to(this, {currentName: 6, duration: 15, onComplete: () => {
       this.$el.classList.add('hide')
       this.$parent.appear()
     } })
   }
  }
}
</script>
