/* global Vue, VueRouter */
import App from './components/App.js'
import Store from './store.js'

import Register from './components/pages/auth/register.js'
import Login from './components/pages/auth/login.js'
import NewPassword from './components/pages/auth/newpwd.js'
import ChangeRegistration from './components/pages/auth/chreg.js'

import Dashboard from './components/pages/dashboard.js'
import Profile from './components/pages/profile.js'

import ParoApply from './components/pages/paro/apply.js'
import ParoProjectList from './components/pages/paro/projectlist.js'
import ParoProjDetail from './components/pages/paro/projectdetail.js'

const router = new VueRouter({
  routes: [
    { path: '/register', component: Register },
    { path: '/login', component: Login },
    { path: '/newpwd', component: NewPassword },
    { path: '/chreg', component: ChangeRegistration },
    { path: '/profile', component: Profile },
    { path: '/paro/:call_id', component: ParoProjectList, name: 'parocall' },
    { path: '/paro/:call_id/apply', component: ParoApply, name: 'paroapply' },
    { path: '/paro/project/:id', component: ParoProjDetail, name: 'parodetail' },
    { path: '', component: Dashboard }
  ]
})

const store = Store(router)

new Vue({
  router,
  store,
  template: App.template
}).$mount('#app')
