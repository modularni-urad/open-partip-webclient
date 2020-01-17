/* global axios, API, marked, moment */

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      project: null,
      support: null
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
      res = await axios.get(`${API}/paro_support/${projId}`)
      this.$data.support = res.data.length > 0
      this.$data.loading = false
    },
    sendSupport: async function () {
      const projId = this.$router.currentRoute.params.id
      if (this.$data.support) {
        await axios.delete(`${API}/paro_support/${projId}`)
        this.$data.support = false
        this.$data.project.support_count--
      } else {
        const res = await axios.post(`${API}/paro_support/${projId}`)
        this.$data.support = true
        this.$data.project.support_count++
        this.$data.project.state = res.data
      }
    }
  },
  computed: {
    budgetHTML: function () {
      return marked(this.project.budget)
    },
    canSupport: function () {
      return moment(this.call.submission_end) > moment() &&
        this.project.state === 'new'
    },
    supportbutt: function () {
      return this.$data.support ? 'Už se mi to nelíbí' : 'Líbí se mi'
    }
  },
  template: `
  <div class="container">
    <div class="row" v-if="!loading">
      <div class="col-sm-12 col-md-6">
        <h2>{{project.name}}</h2>

        <router-link :to="{name: 'parocall', params: {call_id: call.id}}">
          <h4>Výzva: {{call.name}}</h4>
        </router-link>

        <h4>{{project.desc}}</h4>
        <h3>Rozpočet</h3>
        <p v-html="budgetHTML">{{project.budget}}</p>
        <p>Celkem: {{project.total}}</p>
        <div v-if="canSupport">
          {{project.support_count}}
          <button class="btn btn-primary" v-on:click='sendSupport()'>
            {{supportbutt}}
          </button>
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <img :src="project.photo" class="card-img-top" alt="...">
        <p>{{project.content}}</p>
      </div>
    </div>
  </div>
  `
}
