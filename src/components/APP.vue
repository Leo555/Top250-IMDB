<template>
  <section id="app">
    <m-header></m-header>
    <keep-alive>
      <router-view/>
    </keep-alive>
  </section>
</template>
<script>
  import Header from 'components/Header.vue'
  export default {
    name: 'Movie',
    components: {'m-header': Header}
  }
</script>
<style lang="less">
  @font-family: 'Helvetica Neue', Helvetica, "PingFang SC", "Hiragino Sans GB", "STHeitiSC-Light", "Microsoft YaHei", "微软雅黑", SimSun, sans-serif;
  body {
    font-family: @font-family;
    font-size: 14px;
    padding: 0;
    margin: 0;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -webkit-overflow-scrolling: touch;
    -webkit-text-size-adjust: 100%;
    color: #666;
  }

  input, button {
    font-family: @font-family;
  }

  *, *:before, *:after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  a {
    text-decoration: none;
    outline: none;
  }

  ol,
  ul {
    list-style: none;
  }
</style>
