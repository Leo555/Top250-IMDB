<template>
  <section class="movie" :href="movie.id" rel="chapter">
    <router-link :to="_to()">
      <img v-lazy="`/static/img/${movie.src}`" :alt="movie.name">
    </router-link>
    <div class="movie-intro">
      <div class="name">
        <router-link :to="_to()">
          <h2>{{movie.order}}. <template v-for="(part, i) in highlightedParts"><mark v-if="part.highlight" :key="i" class="highlight">{{part.text}}</mark><template v-else>{{part.text}}</template></template></h2>
          <h2 class="score">{{movie.score}}</h2>
        </router-link>
      </div>
      <div class="details">
        <p>英文名：
          <i>{{movie.englishName}}</i>
        </p>
        <p>别名：
          <i>{{movie.nickName}}</i>
        </p>
        <p>导演：<i>{{movie.director}}</i></p>
        <p>主演：<i>{{movie.actors}}</i></p>
        <p>IMDB：<a :href="`https://www.imdb.cn/title${movie.imdb}`" target="_blank" rel="noopener noreferrer">{{name}}</a>
          <span>
            豆瓣：<a :href="`https://movie.douban.com/subject/${movie.subject.id || '1292052'}/?from=showing/`"
                  target="_blank" rel="noopener noreferrer">{{name}}</a>
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
  import mixin from 'mixins'
  import { highlightKeyword } from 'helpers'
  export default {
    props: ['movie', 'keyword'],
    data () {
      return {
        name: this.movie.name.split('（')[0]
      }
    },
    mixins: [mixin],
    computed: {
      highlightedParts () {
        return highlightKeyword(this.movie.name, this.keyword)
      }
    }
  }
</script>
<style lang="less" scoped>

  .movie {
    width: 300px;
    overflow: hidden;
    display: inline-block;
    margin: 40px 20px 0 20px;
    vertical-align: top;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    img {
      width: 100%;
      min-height: 400px;
      display: block;
    }
    .movie-intro {
      width: 100%;
      background: #ccc;
      padding: 10px;
      h2 {
        display: inherit;
        line-height: 30px;
      }
      .score {
        float: right;
      }
      .details {
        color: #9a9a9a;
        font-size: 14px;
        i {
          color: #181818;
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

  @media screen and (max-width: 700px) {
    .movie {
      display: block;
      margin: 40px auto;
    }
  }
</style>
