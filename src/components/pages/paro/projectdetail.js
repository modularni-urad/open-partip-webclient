/* global axios, API, marked, moment */
import LikeButton from './parts/likebutton.js'
import ProjectStatus from './parts/projectstatus.js'

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      project: null,
      support: null
    }
  },
  components: {
    likebutton: LikeButton,
    projstatus: ProjectStatus
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const projId = this.$router.currentRoute.params.id
      let res = await axios.get(`${API}/paro_proj/?id=${projId}`)
      const p = res.data.length ? res.data[0] : null
      this.$data.project = p
      res = await axios.get(`${API}/paro_call/?id=${p.call_id}`)
      this.$data.call = res.data[0]
      this.$data.loading = false
    }
  },
  computed: {
    budgetHTML: function () {
      return marked(this.project.budget)
    },
    contentHTML: function () {
      return marked(this.project.content)
    }
  },
  template: `
  <div v-if="!loading">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <h2>{{project.name}}</h2>

        <router-link :to="{name: 'parocall', params: {call_id: call.id}}">
          <h4>Zpět na: Výzva: {{call.name}}</h4>
        </router-link>

        <projstatus project="project"></projstatus>

        <h4>{{project.desc}}</h4>

        <p v-html="contentHTML"></p>

        <p>Celkem: {{project.total}}</p>
      </div>
      <div class="col-sm-12 col-md-6">
        <img v-if="project.photo" :src="project.photo" class="card-img-top" alt="ilustrační foto">

        <h3>Rozpočet</h3>
        <p v-html="budgetHTML"></p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12">
        "Líbí se mi" od {{project.support_count}} uživatelů.
      </div>
      <likebutton v-bind:call="call" v-bind:project="project"></likebutton>
    </div>
  </div>
  `
}
