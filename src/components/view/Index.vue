<template>
  <div class="movie" :href="movie.name">
    <img :src="`/static/img/${movie.src}`" :alt="movie.name">
    <div class="movie-intro">
      <div class="name">
        <h1>{{movie.order}}. {{movie.name}}</h1>
        <h1 class="score">{{movie.score}}</h1>
      </div>
      <div class="details">
        <p>英文名：<i>{{movie.englishName}}</i></p>
        <p>别名：<i>{{movie.nickName}}</i></p>
        <p>导演：<i>{{movie.director}}</i></p>
        <p>主演：<i>{{movie.actors}}</i></p>
        <p>IMDB：<a :href="`http://www.imdb.cn/title/${movie.imdb}`" target="_blank">{{name}}</a>
          <span v-if="movie.subject">
            豆瓣：<a :href="`https://movie.douban.com/subject/${movie.subject?movie.subject.id:'1292052'}/?from=showing/`"
                                           target="_blank">{{name}}</a>
          </span>
        </p>
        <p>简介：<i class="short">{{movie.short || movie.synopsis}}</i></p>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'Vuex'
  import {
    INIT_MOVIES_DATA
  } from 'constants/actions'
  const movies = require('movies.json')
  export default {
    name: 'movieView',
    computed: {
      ...mapGetters(['movies']),
      name () {
        return this.movie.name.split('（')[0]
      }
    },
    data () {
      return {
        movie: {name: '', imdb: '', href: '', src: ''}
      }
    },
    beforeCreate () {
      this.$store.dispatch(INIT_MOVIES_DATA, movies)
    },
    activated () {
      let name = this.$route.params.name
      this.movie = this.movies.find(m => m.englishName === name)
    }
  }
</script>
