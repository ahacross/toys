import axios from 'axios'
import xmlConverter from 'xml-js'
import cheerio from 'cheerio'

class Ajax {
  constructor (options = { timeout: 30000, token: false }) {
    this._options = options
  }

  url (url) {
    this._options.url = url
    return this
  }

  openApi () {
    this._options.url = 'https://ahacross.me/apis/openApi'
    this._options.method = 'POST'
    return this
  }

  method (method) {
    this._options.method = method
    return this
  }

  headers (headers) {
    this._options.headers = headers
    return this
  }

  datas (datas) {
    this._options.data = JSON.stringify(datas)
    return this
  }

  timeout (time) {
    this._options.timeout = time
    return this
  }

  // 헤더 정보 정리.
  _makeInstance () {
    const instance = axios.create()
    instance.defaults.timeout = this._options.timeout
    instance.defaults.headers = {
      // 'Accept': 'application/json',
      'Content-Type': 'application/json; charset=UTF-8'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    }

    // if(this._options.headers ){
    instance.defaults.headers['Access-Control-Allow-Origin'] = '*'
    instance.defaults.headers['Access-Control-Allow-Headers'] = 'X-Requested-With'

    if (this._options.token) {
      // instance.defaults.headers['access_token'] = cookie.getToken()
    }

    return instance
  }

  async run (fn) {
    await this.promise().then((res) => {
      if (res.$) {
        fn(res)
      } else {
        fn(res.data)
      }
    }).catch((err) => {
      console.error(err)
    })
  }

  async promise () {
    // eslint-disable-next-line no-return-await
    return await this._makeInstance().request(this._options).then((res) => {
      let data = res.data

      if (typeof data === 'string' && /xml/.test(data) && !/!DOCTYPE html/.test(data)) {
        res.data = xmlConverter.xml2js(data, { compact: true, ignoreComment: true, spaces: 4, textKey: 'text' })
      } else if (/!DOCTYPE/.test(data)) {
        res.$ = cheerio.load(data)
      }

      return res
    })
  }
}

function request () {
  return new Ajax()
}

export default request
