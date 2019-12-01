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
import WalletCreate2 from './pages/wallet/create2'
import WalletImport2 from './pages/wallet/import2'

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
    path: '/wallet/create2',
    name: 'walletcreate2',
    component: WalletCreate2
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
    path: '/wallet/import2',
    name: 'walletimport2',
    component: WalletImport2
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
    path: '/delegation/create',
    name: 'delegationcreate',
    component: DelegationCreate
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
