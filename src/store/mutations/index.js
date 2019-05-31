import Constant from '../constant'
import _ from 'lodash'

export default {
  [Constant.CHANGE_VIEW]: (state, payload) => {
    state.currentView = payload.view
  },
  [Constant.DATA_SET]: (state, payload) => {
    _.set(state, payload.path, payload.value)
  },
  [Constant.DATA_DEL]: (state, payload) => {
    _.unset(state, payload.path)
  },
  [Constant.DATA_PATH]: (state, payload) => {
    state.dataGetPath = payload.path
  }
}
