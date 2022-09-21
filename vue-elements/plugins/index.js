import confirm from './confirm'

export default {
  install(Vue) {
    Vue.prototype.$dialog = {
      confirm: async ({ title, description } = {}) => {
        return confirm({
          title: title || 'Confirmation',
          description: description || 'Are you sure with this action?'
        })
      }
    }
  }
}
