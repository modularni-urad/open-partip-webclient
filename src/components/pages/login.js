/* global axios */

export default {
  data: () => {
    return {
      record: {
        username: '',
        password: ''
      },
      errors: {}
    }
  },
  methods: {
    login: async function () {
      const res = await axios.post('/user', this.$data.record)
      return res.data
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

  <div class="d-flex justify-content-center mt-3 login_container">
    <button type="button" name="button" class="btn btn-primary" v-on:click="login" v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      Přihlásit se
    </button>
  </div>
</form>
  `
}
