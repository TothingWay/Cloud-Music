import { combineReducers } from "redux";
import { reducer as recommendReducer } from './modules/Recommend/index'
import { reducer as singersReducer } from './modules/Singers/index'
import { reducer as rankReducer } from './modules/Rank/index'

export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer,
  rank: rankReducer,
})