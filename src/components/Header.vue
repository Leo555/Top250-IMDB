<template>
  <div class="header-wrap">
    <div class="logo">
      IMDB Top250
    </div>
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
<style lang="less">
  .header-wrap {
    height: 54px;
    background: #5a5e66;
    position: relative;
    .logo {
      line-height: 54px;
      text-align: center;
      float: left;
      width: 245px;
      color: #fff;
      font-size: 20px;
    }
  }

</style>
