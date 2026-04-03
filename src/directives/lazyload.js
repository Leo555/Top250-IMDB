/**
 * v-lazy 图片懒加载指令
 * 使用 IntersectionObserver，图片进入视口前显示占位色块，进入后才加载真实 src
 */
const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"%3E%3Crect fill="%23e9e9e9" width="300" height="450"/%3E%3C/svg%3E'

let observer = null

function getObserver () {
  if (observer) return observer
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let el = entry.target
        let realSrc = el.dataset.src
        if (realSrc) {
          el.src = realSrc
          el.removeAttribute('data-src')
        }
        observer.unobserve(el)
      }
    })
  }, {
    rootMargin: '200px 0px'
  })
  return observer
}

export default {
  bind (el, binding) {
    el.dataset.src = binding.value
    el.src = defaultImage
    el.style.backgroundColor = '#e9e9e9'
  },
  inserted (el) {
    if ('IntersectionObserver' in window) {
      getObserver().observe(el)
    } else {
      // fallback: 直接加载
      el.src = el.dataset.src
    }
  },
  update (el, binding) {
    if (binding.value !== binding.oldValue) {
      el.dataset.src = binding.value
      if ('IntersectionObserver' in window) {
        getObserver().observe(el)
      } else {
        el.src = binding.value
      }
    }
  },
  unbind (el) {
    if (observer) {
      observer.unobserve(el)
    }
  }
}
