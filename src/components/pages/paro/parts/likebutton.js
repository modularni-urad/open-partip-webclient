/* global axios, API, moment */

export default {
  data: () => {
    return {
      support: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const projId = this.$router.currentRoute.params.id
      if (this.$store.state.user) {
        const res = await axios.get(`${API}/paro_support/${projId}`)
        this.$data.support = res && res.data.length > 0
      }
    },
    sendSupport: async function () {
      const projId = this.$router.currentRoute.params.id
      if (this.$data.support) {
        await axios.delete(`${API}/paro_support/${projId}`)
        this.$data.support = false
        this.$props.project.support_count--
      } else {
        const res = await axios.post(`${API}/paro_support/${projId}`)
        this.$data.support = true
        this.$props.project.support_count++
        this.$props.project.state = res.data
      }
    }
  },
  computed: {
    canSupport: function () {
      return moment(this.$props.call.submission_end) > moment() &&
        this.$props.project.state === 'new'
    },
    supportbutt: function () {
      return this.$data.support ? 'Už se mi to nelíbí' : 'Líbí se mi'
    }
  },
  props: ['call', 'project'],
  template: `
    <div v-if="canSupport">
      <b-button v-if="this.$store.state.user" @click='sendSupport'>
        {{supportbutt}}
      </b-button>
      <span v-else="!$store.state.user">
        Pro udílení "Líbí se mi" se přihlašte
      </span>
    </div>
  `
}
