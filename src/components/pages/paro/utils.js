/* global Vue */
const CDN_URL = '/cdn/'

export function MDImageSrcs2CDN (str) {
  function replacer (match, p1, p2, offset, string) {
    return `![${p1}](${imageSrc2CDN(p2)})`
  }
  const imageRegex = /!\[(.*?)\]\((.*?)\)/g
  return str.replace(imageRegex, replacer)
}

export function imageSrc2CDN (src, width = 800) {
  return `${CDN_URL}?url=${encodeURIComponent(src)}&w=${width}`
}

Vue.filter('cdn', function (value) {
  return imageSrc2CDN(value)
})

Vue.filter('cdnsmall', function (value) {
  return imageSrc2CDN(value, 300)
})
