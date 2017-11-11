<template>
  <div class="movie-container">
    <article class="movie" :href="movie.name">
      <div class="image-wrap">
        <img :src="`/static/img/${movie.src}`" :alt="movie.name">
      </div>
      <div class="movie-score">
        <p> {{movie.score}}</p>
      </div>
      <div class="movie-intro">
        <header class="name">
          <h1>{{movie.order}}. {{movie.name}}</h1>
        </header>
        <div class="details">
          <p>英文名：<i>{{movie.englishName}}</i></p>
          <p>别名：<i>{{movie.nickName}}</i></p>
          <p>导演：<i>{{movie.director}}</i></p>
          <p>主演：<i>{{movie.actors}}</i></p>
          <p>IMDB：<a :href="`http://www.imdb.cn/title/${movie.imdb}`" target="_blank">{{name}}</a>
            <span v-if="movie.subject">
              豆瓣：<a
              :href="`https://movie.douban.com/subject/${movie.subject?movie.subject.id:'1292052'}/?from=showing/`"
              target="_blank">{{name}}</a>
            </span>
          </p>
          <p>上映时间：<i>{{movie.subject ? movie.subject.year : movie.name | getYear}}</i></p>
          <p>类型：<i>{{movie.subject ? movie.subject.genres.join(', ') : '剧情'}}</i></p>
          <p>简介：<i class="short">{{movie.short || movie.synopsis}}</i></p>
        </div>
        <h3>演职员表</h3>
        <div v-if="movie.subject" class="actors-list">
          <p>导演</p>
          <div class="items">
            <div v-for="d in movie.subject.directors" class="item">
              <a class="director-name" :href="d.alt" target="_blank">
                <p class="image-container">
                  <img :src="`/static/img/avatars/${d.avatars}`" :alt="d.name">
                </p>
                <span>{{d.name}}</span>
              </a>
            </div>
          </div>
          <p>主要演员</p>
          <div class="items">
            <div v-for="d in movie.subject.casts" class="item">
              <a class="director-name" :href="d.alt" target="_blank">
                <p class="image-container">
                  <img :src="`/static/img/avatars/${d.avatars}`" :alt="d.name">
                </p>
                <span>{{d.name}}</span>
              </a>
            </div>
          </div>
        </div>
        <div class="download">
          下载地址：<a :href="movie.download">{{movie.name}}</a>
        </div>
      </div>
    </article>
    <nav class="movie-nav">
      <router-link :to="{name: 'View', params: {name: preview.englishName}}"
                   class="preview nav" v-if="preview && preview.name">
        <Icon type="circle-left"></Icon>
      </router-link>
      <router-link :to="{name: 'View', params: {name: next.englishName}}"
                   class="next nav" v-if="next && next.name">
        <Icon type="circle-right"></Icon>
      </router-link>
    </nav>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

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
        preview: {},
        next: {},
        movie: {name: '', imdb: '', href: '', src: ''}
      }
    },
    methods: {
      init () {
        let name = this.$route.params.name
        this.movie = this.movies.find(m => m.englishName === name)
        if (!this.movie || !this.movie.name) {
        }
        this.preview = this.movies.find(m => m.order === (this.movie.order - 1))
        this.next = this.movies.find(m => m.order === (this.movie.order + 1))
      }
    },
    watch: {
      $route (to, from) {
        if (this._inactive) return
        this.init()
      }
    },
    activated () {
      this.init()
    }
  }
</script>
<style lang="less" scoped>
  .movie-container {
    background: #e9e9e9;
    overflow: hidden;
    .movie {
      position: relative;
      padding: 30px;
      width: 750px;
      margin: 0 auto;
      .image-wrap {
        background: #333;
        img {
          display: block;
          max-width: 400px;
          margin: 0 auto;
        }
      }
      .movie-score {
        position: absolute;
        background: #000;
        filter: alpha(opacity=70);
        filter: alpha(opacity=70);
        opacity: 0.7;
        margin-top: -36px;
        p {
          line-height: 30px;
          padding-left: 20px;
          padding-right: 40px;
          color: #fff;
          font-style: italic;
        }
      }
      .movie-intro {
        padding: 20px 3%;
        h1 {
          font-size: 36px;
          line-height: 46px;
          padding-bottom: 5px;
          padding-top: 5px;
          color: #111;
        }
        p {
          font-size: 13px;
          color: #454545;
          line-height: 24px;
          padding-top: 8px;
          padding-bottom: 8px;
        }
        i {
          color: #181818;
          font-style: normal;
        }
        .actors-list {
          border: 1px solid #ccc;
          p {
            font-size: 18px;
            text-align: center;
          }
          .items {
            display: flex;
            flex-direction: row;
            justify-content: center;
            span {
              line-height: 30px;
            }
            .item {
              margin: 0 10px;
              text-align: center;
              width: 220px;
              .image-container {
                width: 100%;
                height: 0;
                padding-bottom: 150%;
                overflow: hidden;
                img {
                  width: 100%;
                }
              }
            }
          }
        }
        .download {
          margin-top: 26px;
          margin-bottom: 30px;
        }
      }
    }
    .movie-nav {
      overflow: hidden;
      text-align: center;
      position: relative;
      padding: 0 30px;
      bottom: 30px;
      width: 750px;
      margin: 0 auto;
      .nav {
        font-size: 30px;
        padding: 0 3%;
      }
      .preview {
        float: left;
      }
      .next {
        float: right;
      }
      a {
        color: #222;
        line-height: 30px;
      }
    }
  }

  a {
    color: #42b983;
    cursor: pointer;
  }

  h3 {
    line-height: 2em;
  }
</style>
