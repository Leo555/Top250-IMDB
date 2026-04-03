<template>
  <transition name="fade">
    <button v-show="visible" @click="backToTop">Top</button>
  </transition>
</template>
<script>
  export default {
    name: 'BackTop',
    data () {
      return {
        visible: false
      }
    },
    methods: {
      backToTop () {
        window.scrollTo({top: 0, behavior: 'smooth'})
      },
      handleScroll () {
        this.visible = (document.documentElement.scrollTop || document.body.scrollTop) > 300
      }
    },
    mounted () {
      window.addEventListener('scroll', this.handleScroll)
    },
    beforeDestroy () {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
</script>
<style lang="less" scoped>
  button {
    position: fixed;
    bottom: 40px;
    right: 30px;
    z-index: 99;
    border: none;
    outline: none;
    background-color: #111111;
    opacity: 0.9;
    color: white;
    cursor: pointer;
    padding: 15px;
    border-radius: 10px;
    transition: opacity 0.3s;
    &:hover {
      opacity: 1;
    }
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
