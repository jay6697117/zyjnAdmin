const isNullOrEmpty = function (val) {
  if (val === null || val === '' || typeof (val) === 'undefined') {
    return true
  } else {
    return false
  }
}
// eslint-disable-next-line no-extend-native
Date.prototype.Format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    o[k] = o[k] < 10 ? '0' + o[k] : o[k]
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return fmt
}

function durationFormat (data, pattern) {
  var hours = parseInt(data / (60 * 60))
  var minutes = parseInt((data % (60 * 60)) / 60)
  var seconds = data % 60
  if (pattern === '分') {
    // if (hours) {
    return hours + ' 小时 ' + minutes + ' 分钟'
    // } else {
    // return minutes + ' 分钟'
    // }
  } else if (pattern === '秒') {
    minutes = parseInt(data / 60)
    // if (minutes) {
    return minutes + ' 分钟 ' + seconds + ' 秒'
    // } else {
    //   return seconds + ' 秒'
    // }
  } else {
    return (hours < 10 ? ('0' + hours) : hours) + ':' + (minutes < 10 ? ('0' + minutes) : minutes) + ':' + (seconds < 10 ? ('0' + seconds) : seconds)
  }
}

function timeFormat (times, pattern) {
  if (!times) { return '--' }
  if (times.length < 8) {
    return '--'
  }
  var d = new Date(times * 1000).Format('yyyy-MM-dd hh:mm:ss')
  if (pattern) {
    d = new Date(times * 1000).Format(pattern)
  }
  return d
}
function moneyFormat (money) {
  return '￥' + (money / 100).toFixed(2)
}
export {
  isNullOrEmpty,
  timeFormat,
  durationFormat,
  moneyFormat
}
