/* global Vue, VueMeta, moment */

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD.MM.YYYY')
  }
})

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
})
