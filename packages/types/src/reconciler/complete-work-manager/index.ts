import type { IPNode } from '../p-node'

export interface ICompleteWorkManager {
  completeWork(pNode: IPNode): void
}
