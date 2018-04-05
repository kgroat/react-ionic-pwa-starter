export function wc (events = {}, obj = {}) {
  let storedEl: HTMLElement

  return function (el: HTMLElement) {

    Object.entries(events).forEach((keyValues) => {
      const name = keyValues[0]
      const value = keyValues[1]
      const action = (el) ? el.addEventListener : storedEl.removeEventListener
      if (typeof value === 'function') {
        action(name, value)
        return
      }
    })
    if (el) {
      Object.entries(obj).forEach((keyValues) => {
        const name = keyValues[0]
        const value = keyValues[1]
        el[name] = value
      })
    }
    storedEl = el
  }
}
