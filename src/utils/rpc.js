import store from '@/store'
import QOSRpc from 'js-for-qos-httprpc'
import { getCurrentAccount } from '@/business/auth'

export const rpc = new QOSRpc({ baseUrl: 'http://47.98.253.9:9876' })

export const currentIndex = store.getters.accounts.findIndex(x => x.address === getCurrentAccount().address)
