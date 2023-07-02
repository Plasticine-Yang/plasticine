import { IUpdate, UpdateAction } from '@plasticine/types'
import { logger } from '../logger'

class Update<State = any> implements IUpdate<State> {
  public action: UpdateAction<State>

  constructor(action: UpdateAction<State>) {
    if (__DEV__) {
      logger.info('创建 Update', this)
    }

    this.action = action
  }
}

export { Update }
