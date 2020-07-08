import { singerStateType } from '@/store/modules/Singers/data';
import { recommendStateType } from '@/store/modules/Recommend/data.d'

export type storeType = {
  recommend: recommendStateType
  singers: singerStateType
}
