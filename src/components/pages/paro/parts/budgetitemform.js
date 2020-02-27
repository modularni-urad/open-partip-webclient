/* global Vue, axios, API, required */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      name: '',
      price: '',
      count: '',
      link: ''
    }
  },
  validations: {
    name: {
      required: validators.required
    },
    price: {
      required: validators.required
    },
    count: {
      required: validators.required
    },
    link: {}
  },
  methods: {
    handleSubmit () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      this.$attrs.onSubmit(this.$data)
      this.$bvModal.hide('modal-add')
    }
  },
  template: `
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group
        :state="!$v.name.$error"
        label="Název"
        label-for="name-input"
        invalid-feedback="Název je povinný"
      >
        <b-form-input
          id="name-input"
          v-model="$v.name.$model"
          :state="!$v.name.$error"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        label="Odkaz"
        label-for="link-input"
      >
        <b-form-input
          id="name-input"
          v-model="$v.link.$model"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :state="!$v.count.$error"
        label="Počet (kusů, m3, atd)"
        label-for="count-input"
        invalid-feedback="Počet je povinný"
      >
        <b-form-input
          id="name-input" type="number"
          v-model="$v.count.$model"
          :state="!$v.count.$error"
        ></b-form-input>
      </b-form-group>

      <b-form-group
        :state="!$v.price.$error"
        label="Cena"
        label-for="price-input"
        invalid-feedback="Cena je povinná"
      >
        <b-form-input
          id="name-input" type="number"
          v-model="$v.price.$model"
          :state="!$v.price.$error"
        ></b-form-input>
      </b-form-group>

      <b-button class="mt-3" block
        :disabled="$v.$anyError"
        @click="handleSubmit">
        Uložit
      </b-button>
    </form>
  `
})
