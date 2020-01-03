import Register from './Register.js'

export default {
  name: `App`,
  components: {
    Register
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
    <div class="container mx-auto p-4">
      <h1>Register</h1>
      <register v-on:register="register" />
    </div>
  `
}
