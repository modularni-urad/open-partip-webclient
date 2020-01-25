/* global axios, AUTH_API */

export default {
  data: () => {
    return {
      working: false,
      formValid: false,
      validationNotSend: true,
      model: {
        phone: '',
        password: '',
        email: '',
        validcode: ''
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'number',
            label: 'Telefon (9 čísel)',
            model: 'phone',
            id: 'phone',
            placeholder: '9 za sebou jdoucích číslic',
            featured: true,
            required: true,
            pattern: /\d{9}/,
            validator: 'regexp'
          },
          {
            type: 'input',
            inputType: 'email',
            label: 'E-mail (nepovinné)',
            model: 'email',
            placeholder: 'platná emailová adresa',
            required: false,
            validator: 'email'
          },
          {
            type: 'input',
            inputType: 'password',
            label: 'Heslo',
            model: 'password',
            required: true,
            hint: 'Minimalně 8 znaků, malá i velká písmena a číslice',
            validator: 'pwdComplexity'
          },
          {
            type: 'input',
            inputType: 'number',
            label: 'Ověřovací kod (v SMS)',
            model: 'validcode',
            required: true,
            pattern: /\d+/,
            validator: 'regexp'
          }
        ]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true,
        validateAsync: true
      }
    }
  },
  methods: {
    onValidated: function (isValid, errors) {
      this.$data.formValid = isValid
    },
    register: async function () {
      try {
        let res = await axios.post(`${AUTH_API}/register`, this.$data.model)
        if (res.status === 200) {
          res = await axios.post(`${AUTH_API}/login`, this.$data.model)
          this.$router.push('')
        }
      } catch (e) {
        console.log(e)
      }
    },
    sendValidationCode: async function () {
      try {
        const res = await axios.post(`${AUTH_API}/validationCode`, {
          phone: this.$data.model.phone
        })
        if (res.status === 200 && res.data.message === 'ok') {
          this.$data.validationNotSend = false
        }
      } catch (e) {
        console.log(e)
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
    <h1>Registrace</h1>
    <form>
      <vue-form-generator :schema="schema" :model="model"
        :options="formOptions" @validated="onValidated">
      </vue-form-generator>
    </form>

    <button type='submit' class='btn btn-primary' v-on:click='register()'
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      <b>Registrovat</b>
    </button>

    <button v-if="validationNotSend" type='submit' class='btn btn-secondary'
      v-on:click='sendValidationCode()'>
      Zaslat potvrzovací kod
    </button>
    <span v-else>
      Potvrzovací kod zaslán SMS na {{model.phone}}.
    </span>
  </div>
  `
}
