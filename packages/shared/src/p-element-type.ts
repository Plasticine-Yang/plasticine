import { supportSymbol } from './supports'

/** PElement 的 $$typeof 的值 */
export const PELEMENT_TYPE = supportSymbol() ? Symbol.for('react.element') : 0xeac7
