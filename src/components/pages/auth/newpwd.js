/* global axios, Vue, API */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      working: false,
      validationNotSend: true,
      phone: '',
      password: '',
      validcode: ''
    }
  },
  validations: {
    phone: {
      required: validators.required,
      a: validators.helpers.regex('alpha', /^\d{9}$/)
    },
    password: {
      pwdComplexity: function (value) {
        return Boolean(value.length >= 8 && value.match(/[A-Z]+/) &&
          value.match(/[a-z]+/) && value.match(/[0-9]+/))
      }
    },
    validcode: {
      required: validators.required
    }
  },
  methods: {
    submit: function () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      return this.send()
    },
    send: async function () {
      try {
        const res = await axios.post(`${API}/ooth/local/change-password`, this.$data)
        if (res.status === 200) {
          this.$router.push('/login')
          this.$store.dispatch('toast', {
            message: 'Heslo změněno',
            type: 'success'
          })
        }
      } catch (e) {
        const message = `Nepodařilo se: ${e.toString()}`
        this.$store.dispatch('toast', { message, type: 'error' })
      }
    },
    sendValidationCode: async function () {
      try {
        const res = await axios.post(`${API}/ooth/local/validationcode`, {
          phone: Number(this.$data.phone)
        })
        if (res.status === 200 && res.data.message === 'ok') {
          this.$data.validationNotSend = false
        }
      } catch (e) {
        const message = `Nepodařilo se odeslat SMS: ${e.toString()}`
        this.$store.dispatch('toast', { message, type: 'error' })
      }
    }
  },
  template: `
  <div>
    <h1>Změna hesla</h1>
    <form>

      <b-form-group
        :state="!$v.phone.$error"
        label="Telefon (9 čísel)"
        label-for="phone-input"
        invalid-feedback="Telefonní číslo není správné"
      >
        <b-form-input
          id="phone-input"
          type="number"
          placeholder="9 za sebou jdoucích číslic"
          v-model="$v.phone.$model"
          :state="!$v.phone.$error"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :state="!$v.password.$error"
        label="Nové heslo"
        label-for="password-input"
        invalid-feedback="Heslo neodpovídá požadavkům"
      >
        <b-form-input
          type="password"
          id="password-input"
          placeholder="Minimalně 8 znaků, malá i velká písmena a číslice"
          v-model="$v.password.$model"
          :state="!$v.password.$error"
        ></b-form-input>
      </b-form-group>

      <div class="row">
        <div class="col">
          <b-form-group
            :state="!$v.validcode.$error"
            label="Ověřovací kod (v SMS)"
            label-for="validcode-input"
            invalid-feedback="Ověřovací kód je povinný"
          >
            <b-form-input
              type="number"
              id="validcode-input"
              placeholder="kód, který přišel v SMS"
              v-model="$v.validcode.$model"
              :state="!$v.validcode.$error"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col">
          <b-button v-if="validationNotSend" class='btn btn-secondary'
            @click='sendValidationCode'>
            Zaslat ověřovací kod
          </b-button>
          <span v-else>
            Potvrzovací kod zaslán SMS na {{model.phone}}.
          </span>
        </div>
      </div>

    </form>

    <b-button class="mt-3" :disabled="$v.$anyError" @click="submit">
      <b>Odeslat</b> <i class="fas fa-spinner fa-spin" v-if="working"></i>
    </b-button>
  </div>
  `
})
