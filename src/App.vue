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

@font-face {font-family: "iconfont";
  src: url('./assets/fonts/iconfont.eot?t=1518500096163'); /* IE9*/
  src: url('./assets/fonts/iconfont.eot?t=1518500096163#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
  url('./assets/fonts/iconfont.ttf?t=1518500096163') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('./assets/fonts/iconfont.svg?t=1518500096163#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-next:before { content: "\e60b"; }

.icon-pre:before { content: "\e60d"; }

.icon-play:before { content: "\e662"; }

.icon-pause:before { content: "\e670"; }

.icon-random:before { content: "\e66b"; }

.icon-circle:before { content: "\e66c"; }

.icon-single:before { content: "\e66d"; }

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
