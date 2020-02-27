/* global _ */
import ItemForm from './budgetitemform.js'

function _parse (data) {
  try {
    return JSON.parse(data)
  } catch (_) {
    return []
  }
}

export function countTotal (budget) {
  const items = _parse(budget)
  return items.reduce((acc, i) => {
    return acc + (i.count * i.price)
  }, 0)
}

export default {
  data: function () {
    return {
      item: {},
      curr: null
    }
  },
  methods: {
    remove: function (item) {
      const items = _parse(this.$attrs.value)
      const idx = _.findIndex(items, i => (i.name === item.name))
      items.splice(idx, 1)
      this.$emit('input', JSON.stringify(items))
    },
    add: function () {
      this.$data.curr = null
      this.$bvModal.show('modal-add')
    },
    edit: function (idx, item) {
      this.$data.curr = idx
      Object.assign(this.$data.item, item)
      this.$bvModal.show('modal-add')
    },
    onItemSubmit: function (item) {
      const items = _parse(this.$attrs.value)
      this.$data.curr
        ? Object.assign(items[this.$data.curr], item)
        : items.push(item)
      const newVal = JSON.stringify(items)
      this.$props['v-model'] = newVal
      this.$emit('input', newVal)
    }
  },
  computed: {
    items: function () {
      return _parse(this.$attrs.value)
    },
    total: function () {
      return countTotal(this.$attrs.value)
    }
  },
  props: ['v-model'],
  components: { itemform: ItemForm },
  template: `
    <div>
      <b-modal id="modal-add" title="Přidat položku" hide-footer>
        <itemform v-bind:onSubmit="onItemSubmit" v-bind:item="item"></itemform>
      </b-modal>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">Název</th>
            <th scope="col">Počet</th>
            <th scope="col">Cena</th>
            <th><b-button variant="primary" size="sm" @click="add">
              + přidat
            </b-button></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(i, idx) in items">
            <td>{{ i.name }} <a v-if="i.link" v-bind:href="i.link" target="_blank">(odkaz)</a></td>
            <td>{{ i.count }}</td>
            <td>{{ i.price }}</td>
            <td>
              <b-button variant="secondary" size="sm" @click='edit(idx, i)'>edit</b-button>
              <b-button variant="danger" size="sm" @click='remove(i)'>x odstranit</b-button>
            </td>
          </tr>
        </tbody>
        <h2>Celkové náklady s DPH: {{ total }}.</h2>
      </table>
    </div>
  `
}
