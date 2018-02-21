<template>
  <scroll ref="scroll" :data="suggestList" class="suggest" :beforeScroll="beforeScroll" @beforeScroll="scrollList">
    <group>
      <cell-box v-for="(item, index) in suggestList" :key="index" @click.native="select(item)">
        <div class="icon"><icon type="search"></icon></div>
        <div class="name">{{isSinger(item)}}</div>
      </cell-box>
    </group>
  </scroll>
</template>

<script>
import { Group, CellBox, Icon } from 'vux'
import Scroll from '../common/Scroll'
import { debounce } from '../../assets/js/until'
import { scrollMixin } from '../../assets/js/mixin'
export default {
  mixins: [scrollMixin],
  props: [
    'keywords'
  ],
  data () {
    return {
      suggestList: [],
      beforeScroll: true
    }
  },
  components: {
    Group,
    CellBox,
    Icon,
    Scroll
  },
  methods: {
    getSuggest (keywords) {
      let This = this
      This.http.suggest(keywords)
        .then((res) => {
          if (res.data.code === 200) {
            This.suggestList = This.formatData(res.data.result)

            let singerData = []
            This.suggestList.forEach((item) => {
              if (item.type === 'singer') {
                singerData.push(item)
              }
            })
            This.$emit('singerData', singerData)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    formatData (data) {
      let ret = []
      if (data.artists) {
        data.artists.forEach((item) => {
          ret.push({
            ...item,
            ...{type: 'singer'}
          })
        })
      }
      if (data.songs) {
        ret = ret.concat(data.songs)
      }
      return ret
    },
    isSinger (item) {
      return item.type === 'singer' ? item.name : `${item.name} - ${this.filterNames(item.artists)}`
    },
    filterNames (names) {
      let ret = []
      names.forEach((item) => {
        ret.push(item.name)
      })
      return ret.join(' / ')
    },
    select (item) {
      this.$emit('select', this.isSinger(item))
    },
    scrollList () {
      this.$emit('scrollSuggest')
    },
    handlePlaylist (playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.scroll.$el.style.bottom = bottom
      this.$refs.scroll.refresh()
    }
  },
  created () {
    this.$watch('keywords', debounce((newValue) => {
      if (this.keywords) {
        this.getSuggest(newValue)
      } else {
        this.suggestList = []
      }
    }, 200))
  }
}
</script>
<style lang='scss' scoped>
.suggest {
  z-index: 3;
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100%;
  height: auto !important;
  background-color: #fff;
  .icon {
    i {
      position: relative;
      top: -1px;
    }
  }
  .name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: normal;
    padding-left: 5px;
    font-size: 14px;
    box-sizing: border-box;
  }
}
</style>
