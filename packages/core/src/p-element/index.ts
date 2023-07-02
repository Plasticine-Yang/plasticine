import { PELEMENT_TYPE } from '@plasticine/shared'
import type { IPElement, PElementProps, PElementType } from '@plasticine/types'

import { logger } from '../logger'

class PElement implements IPElement {
  public $$typeof: number | symbol
  public type: PElementType
  public props: PElementProps

  constructor(type: PElementType, props: PElementProps) {
    this.$$typeof = PELEMENT_TYPE
    this.type = type
    this.props = props
  }
}

function createElement(type: PElementType, props: PElementProps): IPElement {
  const pElement = new PElement(type, props)

  if (__DEV__) {
    logger.info('createElement', pElement)
  }

  return pElement
}

export { createElement }
