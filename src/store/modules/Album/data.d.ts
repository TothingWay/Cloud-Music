export interface AlbumDetailProps {
  currentAlbum: Object<CurrentAlbum>
  pullUpLoading?: boolean
  enterLoading?: boolean
  startIndex?: number
  totalCount?: number
}

export interface CurrentAlbum {
  creator: AlbumCreator
  coverImgUrl: string
  subscribedCount: number
  name: string
  tracks: Array<AlbumTracks>
}

interface AlbumCreator {
  avatarUrl: string
  nickname: string
}

interface AlbumTracks {
  name: string
  ar: Array<any>
  al: {
    name: string
  }
}
