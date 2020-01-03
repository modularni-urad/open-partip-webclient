/* global Vue, VueFormGenerator */

VueFormGenerator.validators.resources.fieldIsRequired = 'Toto je povinné'
VueFormGenerator.validators.resources.textTooSmall =
  'Text je moc krátký! Teď: {0}, minimum: {1}'

Vue.use(VueFormGenerator, {
  validators: {
    pwdComplexity: function (value) {
      if (value.length < 8) {
        return 'Heslo neodpovídá požadavkům'
      }
    }
  }
})

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
            validator: 'string'
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
    register: async function (record) {
      const res = await fetch('http://localhost:3001/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(record),
        credentials: 'include'
      })
      const body = await res.json()
      if (body.status === 'error') {
        alert(body.message)
      }
    },
    sendValidationCode: async function () {
      this.$data.validationNotSend = true
      const res = await fetch('http://localhost:3001/local/validationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: this.$data.model.phone }),
        credentials: 'include'
      })
      const body = await res()
      if (body.status === 'error') {
        alert(body.message)
      }
    }
  },
  computed: {
    submitDisabled: function () {
      return this.$data.formValid === true
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
  </div>
  `
}
