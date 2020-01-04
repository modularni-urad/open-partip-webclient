/* global Vue, VueMultiselect, axios, AUTH_API */

Vue.component('multiselect', VueMultiselect.Multiselect)

export default {
  data: () => {
    return {
      working: false,
      formValid: false,
      model: {
        interrests: ''
      },
      schema: {
        fields: [
          {
            type: 'vueMultiSelect',
            selectOptions: {
              multiple: true,
              closeOnSelect: false
            },
            values: [
              'Doprava', 'Krize', 'Kultura',
              'Úřední', 'Sport', 'Městské bydlení',
              'Poruchy/Odstávky', 'Senioři', 'Mladé rodiny'
            ],
            label: 'Zájmy',
            model: 'interrests',
            id: 'interests',
            placeholder: '9 za sebou jdoucích číslic',
            required: true
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
    <h1>Můj profil</h1>
    <form>
      <vue-form-generator :schema="schema" :model="model"
        :options="formOptions" @validated="onValidated">
      </vue-form-generator>
    </form>

    <button type='submit' class='btn btn-primary' v-on:click='register()'
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      <b>Uložit</b>
    </button>
  </div>
  `
}
