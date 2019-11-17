export const foo = (state) => state.foo

export const toPage = (state) => state.toPage

export const firstMsg = (state) => {
  const queue = state.msgQueue
  return queue.length > 0 ? queue[0] : null
}

export const accounts = (state) => {
  return state.accounts
}
