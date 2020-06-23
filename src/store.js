/* global Vue, Vuex, localStorage, API, axios */

const KEY = '_opencomm_user_'
const savedUser = localStorage.getItem(KEY)

export default function (router) {
  const store = new Vuex.Store({
    state: {
      user: savedUser && JSON.parse(savedUser)
    },
    getters: {
      userLogged: state => {
        return state.user !== null
      }
    },
    mutations: {
      logout: async state => {
        localStorage.removeItem(KEY)
        await axios.post(`${API}/auth/logout`)
        state.user = null
        router.push('/')
      },
      login: (state, profile) => {
        localStorage.setItem(KEY, JSON.stringify(profile))
        state.user = profile
      }
    },
    actions: {
      toast: function (ctx, opts) {
        Vue.$toast.open(opts)
      }
    }
  })

  axios.interceptors.response.use(
    function (response) { return response },
    function (error) {
      switch (error.response.status) {
        case 401:
          store.commit('logout')
          return store.dispatch('toast', {
            message: 'Přihlášení vypršelo',
            type: 'success'
          })
        default:
          throw error
      }
    })

  return store
}
