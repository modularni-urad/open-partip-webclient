/* global axios, API, AUTH_API */

export default {
  data: () => {
    return {
      record: {
        username: '',
        password: ''
      },
      error: null,
      errcount: 0
    }
  },
  methods: {
    login: async function () {
      try {
        const res = await axios.post(`${AUTH_API}/login`, this.$data.record)
        await axios.post(`${API}/login`, null, {
          headers: {
            Authorization: `JWT ${res.data.token}`
          }
        })
        this.$store.commit('login', res.data.user)
        this.$router.push('/')
        return res.data
      } catch (err) {
        this.$data.error = err.response.data
        this.$data.errcount++
      }
    }
  },
  computed: {
    submitDisabled: function () {
      return this.$data.record.username.length === 0 || this.$data.record.password.length === 0
    }
  },
  template: `
<form>
  <div class="input-group mb-3">
    <div class="input-group-append">
      <span class="input-group-text"><i class="fas fa-user"></i></span>
      </div>
      <input type="text" name="" class="form-control"
        v-model='record.username' placeholder="Email/Telefon">
    </div>

  <div class="input-group mb-2">
    <div class="input-group-append">
    <span class="input-group-text"><i class="fas fa-key"></i></span>
    </div>
    <input type="password" name="pwd" class="form-control"
      v-model='record.password' placeholder="Heslo">
  </div>

  <div clas="danger" v-if="error">
    Nesprávné přihlašovací údaje!
    <router-link v-if="errcount > 4" to="/newpwd">
      Zapomenuté heslo?
    </router-link>
  </div>

  <div class="d-flex justify-content-center mt-3 login_container">
    <button type="button" name="button" class="btn btn-primary" v-on:click="login" v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      Přihlásit se
    </button>

    <router-link to="/register">Registrovat se</router-link>
  </div>
</form>
  `
}
