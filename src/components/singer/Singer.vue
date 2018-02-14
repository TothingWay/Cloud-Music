<template>
  <scroll :data="artists" ref="scroll">
    <div class="singer">
      <div class="update">
        <p v-text="updateTime" class="time"></p>
        <popover placement="bottom" class="info">
          <div slot="content" class="content">
            选取热度最高的100名歌手，每天更新。热度由收藏歌手、歌手歌曲的播放、收藏、分享数量等情况综合计算
          </div>
          <a href="javascript:;" class="btn btn-default">
            <i class="fa fa-question-circle-o"></i>
          </a>
        </popover>
      </div>
      <group>
        <cell-box v-for="(item,index) in artists" :key="index" :link="{path:'/singer/'+item.id}" @click.native="selectSinger(item)">
          <!-- 对应排名 -->
          <div class="rankWrap">
            <div class="rank" v-text="index+1"></div>
            <div class="lastRank">
              <i class="fa fa-long-arrow-up green" v-if="item.lastRank - index > 0"></i>
              <i class="fa fa-long-arrow-down red" v-if="item.lastRank - index < 0"></i>
              <i class="minus" v-if="item.lastRank - index === 0">-</i>
              <span class="scope" v-text="Math.abs(item.lastRank - index)" v-if="item.lastRank!=undefined"></span>
              <span v-if="item.lastRank==undefined" class="newRank">new</span>
            </div>
          </div>
          <!-- 歌手头像 -->
          <div class="avatar">
            <img v-lazy="item.img1v1Url">
          </div>
          <div class="describe">
            <h4 class="name" v-text="item.name"></h4>
            <p class="score">
              <x-icon type="ios-flame-outline" size="13px" class="fire"></x-icon>
              <span v-text="item.score"></span>
            </p>
          </div>
        </cell-box>
      </group>
    </div>
    <div class="mask" v-show="load">
      <div class="loading">
        <spinner type="crescent" size="30px"></spinner>
      </div>
    </div>
    <router-view></router-view>
  </scroll>
</template>

<script>
import Scroll from '../common/Scroll'
import { CellBox, Group, dateFormat, Popover, Spinner } from 'vux'
import { mapMutations } from 'vuex'
import { scrollMixin } from '../../assets/js/mixin'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      artists: [],
      // 歌手排行榜最后更新时间戳
      update: 0
    }
  },
  components: {
    Scroll,
    CellBox,
    Group,
    dateFormat,
    Popover,
    Spinner
  },
  computed: {
    // 格式化歌手榜更新时间戳
    updateTime: function () {
      return this.update !== 0 ? dateFormat(new Date(this.update), '最近更新：M月D日') : '最近更新：-月-日'
    },
    load: function () {
      return !this.artists.length
    }
  },
  methods: {
    // 获取歌手排行榜数据
    getSinger () {
      let This = this
      This.http.singerRank()
        .then(function (res) {
          if (res.data.code === 200) {
            let data = res.data
            This.artists = data.list.artists
            This.update = data.list.updateTime
          }
        })
    },
    selectSinger (singer) {
      this.setSinger(singer)
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    handlePlaylist (playlist) {
      const height = playlist.length > 0 ? 'calc(100% - 139px)' : 'calc(100% - 79px)'
      this.$refs.scroll.$el.style.height = height
      this.$refs.scroll.refresh()
    }
  },
  created () {
    this.getSinger()
  }
}
</script>
<style lang='scss' scoped>
.update {
  font-size: 14px;
  padding: 8px 10px;
  .time {
    display: inline-block;
  }
  .info /deep/{
    display: inline-block;
    .btn-default {
      font-size: 14px;
      color: #999;
      padding-left: 5px;
      outline: 0;
    }
    .vux-popover {
      left: 0 !important;
      top: 35px !important;
      margin-left: 5px;
      margin-right: 5px;
      background-color: rgba(#000, .8);
      .content {
        padding: 8px;
        font-size: 12px;
      }
      .vux-popover-arrow-up {
        left: 133px;
        border-bottom: 5px solid rgba(#000, .8);
      }
    }
  }
}
.singer /deep/ {
  .weui-cells {
    margin-top: 0;
    .weui-cell {
      padding-left: 0;
    }
  }
  .rankWrap {
    width: 55px;
    text-align: center;
    line-height: 1.2;
    .minus {
      font-size: 16px;
    }
    .scope {
      font-size: 15px;
      position: relative;
      top: 1px;
    }
    .lastRank {
      color: #999;
      font-size: 12px;
      transform: scale(.7);
    }
    .newRank {
      color: #16A085;
    }
    .green {
      color: #04BE02;
    }
    .red {
      color: #E74C3C;
    }
  }
  .avatar {
    width: 60px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
      outline: 0;
    }
  }
  .describe {
    width: calc(100% - 130px);
    padding-left: 15px;
    h4.name {
      font-weight: 400;
      font-size: 17px;
      margin-bottom: 5px;
      width: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: break-word;
      word-break: break-all;
    }
    .score {
      color: #999;
      line-height: 1.2;
      .fire {
        fill: #999;
      }
      span {
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: break-word;
        word-break: break-all;
        position: relative;
        top: -1px;
      }
    }
  }
}

</style>
