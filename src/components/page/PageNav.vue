<template>
  <nav id="page-nav">
    <ul class="pagination">
      <li class="prev extend">
        <router-link :class="{'disabled': page === 1}" :to="{name: 'Page', params: {p: page - 1}}">
          « Prev
        </router-link>
      </li>
      <li v-for="p in pageArray">
        <router-link v-if="showPage(p)" class="page-number" :class="{'current': page == p}"
                     :to="{name: 'Page', params: {p}}">{{p}}
        </router-link>
        <span v-else-if="showPage(p-1)" class="space">…</span>
      </li>
      <li class="next extend">
        <router-link :class="{'disabled': page === pageArray.length}" :to="{name: 'Page', params: {p: page + 1}}">
          Next »
        </router-link>
      </li>
    </ul>
  </nav>
</template>
<script>
  export default {
    name: 'PageNav',
    props: {
      count: {
        type: Number,
        required: true
      },
      page: {
        type: Number,
        required: true,
        default: 1
      }
    },
    data () {
      return {
        pageArray: []
      }
    },
    methods: {
      /**
       * 分页按钮隐藏条件
       * @param p
       * @returns {boolean}
       */
      showPage (p) {
        if (p === 1 || p === this.count) {
          return true
        }
        if (Math.abs(this.page - p) <= 2) {
          return true
        }
      }
    },
    mounted () {
      // 页码从 1 开始
      this.pageArray = [...Array(this.count + 1).keys()]
      this.pageArray.shift()
    }
  }
</script>
<style lang="less" scoped>
  @import "~styles/utils.less";

  #page-nav {
    user-select: none;
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
      &:hover {
        color: #5e5e5e;
      }
      &:active {
        color: #6a6e76;
      }
    }
    .page-number {
      width: 20px;
      height: 25px;
      background: #4d4d4d;
      display: inline-block;
      color: #fff;
      line-height: 25px;
      font-size: 12px;
      margin: 0 5px 30px;
      border-radius: 2px;
      &:hover {
        .transform
      }
      &:active {
        background: #6a6e76;
      }
    }
    .disabled, .current {
      pointer-events: none;
    }
    .current {
      background: #88acdb;
    }
  }

  @media only screen and (max-width: 450px) {
    #page-nav .extend > a {
      margin: 0 10px;
    }
  }

  @media only screen and (max-width: 360px) {
    #page-nav .extend {
      display: none;
    }

    #page-nav .page-number {
      width: 22px;
      height: 26px;
      line-height: 26px;
    }
  }
</style>
