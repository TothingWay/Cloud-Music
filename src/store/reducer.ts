import { combineReducers } from 'redux'
import { reducer as recommendReducer } from './modules/Recommend/index'
import { reducer as singersReducer } from './modules/Singers/index'
import { reducer as rankReducer } from './modules/Rank/index'
import { reducer as albumReducer } from './modules/Album/index'

export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer,
  rank: rankReducer,
  album: albumReducer,
})
