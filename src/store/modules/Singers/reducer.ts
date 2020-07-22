import * as actionTypes from './constants'
import { singerStateType } from './data.d'
import produce from 'immer'

const defaultState: singerStateType = {
  singerList: [],
  enterLoading: true,     //控制进场Loading
  pullUpLoading: false,   //控制上拉加载动画
  pullDownLoading: false, //控制下拉加载动画
  offset: '0',            //这里是当前页数
  category: '-1',       //分类
  singerType: '-1',       //男歌手/女歌手/乐队
  alpha: '',              //热门/字母
}

export default (state = defaultState, action: any) => {
  return produce(state, draft => {
    switch (action.type) {
      case actionTypes.CHANGE_SINGER_LIST:
        draft.singerList = action.data
        break
      case actionTypes.CHANGE_PAGE_COUNT:
        draft.offset = action.data
        break
      case actionTypes.CHANGE_ENTER_LOADING:
        draft.enterLoading = action.data
        break
      case actionTypes.CHANGE_PULLUP_LOADING:
        draft.pullUpLoading = action.data
        break
      case actionTypes.CHANGE_PULLDOWN_LOADING:
        draft.pullDownLoading = action.data
        break
      case actionTypes.CHANGE_CATOGORY:
        draft.category = action.data
        break
      case actionTypes.CHANGE_ALPHA:
        draft.alpha = action.data
        break
      case actionTypes.CHANGE_SINGER_TYPE:
        draft.singerType = action.data
        break
    }
  })
}