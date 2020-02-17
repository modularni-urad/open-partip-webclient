/* global Vue, Vuex, localStorage, API, axios */

const KEY = '_opencomm_user_'
const savedUser = localStorage.getItem(KEY)

export default function (router) {
  const store = new Vuex.Store({
    state: {
      user: savedUser && JSON.parse(savedUser)
    },
    mutations: {
      logout: async state => {
        await axios.post(`${API}/logout`)
        state.user = null
        localStorage.removeItem(KEY)
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
          return store.dispatch('toast', { message: error, type: 'error' })
      }
    })

  return store
}
