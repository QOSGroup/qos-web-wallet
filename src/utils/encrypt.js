export function encrypt (content, passcode) {
  var result = []
  var str = ''
  var codesArr = JSON.parse(content)
  var passLen = passcode.length
  for (var i = 0; i < codesArr.length; i++) {
    var passOffset = i % passLen
    var calAscii = (codesArr[i] - passcode.charCodeAt(passOffset))
    result.push(calAscii)
  }
  for (var j = 0; j < result.length; j++) {
    var ch = String.fromCharCode(result[j])
    str += ch
  }
  return str
}

export function decrypt (content, passcode) {
  var result = []
  var str = ''
  var codesArr = JSON.parse(content)
  var passLen = passcode.length
  for (var i = 0; i < codesArr.length; i++) {
    var passOffset = i % passLen
    var calAscii = (codesArr[i] - passcode.charCodeAt(passOffset))
    result.push(calAscii)
  }
  for (var j = 0; j < result.length; j++) {
    var ch = String.fromCharCode(result[j])
    str += ch
  }
  return str
}
