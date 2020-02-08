/* global Vue, VueMultiselect, axios, API, _ */
const validationMixin = window.vuelidate.validationMixin

export default Vue.extend({
  mixins: [validationMixin],
  components: { Multiselect: VueMultiselect.Multiselect },
  data: () => {
    return {
      working: false,
      formValid: false,
      interrests: 'Krize',
      options: [
        'Doprava', 'Krize', 'Kultura',
        'Úřední', 'Sport', 'Městské bydlení',
        'Poruchy/Odstávky', 'Senioři', 'Mladé rodiny'
      ]
    }
  },
  validations: {
    interrests: {
      goodSelection: function (value) {
        return value.length >= 0
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    submit: function () {
      this.$v.$touch()
      if (this.$v.$invalid) {
        return false
      }
      return this.save()
    },
    save: async function () {
      try {
        this.$data.working = true
        const data = { interrests: this.$data.interrests.join(',') }
        const req = this.$data.uid
          ? axios.put(`${API}/comm_prefs/${this.$data.uid}/`, data)
          : axios.post(`${API}/comm_prefs/`, _.extend(data, { uid: this.$data.uid }))
        await req
        this.$data.working = false
        this.$store.dispatch('toast', {
          message: 'Uloženo',
          type: 'success'
        })
      } catch (e) {
        console.log(e)
        this.$data.working = false
      }
    },
    fetchData: async function () {
      try {
        const res = await axios.get(`${API}/comm_prefs/`)
        res.data.interrests = res.data.interrests ? res.data.interrests.split(',') : []
        Object.assign(this.$data, res.data)
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
  template: `
  <div>
    <h1>Můj profil</h1>
    <form>
      <b-form-group
        :state="!$v.interrests.$error"
        label="Odebíraná témata"
        label-for="budget-input"
        invalid-feedback="je nutné si vybra"
      >
        <multiselect v-model="interrests" :options="options"
          placeholder="vyberte si z menu"
          :multiple="true">
        </multiselect>
      </b-form-group>
    </form>

    <b-button class="mt-3 btn btn-primary" :disabled="$v.$anyError" @click="submit">
      <b>Uložit</b> <i class="fas fa-spinner fa-spin" v-if="working"></i>
    </b-button>
  </div>
  `
})
