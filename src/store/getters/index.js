import Constant from '../constant'
import _ from 'lodash'

export default {
  [Constant.CHANGE_VIEW]: (state) => {
    return state.currentView
  },
  [Constant.DATA_GET]: state => payload => {
    console.log('### DATA_GET ###')
    return _.get(state, payload.path)
  }
}
