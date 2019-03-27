import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faDownload,
  faPaintBrush,
  faEraser,
  faTrash,
  faUndo,
  faRedo,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App'

library.add(faDownload, faPaintBrush, faEraser, faTrash, faUndo, faRedo, faTimesCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

new Vue({
  el: '#app',
  render: h => h(App)
})
