<template>
  <scroll :data="scrollData" ref="scroll">
    <div class="remd">
      <Banner :banner="banner"></Banner>
      <RemdList :remdList1="remdList1" :remdList2="remdList2"></RemdList>
      <RemdSong :remdSong="remdSong"></RemdSong>
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
import Banner from '../recommend/Banner'
import RemdList from '../recommend/RemdList'
import RemdSong from '../recommend/RemdSong'
import Scroll from '../common/Scroll'
import { Spinner } from 'vux'
import { scrollMixin } from '../../assets/js/mixin'
import { createNewSong } from '../../assets/js/song'

export default {
  mixins: [scrollMixin],
  data () {
    return {
      // 轮播图数据
      banner: [],
      // 推荐歌单第一行和第二行数据
      remdList1: [],
      remdList2: [],
      remdSong: []
    }
  },
  computed: {
    load () {
      return !this.banner.length || !this.remdList1.length || !this.remdList2.length
    },
    scrollData () {
      return this.banner.concat(this.remdList1, this.remdList2, this.remdSong)
    }
  },
  components: {
    Banner,
    RemdList,
    RemdSong,
    Scroll,
    Spinner
  },
  methods: {
    // 获取banner数据
    getBanner () {
      let This = this
      This.http.banner().then((res) => {
        if (res.code === 0) {
          let data = res.data.slider
          This.banner = []
          for (let i = 0; i < data.length; i++) {
            This.banner.push({
              url: data[i].linkUrl,
              img: data[i].picUrl
            })
          }
        }
      })
    },
    // 获取推荐歌单数据
    getRemdList () {
      let This = this
      This.http.remdList()
        .then(function (res) {
          if (res.data.code === 200) {
            let data = res.data.result
            let max = 6
            This.remdList1 = []
            This.remdList2 = []
            for (let i = 0; i < max; i++) {
              if (i < 3) {
                This.remdList1.push({
                  id: data[i].id,
                  name: data[i].name,
                  img: data[i].picUrl,
                  playCount: data[i].playCount > 10000 ? Math.round(data[i].playCount / 10000) + '万' : Math.round(data[i].playCount)
                })
              } else {
                This.remdList2.push({
                  id: data[i].id,
                  name: data[i].name,
                  img: data[i].picUrl,
                  playCount: data[i].playCount > 10000 ? Math.round(data[i].playCount / 10000) + '万' : Math.round(data[i].playCount)
                })
              }
            }
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    // 获取最新音乐数据
    getRemdSong () {
      let This = this
      This.http.newSong()
        .then(function (res) {
          if (res.data.code === 200) {
            let data = res.data.result
            This.remdSong = This.normalizeSongs(data)

            for (let i = 0; i < This.remdSong.length; i++) {
              // 获取音乐url
              This.http.getMusicUrl(This.remdSong[i].id)
                .then(function (res) {
                  if (res.data.code === 200) {
                    This.remdSong[i].musicUrl = res.data.data[0].url
                  }
                })
                .catch(function (err) {
                  console.log(err)
                })
            }
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    },
    handlePlaylist (playlist) {
      const height = playlist.length > 0 ? 'calc(100% - 139px)' : 'calc(100% - 79px)'
      this.$refs.scroll.$el.style.height = height
      this.$refs.scroll.refresh()
    },
    normalizeSongs (list) {
      let retrn = []
      list.forEach((item) => {
        retrn.push(createNewSong(item))
      })
      return retrn
    }
    /* ...mapMutations({
      setRemdSong: 'SET_REMD_SONG'
    }) */
  },
  created () {
    // 推荐页面数据初始化
    this.getBanner()
    this.getRemdList()
    this.getRemdSong()
  }
}
</script>
<style lang="scss" scoped>
.vux-spinner-lines {
  position: absolute;
  top: 0;
}
</style>
