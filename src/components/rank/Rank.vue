<template>
  <scroll ref="scroll" :data="scrollData">
    <div class="rank">
      <h2 class="title">云音乐官方榜</h2>
      <div class="cloud">
        <div class="official" v-for="(item, index) in rankOfficialData" @click="selectItem(item)" :key="index">
          <div class="cover">
            <img v-lazy="item.coverImgUrl">
          </div>
          <ol class="preview">
            <li v-for="(song, index2) in item.tracks.slice(0,3)" :key="index2">
              {{index2+1}}.
              {{song.name}} -
              <span v-for="(names, index3) in song.ar" :key="index3">
                {{song.name}}
              </span>
            </li>
          </ol>
        </div>
      </div>

      <h2 class="title">全球榜</h2>
      <div class="global">
        <div class="wrap" v-for="(item, index) in rankGlobalData" @click="selectItem(item)" :key="index">
          <img v-lazy="item.coverImgUrl">
          <p>{{item.name}}</p>
        </div>
        <div class="wrap"></div>
      </div>
    </div>
    <div class="mask" v-show="rankOfficialData.length !== 4 && rankGlobalData.length !== 20">
      <div class="loading">
        <spinner type="crescent" size="30px"></spinner>
      </div>
    </div>
    <router-view></router-view>
  </scroll>
</template>

<script>
import Scroll from '../common/Scroll'
import { Spinner } from 'vux'
import { scrollMixin } from '../../assets/js/mixin'
import { mapMutations } from 'vuex'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      rankOfficialData: [],
      rankGlobalData: []
    }
  },
  components: {
    Spinner,
    Scroll
  },
  computed: {
    scrollData () {
      return this.rankOfficialData.concat(this.rankGlobalData)
    }
  },
  methods: {
    handlePlaylist (playlist) {
      const height = playlist.length > 0 ? 'calc(100% - 139px)' : 'calc(100% - 79px)'
      this.$refs.scroll.$el.style.height = height
      this.$refs.scroll.refresh()
    },
    getRankData () {
      let This = this
      for (let i = 0; i < 24; i++) {
        This.http.getRankList(i)
          .then(function (res) {
            if (res.data.code === 200) {
              let data = res.data.playlist
              if (i < 4) {
                This.rankOfficialData.push(data)
              } else {
                This.rankGlobalData.push(data)
              }
            }
          })
          .catch(function (err) {
            console.log(err)
          })
      }
    },
    selectItem (item) {
      this.$router.push({
        path: `/rank/${item.id}`
      })
      this.setRankList(item)
    },
    ...mapMutations({
      setRankList: 'SET_RANK_LIST'
    })
  },
  created () {
    this.getRankData()
  }
}
</script>
<style lang='scss' scoped>
h2.title {
  padding-top: 15px;
  margin-bottom: 12px;
  &::after {
    margin-top: -1px;
  }
}
.cloud {
  min-height: 488px;
}
.official {
  height: 120px;
  margin-top: 2px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  .cover {
    width: 120px;
    height: 120px;
    position: relative;
    top: 1px;
    img {
      outline: 0;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .preview {
    width: calc(100% - 145px);
    padding-left: 10px;
    padding-right: 15px;
    height: 119px;
    font-size: 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    font-size: 14px;
    li {
      position: relative;
      overflow: hidden;
      color: #999;
      line-height: 2.3;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
}
.global {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .wrap {
    width: calc((100% / 3) - (4px / 3));
    height: calc(100% / 3);
    margin-right: 2px;
    flex-grow: 1;
    img {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .wrap:nth-of-type(3n){
    margin-right: 0;
  }
  p {
    font-size: 14px;
    padding: 6px 2px 6px 6px;
  }
}

</style>
