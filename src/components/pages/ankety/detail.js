/* global axios, API, marked */
import VoteButton from './parts/votebutton.js'

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
    votebutton: VoteButton
  },
  metaInfo: function () {
    return this.$data.survey ? {
      title: this.$data.survey.name,
      meta: [
        { property: 'og:title', content: this.$data.survey.name },
        { property: 'og:image', content: this.$data.survey.image || '' },
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
      if (this.$store.getters.userLogged) {
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
    canVote: function () {
      return this.$store.getters.userLogged
    }
  },
  template: `
  <div v-if="!loading">
    <b-breadcrumb :items="items"></b-breadcrumb>
    <div class="row">
      <div class="col-sm-12">
        <h2>{{survey.name}}</h2>

        <img v-if="survey.photo" :src="survey.photo | cdn"
          alt="ilustrační foto ankety">

        <h4>{{survey.desc}}</h4>

        <p>
          Hlasování probíhá:
          {{survey.voting_start | formatDate}} -
          {{survey.voting_end | formatDate}}.
        </p>

        <div v-if="! $store.getters.userLogged" class="alert alert-danger">
          <i class="fas fa-exclamation-circle"></i> Pro hlasování je nutné se přihlásit!
        </div>
      </div>

      <div class="col-sm-12">
        <table class="table">
          <tbody>
            <tr v-for="i in options">
              <td v-if="i.image">
                <img :src="i.image" style="width: 10em;" alt="ilustrační foto">
              </td>
              <td>
                <h3>
                  <a v-if="i.link" v-bind:href="i.link" target="_blank">
                    {{ i.title }}
                  </a>
                  <span v-else>{{ i.title }}</span>
                  &nbsp;
                  <votebutton v-if="canVote" :survey="survey" :optionid="i.id" :votes="myvotes">
                  </votebutton>
                </h3>
                <p v-if="i.desc">{{ i.desc }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `
}
