import Constant from '../constant'

export default {
  [Constant.CHANGE_VIEW]: (store, payload) => {
    console.log('### CHANGE_VIEW ###')
    store.commit(Constant.CHANGE_VIEW, payload)
  },
  [Constant.DATA_SET]: (store, payload) => {
    console.log('### DATA_SET ###')
    store.commit(Constant.DATA_SET, payload)
  },
  [Constant.DATA_DEL]: (store, payload) => {
    console.log('### DATA_DEL ###')
    store.commit(Constant.DATA_DEL, payload)
  },
  [Constant.DATA_PATH]: (store, payload) => {
    console.log('### DATA_PATH ###')
    store.commit(Constant.DATA_PATH, payload)
  }
}
