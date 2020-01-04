/* global Vue, VueRouter */
import App from './components/App.js'

import Register from './components/pages/register.js'
import Login from './components/pages/login.js'
import Dashboard from './components/pages/dashboard.js'
import Profile from './components/pages/profile.js'

const router = new VueRouter({
  routes: [
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/profile', component: Profile },
    { path: '', component: Dashboard }
  ]
})

new Vue({
  router,
  template: App.template,
  mounted: function () {
    this.$nextTick(function () {
      console.log('check user')
    })
  }
}).$mount('#app')
