const fs = require('fs')
const path = require('path')
const jsStringEscape = require('js-string-escape')
const { watch } = require('gulp')

const filePath = path.join(__dirname, '..', '..', 'dist', 'inject.js')
const srcFilePath = path.join(__dirname, '../content-src.js')

function injectJSContent () {
  const inpageContent = fs.readFileSync(filePath, 'utf8').toString()
  let contentSrc = fs.readFileSync(srcFilePath, 'utf8').toString()
  contentSrc = contentSrc.replace('<neeinject></neeinject>', jsStringEscape(inpageContent))
  fs.writeFileSync(path.join(__dirname, '../content.js'), contentSrc)
}

if (process.env.NODE_ENV === 'production') {
  return injectJSContent()
}
// 监听 dist 下 inject.js 变化
watch([srcFilePath, filePath], function (cb) {
  console.log(srcFilePath)
  console.log(' or ')
  console.log(filePath)
  console.log('changed')
  // body omitted
  injectJSContent()
  cb()
})
