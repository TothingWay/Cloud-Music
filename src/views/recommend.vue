<template>
  <div v-loading="loading" class="recommend">
    <Scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <Slider v-if="banners.length" :banners="banners"></Slider>
          </div>
        </div>
        <div class="recommend-list">
          <div v-show="!loading" class="title">推荐歌单</div>
          <div class="albums">
            <div v-for="item in albums" :key="item.id" class="album-item">
              <div class="img-wrapper">
                <div class="decorate"></div>
                <img
                  v-lazy="item.picUrl + '?param=300x300'"
                  width="100%"
                  height="100%"
                  alt="album"
                />
                <div class="play-count">
                  <SvgIcon icon-class="play" class-name="icon-play" />
                  <span class="count">
                    {{ calculateCount(item.playCount) }}
                  </span>
                </div>
              </div>
              <div class="desc">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { getBannerListRequest, getRecommendListRequest } from '@/api/recommend.js'
import { calculateCount } from '@/utils'
import Slider from '@/components/Slider/index.vue'
import Scroll from '@/components/Scroll/index.vue'
export default {
  components: {
    Slider,
    Scroll
  },
  data() {
    return {
      banners: [],
      albums: []
    }
  },
  computed: {
    loading() {
      if (this.banners.length && this.albums.length) {
        return false
      } else {
        return true
      }
    }
  },
  created() {
    this.handleBannerList()
    this.handleRecommendList()
  },
  mounted() {},
  methods: {
    calculateCount,
    handleBannerList() {
      getBannerListRequest().then((res) => {
        if (res.code === 200) {
          this.banners = res.banners
        }
      })
    },
    handleRecommendList() {
      getRecommendListRequest().then((res) => {
        if (res.code === 200) {
          this.albums = res.result
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .title {
        font-weight: 700;
        padding-left: 6px;
        font-size: $font-size-medium-x;
        color: $color-text;
        padding-bottom: 10px;
        padding-top: 20px;
      }
      .albums {
        width: 100%;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-around;
      }
      .album-item {
        position: relative;
        width: 32%;
        .decorate {
          z-index: 1;
          position: absolute;
          top: 0;
          width: 100%;
          height: 35px;
          border-radius: 3px;
          background: linear-gradient(hsla(0, 0%, 43%, 0.4), hsla(0, 0%, 100%, 0));
        }
      }
      .img-wrapper {
        position: relative;
        height: 0;
        padding-bottom: 100%;
        .play-count {
          z-index: 1;
          position: absolute;
          right: 2px;
          top: 2px;
          font-size: $font-size-small;
          line-height: 15px;
          color: $color-text-light;
          .play {
            vertical-align: top;
          }
        }
        img {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
        .icon-play {
          margin-right: 2px;
        }
      }
      .desc {
        overflow: hidden;
        margin-top: 2px;
        padding: 0 2px;
        height: 50px;
        text-align: left;
        font-size: $font-size-small;
        line-height: 1.4;
        color: $color-text;
      }
    }
  }
}
</style>
