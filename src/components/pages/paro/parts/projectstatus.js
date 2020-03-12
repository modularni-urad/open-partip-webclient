
export default {
  computed: {
    content: function () {
      switch (this.$props.project.state) {
        case 'supprtd': return 'Projekt získal dostatečnou základní podporu'
        default: return 'Projekt sbírá základní podporu'
      }
    },
    className: function () {
      switch (this.$props.project.state) {
        case 'supprtd': return 'alert-success'
        default: return 'alert-info'
      }
    }
  },
  props: ['project'],
  template: `
    <div class="alert" v-bind:class="className">
      {{ content }}
    </div>
  `
}
