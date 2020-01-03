
export default {
  name: `Register`,
  data: () => {
    return {
      email: '',
      password: 'koko'
    }
  },
  template: `
  <div>
    <h2>Register</h2>
    <form v-on:submit.prevent="$emit('register', $data)">
        <div>
          <label>E-Mail <input v-model="email" id="reg-email" type="email"/>
          </label>
        </div>
        <div>
          <label>Password <input v-model="password" id="reg-pass" type="password"/>
          </label>
        </div>
        <button>Register</button>
        {{ email }}, {{ password }}
    </form>
  </div>
  `
}
