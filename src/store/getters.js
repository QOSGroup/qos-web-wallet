export const foo = (state) => state.foo

export const toPage = (state) => state.toPage

export const firstMsg = (state) => {
  const queue = state.msgQueue
  return queue.length > 0 ? queue[0] : null
}

export const accountList = (state) => {
  return state.accountList
}

export const currentAccount = (state) => {
  return state.currentAccount
}

export const acountByName = (state, name) => {
  return state.accountList[name]
}
