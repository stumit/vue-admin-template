import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control


/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
import api from '@/api' // 引入相关的api接口
// 将引入的api接口，放到组件实例原型$API上,这样做之后要使用时可以直接使用，不用引入
Vue.prototype.$API = api
import CategorySelect from '@/components/CategorySelect' // 引入三级联动组件
// 将三级联动组件注册为全局组件
Vue.component(CategorySelect.name, CategorySelect)
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
