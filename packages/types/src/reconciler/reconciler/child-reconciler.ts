import type { IPElement } from '../../core'
import type { IPNode } from '../p-node'

export interface IChildReconciler {
  reconcileChildPNode(wip: IPNode, current: IPNode | null, childPElement: IPElement): IPNode | null
}
