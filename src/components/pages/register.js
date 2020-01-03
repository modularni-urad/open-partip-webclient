/* global fetch */

export default {
  name: `Register`,
  data: () => {
    return {
      record: {
        phone: '',
        validation: '',
        email: '',
        password: ''
      },
      errors: {}
    }
  },
  computed: {
    submitDisabled: function () {
      return this.$data.errors !== {}
    }
  },
  watch: {
    'record.phone': {
      deep: true,
      handler: function (newVal, oldVal) {
        if (!newVal) {
          this.$data.errors.phone = 'blbes'
        }
      }
    }
  },
  methods: {
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
      const res = await fetch('http://localhost:3001/local/validationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone: this.$data.record.phone }),
        credentials: 'include'
      })
      const body = await res()
      if (body.status === 'error') {
        alert(body.message)
      }
    }
  },
  template: `
  <div>
    <h1>Registrace</h1>
    <form v-on:submit.prevent='register($data.record)'>
      <div class='form-group'>
        <label for='iphone'>Telefon</label>
        <input class='form-control' id='iphone' type='text'
          v-model='record.phone'>
      </div>
      <div class='form-group'>
        <label for='ivalidation'>Ověření čísla</label>
        <input class='form-control' id='ivalidation' type='text'
          v-model='record.validation'>
        <button type='button' v-on:click='sendValidationCode()'>
          Zaslat SMS
        </button>
      </div>
      <div class='form-group'>
        <label for='ipassword'>Telefon</label>
        <input class='form-control' id='ipassword' type='password'
          v-model='record.password' >
      </div>
      <div class='form-group'>
        <div class='form-check'>
          <input class='form-check-input' type='checkbox' id='invalidCheck3' required>
          <label class='form-check-label' for='invalidCheck3'>
            Souhlasím s podmínkami užití.
          </label>
        </div>
      </div>

      <button type='submit' class='btn btn-primary'
        v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
        Registrovat
      </button>
    </form>
  </div>
  `
}
