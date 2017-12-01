<template>
  <section id="not-found">
    <h1>404</h1>
  </section>
</template>
<script>
  import { TITLE } from 'constants/index'
  export default {
    name: 'NotFound',
    metaInfo () {
      return {
        title: `404 - ${TITLE}`
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "~styles/index.less";

  #not-found {
    background: @background;
    height: calc(~'100vh' - @header-height * 2);
    h1 {
      padding: 10% 0 0 0;
      text-align: center;
      font-size: 30px;
    }
  }

  @media screen and (max-width: 820px) {
    #not-found {
      height: calc(~'100vh' - (@header-height + @header-height-mobile));
    }
  }
</style>
