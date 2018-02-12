<template>
  <group>
    <cell-box @click.native="selectItem(item,index)" v-for="(item,index) in list" :key="index">
      <div class="index">{{index+1}}</div>
      <div class="singer-wrapper">
        <div class="name" v-text="item.songName"></div>
        <div class="album" v-text="item.albumName"></div>
        <i class="fa fa-play-circle"></i>
      </div>
    </cell-box>
  </group>
</template>

<script>
import { CellBox, Group } from 'vux'
export default {
  props: [
    'list'
  ],
  components: {
    CellBox,
    Group
  },
  methods: {
    selectItem (item, index) {
      this.$emit('select', item, index)
    }
  }
}
</script>
<style lang='scss' scoped>
.weui-cell {
  padding-left: 0;
  .index {
    width: 40px;
    text-align: center;
    color: #999;
  }
  &:before {
    left: 40px;
  }
}
.singer-wrapper {
  position: relative;
  width: calc(100% - 40px);
  .name {
    font-size: 16px;
  }
  .album {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
  .fa-play-circle {
    font-size: 20px;
    position: absolute;
    right: 0;
    top: 50%;
    margin-top: -10px;
    color: #ccc;
  }
}
</style>
