<template>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</template>
<script>
  import {
    INIT_MOVIES_DATA
  } from 'constants/actions'
  const movies = require('movies.json')
  export default {
    name: 'Movie',
    beforeCreate () {
      this.$store.dispatch(INIT_MOVIES_DATA, movies)
    }
  }
</script>
