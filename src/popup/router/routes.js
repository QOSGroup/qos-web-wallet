import Login from './pages/login/login'
import Register from './pages/register/register'
import HomePage from './pages/HomePage'

import AccountList from './pages/account/list'
import AccountModify from './pages/account/modify'
import AccountExport from './pages/account/export'

import Transfer from './pages/transfer/transfer'

import WalletCreate from './pages/wallet/create'
import WalletResult from './pages/wallet/result'
import WalletImport from './pages/wallet/import'
import WalletcreateNoPwd from './pages/wallet/createNoPwd'
import WalletimportNoPwd from './pages/wallet/importNoPwd'

import DelegateOrUnbond from './pages/delegation/delegateorunbond'
import ModifyCompound from './pages/delegation/modify'
import DelegationCreate from './pages/delegation/create'

import ValidatorList from './pages/validator/list'

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
    path: '/wallet/createNoPwd',
    name: 'walletcreateNoPwd',
    component: WalletcreateNoPwd
  },
  {
    path: '/wallet/result/:mnemonic',
    name: 'walletresult',
    component: WalletResult
  },
  {
    path: '/wallet/import',
    name: 'walletimport',
    component: WalletImport
  },
  {
    path: '/wallet/importNoPwd',
    name: 'walletimportNoPwd',
    component: WalletimportNoPwd
  },
  {
    path: '/delegation/deleagteorunbond/:amount/:operation/:delegation',
    name: 'delegateorunbond',
    component: DelegateOrUnbond
  },
  {
    path: '/delegation/modify/:amount/:iscompound/:delegation',
    name: 'modifycompound',
    component: ModifyCompound
  },
  {
    path: '/delegation/create/:description/:validator',
    name: 'delegationcreate',
    component: DelegationCreate
  },
  {
    path: '/result/result/:hash',
    name: 'txresult',
    component: TxResult
  },
  {
    path: '/account/list',
    name: 'accountlist',
    component: AccountList
  },
  {
    path: '/account/modify',
    name: 'accountmodify',
    component: AccountModify
  },
  {
    path: '/account/export',
    name: 'accountexport',
    component: AccountExport
  },
  {
    path: '/validator/list',
    name: 'validatorlist',
    component: ValidatorList
  }
]
