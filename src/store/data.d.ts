import { singerStateType } from '@/store/modules/Singers/data';
import { recommendStateType } from '@/store/modules/Recommend/data'
import { rankStateType } from '@/store/modules/Rank/data';
import { AlbumDetailProps } from '@/store/modules/Album/data';

export type storeType = {
  recommend: recommendStateType
  singers: singerStateType
  rank: rankStateType
  album: AlbumDetailProps
}
