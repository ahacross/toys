import _ from 'lodash'
import '@/js/AddPrototype'
import request from '@/js/Ajax'

class Common {
  deepCopy (obj) {
    return _.cloneDeep(obj)
  }
  moveRouter (that, params) {
    that.$router.push(params)
  }
}
const common = new Common()

export { common, request }
