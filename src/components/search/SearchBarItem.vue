<template>
  <li class="search-bar-item" @click="handleClick">
    <el-row :gutter="20">
      <el-col :span="2">
        <span>{{item.order}}</span>
      </el-col>
      <el-col :span="16" v-html="highlighted"></el-col>
      <el-col :span="6"> {{item.year}}</el-col>
    </el-row>
  </li>
</template>

<script>
  import Emitter from 'element-ui/lib/mixins/emitter'
  export default {
    name: 'search-bar-item',
    mixins: [Emitter],
    props: {
      item: {type: Object, required: true}
    },
    computed: {
      highlighted () {
        let key = this.item.keyword
        let kw = key.replace(/[-\\/^$*+?.()|[\]{}]/g, '\\$&')
        return this.item.name
          .replace(new RegExp(kw, 'ig'), function ($1, $2) {
            return ('<span class="hightlight">' + $1 + '</span>')
          })
      }
    },
    methods: {
      handleClick () {
        this.dispatch('ElAutocomplete', 'select', this.item)
      }
    }
  }
</script>

<style lang="less">
  @import "~styles/index";

  li.search-bar-item {
    &.highlighted {
      background: @dropdown-hover-color;
    }
    .el-row {
      line-height: 38px;
      padding: 0 15px;
      font-size: 12px;
      color: #666;
    }
    .el-col {
      padding: 0 !important;
      i {
        vertical-align: top;
        margin-top: 9px;
        font-size: 20px;
      }

      &:last-child {
        text-align: right;
      }
    }
    &:hover {
      background: @dropdown-hover-color;
    }
  }
</style>

