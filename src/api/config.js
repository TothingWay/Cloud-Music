// 接口地址
export default {
  // 歌单相关
  personalized: '/personalized', // 推荐歌单
  playlistDetail: '/playlist/detail', // 获取歌单详情
  // 搜索相关
  search: '/search', // 搜索(音乐 专辑 歌手 歌单)
  searchSuggest: '/search/suggest', // 搜索建议
  hotKey: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg', // 热门搜索
  // 音乐相关
  musicUrl: '/music/url', // 获取音乐url
  lyric: '/lyric', // 获取歌词
  newSong: '/personalized/newsong',
  // banner
  banner: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  // 歌手相关
  artists: '/artists', // 获取歌手单曲
  // 排行榜相关
  rankList: '/top/list', // 各大排行榜
  singerRank: '/toplist/artist' // 歌手榜
}
