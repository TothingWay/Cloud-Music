import { combineReducers } from "redux";
import { reducer as recommendReducer } from './modules/Recommend/index'

export default combineReducers({
  recommend: recommendReducer
})