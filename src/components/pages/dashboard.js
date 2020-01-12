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
  <div class="container">

    <div class="row">
      <div class="col-sm-12">
        <h2>Rozcestník</h2>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-6">
        <div class="card" style="width: 18rem;">
          <img class="card-img-top" alt="..."
            src="https://trebicobcanum.net/wp-content/uploads/2017/03/chodnik-na-kopcich-1080x675.jpg">
          <div class="card-body">
            <h5 class="card-title">Participativní rozpočet</h5>
            <p class="card-text">
              Some quick example text to build on the card title and
              make up the bulk of the card's content.
            </p>
            <router-link v-if="currentCall"
              :to="{name: 'parocall', params: {call_id: currentCall.id}}">
              <button class="btn btn-primary">Přejít tam</button>
            </router-link>
            <p v-else class="info">Nyní není žádná výzva pro PaRO</p>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card" style="width: 18rem;">
          <img src="https://image.shutterstock.com/image-vector/settings-icon-isometric-template-web-600w-1129890074.jpg" class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">Můj profil</h5>
            <p class="card-text">
              Zde se nastavuje jaké žánry informací chcete dostávat.
            </p>
            <router-link to="/profile">
              <button class="btn btn-primary">Přejít tam</button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
}