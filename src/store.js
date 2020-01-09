/* global Vuex, localStorage, API, axios */

const KEY = '_opencomm_user_'
const savedUser = localStorage.getItem(KEY)

export default function (router) {
  return new Vuex.Store({
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
    }
  })
}
