/* global axios, API */

export default {
  data: () => {
    return {
      profile: false
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const uid = this.$props.feedback.author
      const res = await axios.get(`${API}/auth/uinfo/${uid}`)
      this.$data.profile = res && res.data
    }
  },
  props: ['feedback'],
  template: `
    <span>
      {{ feedback.created | formatDate }}:
      <a v-bind:href="'mailto:' + profile.email">{{ profile.email }}</a>
    </span>
  `
}
