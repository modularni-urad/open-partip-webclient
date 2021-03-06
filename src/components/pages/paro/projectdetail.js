/* global axios, API, marked */
import { MDImageSrcs2CDN } from './utils.js'
import LikeButton from './parts/likebutton.js'
import ProjectStatus from './parts/projectstatus.js'
import UserInfo from './parts/userinfo.js'

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      project: null,
      support: null,
      feedbacks: null
    }
  },
  components: {
    likebutton: LikeButton,
    projstatus: ProjectStatus,
    userinfo: UserInfo
  },
  metaInfo: function () {
    return this.$data.project ? {
      title: this.$data.project.name,
      meta: [
        { property: 'og:title', content: this.$data.project.name },
        { property: 'og:image', content: this.$data.project.photo || '' },
        { property: 'og:description', content: this.$data.project.desc }
      ]
    } : {}
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const projId = this.$router.currentRoute.params.id
      let res = await axios.get(`${API}/paro/project/?id=${projId}`)
      const p = res.data.length ? res.data[0] : null
      if (p) p.content = MDImageSrcs2CDN(p.content)
      this.$data.project = p
      res = await axios.get(`${API}/paro/call/?id=${p.call_id}`)
      this.$data.call = res.data[0]
      res = await axios.get(`${API}/paro/feedback/${projId}`)
      this.$data.feedbacks = res.data
      this.$data.loading = false
    }
  },
  computed: {
    budgetJSON: function () {
      return JSON.parse(this.project.budget)
    },
    contentHTML: function () {
      return marked(this.project.content)
    },
    items: function () {
      return [
        { text: 'Domů', to: { name: 'home' } },
        {
          text: this.$data.call.name,
          to: { name: 'parocall', params: { call_id: this.$data.call.id } }
        },
        { text: this.$data.project.name, active: true }
      ]
    }
  },
  template: `
  <div v-if="!loading">
    <b-breadcrumb :items="items"></b-breadcrumb>
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <h2>{{project.name}}</h2>

        <img v-if="project.photo" :src="project.photo | cdn" class="card-img-top" alt="ilustrační foto">

        <h4>{{project.desc}}</h4>
      </div>

      <div class="col-sm-12 col-md-6">
        <projstatus v-bind:project="project"></projstatus>

        <h3>Rozpočet</h3>
        <p>Celkem: {{project.total}}</p>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Název</th>
              <th scope="col">Počet</th>
              <th scope="col">Cena</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in budgetJSON">
              <td>{{ i.name }} <a v-if="i.link" v-bind:href="i.link" target="_blank">(odkaz)</a></td>
              <td>{{ i.count }}</td>
              <td>{{ i.price }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12">
        <p v-html="contentHTML"></p>

        <p>"Líbí se mi" od {{project.support_count}} uživatelů.</p>
      </div>
      <likebutton v-bind:call="call" v-bind:project="project"></likebutton>
    </div>

    <div v-if="feedbacks.length > 0" class="row">
      <div class="col-sm-12">
        <h3>Posouzení proveditelnosti</h3>
        <ul>
          <li v-for="i in feedbacks">
            <userinfo :feedback="i"></userinfo>:
            <i v-if="i.status==='resolved'" class="text-success fas fa-thumbs-up"></i>
            <i v-else class="text-danger fas fa-thumbs-down"></i>: {{ i.message }}
          </li>
        </ul>
      </div>
    </div>
  </div>
  `
}
