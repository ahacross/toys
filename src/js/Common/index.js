import _ from 'lodash'
import $ from 'jquery'
import '@/js/Common/AddPrototype'
import request from '@/js/Common/Ajax'
import days from './Day'
import validator from './Validator'

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

export { request, common, $, _, days, validator }
