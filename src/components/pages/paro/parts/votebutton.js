/* global axios, API, _ */

export default {
  methods: {
    sayYes: async function () {
      const data = { value: 1 }
      await axios.post(`${API}/paro/votes/${this.call.id}/${this.project.id}`, data)
      Object.assign(data, { proj_id: this.project.id, call_id: this.call.id })
      this.$props.votes.push(data)
    },
    sayNo: async function () {
      const data = { value: 1 }
      await axios.post(`${API}/paro/votes/${this.call.id}/${this.project.id}`, data)
      Object.assign(data, { proj_id: this.project.id, call_id: this.call.id })
      this.$props.votes.push(data)
    },
    remove: async function () {
      await axios.delete(`${API}/paro/votes/${this.call.id}/${this.project.id}`)
      const idx = _.findIndex(this.$props.votes, { proj_id: this.project.id })
      this.$props.votes.splice(idx, 1)
    }
  },
  computed: {
    existing: function () {
      return this.$props.votes.find(i => {
        return i.proj_id === this.$props.project.id
      })
    }
  },
  props: ['call', 'project', 'votes'],
  template: `
  <b-button v-if="existing" class="btn btn-danger" @click='remove'>
    odstranit volbu
  </b-button>
  <div v-else class="btn-group" role="group">
    <b-button class="btn btn-success" @click='sayYes'>PRO</b-button>
    <b-button class="btn btn-danger" @click='sayNo'>PROTI</b-button>
  </div>
  `
}
