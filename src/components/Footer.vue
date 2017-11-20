<template>
  <footer id="footer">
    <div class="outer">
      <div id="footer-info">
        <div class="footer-left">
          &copy; {{new Date() | year}} lizhen
        </div>
        <div class="footer-right">
          <p>Hosted by <a href="https://pages.coding.me">Coding Pages</a></p>
        </div>
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
  #footer {
    font-size: 12px;
    font-family: Menlo, Monaco, Andale Mono, lucida console, Courier New, monospace;
    height: 54px;
    line-height: 54px;
    background: #5a5e66;
    color: #fff;
    position: absolute;
    width: 100%;
    text-align: center;

    .outer {
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
</style>
