import { singersStateType } from '@/store/modules/Singers/data'
import { recommendStateType } from '@/store/modules/Recommend/data'
import { rankStateType } from '@/store/modules/Rank/data'
import { AlbumDetailProps } from '@/store/modules/Album/data'
import { singerStateType } from '@/store/modules/Singer/data'
import { playStateType } from '@/store/modules/Player/data'

export type storeType = {
  recommend: recommendStateType
  singers: singersStateType
  rank: rankStateType
  album: AlbumDetailProps
  singer: singerStateType
  player: playStateType
}
