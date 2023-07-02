import { IPNode } from '../p-node'

export interface IBeginWorkManager {
  beginWork(pNode: IPNode): IPNode | null
}
