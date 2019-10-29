import PageIndex from './pages/Index'
import Login from './pages/Login'
import Register from './pages/Register'
import Transfer from './pages/Transfer'
import NewWallet from './pages/NewWallet'
import NewWalletResult from './pages/NewWalletResult'
import ImportWalletWithSeed from './pages/ImportWalletWithSeed'
import HomePage from './pages/HomePage'
import DelegateOrUnbond from './pages/DelegateOrUnbond'
import TxResult from './pages/TxResult'

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
  },
  {
    path: '/newwallet',
    name: 'newwallet',
    component: NewWallet
  },
  {
    path: '/newwalletresult',
    name: 'newwalletresult',
    component: NewWalletResult
  },
  {
    path: '/importwalletwithseed',
    name: 'importwalletwithseed',
    component: ImportWalletWithSeed
  },
  {
    path: '/homepage',
    name: 'homepage',
    component: HomePage
  },
  {
    path: '/delegateorunbond',
    name: 'delegateorunbond',
    component: DelegateOrUnbond
  },
  {
    path: '/txresult',
    name: 'txresult',
    component: TxResult
  }
]
