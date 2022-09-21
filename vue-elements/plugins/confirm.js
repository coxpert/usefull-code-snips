import Vue from 'vue'
import ConfirmDialog from './ConfirmDialog'
export default function confirm({ title, description }) {
  return new Promise((resolve) => {
    const ConfirmDialogComp = Vue.extend(ConfirmDialog)
    const instance = new ConfirmDialogComp({
      propsData: {
        title,
        description
      },
      methods: {
        close() {
          this.$el.remove()
          resolve(false)
        },
        confirm() {
          this.$el.remove()
          resolve(true)
        }
      }
    }).$mount()
    document.body.appendChild(instance.$el)
  })
}
