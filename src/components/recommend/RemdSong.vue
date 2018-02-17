<template>
  <div class="remdSong">
    <h2 class="title">最新音乐</h2>
    <group>
      <CellBox v-for="(item,index) in remdSong" :key="index" @click.native="selectItem(item, index)">
        <img v-lazy="item.picUrl" class="img">
        <div class="music">
          <div class="name ellipsis"><span class="songName" v-text="item.songName"></span><span class="alias" v-if="item.alias.length!==0">（{{item.alias[0]}}）</span></div>
          <div class="singer ellipsis">
            <span>{{item.singerName}}</span>
            -
            <span v-text="item.albumName"></span>
          </div>
          <i class="fa fa-play-circle"></i>
        </div>
      </CellBox>
    </group>
  </div>
</template>

<script>
import { CellBox, Group } from 'vux'
import { mapActions, mapMutations } from 'vuex'

export default {
  props: ['remdSong'],
  components: {
    CellBox,
    Group
  },
  methods: {
    selectItem (item, index) {
      this.setRemdSong(item)
      this.selectPlay({
        list: this.remdSong,
        index
      })
    },
    ...mapActions([
      'selectPlay'
    ]),
    ...mapMutations({
      setRemdSong: 'SET_REMD_SONG'
    })
  }
}
</script>
<style lang='scss' scoped>
.remdSong /deep/{
  position: relative;
  h2.title {
    margin-top: 20px;
  }
  .weui-cell{
    font-size: 16px;
    .img {
      display: inline-block;
      width: 40px;
      outline: 0;
    }
    .music {
      display: inline-block;
      width: calc(100% - 55px);
      position: relative;
      padding-left: 15px;
      .fa-play-circle {
        font-size: 20px;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -10px;
        color: #ccc;
      }
      .name {
        padding-right: 30px;
        .alias {
          color: #888;
          font-size: 15px;
        }
      }
      .singer {
        color: #999;
        font-size: 12px;
        margin-top: 4px;
        padding-right: 30px;
      }
      .total {
        font-size: 13px;
        color: #999;
        line-height: 1;
      }
    }
    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: normal;
    }
  }
}

</style>
