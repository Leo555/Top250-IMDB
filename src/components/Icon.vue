<template>
  <i :class="getClassName()"/>
</template>
<script>
  export default {
    name: 'Icon',
    props: ['type', 'svg'],
    methods: {
      getClassName () {
        var type = this.type.split('.')[0]
        if (this.svg === undefined) {
          return `components-icons components-icons-${type}`
        } else {
          return `components-icons components-icons-svg components-icons-svg-${type}`
        }
      }
    }
  }
</script>

<style lang='less'>
  @import "~styles/components/icon.less";
</style>
