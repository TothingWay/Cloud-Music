export interface artistType {
  [propName: string]: any
}

export interface singerStateType {
  artist: artistType
  songsOfArtist: Array<unknown>
  loading: true
}
