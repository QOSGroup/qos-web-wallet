import Login from './pages/login/login'
import Register from './pages/register/register'
import HomePage from './pages/HomePage'

import AccountList from './pages/account/list'
// import AccountCreate from './pages/account/create'
import AccountImport from './pages/account/import'

import Transfer from './pages/transfer/transfer'

import WalletCreate from './pages/wallet/create'
import WalletResult from './pages/wallet/result'
import WalletImport from './pages/wallet/import'

import DelegateOrUnbond from './pages/delegation/delegateorunbond'
import ModifyCompound from './pages/delegation/modify'

import TxResult from './pages/result/result'

export default [
  {
    path: '/login/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register/register',
    name: 'register',
    component: Register
  },
  {
    path: '/',
    name: 'homepage',
    component: HomePage
  },
  {
    path: '/transfer/transfer',
    name: 'transfer',
    component: Transfer
  },
  {
    path: '/wallet/create',
    name: 'walletcreate',
    component: WalletCreate
  },
  {
    path: '/wallet/result',
    name: 'walletresult',
    component: WalletResult
  },
  {
    path: '/wallet/import',
    name: 'walletimport',
    component: WalletImport
  },
  {
    path: '/delegation/deleagteorunbond',
    name: 'delegateorunbond',
    component: DelegateOrUnbond
  },
  {
    path: '/delegation/modify',
    name: 'modifycompound',
    component: ModifyCompound
  },
  {
    path: '/result/result',
    name: 'txresult',
    component: TxResult
  },
  {
    path: '/account/list',
    name: 'accountlist',
    component: AccountList
  },
  // {
  //   path: '/account/create',
  //   name: 'accountcreate',
  //   component: AccountCreate
  // },
  {
    path: '/account/import',
    name: 'accountimport',
    component: AccountImport
  }
]
