/* global axios, API */

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      projects: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const callId = this.$router.currentRoute.params.call_id
      const res = await Promise.all([
        axios.get(`${API}/paro_proj/?call_id=${callId}`),
        axios.get(`${API}/paro_call/?id=${callId}`)
      ])
      this.$data.projects = res[0].data.length ? res[0].data : null
      this.$data.call = res[1].data[0]
      this.$data.loading = false
    }
  },
  template: `
  <div class="container">

    <div class="row" v-if="!loading">
      <div class="col-sm-12">
        <h1>{{call.name}}</h1>

        <router-link v-if="call.status !== 'closed'"
          :to="{name: 'paroapply', params: {call_id: call.id}}">
          <button class="btn btn-primary">Vytvořit / upravit projekt</button>
        </router-link>
      </div>
    </div>

    <div class="row" v-if="!loading">
      <div class="col-sm-12">
        <h2>Projekty</h2>
        <div v-if="projects.length === 0">Zatím žádné</div>
        <div v-else class="card-group">
          <div v-for="p in projects" class="card" style="width: 10rem;">
            <img :src="p.photo" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">{{p.name}}</h5>
              <p class="card-text">{{p.desc}}</p>
              <p class="card-text">Rozpočet: {{p.total}}</p>
              <router-link :to="{name: 'parodetail', params: {id: p.id}}">
                <button class="btn btn-primary">Detail</button>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
}
