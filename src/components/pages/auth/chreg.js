/* global axios, API */

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
        const uid = this.$store.state.user._id
        const url = `${API}/ooth/local/set-email?uid=${uid}&email=${this.$data.model.email}`
        const res = await axios.put(url)
        if (res.status === 200) {
          this.$data.message = 'Na novou adresu přijde potvrzovací mail'
          this.$store.dispatch('toast', {
            message: 'OK',
            type: 'success'
          })
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
