<template>
  <div class="movie" :href="movie.name">
    <a :href="movie.name">
      <img :src="`static/img/${movie.src}`" :alt="movie.name">
    </a>
    <div class="movie-intro">
      <div class="name">
        <a :href="movie.name">
          <h1>{{movie.order}}. {{movie.name}}</h1>
          <h1 class="score">{{movie.score}}</h1>
        </a>
      </div>
      <div class="details">
        <p>英文名：<i>{{movie.englishName}}</i></p>
        <p>别名：<i>{{movie.nickName}}</i></p>
        <p>导演：<i>{{movie.director}}</i></p>
        <p>主演：<i>{{movie.actors}}</i></p>
        <p>IMDB：<a :href="`http://www.imdb.cn/title/${movie.imdb}`">{{name}}</a>
          豆瓣：<a :href="`http://www.imdb.cn/title/${movie.href}`">{{name}}</a></p>
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
    computed: {}
  }
</script>
<style lang="less" scoped>
  .movie {
    overflow: hidden;
    display: block;
    margin: 40px 20px;
    img {
      width: 250px;
      height: 370px;
      float: left;
    }
    .movie-intro {
      margin-left: 260px;
      width: 660px;
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
