import _ from 'lodash'
import $ from 'jquery'
import '@/js/AddPrototype'
import request from '@/js/Ajax'

class Common {
  deepCopy (obj) {
    return _.cloneDeep(obj)
  }
  flatMap (obj) {
    return _.flatMap(obj)
  }
  moveRouter (that, params) {
    that.$router.push(params)
  }
  setData (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }
  getData (key) {
    return JSON.parse(localStorage.getItem(key))
  }
}
const common = new Common()

export { common, request, $, _ }
