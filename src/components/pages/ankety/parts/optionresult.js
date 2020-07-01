/* global, _ */

export default {
  computed: {
    pozitive: function () {
      this.$props.results.pos[this.$props.option.id]
    },
    negative: function () {
      return 0
    }
  },
  props: ['option', 'results'],
  template: `
    <span>
      {{ option.title }}:
      pozitivních: {{ results.pos[option.id] || 0 }},
      negativních: {{ results.neg[option.id] || 0 }}
    </span>
  `
}
