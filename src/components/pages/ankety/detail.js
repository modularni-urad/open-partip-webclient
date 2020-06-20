/* global axios, API, marked */
import { MDImageSrcs2CDN } from './utils.js'
import VoteButton from './parts/votebutton.js'
import UserInfo from './parts/userinfo.js'

export default {
  data: () => {
    return {
      loading: true,
      survey: null,
      options: null,
      myvotes: null
    }
  },
  components: {
    userinfo: UserInfo,
    votebutton: VoteButton
  },
  metaInfo: function () {
    return this.$data.survey ? {
      title: this.$data.survey.name,
      meta: [
        { property: 'og:title', content: this.$data.survey.name },
        { property: 'og:image', content: this.$data.survey.photo || '' },
        { property: 'og:description', content: this.$data.survey.desc }
      ]
    } : {}
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const id = this.$router.currentRoute.params.id
      let res = await axios.get(`${API}/ankety/surveys/?id=${id}`)
      this.$data.survey = res.data.length ? res.data[0] : null
      res = await axios.get(`${API}/ankety/options/${id}`)
      this.$data.options = res.data
      if (this.$store.state.user) {
        res = await axios.get(`${API}/ankety/votes/${id}`)
        this.$data.myvotes = res.data
      }
      this.$data.loading = false
    }
  },
  computed: {
    contentHTML: function () {
      return marked(this.project.content)
    },
    items: function () {
      return [
        { text: 'Domů', to: { name: 'home' } },
        { text: `anketa: ${this.$data.survey.name}`, active: true }
      ]
    },
    canVote: () => {
      return true
    }
  },
  template: `
  <div v-if="!loading">
    <b-breadcrumb :items="items"></b-breadcrumb>
    <div class="row">
      <div class="col-sm-12 col-md-4">
        <h2>{{survey.name}}</h2>

        <img v-if="survey.photo" :src="survey.photo | cdn" class="card-img-top" alt="ilustrační foto">

        <h4>{{survey.desc}}</h4>

        <p>
          Hlasování probáhá:
          {{survey.voting_start | formatDate}} -
          {{survey.voting_end | formatDate}}.
        </p>
      </div>

      <div class="col-sm-12 col-md-8">
        <table class="table">
          <tbody>
            <tr v-for="i in options">
              <td>
                <a v-if="i.link" v-bind:href="i.link" target="_blank">{{ i.title }}</a>
                <span v-else>{{ i.title }}</span>
                <img v-if="i.photo" :src="i.photo | cdn" alt="ilustrační foto">
                <p>
                  <votebutton v-if="canVote" :survey="survey" :optionid="i.id" :votes="myvotes">
                  </votebutton>
                </p>
              </td>
              <td>{{ i.desc }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `
}
