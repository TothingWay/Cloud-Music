// 接口地址
export default {
  // 歌单相关
  personalized: '/personalized', // 推荐歌单
  playlistDetail: '/playlist/detail', // 获取歌单详情
  // 搜索相关
  search: '/search', // 搜索(音乐 专辑 歌手 歌单)
  searchSuggest: '/search/suggest', // 搜索建议
  like: '/like', // 喜欢音乐
  // 音乐相关
  musicUrl: '/music/url', // 获取音乐url
  lyric: '/lyric', // 获取歌词
  songDetail: '/song/detail', // 获取歌曲详情
  newSong: '/personalized/newsong',
  // 评论相关
  commentMusic: '/comment/music', // 歌曲评论
  commentAlbum: '/comment/album', // 专辑评论
  commentPlaylist: '/comment/playlist', // 歌单评论
  commentLike: '/comment/like', // 给评论点赞
  // banner
  banner: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
  // 歌手相关
  album: '/album', // 获取专辑内容
  artists: '/artists', // 获取歌手单曲
  artistAlbum: '/artist/album', // 获取歌手专辑
  artistDesc: '/artist/desc', // 获取歌手描述
  // 排行榜相关
  rankList: '/top/list', // 各大排行榜
  singerRank: '/toplist/artist' // 歌手榜
}
