<template>
  <div class="searchbar">
    <el-autocomplete
      ref="input"
      class="searchbar"
      :popper-class="showItem ? 'searchbar-autocomplete': 'searchbar-autocomplete hide'"
      :fetch-suggestions='querySearch'
      @select="handleSelect"
      custom-item="search-bar-item"
      placeholder='请输入电影名'
      :trigger-on-focus="false"
      @keyup.enter.native="submit"
      v-model.trim="keyword"
    >
      <template slot="prepend">
        <Icon type="search"></Icon>
      </template>
      <template slot="append">
        <Icon v-show="!!keyword" type="close" @click.native="keyword=''"></Icon>
      </template>
    </el-autocomplete>
  </div>
</template>
<script>
  import debounce from 'debounce'
  import { mapGetters } from 'vuex'

  export default {
    name: 'search-bar',
    data () {
      return {
        sMovies: [],
        keyword: '',
        showItem: false,
        hash: {}
      }
    },
    computed: {
      ...mapGetters(['movies'])
    },
    methods: {
      submit (e) {
        this.showItem = false
        let regu = '^[ ]+$'
        let checkNull = new RegExp(regu).test(this.keyword)

        if (!checkNull && this.keyword && this.keyword.length > 0) {
          this.$router.push({
            name: 'Search',
            params: {
              keyword: encodeURIComponent(this.keyword)
            }
          })
        }
        this.keyword = ''
      },
      querySearch: debounce(async function (queryString, cb) {
        if (!queryString || queryString.trim().length === 0) {
          this.showItem = false
          return
        }
        let keyword = this.keyword
        let files = []
        this.sMovies.some(m => {
          if (m.name.includes(keyword)) {
            files.push(m)
          }
          if (files.length >= 10) {
            return true
          }
        })
        files.forEach(file => {
          file.keyword = keyword
        })
        if (files.length) this.showItem = true
        cb(files)
      }, 50),
      handleSelect (item) {
        this.$router.push({
          name: 'View',
          params: {
            id: item.id
          }
        })
        this.showItem = false
        this.keyword = ''
      }
    },
    created () {
      this.movies.map(m => {
        this.sMovies.push({
          id: m.id,
          englishName: m.englishName,
          name: m.subject.title,
          year: m.subject.year,
          order: m.order
        })
      })
    }
  }
</script>
<style lang="less">
  @import "~styles/index";

  .searchbar {
    display: inline-block;
    .components-icons:hover {
      -webkit-transform: scale(1.2);
      -ms-transform: scale(1.2);
      transform: scale(1.2);
    }
  }

  .searchbar {
    .el-input {
      width: 480px;
      i {
        width: 14px;
        height: 14px;
      }
    }
    .el-input-group__prepend {
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      background: #FFFFFF;
      border: 0;
      padding: 0 10px;
      cursor: pointer;
    }
    .el-input-group__append {
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      background: #FFFFFF;
      border: 0;
      padding: 0 10px;
      cursor: pointer;
    }
    input {
      height: 32px;
      border-radius: 16px;
      border: 0;
      font-size: 13px;
      padding-left: 0;
    }
  }

  .searchbar-autocomplete {
    box-shadow: none;
    &.hide {
      display: none;
    }
    .el-scrollbar {
      border: 0;
      box-sizing: border-box;
    }
    .el-autocomplete-suggestion__wrap {
      border-radius: 6px;
      margin: 0 !important;
      padding: 0;
      border: 0;
    }

    ul {
      li {
        border-right: 1px solid #d1dbe5;
        border-left: 1px solid #d1dbe5;
        &:first-child {
          border-top: 1px solid #d1dbe5;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }
        &:last-child {
          border-bottom-left-radius: 6px;
          border-bottom-right-radius: 6px;
          border-bottom: 1px solid #d1dbe5;
        }
        .el-col {
          .ellis();
        }
      }
    }

    &.is-loading {
      ul {
        border: 1px solid #d1dbe5;
        li {
          border: 0;
        }
      }
    }
  }
</style>
