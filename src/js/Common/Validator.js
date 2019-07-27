const patterns = {
  number: /^[0-9]*$/,
  korean: /^[ㄱ-ㅎㅏ-ㅣ가-힣]*$/,
  alphabet: /^[a-zA-Z\s]*$/,
  email: /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
  mobile: /(01[016789])-?([1-9]{1}[\d]{2,3})-?([\d]{4})$/,
  phone: /^\d{2,3}-\d{3,4}-\d{4}$/,
  character: /^[ㄱ-ㅎㅏ-ㅣ가-힣|a-zA-Z\s]*$/,
  alphabetNumber: /^[a-zA-Z0-9]*$/,
  registrationNumber: /^\d{6}-[1-4]\d{6}$/,
  ipV4: /([0-9]{1,3}) \. ([0-9]{1,3}) \. ([0-9]{1,3}) \. ([0-9]{1,3})/
}

const patternsNot = {
  number: /[\D]/g, // 숫자가 아니면
  alphabet: /[^a-zA-Z]/g, //
  korean: /[^ㄱ-ㅎㅏ-ㅣ가-힣]/g,
  alphabetNumber: /[^a-zA-Z0-9]/g
}

const patternsAdd = {
  mobile: /([\d]{3})([\d]{3,4})([\d]{4})/,
  phone: /(^02.{0}|^01.{1}|[\d]{3})([\d]+)([\d]{4})/,
  registrationNumber: /([\d]{6})([\d*]{7})/
}

const patternsDynamic = {
  isLength (min, max) {
    return new RegExp(`^.{${min},${max}}$`)
  },
  replaceLength (min, max) {
    return new RegExp(`^.{${min},${max}}`)
  }
}

// 확인용
const is = (function () {
  const __ = {}
  __.required = value => (!(value === null || value === undefined || (typeof value === 'string' && value.trim() === '')))

  __.length = (value, min, max) => {
    const regex = patternsDynamic.isLength(min, max)
    return regex.test(value)
  }

  __.number = value => patterns.number.test(value)

  __.alphabet = value => patterns.alphabet.test(value)

  __.korean = value => patterns.korean.test(value)

  __.email = value => patterns.email.test(value)

  __.mobile = value => patterns.mobile.test(value)

  __.phone = value => patterns.phone.test(value)

  __.alphabetNumber = value => patterns.alphabetNumber.test(value)

  __.registrationNumber = value => patterns.registrationNumber.test(value)

  return __
}())

// 입력창에서 입력받을 때 특정 타입만 받을 때 사용
const replace = (function () {
  const __ = {}
  __.length = (value, min, max) => {
    const regex = patternsDynamic.replaceLength(min, max)
    const matchValue = value.match(regex)
    // eslint-disable-next-line no-mixed-operators
    return matchValue && matchValue[0] || ''
  }

  __.number = value => value.replace(patternsNot.number, '')

  __.alphabet = value => value.replace(patternsNot.alphabet, '')

  __.korean = value => value.replace(patternsNot.korean, '')

  __.alphabetNumber = value => value.replace(patternsNot.aphabetNumber, '')

  return __
}())

// 입력창에서 blur 일때 -를 추가할 때
const format = (function () {
  const __ = {}
  __.removeDash = value => value.split('-').join('')

  __.registrationNumber = value => value.replace(patternsAdd.registrationNumber, '$1-$2')

  __.mobile = value => value.replace(patternsAdd.mobile, '$1-$2-$3')

  __.phone = value => value.replace(patternsAdd.phone, '$1-$2-$3')

  return __
}())

export default {
  is,
  replace,
  format
}
