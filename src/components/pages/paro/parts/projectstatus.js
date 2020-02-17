
export default {
  computed: {
    content: function () {
      switch (this.$props.project.state) {
        case 'supprtd': return 'Projekt získal dostatečnou základní podporu'
        default: return 'Projekt sbírá základní podporu'
      }
    }
  },
  props: ['project'],
  template: `
    <div class="alert alert-success">
      {{ content }}
    </div>
  `
}
