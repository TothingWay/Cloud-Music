import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// svg-icon
import SvgIcon from '@/components/SvgIcon/index.vue'
// vue3-lazyLoad
import lazyPlugin from 'vue3-lazy'
// loading directive
import loadingDirective from '@/components/Loading/directive.js'

import '@/styles/index.scss'

import defaultAlbum from '@/assets/default-album.png'

createApp(App)
  .use(store)
  .use(router)
  .use(lazyPlugin, {
    loading: defaultAlbum
  })
  .component('SvgIcon', SvgIcon)
  .directive('loading', loadingDirective)
  .mount('#app')
