
declare const __DEV__: boolean

interface HTMLAttributes {
  id?: string
  class?: string
  key?: string
  slot?: string
  ref?: string | (<T extends HTMLElement>(ref: T) => any)
  children?: any
  onClick?: (ev: MouseEvent) => void
  onChange?: (ev: KeyboardEvent) => void
  onInput?: (ev: KeyboardEvent) => void
}

declare const htmlWebpackPlugin: {
  options: any
}