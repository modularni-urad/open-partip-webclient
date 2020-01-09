/* global Vue, VueMultiselect, axios, API */

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
            label: 'Odebíraná témata',
            model: 'interrests',
            id: 'interests',
            placeholder: 'vyberte si z menu',
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
  created () {
    this.fetchData()
  },
  methods: {
    onValidated: function (isValid, errors) {
      this.$data.formValid = isValid
    },
    save: async function () {
      try {
        this.$data.working = true
        const joined = this.$data.model.interrests.join(',')
        const data = Object.assign({}, this.$data.model, { interrests: joined })
        const req = this.$data.model.uid
          ? axios.put(`${API}/comm_prefs/${this.$data.model.uid}/`, data)
          : axios.post(`${API}/comm_prefs/`, data)
        await req
        this.$data.working = false
      } catch (e) {
        console.log(e)
        this.$data.working = false
      }
    },
    fetchData: async function () {
      try {
        const res = await axios.get(`${API}/comm_prefs/`)
        res.data.interrests = res.data.interrests ? res.data.interrests.split(',') : []
        this.$data.model = res.data
        this.$data.working = false
      } catch (e) {
        if (e.response.status === 401) {
          this.$store.commit('logout')
          this.$router.push('/login')
        } else {
          console.log(e)
        }
      }
    }
  },
  computed: {
    submitDisabled: function () {
      return this.$data.formValid !== true || this.$data.working
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

    <button type='submit' class='btn btn-primary' v-on:click='save()'
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      <b>Uložit</b>
    </button>
  </div>
  `
}
