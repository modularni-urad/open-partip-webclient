/* global _ */
import ItemForm from './budgetitemform.js'

function _parse (data) {
  try {
    return JSON.parse(data)
  } catch (_) {
    return []
  }
}

export default {
  methods: {
    remove: function (item) {
      const items = _parse(this.$attrs.value)
      const idx = _.findIndex(items, i => (i.name === item.name))
      items.splice(idx, 1)
      this.$emit('input', JSON.stringify(items))
    },
    onItemSubmit: function (item) {
      const items = _parse(this.$attrs.value)
      items.push(item)
      const newVal = JSON.stringify(items)
      this.$props['v-model'] = newVal
      this.$emit('input', newVal)
    }
  },
  computed: {
    items: function () {
      return _parse(this.$attrs.value)
    }
  },
  props: ['v-model'],
  components: { itemform: ItemForm },
  template: `
    <div>
      <b-modal id="modal-add" title="Přidat položku" hide-footer>
        <itemform v-bind:onSubmit="onItemSubmit"></itemform>
      </b-modal>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Název</th>
            <th scope="col">Počet</th>
            <th scope="col">Cena</th>
            <th><b-button variant="primary" size="sm" v-b-modal.modal-add>
              + přidat
            </b-button></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in items">
            <td>{{ i.name }} <a v-if="i.link" v-bind:href="i.link" target="_blank">(odkaz)</a></td>
            <td>{{ i.count }}</td>
            <td>{{ i.price }}</td>
            <td>
              <b-button variant="danger" size="sm" @click='remove(i)'>x odstranit</b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
}
