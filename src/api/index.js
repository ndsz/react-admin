import ajax from './ajax'

// export function reqLogin () {
//   return ajax('/login', {username, password}, 'POST')
// }

const base = ''

export const reqLogin = (username, password) => ajax(base + '/login', {username, password}, 'POST')

export const reqAddUser = user => ajax(base + '/manage/user/add', user, 'POST')