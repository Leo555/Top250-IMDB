<template>
  <nav id="page-nav">
    <ul class="pagination">
      <li class="page-item prev extend">
        <a class="page-link" href="#">« Prev</a>
      </li>
      <li v-for="page in count">
        <a class="page-link" href="#">{{page}}</a>
      </li>
      <li class="page-item next extend">
        <a class="page-link" href="#">Next »</a>
      </li>
    </ul>
  </nav>
</template>
<script>
  import { PAGE_NUM } from 'constants/index'
  export default {
    data () {
      return {
        current: 0,
        count: []
      }
    },
    mounted () {
      let movies = this.$store.state.movies
      let pages = Math.ceil(movies.length / PAGE_NUM)
      for (let i = 1; i <= pages; i++) this.count.push(i)
    }
  }
</script>
<style lang="less" scoped>
  #page-nav {
    text-align: center;
    margin-top: 30px;
    font-size: 1rem;
    line-height: 1.75;
    li {
      display: inline;
    }
    .extend > a {
      color: #4d4d4d;
      margin: 0 27px;
    }
  }
</style>
