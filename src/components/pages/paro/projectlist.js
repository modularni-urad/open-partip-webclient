/* global axios, API, _, moment */

export default {
  data: () => {
    return {
      loading: true,
      call: null,
      projects: [],
      myvote: null
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
      this.$data.projects = res[0].data
      this.$data.call = res[1].data[0]
      this.$data.loading = false
      if (this.$store.state.user) {
        const myVote = await axios.get(`${API}/paro_votes/${callId}`)
        this.$data.myvote = _parseVote(myVote.data[0])
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
      // TODO: check call
    }
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
            <button class="btn btn-primary">Vytvořit / upravit projekt</button>
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
        <img :src="p.photo" class="card-img-top projimg" alt="...">
        <div class="card-body">
          <h5 class="card-title">{{p.name}}</h5>
          <p class="card-text">{{p.desc}}</p>
          <p class="card-text">Rozpočet: {{p.total}}</p>
          <router-link :to="{name: 'parodetail', params: {id: p.id}}">
            <button class="btn btn-primary">Detail ...</button>
          </router-link>
          <div v-if="canVote" class="btn-group" role="group">
            <button type="button" class="btn btn-success">PRO</button>
            <button type="button" class="btn btn-danger">PROTI</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
}

function _fillVote (arr, vote) {
  _.each(arr, i => {
    if (i[0] === '+') {
      vote.pos.push(parseInt(i))
    } else {
      vote.neg.push(parseInt(i.substr(1)))
    }
  })
}

function _parseVote (content) {
  const data = {
    pos: [],
    neg: []
  }
  return content ? _fillVote(content.split('|'), data) : data
}
