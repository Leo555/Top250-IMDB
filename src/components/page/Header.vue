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
    min-width: 820px;
    height: @header-height;
    line-height: @header-height;
    background: @header-color;
    position: relative;
    a {
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

</style>
