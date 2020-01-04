
export default {
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
            <router-link to="/foo"><button class="btn btn-primary">Přejít tam</button></router-link>

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
