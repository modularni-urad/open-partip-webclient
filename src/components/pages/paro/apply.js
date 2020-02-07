/* global axios, API, Vue */
const validationMixin = window.vuelidate.validationMixin
const validators = window.validators

export default Vue.extend({
  mixins: [validationMixin],
  data: () => {
    return {
      working: false,
      name: '',
      desc: '',
      content: '',
      budget: '',
      photo: '',
      total: ''
    }
  },
  validations: {
    name: {
      required: validators.required,
      maxLength: validators.maxLength(32)
    },
    total: {
      required: validators.required
    },
    photo: {
      https: function (value) {
        return (value && Boolean(value.match(/^https:\/\/+/))) || !value
      }
    },
    desc: {
      required: validators.required,
      maxLength: validators.maxLength(128)
    },
    budget: {
      required: validators.required
    },
    content: {
      required: validators.required
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      this.$data.working = true
      const callId = this.$router.currentRoute.params.call_id
      const author = this.$store.state.user._id
      const url = `${API}/paro_proj/?call_id=${callId}&author=${author}`
      const res = await axios.get(url)
      if (res.data.length > 0) Object.assign(this.$data, res.data[0])
      this.$data.working = false
    },
    submit: function () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      return this.save()
    },
    save: async function () {
      const model = this.$data
      try {
        this.$data.working = true
        const callId = this.$router.currentRoute.params.call_id
        if (model.id) {
          await axios.put(`${API}/paro_proj/${model.id}`, model)
        } else {
          const res = await axios.post(`${API}/paro_proj/${callId}`, model)
          model.id = res.data[0]
        }
        this.$store.dispatch('toast', {
          message: 'Uloženo',
          type: 'success'
        })
      } catch (e) {
        this.$store.dispatch('toast', { message: e, type: 'error' })
        console.log(e)
      } finally {
        this.$data.working = false
      }
    }
  },
  template: `
  <div>
    <h1>Můj projekt</h1>
    <form>
      <div class="row">
        <div class="col">
          <b-form-group
            :state="!$v.name.$error"
            label="Název projektu"
            label-for="name-input"
            invalid-feedback="Název je povinný a musí být maximálně 32 znaků dlouhý"
          >
            <b-form-input
              id="name-input"
              placeholder="zadejte název projektu"
              v-model="$v.name.$model"
              :state="!$v.name.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.desc.$error"
            label="Stručný popis projektu"
            label-for="desc-input"
            invalid-feedback="Popis je povinný a musí být maximálně 128 znaků dlouhý"
            description="Můžete používat markdown"
          >
            <b-form-textarea
              id="desc-input"
              placeholder="stručný popis projektu"
              v-model="$v.desc.$model"
              :state="!$v.desc.$error"
              rows="4"
            ></b-form-textarea>
          </b-form-group>

          <b-form-group
            :state="!$v.content.$error"
            label="Úplný popis projektu"
            label-for="content-input"
            invalid-feedback="Úplný popis je povinný"
            description="Můžete používat markdown"
          >
            <b-form-textarea
              id="content-input"
              placeholder="Můžete používat markdown"
              v-model="$v.content.$model"
              :state="!$v.content.$error"
              rows="10"
            ></b-form-textarea>
          </b-form-group>

        </div>
        <div class="col">
          <b-form-group
            :state="!$v.total.$error"
            label="Celkové náklady s DPH"
            label-for="total-input"
            invalid-feedback="Toto je povinné"
          >
            <b-form-input
              id="total-input"
              type="number"
              placeholder="zadejte číslo"
              v-model="$v.total.$model"
              :state="!$v.total.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.photo.$error"
            label="Obrázek projektu"
            label-for="photo-input"
            invalid-feedback="adresa obrázku musí začínat https"
          >
            <template slot="description">
              Nahrát můžete např. přes <a href="https://1iq.cz/" target="_blank">1iq.cz</a>
            </template>

            <b-form-input
              id="photo-input"
              placeholder="zadejte adresu obrázku"
              v-model="$v.photo.$model"
              :state="!$v.photo.$error"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            :state="!$v.budget.$error"
            label="Rozpočet projektu"
            label-for="budget-input"
            invalid-feedback="Rozpočet projektu je povinný a musí být maximílně 128 znaků dlouhý"
          >
            <b-form-textarea
              id="budget-input"
              placeholder="Můžete používat markdown"
              v-model="$v.budget.$model"
              :state="!$v.budget.$error"
              rows="10"
            ></b-form-textarea>
          </b-form-group>
        </div>
      </div>
    </form>

    <b-button class="mt-3 btn btn-primary" :disabled="$v.$anyError" @click="submit">
      <b>Uložit</b> <i class="fas fa-spinner fa-spin" v-if="working"></i>
    </b-button>
  </div>
  `
})
