
export default {
  template: `
<div>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/">Domů</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="$store.state.user === null" class="nav-link" to="/register">
            Registrovat se
          </router-link>
          <router-link v-else class="nav-link" to="/profile">
            Můj profil
          </router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="javascript:void(0);">Disabled</a>
        </li>
      </ul>
      <button v-if="$store.state.user !== null" class="btn btn-warning"
        v-on:click="$store.commit('logout')">
        Odhlásit
      </button>
      <router-link v-else class="btn btn-primary" to="/login">
        Přihlásit
      </router-link>
    </div>
  </nav>

  <div class="container mx-auto p-4">
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</div>
  `
}
