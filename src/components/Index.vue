<template>
  <div>
    <m-header></m-header>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
  import Header from 'components/Header.vue'
  import {
    INIT_MOVIES_DATA
  } from 'constants/actions'
  const movies = require('movies.json')
  export default {
    name: 'Movie',
    components: {'m-header': Header},
    beforeCreate () {
      this.$store.dispatch(INIT_MOVIES_DATA, movies)
    }
  }
</script>
