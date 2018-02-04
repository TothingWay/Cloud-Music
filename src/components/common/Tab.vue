<template>
    <tab :line-width="2" custom-bar-width="44px">
      <tab-item :selected="nowHash.indexOf('recommend')!=-1" @on-item-click="onItemClick">推荐</tab-item>
      <tab-item :selected="nowHash.indexOf('rank')!=-1" @on-item-click="onItemClick">排行榜</tab-item>
      <tab-item :selected="nowHash.indexOf('singer')!=-1" @on-item-click="onItemClick">歌手榜</tab-item>
    </tab>
</template>

<script>
import { Tab, TabItem } from 'vux'
export default {
  computed: {
    nowHash () {
      return this.$route.path
    }
  },
  components: {
    Tab,
    TabItem
  },
  methods: {
    onItemClick (index) {
      if (index === 0) {
        this.$router.push({name: 'recommend'})
      } else if (index === 1) {
        this.$router.push({name: 'rank'})
      } else if (index === 2) {
        this.$router.push({name: 'singer'})
      }
    }
  }
}
</script>
<style lang='scss' scoped>
  .vux-tab {
    background-color: rgba(255, 255, 255, .97);
    height: 35px;
    .vux-tab-item {
      line-height: 35px;
    }
  }
</style>
