import { IUpdate } from './update'

export interface IUpdateQueue<State = any> {
  enqueueUpdate(update: IUpdate<State>): void
  process(baseState: State): IProcessedUpdateQueueResult<State>
  clear(): void
}

/** UpdateQueue 消费完后返回的结果 */
export interface IProcessedUpdateQueueResult<State> {
  memoizedState: State
}
