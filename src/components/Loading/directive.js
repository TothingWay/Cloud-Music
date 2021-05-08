import { createApp } from 'vue'
import Loading from './index.vue'
import { addClass, removeClass } from '@/utils'

export default {
  mounted(el, binding) {
    const app = createApp(Loading)
    const instance = app.mount(document.createElement('div'))
    const name = Loading.name
    if (!el[name]) {
      el[name] = {}
    }
    el[name].instance = instance

    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  }
}

function append(el) {
  const name = Loading.name
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    addClass(el, 'loading-relative')
  }
  el.appendChild(el[name].instance.$el)
}

function remove(el) {
  const name = Loading.name
  removeClass(el, 'loading-relative')
  el.removeChild(el[name].instance.$el)
}
