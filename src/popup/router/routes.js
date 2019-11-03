import PageIndex from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import Transfer from './pages/Transfer'
import CreateAccount from './pages/CreateAccount'
import ImportAccount from './pages/ImportAccount'

export default [
  {
    path: '/',
    name: 'home',
    component: PageIndex
  }, {
    path: '/login',
    name: 'login',
    component: Login
  }, {
    path: '/register',
    name: 'register',
    component: Register
  }, {
    path: '/transfer',
    name: 'transfer',
    component: Transfer
  }, {
    path: '/create',
    name: 'create',
    component: CreateAccount
  }, {
    path: '/import',
    name: 'import',
    component: ImportAccount
  }
]
