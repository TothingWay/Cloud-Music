<template>
  <rankWrap
  :imgUrl="coverImgUrl"
  :type="3"
  :list="rankList"
  ></rankWrap>
</template>

<script>
import RankWrap from '../common/RankWrap'
export default {
  data () {
    return {
      coverImgUrl: '',
      rankList: []
    }
  },
  components: {
    RankWrap
  },
  methods: {
    getRank (idx) {
      let This = this
      This.http.getRankList(idx)
        .then(function (res) {
          if (res.data.code === 200) {
            let data = res.data.playlist
            This.rankList = data.tracks
            This.coverImgUrl = data.coverImgUrl
            This.$emit('getHipHop', This.rankList)
          }
        })
        .catch(function (err) {
          console.log(err)
        })
    }
  },
  created () {
    this.getRank(23)
  }
}
</script>
