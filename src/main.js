/* global Vue, VueRouter */
import App from './components/App.js'
import Store from './store.js'

import Register from './components/pages/register.js'
import Login from './components/pages/login.js'
import Dashboard from './components/pages/dashboard.js'
import Profile from './components/pages/profile.js'
import NewPassword from './components/pages/newpwd.js'

const router = new VueRouter({
  routes: [
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/profile', component: Profile },
    { path: '/newpwd', component: NewPassword },
    { path: '', component: Dashboard }
  ]
})

const store = Store(router)

new Vue({
  router,
  store,
  template: App.template
}).$mount('#app')
