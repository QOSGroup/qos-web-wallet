import Login from './pages/Login'
import Register from './pages/Register'
import Transfer from './pages/Transfer'
import CreateAccount from './pages/CreateAccount'
import NewWallet from './pages/NewWallet'
import NewWalletResult from './pages/NewWalletResult'
import ImportWalletWithSeed from './pages/ImportWalletWithSeed'
import HomePage from './pages/HomePage'
import DelegateOrUnbond from './pages/DelegateOrUnbond'
import TxResult from './pages/TxResult'
import AccountList from './pages/AccountList'
import NewAccount from './pages/NewAccount'
import ImportAccount from './pages/ImportAccount'
import ModifyCompound from './pages/ModifyCompound'

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/transfer',
    name: 'transfer',
    component: Transfer
  },
  {
    path: '/createaccount',
    name: 'createaccount',
    component: CreateAccount
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
    path: '/',
    name: 'homepage',
    component: HomePage
  },
  {
    path: '/delegateorunbond',
    name: 'delegateorunbond',
    component: DelegateOrUnbond
  },
  {
    path: '/modifycompound',
    name: 'modifycompound',
    component: ModifyCompound
  },
  {
    path: '/txresult',
    name: 'txresult',
    component: TxResult
  },
  {
    path: '/accountlist',
    name: 'accountlist',
    component: AccountList
  },
  {
    path: '/newaccount',
    name: 'newaccount',
    component: NewAccount
  },
  {
    path: '/importaccount',
    name: 'importaccount',
    component: ImportAccount
  }
]
