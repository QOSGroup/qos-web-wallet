
import store from '@/store'
import { getCurrentAccount } from '@/business/auth'

export const currentIndex = store.getters.accounts.findIndex(x => x.address === getCurrentAccount().address)
export const currentAccount = store.getters.accounts[currentIndex]
export const userName = getCurrentAccount().name
export const address = getCurrentAccount().address
