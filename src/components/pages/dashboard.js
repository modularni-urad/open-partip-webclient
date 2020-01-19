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
        <img class="card-img-top" alt="..."
          src="https://trebicobcanum.net/wp-content/uploads/2017/03/chodnik-na-kopcich-1080x675.jpg">
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
        <img class="card-img-top" alt="..."
          src="http://www.lipnicens.unas.cz/anketa/anketa.jpg">
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
        <img class="card-img-top" alt="..."
          src="http://www.caoh.cz/img/blog/img15102239871000.jpg">
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
