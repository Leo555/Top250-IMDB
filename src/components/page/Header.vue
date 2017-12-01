<template>
  <div class="header-wrap">
    <router-link :to="{name: 'Main'}">
      IMDB Top250
    </router-link>
    <search-bar></search-bar>
  </div>
</template>
<script>
  import SearchBar from 'components/search/SearchBar.vue'
  export default {
    name: 'movie-header',
    components: {SearchBar}
  }
</script>
<style lang="less" scoped>
  @import "~styles/index.less";

  .header-wrap {
    height: @header-height;
    line-height: @header-height;
    background: @header-color;
    position: relative;
    a {
      display: block;
      text-align: center;
      float: left;
      width: 245px;
      color: #fff;
      font-size: 20px;
      user-select: none;
      &:hover {
        color: #dbdbdb;
      }
      &:active {
        color: #dbdbdb;
      }
    }
  }

  @media screen and (max-width: 820px) {
    .header-wrap {
      height: @header-height-mobile;
      padding: 12px 0;
      line-height: calc(@header-height - 12px);
      a {
        margin: 0 auto;
        float: none;
      }
    }
  }
</style>
