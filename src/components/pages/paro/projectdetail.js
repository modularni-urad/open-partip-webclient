/* global axios, API, marked */

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      project: null
    }
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
    }
  },
  template: `
  <div class="container">
    <div class="row" v-if="!loading">
      <div class="col-sm-12">
        <h2>{{project.name}}</h2>

        <router-link :to="{name: 'parocall', params: {call_id: call.id}}">
          <h4>Výzva: {{call.name}}</h4>
        </router-link>

        <img :src="project.photo" class="card-img-top" alt="...">

        <h4>{{project.desc}}</h4>
        <h3>Rozpočet</h3>
        <p v-html="budgetHTML">{{project.budget}}</p>
        <p>Celkem: {{project.total}}</p>
      </div>
      <div class="col-sm-12">
        <p>{{project.content}}</p>
      </div>
    </div>
  </div>
  `
}
