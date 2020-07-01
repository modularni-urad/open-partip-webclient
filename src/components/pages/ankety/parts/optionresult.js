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
      <a v-if="option.link" v-bind:href="option.link" target="_blank">
        {{ option.title }}
      </a>
      <span v-else>{{ option.title }}</span>:
      pozitivních: {{ results.pos[option.id] || 0 }},
      negativních: {{ results.neg[option.id] || 0 }}
    </span>
  `
}
