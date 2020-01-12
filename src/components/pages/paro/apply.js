/* global Vue, VueFormGenerator, axios, API */

VueFormGenerator.validators.resources.fieldIsRequired = 'Toto je povinné'
VueFormGenerator.validators.resources.textTooSmall =
  'Text je moc krátký! Teď: {0}, minimum: {1}'

Vue.use(VueFormGenerator, {
  validators: {
    pwdComplexity: function (value) {
      if (value.length < 8) {
        return 'Heslo neodpovídá požadavkům'
      }
    },
    nonEmptySelection: function (value) {
      if (!value.length) {
        return 'Výběr nesmí být prázdný'
      }
    }
  }
})

export default {
  data: () => {
    return {
      working: false,
      formValid: false,
      model: {
        name: '',
        desc: '',
        content: '',
        photo: '',
        total: ''
      },
      schema: {
        fields: [
          {
            type: 'input',
            inputType: 'text',
            label: 'Název projektu',
            model: 'name',
            id: 'name',
            placeholder: 'zadejte název projektu',
            featured: true,
            required: true,
            max: 32,
            validator: 'string'
          },
          {
            type: 'textArea',
            rows: 3,
            label: 'Popis',
            model: 'desc',
            required: true,
            hint: 'stručný popis projektu',
            max: 128,
            validator: 'string'
          },
          {
            type: 'textArea',
            rows: 7,
            label: 'Úplný popis projektu včetně rozpočtu',
            model: 'content',
            required: true,
            hint: 'Můžete používat markdown',
            max: 1024,
            validator: 'string'
          },
          {
            type: 'input',
            inputType: 'number',
            label: 'Celkové náklady s DPH',
            model: 'total',
            placeholder: 'zadejte číslo',
            required: true,
            validator: 'integer'
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
    fetchData: async function () {
      this.$data.working = true
      const callId = this.$router.currentRoute.params.call_id
      const author = this.$store.state.user._id
      const url = `${API}/paro_proj/?call_id=${callId}&author=${author}`
      const res = await axios.get(url)
      if (res.data.length > 0) this.$data.model = res.data[0]
      this.$data.working = false
    },
    save: async function () {
      const model = this.$data.model
      try {
        this.$data.working = true
        const callId = this.$router.currentRoute.params.call_id
        if (!model.call_id) model.call_id = callId
        const res = model.id
          ? axios.put(`${API}/paro_proj/${model.id}`, model)
          : axios.post(`${API}/paro_proj/`, model)
        await res
        Object.assign(model, res.data)
        this.$data.working = false
      } catch (e) {
        console.log(e)
        this.$data.working = false
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
    <h1>Můj projekt</h1>
    <form>
      <vue-form-generator :schema="schema" :model="model"
        :options="formOptions" @validated="onValidated">
      </vue-form-generator>
    </form>

    <button type='submit' class='btn btn-primary' v-on:click='save()'
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      <b>Uložit</b>
    </button>
    <i class="fas fa-spinner fa-spin" v-if="working"></i>
  </div>
  `
}