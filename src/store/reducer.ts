import { combineReducers } from "redux";
import { reducer as recommendReducer } from './modules/Recommend/index'
import { reducer as singersReducer } from './modules/Singers/index'

export default combineReducers({
  recommend: recommendReducer,
  singers: singersReducer
})