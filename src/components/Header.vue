<template>
  <div class="header-wrap">
    <router-link :to="{name: 'Main'}">
      IMDB Top250
    </router-link>
    <search-bar></search-bar>
  </div>
</template>
<script>
  import SearchBar from './search/SearchBar.vue'
  export default {
    name: 'movie-header',
    components: {SearchBar}
  }
</script>
<style lang="less" scoped>
  .header-wrap {
    height: 54px;
    background: #5a5e66;
    position: relative;
    a {
      line-height: 54px;
      text-align: center;
      float: left;
      width: 245px;
      color: #fff;
      font-size: 20px;
      user-select: none;
      cursor: pointer;
      &:hover {
        color: #dbdbdb;
      }
      &:active {
        color: #dbdbdb;
      }
    }
  }

</style>
