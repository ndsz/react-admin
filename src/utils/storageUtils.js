import store from 'store'

//eslint-disable-next-line
export default {
  setUser (user) {
    // localStorage.setItem('user_key', JSON.stringify(user))
    store.set('user_key', user)
  },

  getUser () {
    try {
      // return JSON.parse(localStorage.getItem('user_key') || '{}')
      return store.get('user_key') || {}
    } catch (error) {
      
    }
  },

  removeUser () {
    // localStorage.removeItem('user_key')
    store.remove('user_key')
  }
}