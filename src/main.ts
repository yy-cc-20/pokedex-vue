import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import axios from 'axios';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

const app = createApp(App)

app
  .use(vuetify)
  .use(router)
  .use(store)
  .mount('#app')