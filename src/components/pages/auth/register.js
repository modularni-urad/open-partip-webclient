/* global axios, API, Vue */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

const messageMapping = {
  'register.invalid_validation_code': 'Špatný kód z SMS',
  'register.phone_already_registered': 'Toto tel. číslo je už registrováno'
}

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      working: false,
      formValid: false,
      validationSend: false,
      sendingValidation: false,
      phone: '',
      password: '',
      email: '',
      validcode: '',
      agree: ''
    }
  },
  validations: {
    phone: {
      required: validators.required,
      a: validators.helpers.regex('alpha', /^\d{9}$/)
    },
    email: {
      email: validators.email
    },
    password: {
      pwdComplexity: function (value) {
        return Boolean(value.length >= 8 && value.match(/[A-Z]+/) &&
          value.match(/[a-z]+/) && value.match(/[0-9]+/))
      }
    },
    validcode: {
      required: validators.required
    },
    agree: {
      required: function (val) {
        return val === true
      }
    }
  },
  methods: {
    register: async function () {
      try {
        let res = await axios.post(`${API}/ooth/local/register`, this.$data)
        if (res.status === 200) {
          this.$store.dispatch('toast', {
            message: 'Registrováno',
            type: 'success',
            duration: 10000
          })
          const cretentials = {
            username: this.$data.phone,
            password: this.$data.password
          }
          res = await axios.post(`${API}/ooth/local/login`, cretentials)
          // await axios.post(`${API}/login`, null, {
          //   headers: {
          //     Authorization: `JWT ${res.data.token}`
          //   }
          // })
          this.$store.commit('login', res.data.user)
          this.$store.dispatch('toast', {
            message: 'A rovnou přihlášeno :)',
            type: 'success',
            duration: 5000
          })
          this.$router.push('/')
        }
      } catch (e) {
        const message = messageMapping[e.response.data.message]
        this.$store.dispatch('toast', { message, type: 'error' })
      }
    },
    submit: function () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      return this.register()
    },
    sendValidationCode: async function () {
      this.$data.sendingValidation = true
      try {
        const res = await axios.post(`${API}/ooth/local/validationcode`, {
          phone: this.$data.phone
        })
        if (res.status === 200 && res.data.message === 'ok') {
          this.$data.validationSend = true
        }
      } catch (e) {
        const message = `Nepodařilo se odeslat SMS: ${e.toString()}`
        this.$store.dispatch('toast', { message, type: 'error' })
      } finally {
        this.$data.sendingValidation = false
      }
    }
  },
  computed: {
    sendValidationCodeButtDisabled: function () {
      return this.$data.sendingValidation ||
        this.$v.phone.$error || !this.$v.phone.$dirty
    }
  },
  template: `
  <div>
    <h1>Registrace</h1>
    <form>
      <div class="row">
        <div class="col">
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
        </div>

        <div class="col">
          <b-form-group
            :state="!$v.email.$error"
            label="E-mail (nepovinné)"
            label-for="email-input"
            invalid-feedback="Platná emailová adresa, prosím"
          >
            <b-form-input
              id="email-input"
              placeholder='platná emailová adresa'
              v-model="$v.email.$model"
              :state="!$v.email.$error"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-form-group
            :state="!$v.password.$error"
            label="Heslo (Minimalně 8 znaků, malá i velká písmena a číslice)"
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
        </div>

        <div class="col">
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
              <b-button class='btn btn-secondary'
                @click='sendValidationCode'
                :disabled="sendValidationCodeButtDisabled">
                <span v-if="validationSend">Znovu </span>Zaslat ověřovací kod
              </b-button>
              <span v-if="validationSend">
                Potvrzovací kod zaslán SMS na {{phone}}.
              </span>
            </div>
          </div>
        </div>

      </div>

      <hr/>

      <div class="row">
        <div class="col">
          <b-form-group
            :state="!$v.agree.$error"
            label-for="checkbox-agree"
            invalid-feedback="Souhlas je vyžadován"
          >
            <b-form-checkbox
              id="checkbox-agree"
              v-model="$v.agree.$model"
              :state="!$v.agree.$error"
            >
              Souhlasím se <a href="/gdpr.html" target="_blank">zpracováním osobních údajů</a> pro účely komunikace prostřednictvím tohoto webu.
            </b-form-checkbox>
          </b-form-group>
        </div>
      </div>

    </form>

    <b-button class="mt-3" :disabled="$v.$anyError" @click="submit" :disabled="working">
      <b>Registrovat</b> <i class="fas fa-spinner fa-spin" v-if="working"></i>
    </b-button>

  </div>
  `
})
