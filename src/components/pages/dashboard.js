/* global axios, API */

export default {
  data: () => {
    return {
      calls: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const res = await axios.get(`${API}/paro/call/`)
      this.$data.calls = res.data
    }
  },
  template: `
  <div>

    <div class="card-group">

      <div class="card">
        <img class="card-img-top" alt="ikona k paro" src="paro.jpg">
        <div class="card-body">
          <h5 class="card-title">Participativní rozpočet</h5>
          <p class="card-text">
            <router-link v-for="c in calls" v-bind:key="c.id"
              :to="{name: 'parocall', params: {call_id: c.id}}">
              <h2 v-if="c.status === 'current'"><i class="fas fa-check"></i> {{c.name}} ...</h2>
              <h4 v-else><i class="fas fa-history"></i> {{c.name}}</h4>
            </router-link>
          </p>
        </div>
      </div>

      <div class="card">
        <img class="card-img-top" alt="ikona anketa" src="anketa.jpg">
        <div class="card-body">
          <h5 class="card-title">Ankety</h5>
          <p class="card-text">
            Tuto sekci připravujeme.
            Budou v ní k dispozici uživatelsky přívětivé akety na různá témata.
            <h4>Stojíme o vaši zpětnou vazbu.</h4>
          </p>
        </div>
      </div>

      <div class="card">
        <img class="card-img-top" alt="ikona k informacím" src="info.jpg">
        <div class="card-body">
          <h5 class="card-title">Info kanály</h5>
          <p class="card-text">
            Tuto sekci připravujeme.
            Budou v ní k dispozici kategorizované informace.
          </p>
        </div>
      </div>

    </div>
  </div>
  `
}
