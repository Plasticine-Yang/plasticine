import { IUpdate, UpdateAction } from '@plasticine/types'

class Update<State = any> implements IUpdate<State> {
  public action: UpdateAction<State>

  constructor(action: UpdateAction<State>) {
    this.action = action
  }
}

export { Update }
