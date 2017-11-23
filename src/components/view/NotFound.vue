<template>
  <section id="not-found">
    <h1>404</h1>
  </section>
</template>

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
</style>
