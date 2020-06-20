/* global axios, API, _ */

export default {
  methods: {
    sayYes: async function () {
      const data = { value: 1 }
      await axios.post(`${API}/ankety/votes/${this.survey.id}/${this.optionid}`, data)
      Object.assign(data, { survey_id: this.survey.id, option_id: this.optionid })
      this.$props.votes.push(data)
    },
    sayNo: async function () {
      const data = { value: -1 }
      await axios.post(`${API}/ankety/votes/${this.survey.id}/${this.optionid}`, data)
      Object.assign(data, { survey_id: this.survey.id, option_id: this.optionid })
      this.$props.votes.push(data)
    },
    remove: async function () {
      await axios.delete(`${API}/ankety/votes/${this.survey.id}/${this.optionid}`)
      const idx = _.findIndex(this.$props.votes, { option_id: this.optionid })
      this.$props.votes.splice(idx, 1)
    }
  },
  computed: {
    existing: function () {
      return this.$props.votes.find(i => {
        return i.option_id === this.$props.optionid
      })
    },
    negativeDisabled: function () {
      const negativeCount = this.votes.reduce((acc, i) => {
        return i.value > 0 ? acc : acc + 1
      }, 0)
      return negativeCount >= this.survey.maxnegative
    },
    positiveDisabled: function () {
      const positiveCount = this.votes.reduce((acc, i) => {
        return i.value > 0 ? acc + 1 : acc
      }, 0)
      return positiveCount >= this.survey.maxpositive
    }
  },
  props: ['survey', 'optionid', 'votes'],
  template: `
  <b-button v-if="existing" class="btn btn-danger" @click='remove'>
    odstranit volbu
  </b-button>
  <div v-else class="btn-group" role="group">
    <b-button class="btn btn-success" @click='sayYes'
      :disabled="positiveDisabled">
        PRO
    </b-button>
    <b-button class="btn btn-danger" @click='sayNo'
      :disabled="negativeDisabled">
        PROTI
    </b-button>
  </div>
  `
}
