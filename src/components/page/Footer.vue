<template>
  <footer id="footer">
    <div class="footer-info">
        <div class="footer-left">
          &copy; {{new Date() | year}} lizhen
        </div>
        <div class="footer-right">
          <p>Contact me<a href="https://lz5z.com">lizhen's blog</a></p>
        </div>
      </div>
  </footer>
</template>
<script>
  export default {
    name: 'movie-footer'
  }
</script>
<style lang="less" scoped>
  @import "~styles/utils.less";
  @import "~styles/index.less";

  #footer {
    font-size: 12px;
    font-family: Menlo, Monaco, Andale Mono, lucida console, Courier New, monospace;
    height: @footer-height;
    line-height: @footer-height;
    background: @footer-color;
    color: #fff;
    position: absolute;
    width: 100%;
    text-align: center;

    .footer-info {
      .clear();
      padding: 0 30px;
    }
    .footer-left {
      float: left;
    }

    .footer-right {
      float: right;
      p {
        float: right;
        margin-left: 15px;
      }
    }

    a {
      color: #08c;
    }

  }

  @media only screen and (max-width: 360px){
    #footer > .footer-info {
      padding: 0 10px;
    }
  }
</style>
