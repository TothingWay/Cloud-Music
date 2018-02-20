<template>
  <div id="app">
    <search></search>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Search from './components/search/Search'
import Tab from './components/common/Tab'
import Player from './components/player/player'

export default {
  name: 'App',
  components: {
    Search,
    Tab,
    Player
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
html,body {
  height: 100%;
  position: relative;
}
#app {
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
h2.title {
  position: relative;
  padding-left: 9px;
  margin-bottom: 14px;
  font-size: 17px;
  font-weight: normal;
  height: 20px;
  line-height: 20px;
  &:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -8px;
    width: 2px;
    height: 16px;
    background-color: #374047;
  }
}
.mask {
  position: absolute;
  z-index: 101;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: hsla(0,0%,100%,.9);
}
.loading {
  position: absolute;
  width: 100%;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
}
.weui-cells {
  margin-top: 0 !important;
  &:before {
    border-color: #e5e5e5;
  }
}
.weui-cell{
  &:before {
    border-color: #e5e5e5;
  }
}
[v-cloak] {
  display: none;
}
</style>
