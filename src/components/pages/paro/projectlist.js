/* global axios, API, _, moment */
import ProjectStatus from './parts/projectstatus.js'
import VoteButton from './parts/votebutton.js'

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      projects: [],
      myvotes: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const callId = this.$router.currentRoute.params.call_id
      const promises = [
        axios.get(`${API}/paro/project/?call_id=${callId}`),
        axios.get(`${API}/paro/call/?id=${callId}`)
      ]
      this.$store.state.user &&
        promises.push(axios.get(`${API}/paro/votes/${callId}`))
      const res = await Promise.all(promises)
      this.$data.projects = res[0].data
      this.$data.call = res[1].data[0]
      this.$data.loading = false
      if (this.$store.state.user) {
        this.$data.myvotes = res[2].data
      }
    }
  },
  computed: {
    canChangeProject: function () {
      const now = moment()
      return this.$store.state.user &&
        now >= moment(this.$data.call.submission_start) &&
        now <= moment(this.$data.call.thinking_start)
    },
    canVote: function () {
      return this.$store.state.user && this.$data.call.status === 'voting'
    }
  },
  components: {
    projstatus: ProjectStatus,
    votebutton: VoteButton
  },
  template: `
  <div v-if="!loading">

    <div class="row">
      <div class="col-sm-12 col-md-6">
        <h1>{{call.name}}</h1>
      </div>
      <div class="col-sm-12 col-md-6">
          <router-link v-if="canChangeProject"
            :to="{name: 'paroapply', params: {call_id: call.id}}">
            <button class="btn btn-primary">
              <i class="fas fa-edit"></i> Vytvořit / upravit projekt
            </button>
          </router-link>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12 col-md-6">
        <div>
          Začátek podávání návrhů: {{call.submission_start | formatDate}}<br />
          Začátek ověřování proveditelnosti: {{call.submission_end | formatDate}}<br />
          Začátek hlasování: {{call.voting_start | formatDate}}<br />
          Konec hlasování: {{call.voting_end | formatDate}}
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <h3>Alokace: {{call.allocation}} Kč.</h3>
        <p>Každý projekt musí získat {{call.minimum_support}}x "Líbí se mi",
        aby postoupil do fáze ověřování proveditelnosti a poté k hlasování.</p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12">
        <h2>Projekty</h2>
      </div>
    </div>

    <div class="card-columns">
      <div v-if="projects.length === 0">Zatím žádné</div>
      <div v-for="p in projects" class="card proj">
        <img v-if="p.photo" :src="p.photo" class="card-img-top projimg" alt="...">
        <div class="card-body">
          <h5 class="card-title">{{p.name}}</h5>
          <projstatus v-bind:project="p"></projstatus>
          <p class="card-text">{{p.desc}}</p>
          <p class="card-text">Rozpočet: {{p.total}}</p>
          <router-link :to="{name: 'parodetail', params: {id: p.id}}">
            <button class="btn btn-primary">Detail ...</button>
          </router-link>
          <votebutton v-if="canVote" :call="call" :project="p" :votes="myvotes">
          </votebutton>
        </div>
      </div>
    </div>
  </div>
  `
}
