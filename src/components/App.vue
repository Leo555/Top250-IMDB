<template>
  <section id="app">
    <m-header></m-header>
    <article class="movie-container">
      <keep-alive>
        <router-view :key="$route.path"/>
      </keep-alive>
    </article>
    <back-top></back-top>
    <m-footer></m-footer>
    <corner></corner>
  </section>
</template>
<script>
  import Header from 'components/page/Header.vue'
  import Footer from 'components/page/Footer.vue'
  import BackTop from 'components/page/BackTop.vue'
  import Corner from 'components/page/Corner.vue'

  export default {
    name: 'Movie',
    components: {'m-header': Header, 'm-footer': Footer, BackTop, Corner}
  }
</script>
<style lang="less">
  @import '~styles/index';
  @import '~styles/components/container.less';

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

  span.hightlight {
    background: @highlight-color;
  }
</style>
