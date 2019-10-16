import PageIndex from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'

export default [
  {
    path: '/',
    component: PageIndex
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/register',
    component: Register
  }
]
