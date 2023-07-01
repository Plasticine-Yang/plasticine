import { IPNode } from '../p-node'

export interface IWorkLoopManager<HostContainer> {
  scheduleUpdateOnPNode(pNode: IPNode<HostContainer>): void
}
