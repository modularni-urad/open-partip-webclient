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
      const res = await axios.get(`${API}/paro_call?id=${callId}`)
      this.$data.call = res.data.length ? res.data[0] : null
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
        <div v-else v-for="p in projects" class="col-sm-6">
          <div class="card" style="width: 10rem;">
            <img src="p.photo" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">{p.name}</h5>
              <p class="card-text">{p.desc}</p>
              <router-link to="/profile">
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
