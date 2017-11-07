<template>
  <div class="movie" :href="movie.name">
    <router-link :to="_to">
      <img :src="`static/img/${movie.src}`" :alt="movie.name">
    </router-link>
    <div class="movie-intro">
      <div class="name">
        <router-link :to="_to">
          <h1>{{movie.order}}. {{movie.name}}</h1>
          <h1 class="score">{{movie.score}}</h1>
        </router-link>
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
  export default {
    props: ['movie'],
    data () {
      return {
        name: this.movie.name.split('（')[0]
      }
    },
    computed: {
      _to () {
        return {name: 'View', params: {name: this.movie.englishName}}
      }
    }
  }
</script>
<style lang="less" scoped>
  .movie {
    overflow: hidden;
    display: block;
    float: left;
    margin: 40px 20px;
    img {
      width: 250px;
      height: 370px;
      float: left;
    }
    .movie-intro {
      margin-left: 260px;
      width: 600px;
      h1 {
        display: inline-block;
        line-height: 38px;
      }
      .score {
        float: right;
      }
      .details {
        margin-top: 1rem;
        height: 300px;
        color: #9a9a9a;
        font-size: 1rem;
        i {
          color: #000;
          font-style: normal;
        }
        .short {
          color: #414141;
        }
      }
    }
  }

  a {
    color: #42b983;
  }
</style>
