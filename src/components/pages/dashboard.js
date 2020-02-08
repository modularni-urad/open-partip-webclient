/* global axios, API */

export default {
  data: () => {
    return {
      currentCall: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData: async function () {
      const res = await axios.get(`${API}/paro_call/`)
      this.$data.currentCall = res.data.length ? res.data[0] : null
    }
  },
  template: `
  <div>

    <div class="row">
      <div class="col-sm-12">
        <h2>Rozcestník</h2>
      </div>
    </div>

    <div class="card-group">

      <div class="card">
        <img class="card-img-top" alt="ikona k paro" src="paro.jpg">
        <div class="card-body">
          <h5 class="card-title">Participativní rozpočet</h5>
          <p class="card-text">
            Some quick example text to build on the card title and
            make up the bulk of the card's content.
          </p>
        </div>
        <div class="card-footer">
          <router-link v-if="currentCall"
            :to="{name: 'parocall', params: {call_id: currentCall.id}}">
            <button class="btn btn-primary">Přejít tam</button>
          </router-link>
          <p v-else class="info">Nyní není žádná výzva pro PaRO</p>
        </div>
      </div>

      <div class="card">
        <img class="card-img-top" alt="ikona anketa" src="anketa.jpg">
        <div class="card-body">
          <h5 class="card-title">Ankety</h5>
          <p class="card-text">
            Some quick example text to build on the card title and
            make up the bulk of the card's content.
          </p>
        </div>
        <div class="card-footer">
          Tuto sekci připravujeme.
        </div>
      </div>

      <div class="card">
        <img class="card-img-top" alt="ikona k informacím" src="info.jpg">
        <div class="card-body">
          <h5 class="card-title">Info kanály</h5>
          <p class="card-text">
            Some quick example text to build on the card title and
            make up the bulk of the card's content.
          </p>
        </div>
        <div class="card-footer">
          Tuto sekci připravujeme.
        </div>
      </div>

    </div>
  </div>
  `
}
