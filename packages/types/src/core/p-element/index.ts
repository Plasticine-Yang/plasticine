export type PElementType = any

export type PTextNode = string | number
export type PElementNode = IPElement | PTextNode

export type PElementChildren = PElementNode | PElementNode[]

export type PElementNormalProps = Record<string, any>
export type PElementSpecialProps = {
  children?: PElementChildren
  textNodeContent?: PTextNode
}
export type PElementProps = PElementNormalProps | PElementSpecialProps

export interface IPElement {
  $$typeof: symbol | number
  type: PElementType
  props: PElementProps
}
