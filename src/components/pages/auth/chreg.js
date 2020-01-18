/* global axios, AUTH_API */

export default {
  data: () => {
    return {
      working: false,
      model: {
        email: ''
      },
      message: null
    }
  },
  methods: {
    save: async function () {
      try {
        const res = await axios.post(`${AUTH_API}/set-email`, this.$data.model)
        if (res.status === 200) {
          this.$data.message = 'Na novou adresu přijde potvrzovací mail'
        }
      } catch (e) {
        this.$data.message = e.response.data.message
      }
    }
  },
  computed: {
    submitDisabled: function () {
      return this.$data.formValid !== true
    }
  },
  template: `
  <div>
    <h1>Změna Emailu</h1>
    <form>
      <input v-model="model.email" placeholder="nová emailová adresa">
    </form>

    <div v-if="message">{{message}}</div>

    <button type='submit' class='btn btn-primary' v-on:click='save()'>
      Uložit
    </button>
  </div>
  `
}
