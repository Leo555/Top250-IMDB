<template>
  <router-view></router-view>
</template>
<script>
  import {
    SET_MOVIES_DATA
  } from 'constants/actions'
  const movies = require('movies.json')
  export default {
    beforeCreate () {
      this.$store.dispatch(SET_MOVIES_DATA, movies)
    }
  }
</script>
