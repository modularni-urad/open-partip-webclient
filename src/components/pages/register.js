
export default {
  name: `Register`,
  data: () => {
    return {
      email: '',
      password: 'koko'
    }
  },
  methods: {
    register: async function (data) {
      const res = await fetch("http://localhost:3001/local/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        credentials: "include"
      });
      const body = await res.json()
      if (body.status === "error") {
        alert(body.message)
        return
      }
    }
  },
  template: `
  <div>
    <h2>Register</h2>
    <form v-on:submit.prevent="register($data)">
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
