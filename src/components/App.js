/* global Vue, VueToast */

Vue.use(VueToast, {
  // One of options
  position: 'top-right'
})

export default {
  template: `
<div>
  <b-navbar toggleable="lg" variant="dark" type="dark">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item>
          <router-link class="nav-link" to="/"><i class="fas fa-home"></i> Domů</router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link class="nav-link" to="/">Info Kanály</router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link v-if="$store.state.user === null" class="nav-link" to="/register">
            Registrovat se
          </router-link>
          <router-link v-else class="nav-link" to="/profile">
            Můj profil
          </router-link>
        </b-nav-item>
        <b-nav-item>
          <router-link v-if="$store.state.user !== null" class="nav-link" to="/chreg">
            Změna registrace
          </router-link>
        </b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <button v-if="$store.state.user !== null" class="btn btn-warning"
          v-on:click="$store.commit('logout')">
          <i class="fas fa-sign-out-alt"></i> Odhlásit
        </button>
        <router-link v-else class="btn btn-primary" to="/login">
          Přihlásit
        </router-link>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>

  <div class="container-fluid mx-auto p-4">
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</div>
  `
}
