(function () {
  'use strict';

  /* global Vue, VueToast */

  Vue.use(VueToast, {
    // One of options
    position: 'top-right'
  });

  var App = {
    template: `
<div>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/">Domů</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/">Ankety</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/">Info Kanály</router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="$store.state.user === null" class="nav-link" to="/register">
            Registrovat se
          </router-link>
          <router-link v-else class="nav-link" to="/profile">
            Můj profil
          </router-link>
        </li>
        <li class="nav-item">
          <router-link v-if="$store.state.user !== null" class="nav-link" to="/chreg">
            Změna registrace
          </router-link>
        </li>
      </ul>
      <button v-if="$store.state.user !== null" class="btn btn-warning"
        v-on:click="$store.commit('logout')">
        Odhlásit
      </button>
      <router-link v-else class="btn btn-primary" to="/login">
        Přihlásit
      </router-link>
    </div>
  </nav>

  <div class="container-fluid mx-auto p-4">
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</div>
  `
  };

  /* global Vue, moment, VueFormGenerator */

  VueFormGenerator.validators.resources.fieldIsRequired = 'Toto je povinné';
  VueFormGenerator.validators.resources.textTooSmall =
    'Text je moc krátký! Teď: {0}, minimum: {1}';

  Vue.use(VueFormGenerator, {
    validators: {
      pwdComplexity: function (value) {
        if (value.length < 8 || !value.match(/[A-Z]+/) ||
          !value.match(/[a-z]+/) || !value.match(/[0-9]+/)) {
          return 'Heslo neodpovídá požadavkům'
        }
      },
      nonEmptySelection: function (value) {
        if (!value.length) {
          return 'Výběr nesmí být prázdný'
        }
      }
    }
  });

  Vue.filter('formatDate', function (value) {
    if (value) {
      return moment(String(value)).format('DD.MM.YYYY')
    }
  });

  /* global Vue, Vuex, localStorage, API, axios */

  const KEY = '_opencomm_user_';
  const savedUser = localStorage.getItem(KEY);

  function Store (router) {
    return new Vuex.Store({
      state: {
        user: savedUser && JSON.parse(savedUser)
      },
      mutations: {
        logout: async state => {
          await axios.post(`${API}/logout`);
          state.user = null;
          localStorage.removeItem(KEY);
          router.push('/');
        },
        login: (state, profile) => {
          localStorage.setItem(KEY, JSON.stringify(profile));
          state.user = profile;
        }
      },
      actions: {
        toast: function (ctx, opts) {
          Vue.$toast.open(opts);
        }
      }
    })
  }

  /* global axios, AUTH_API, Vue */
  const validationMixin = window.vuelidate.validationMixin;
  const validators = window.validators;

  var Register = Vue.extend({
    mixins: [validationMixin],
    data: () => {
      return {
        working: false,
        formValid: false,
        validationNotSend: true,
        phone: '',
        password: '',
        email: '',
        validcode: '',
        agree: ''
      }
    },
    validations: {
      phone: {
        required: validators.required,
        a: validators.helpers.regex('alpha', /^\d{9}$/)
      },
      email: {
        email: validators.email
      },
      password: {
        pwdComplexity: function (value) {
          return Boolean(value.length >= 8 && value.match(/[A-Z]+/) &&
            value.match(/[a-z]+/) && value.match(/[0-9]+/))
        }
      },
      validcode: {
        required: validators.required
      },
      agree: {
        required: function (val) {
          return val === true
        }
      }
    },
    methods: {
      register: async function () {
        try {
          let res = await axios.post(`${AUTH_API}/register`, this.$data);
          if (res.status === 200) {
            res = await axios.post(`${AUTH_API}/login`, this.$data);
            this.$router.push('');
          }
        } catch (e) {
          console.log(e);
        }
      },
      submit: function () {
        this.$v.$touch();
        if (this.$v.$invalid) {
          return false
        }
        return this.register()
      },
      sendValidationCode: async function () {
        try {
          const res = await axios.post(`${AUTH_API}/validationCode`, {
            phone: this.$data.phone
          });
          if (res.status === 200 && res.data.message === 'ok') {
            this.$data.validationNotSend = false;
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    template: `
  <div>
    <h1>Registrace</h1>
    <form>
      <div class="row">
        <div class="col">
          <b-form-group
            :state="!$v.phone.$error"
            label="Telefon (9 čísel)"
            label-for="phone-input"
            invalid-feedback="Telefonní číslo není správné"
          >
            <b-form-input
              id="phone-input"
              type="number"
              placeholder="9 za sebou jdoucích číslic"
              v-model="$v.phone.$model"
              :state="!$v.phone.$error"
            ></b-form-input>
          </b-form-group>
        </div>

        <div class="col">
          <b-form-group
            :state="!$v.email.$error"
            label="E-mail (nepovinné)"
            label-for="email-input"
            invalid-feedback="Platná emailová adresa, prosím"
          >
            <b-form-input
              id="email-input"
              placeholder='platná emailová adresa'
              v-model="$v.email.$model"
              :state="!$v.email.$error"
            ></b-form-input>
          </b-form-group>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <b-form-group
            :state="!$v.password.$error"
            label="Heslo"
            label-for="password-input"
            invalid-feedback="Heslo neodpovídá požadavkům"
          >
            <b-form-input
              type="password"
              id="password-input"
              placeholder="Minimalně 8 znaků, malá i velká písmena a číslice"
              v-model="$v.password.$model"
              :state="!$v.password.$error"
            ></b-form-input>
          </b-form-group>
        </div>

        <div class="col">
          <div class="row">
            <div class="col">
              <b-form-group
                :state="!$v.validcode.$error"
                label="Ověřovací kod (v SMS)"
                label-for="validcode-input"
                invalid-feedback="Ověřovací kód je povinný"
              >
                <b-form-input
                  type="number"
                  id="validcode-input"
                  placeholder="kód, který přišel v SMS"
                  v-model="$v.validcode.$model"
                  :state="!$v.validcode.$error"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col">
              <b-button v-if="validationNotSend" class='btn btn-secondary'
                @click='sendValidationCode'>
                Zaslat ověřovací kod
              </b-button>
              <span v-else>
                Potvrzovací kod zaslán SMS na {{model.phone}}.
              </span>
            </div>
          </div>
        </div>

      </div>

      <hr/>

      <div class="row">
        <div class="col">
          <div>
            Tady bude platny disclaimer, kompatibilni s GDPR
          </div>
          <b-form-group
            :state="!$v.agree.$error"
            label-for="checkbox-agree"
            invalid-feedback="Souhlas je vyžadován"
          >
            <b-form-checkbox
              id="checkbox-agree"
              v-model="$v.agree.$model"
              :state="!$v.agree.$error"
            >
              Souhlasím s podmínkami provozu
            </b-form-checkbox>
          </b-form-group>
        </div>
      </div>

    </form>

    <b-button class="mt-3" :disabled="$v.$anyError" @click="submit">
      <b>Registrovat</b> <i class="fas fa-spinner fa-spin" v-if="working"></i>
    </b-button>

  </div>
  `
  });

  /* global axios, API, AUTH_API */

  var Login = {
    data: () => {
      return {
        record: {
          username: '',
          password: ''
        },
        error: null,
        errcount: 0,
        working: false
      }
    },
    methods: {
      login: async function () {
        try {
          this.$data.error = null;
          this.$data.working = true;
          const res = await axios.post(`${AUTH_API}/login`, this.$data.record);
          await axios.post(`${API}/login`, null, {
            headers: {
              Authorization: `JWT ${res.data.token}`
            }
          });
          this.$store.commit('login', res.data.user);
          this.$router.push('/');
          return res.data
        } catch (err) {
          this.$data.error = err.response.data;
          this.$data.errcount++;
        } finally {
          this.$data.working = false;
        }
      }
    },
    computed: {
      submitDisabled: function () {
        return this.$data.record.username.length === 0 || this.$data.record.password.length === 0
      }
    },
    template: `
<form>
  <div class="input-group mb-3">
    <div class="input-group-append">
      <span class="input-group-text"><i class="fas fa-user"></i></span>
      </div>
      <input type="text" name="" class="form-control"
        v-model='record.username' placeholder="Email/Telefon">
    </div>

  <div class="input-group mb-2">
    <div class="input-group-append">
    <span class="input-group-text"><i class="fas fa-key"></i></span>
    </div>
    <input type="password" name="pwd" class="form-control"
      v-model='record.password' placeholder="Heslo">
  </div>

  <div clas="danger" v-if="error">
    Nesprávné přihlašovací údaje!
    <router-link v-if="errcount > 0" to="/newpwd">
      Zapomenuté heslo?
    </router-link>
  </div>

  <div class="d-flex justify-content-center mt-3 login_container">
    <button type="button" name="button" class="btn btn-primary" v-on:click="login"
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      Přihlásit se
    </button>
    <div>
      <i class="fas fa-spinner fa-spin" v-if="working"></i>
    </div>
  </div>
</form>
  `
  };

  /* global axios, AUTH_API */

  var NewPassword = {
    data: () => {
      return {
        working: false,
        formValid: false,
        validationNotSend: true,
        model: {
          phone: '',
          password: '',
          validcode: ''
        },
        schema: {
          fields: [
            {
              type: 'input',
              inputType: 'number',
              label: 'Telefon (9 čísel)',
              model: 'phone',
              id: 'phone',
              placeholder: '9 za sebou jdoucích číslic',
              featured: true,
              required: true,
              pattern: /\d{9}/,
              validator: 'regexp'
            },
            {
              type: 'input',
              inputType: 'password',
              label: 'Heslo',
              model: 'password',
              required: true,
              hint: 'Minimalně 8 znaků, malá i velká písmena a číslice',
              validator: 'pwdComplexity'
            },
            {
              type: 'input',
              inputType: 'number',
              label: 'Ověřovací kod (v SMS)',
              model: 'validcode',
              required: true,
              pattern: /\d+/,
              validator: 'regexp'
            }
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
          validateAsync: true
        }
      }
    },
    methods: {
      onValidated: function (isValid, errors) {
        this.$data.formValid = isValid;
      },
      register: async function () {
        try {
          const res = await axios.post(`${AUTH_API}/change-password`, this.$data.model);
          if (res.status === 200) {
            this.$router.push('/login');
          }
        } catch (e) {
          console.log(e);
        }
      },
      sendValidationCode: async function () {
        try {
          const res = await axios.post(`${AUTH_API}/validationcode`, {
            phone: this.$data.model.phone
          });
          if (res.status === 200 && res.data.message === 'ok') {
            this.$data.validationNotSend = false;
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    computed: {
      submitDisabled: function () {
        return this.$data.formValid !== true
      }
    },
    template: `
  <div>
    <h1>Změna hesla</h1>
    <form>
      <vue-form-generator :schema="schema" :model="model"
        :options="formOptions" @validated="onValidated">
      </vue-form-generator>
    </form>

    <button type='submit' class='btn btn-primary' v-on:click='register()'
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      <b>Uložit</b>
    </button>

    <button v-if="validationNotSend" type='submit' class='btn btn-secondary'
      v-on:click='sendValidationCode()'>
      Zaslat potvrzovací kod
    </button>
    <span v-else>
      Potvrzovací kod zaslán SMS na {{model.phone}}.
    </span>
  </div>
  `
  };

  /* global axios, AUTH_API */

  var ChangeRegistration = {
    data: () => {
      return {
        working: false,
        model: {
          email: ''
        },
        message: null
      }
    },
    methods: {
      save: async function () {
        try {
          const uid = this.$store.state.user._id;
          const url = `${AUTH_API}/set-email?uid=${uid}&email=${this.$data.model.email}`;
          const res = await axios.put(url);
          if (res.status === 200) {
            this.$data.message = 'Na novou adresu přijde potvrzovací mail';
          }
        } catch (e) {
          this.$data.message = e.response.data.message;
        }
      }
    },
    computed: {
      submitDisabled: function () {
        return this.$data.formValid !== true
      }
    },
    template: `
  <div>
    <h1>Změna Emailu</h1>
    <form>
      <input v-model="model.email" placeholder="nová emailová adresa">
    </form>

    <div v-if="message">{{message}}</div>

    <button type='submit' class='btn btn-primary' v-on:click='save()'>
      Uložit
    </button>
  </div>
  `
  };

  /* global axios, API */

  var Dashboard = {
    data: () => {
      return {
        currentCall: null
      }
    },
    created () {
      this.fetchData();
    },
    methods: {
      fetchData: async function () {
        const res = await axios.get(`${API}/paro_call/`);
        this.$data.currentCall = res.data.length ? res.data[0] : null;
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
  };

  /* global Vue, VueMultiselect, axios, API */
  Vue.component('multiselect', VueMultiselect.Multiselect);

  var Profile = {
    data: () => {
      return {
        working: false,
        formValid: false,
        model: {
          interrests: ''
        },
        schema: {
          fields: [
            {
              type: 'vueMultiSelect',
              selectOptions: {
                multiple: true,
                closeOnSelect: false
              },
              values: [
                'Doprava', 'Krize', 'Kultura',
                'Úřední', 'Sport', 'Městské bydlení',
                'Poruchy/Odstávky', 'Senioři', 'Mladé rodiny'
              ],
              label: 'Odebíraná témata',
              model: 'interrests',
              id: 'interests',
              placeholder: 'vyberte si z menu',
              required: true,
              validator: 'nonEmptySelection'
            }
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
          validateAsync: true
        }
      }
    },
    created () {
      this.fetchData();
    },
    methods: {
      onValidated: function (isValid, errors) {
        this.$data.formValid = isValid;
      },
      save: async function () {
        try {
          this.$data.working = true;
          const joined = this.$data.model.interrests.join(',');
          const data = Object.assign({}, this.$data.model, { interrests: joined });
          const req = this.$data.model.uid
            ? axios.put(`${API}/comm_prefs/${this.$data.model.uid}/`, data)
            : axios.post(`${API}/comm_prefs/`, data);
          await req;
          this.$data.working = false;
          this.$store.dispatch('toast', {
            message: 'Uloženo',
            type: 'success'
          });
        } catch (e) {
          console.log(e);
          this.$data.working = false;
        }
      },
      fetchData: async function () {
        try {
          const res = await axios.get(`${API}/comm_prefs/`);
          res.data.interrests = res.data.interrests ? res.data.interrests.split(',') : [];
          this.$data.model = res.data;
          this.$data.working = false;
        } catch (e) {
          if (e.response.status === 401) {
            this.$store.commit('logout');
            this.$router.push('/login');
          } else {
            console.log(e);
          }
        }
      }
    },
    computed: {
      submitDisabled: function () {
        return this.$data.formValid !== true || this.$data.working
      }
    },
    template: `
  <div>
    <h1>Můj profil</h1>
    <form>
      <vue-form-generator :schema="schema" :model="model"
        :options="formOptions" @validated="onValidated">
      </vue-form-generator>
    </form>

    <button type='submit' class='btn btn-primary' v-on:click='save()'
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      <b>Uložit</b>
    </button>
    <i class="fas fa-spinner fa-spin" v-if="working"></i>
  </div>
  `
  };

  /* global axios, API */

  var ParoApply = {
    data: () => {
      return {
        working: false,
        formValid: false,
        model: {
          name: '',
          desc: '',
          content: '',
          budget: '',
          photo: '',
          total: ''
        },
        schema: {
          fields: [
            {
              type: 'input',
              inputType: 'text',
              label: 'Název projektu',
              model: 'name',
              id: 'name',
              placeholder: 'zadejte název projektu',
              featured: true,
              required: true,
              max: 32,
              validator: 'string'
            },
            {
              type: 'input',
              inputType: 'text',
              label: 'Obrázek projektu. Nahrát můžete např. přes https://1iq.cz/',
              model: 'photo',
              id: 'photo',
              placeholder: 'zadejte adresu obrázku'
            },
            {
              type: 'textArea',
              rows: 3,
              label: 'Popis',
              model: 'desc',
              required: true,
              hint: 'stručný popis projektu',
              max: 128,
              validator: 'string'
            },
            {
              type: 'textArea',
              rows: 7,
              label: 'Úplný popis projektu včetně rozpočtu',
              model: 'content',
              required: true,
              hint: 'Můžete používat markdown',
              max: 1024,
              validator: 'string'
            },
            {
              type: 'textArea',
              rows: 7,
              label: 'Rozpočet projektu',
              model: 'budget',
              required: true,
              hint: 'Můžete používat markdown',
              max: 1024,
              validator: 'string'
            },
            {
              type: 'input',
              inputType: 'number',
              label: 'Celkové náklady s DPH',
              model: 'total',
              placeholder: 'zadejte číslo',
              required: true,
              validator: 'integer'
            }
          ]
        },
        formOptions: {
          validateAfterLoad: true,
          validateAfterChanged: true,
          validateAsync: true
        }
      }
    },
    created () {
      this.fetchData();
    },
    methods: {
      onValidated: function (isValid, errors) {
        this.$data.formValid = isValid;
      },
      fetchData: async function () {
        this.$data.working = true;
        const callId = this.$router.currentRoute.params.call_id;
        const author = this.$store.state.user._id;
        const url = `${API}/paro_proj/?call_id=${callId}&author=${author}`;
        const res = await axios.get(url);
        if (res.data.length > 0) this.$data.model = res.data[0];
        this.$data.working = false;
      },
      save: async function () {
        const model = this.$data.model;
        try {
          this.$data.working = true;
          const callId = this.$router.currentRoute.params.call_id;
          if (model.id) {
            await axios.put(`${API}/paro_proj/${model.id}`, model);
          } else {
            const res = await axios.post(`${API}/paro_proj/${callId}`, model);
            model.id = res.data[0];
          }
          this.$data.working = false;
        } catch (e) {
          console.log(e);
          this.$data.working = false;
        }
      }
    },
    computed: {
      submitDisabled: function () {
        return this.$data.formValid !== true || this.$data.working
      }
    },
    template: `
  <div>
    <h1>Můj projekt</h1>
    <form>
      <vue-form-generator :schema="schema" :model="model"
        :options="formOptions" @validated="onValidated">
      </vue-form-generator>
    </form>

    <button type='submit' class='btn btn-primary' v-on:click='save()'
      v-bind:class="{disabled: submitDisabled}" :disabled="submitDisabled">
      <b>Uložit</b>
    </button>
    <i class="fas fa-spinner fa-spin" v-if="working"></i>
  </div>
  `
  };

  /* global axios, API, _, moment */

  var ParoProjectList = {
    data: () => {
      return {
        loading: true,
        call: null,
        projects: [],
        myvote: null
      }
    },
    created () {
      this.fetchData();
    },
    methods: {
      fetchData: async function () {
        const callId = this.$router.currentRoute.params.call_id;
        const res = await Promise.all([
          axios.get(`${API}/paro_proj/?call_id=${callId}`),
          axios.get(`${API}/paro_call/?id=${callId}`)
        ]);
        this.$data.projects = res[0].data;
        this.$data.call = res[1].data[0];
        this.$data.loading = false;
        if (this.$store.state.user) {
          const myVote = await axios.get(`${API}/paro_votes/${callId}`);
          this.$data.myvote = _parseVote(myVote.data[0]);
        }
      }
    },
    computed: {
      canChangeProject: function () {
        const now = moment();
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
        <img v-if="p.photo" :src="p.photo" class="card-img-top projimg" alt="...">
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
  };

  function _fillVote (arr, vote) {
    _.each(arr, i => {
      if (i[0] === '+') {
        vote.pos.push(parseInt(i));
      } else {
        vote.neg.push(parseInt(i.substr(1)));
      }
    });
  }

  function _parseVote (content) {
    const data = {
      pos: [],
      neg: []
    };
    return content ? _fillVote(content.split('|'), data) : data
  }

  /* global axios, API, marked, moment */

  var ParoProjDetail = {
    data: () => {
      return {
        loading: true,
        call: null,
        project: null,
        support: null
      }
    },
    created () {
      this.fetchData();
    },
    methods: {
      fetchData: async function () {
        const projId = this.$router.currentRoute.params.id;
        let res = await axios.get(`${API}/paro_proj/?id=${projId}`);
        const p = res.data.length ? res.data[0] : null;
        this.$data.project = p;
        res = await axios.get(`${API}/paro_call/?id=${p.call_id}`);
        this.$data.call = res.data[0];
        if (this.$store.state.user) {
          res = await axios.get(`${API}/paro_support/${projId}`);
          this.$data.support = res.data.length > 0;
        }
        this.$data.loading = false;
      },
      sendSupport: async function () {
        const projId = this.$router.currentRoute.params.id;
        if (this.$data.support) {
          await axios.delete(`${API}/paro_support/${projId}`);
          this.$data.support = false;
          this.$data.project.support_count--;
        } else {
          const res = await axios.post(`${API}/paro_support/${projId}`);
          this.$data.support = true;
          this.$data.project.support_count++;
          this.$data.project.state = res.data;
        }
      }
    },
    computed: {
      budgetHTML: function () {
        return marked(this.project.budget)
      },
      canSupport: function () {
        return this.$store.state.user &&
          moment(this.call.submission_end) > moment() &&
          this.project.state === 'new'
      },
      supportbutt: function () {
        return this.$data.support ? 'Už se mi to nelíbí' : 'Líbí se mi'
      }
    },
    template: `
  <div v-if="!loading">
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <h2>{{project.name}}</h2>

        <router-link :to="{name: 'parocall', params: {call_id: call.id}}">
          <h4>Výzva: {{call.name}}</h4>
        </router-link>

        <h4>{{project.desc}}</h4>

        <p>{{project.content}}</p>

        <p>Celkem: {{project.total}}</p>
      </div>
      <div class="col-sm-12 col-md-6">
        <img v-if="project.photo" :src="project.photo" class="card-img-top" alt="...">

        <h3>Rozpočet</h3>
        <p v-html="budgetHTML">{{project.budget}}</p>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12">
        "Líbí se mi" od {{project.support_count}} uživatelů.
        <button v-if="canSupport" class="btn btn-primary"
          v-on:click='sendSupport()'>
          {{supportbutt}}
        </button>
        <span class="alert alert-success" v-if="project.state === 'supprtd'">
          Tento projekt již postoupil do další fáze.
        </span>
        <span v-else>Pro udílení "Líbí se mi" se přihlašte</span>
      </div>
    </div>
  </div>
  `
  };

  /* global Vue, VueRouter */

  const router = new VueRouter({
    routes: [
      { path: '/register', component: Register },
      { path: '/login', component: Login },
      { path: '/newpwd', component: NewPassword },
      { path: '/chreg', component: ChangeRegistration },
      { path: '/profile', component: Profile },
      { path: '/paro/:call_id', component: ParoProjectList, name: 'parocall' },
      { path: '/paro/:call_id/apply', component: ParoApply, name: 'paroapply' },
      { path: '/paro/project/:id', component: ParoProjDetail, name: 'parodetail' },
      { path: '', component: Dashboard }
    ]
  });

  const store = Store(router);

  new Vue({
    router,
    store,
    template: App.template
  }).$mount('#app');

}());
