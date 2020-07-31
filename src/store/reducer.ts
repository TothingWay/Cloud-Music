import { combineReducers } from 'redux'
import { reducer as recommendReducer } from './modules/Recommend/index'
import { reducer as singersReducer } from './modules/Singers/index'
import { reducer as rankReducer } from './modules/Rank/index'
import { reducer as albumReducer } from './modules/Album/index'
import { reducer as singerReducer } from './modules/Singer/index'
import { reducer as playerReducer } from './modules/Player/index'

export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer,
  rank: rankReducer,
  album: albumReducer,
  singer: singerReducer,
  player: playerReducer,
})
