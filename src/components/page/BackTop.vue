<template>
  <button @click="backToTop">Top</button>
</template>
<script>
  export default {
    name: 'BackTop',
    methods: {
      backToTop () {
        let time = setInterval(() => {
          let osTop = document.documentElement.scrollTop || document.body.scrollTop
          let speed = Math.floor(-osTop / 10)
          document.documentElement.scrollTop = document.body.scrollTop = osTop + speed
          if (osTop === 0) {
            clearInterval(time)
          }
        }, 10)
      }
    }
  }
</script>
<style lang="less" scoped>
  button {
    position: fixed;
    bottom: 20px;
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
  }
</style>
