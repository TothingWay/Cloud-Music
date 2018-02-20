import axios from 'axios'
import jsonp from '../assets/js/jsonp'
// 导入地址
import site from './config'

axios.defaults.baseURL = 'http://www.tothingway.me:3000'

export default {
  /*
    @method 轮播图
   */
  banner () {
    return jsonp(site.banner, {
      g_tk: 1716874572,
      uin: 0,
      format: 'jsonp',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1
    }, {
      param: 'jsonpCallback'
    })
  },
  /*
    @method 推荐歌单
   */
  remdList () {
    return axios.get(site.personalized)
  },
  /*
    @method 歌单详情
    @param: id
   */
  remdListDetail (id) {
    return axios.get(site.playlistDetail, {
      params: {
        id
      }
    })
  },
  /*
    @method 最新音乐
   */
  newSong () {
    return axios.get(site.newSong)
  },
  /*
    @method 歌手榜
   */
  singerRank () {
    return axios.get(site.singerRank)
  },
  /*
    @method 歌手单曲
    @param: id
   */
  getArtists (id) {
    return axios.get(site.artists, {
      params: {
        id
      }
    })
  },
  /*
    @method 歌曲地址
    @param: id
   */
  getMusicUrl (id) {
    return axios.get(site.musicUrl, {
      params: {
        id
      }
    })
  },
  /*
    @method 歌曲歌词
    @param: id
   */
  getMusiclyric (id) {
    return axios.get(site.lyric, {
      params: {
        id
      }
    })
  },
  /*
    @method 排行榜
    @param idx
    "0": 云音乐新歌榜,
    "1": 云音乐热歌榜,
    "2": 网易原创歌曲榜,
    "3": 云音乐飙升榜,
    "4": 云音乐电音榜,
    "5": UK排行榜周榜,
    "6": 美国Billboard周榜
    "7": KTV嗨榜,
    "8": iTunes榜,
    "9": Hit FM Top榜,
    "10": 日本Oricon周榜
    "11": 韩国Melon排行榜周榜,
    "12": 韩国Mnet排行榜周榜,
    "13": 韩国Melon原声周榜,
    "14": 中国TOP排行榜(港台榜),
    "15": 中国TOP排行榜(内地榜)
    "16": 香港电台中文歌曲龙虎榜,
    "17": 华语金曲榜,
    "18": 中国嘻哈榜,
    "19": 法国 NRJ EuroHot 30周榜,
    "20": 台湾Hito排行榜,
    "21": Beatport全球电子舞曲榜,
    "22": 云音乐ACG音乐榜,
    "23": 云音乐嘻哈榜
   */
  getRankList (idx) {
    return axios.get(site.rankList, {
      params: {
        idx
      }
    })
  },
  /*
    @method 热门搜索
   */
  getHotKey () {
    return jsonp(site.hotKey, {
      g_tk: 1888361161,
      uin: 0,
      format: 'jsonp',
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'h5',
      needNewCode: 1
    }, {
      param: 'jsonpCallback'
    })
  },
  /*
    @method 搜索
    @param: keywords
   */
  search (keywords, page) {
    return axios.get(site.search, {
      params: {
        keywords,
        offset: page * 30
      }
    })
  },
  /*
    @method 搜索建议
    @param: keywords
    @param: offset  偏移数
   */
  suggest (keywords) {
    return axios.get(site.searchSuggest, {
      params: {
        keywords
      }
    })
  }
}
