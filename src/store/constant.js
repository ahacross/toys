export default {
  CHANGE_VIEW: 'changeView',
  DATA_SET: 'dataSet',
  DATA_GET: 'dataGet',
  DATA_PATH: 'dataPath',
  DATA_DEL: 'dataDel',
  getterUnwrapFn (fn, path) {
    return fn()({ path })
  },
  actionWrapFn (fn, path, value) {
    fn({ path, value })
  }
}
