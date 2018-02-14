<template>
  <scroll :data="remdData" ref="scroll">
    <div class="remd">
      <Banner :banner="remdData.banner"></Banner>
      <RemdList :remdList1="remdData.remdList1" :remdList2="remdData.remdList2"></RemdList>
      <RemdSong :remdSong="remdData.remdSong"></RemdSong>
    </div>
    <div class="mask" v-show="load">
      <div class="loading">
        <spinner type="crescent" size="30px"></spinner>
      </div>
    </div>
  </scroll>
</template>

<script>
import Banner from '../recommend/Banner'
import RemdList from '../recommend/RemdList'
import RemdSong from '../recommend/RemdSong'
import Scroll from '../common/Scroll'
import { Spinner } from 'vux'
import { scrollMixin } from '../../assets/js/mixin'
export default {
  mixins: [scrollMixin],
  data () {
    return {
      // 轮播图数据
      remdData: {
        banner: [],
        // 推荐歌单第一行和第二行数据
        remdList1: [],
        remdList2: [],
        // 最新音乐数据
        remdSong: []
      }
    }
  },
  computed: {
    load: function () {
      return !this.remdData.banner.length || !this.remdData.remdList1.length || !this.remdData.remdList2.length || !this.remdData.remdSong.length
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
          This.remdData.banner = []
          for (let i = 0; i < data.length; i++) {
            This.remdData.banner.push({
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
            This.remdData.remdList1 = []
            This.remdData.remdList2 = []
            for (let i = 0; i < max; i++) {
              if (i < 3) {
                This.remdData.remdList1.push({
                  id: data[i].id,
                  name: data[i].name,
                  img: data[i].picUrl,
                  playCount: data[i].playCount > 10000 ? Math.round(data[i].playCount / 10000) + '万' : Math.round(data[i].playCount)
                })
              } else {
                This.remdData.remdList2.push({
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
            This.remdData.remdSong = res.data.result
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
    }
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
