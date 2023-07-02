import type {
  IProcessedUpdateQueueResult,
  IUpdate,
  IUpdateQueue,
  UpdateActionCallback,
  UpdateActionPayload,
} from '@plasticine/types'
import { logger } from '../logger'

class UpdateQueue<State = any> implements IUpdateQueue<State> {
  private shared: { pending: IUpdate<State> | null }

  constructor(update: IUpdate<State> | null) {
    this.shared = {
      pending: update,
    }
  }

  public enqueueUpdate(update: IUpdate<State>): void {
    if (__DEV__) {
      logger.info('UpdateQueue#enqueueUpdate', update)
    }

    this.shared.pending = update
  }

  public process(baseState: State): IProcessedUpdateQueueResult<State> {
    const result: IProcessedUpdateQueueResult<State> = {
      memoizedState: baseState,
    }
    const pendingUpdate = this.getPendingUpdate()

    if (pendingUpdate) {
      const action = pendingUpdate.action

      if (action instanceof Function) {
        result.memoizedState = (action as UpdateActionCallback<State>)(baseState)
      } else {
        result.memoizedState = action as UpdateActionPayload<State>
      }
    }

    if (__DEV__) {
      logger.info('UpdateQueue#process', baseState, result)
    }

    return result
  }

  public clear(): void {
    this.shared.pending = null

    if (__DEV__) {
      logger.info('UpdateQueue#clear', this.shared.pending)
    }
  }

  private getPendingUpdate(): IUpdate<State> | null {
    return this.shared.pending
  }
}

export { UpdateQueue }
