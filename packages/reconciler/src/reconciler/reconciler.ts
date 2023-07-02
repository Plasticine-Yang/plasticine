import {
  PNodeTag,
  type IHostConfig,
  type IPElement,
  type IPRootNode,
  type IReconciler,
  type IWorkLoopManager,
} from '@plasticine/types'

import { PNode, PRootNode } from '../p-node'
import { Update, UpdateQueue } from '../update'
import { WorkLoopManager } from '../work-loop-manager'

class Reconciler<HostContainer> implements IReconciler<HostContainer> {
  private hostConfig: IHostConfig
  private workLoopManager: IWorkLoopManager<HostContainer>

  constructor(hostConfig: IHostConfig) {
    this.hostConfig = hostConfig
    this.workLoopManager = new WorkLoopManager()
  }

  public createPRootNode(hostContainer: HostContainer): IPRootNode<HostContainer> {
    // 为宿主环境的容器节点创建对应的 PNode
    const hostRootPNode = new PNode<HostContainer>(PNodeTag.HostRoot, {})

    // PRootNode 用于关联宿主环境的容器节点与其 PNode
    const pRootNode = new PRootNode<HostContainer>(hostContainer, hostRootPNode)

    hostRootPNode.updateQueue = new UpdateQueue(null)

    return pRootNode
  }

  public updatePRootNode(pRootNode: IPRootNode<HostContainer>, appElement: IPElement): void {
    const hostRootPNode = pRootNode.current
    const updateQueue = hostRootPNode.updateQueue

    if (updateQueue) {
      const update = new Update(appElement)
      updateQueue.enqueueUpdate(update)
    }

    this.workLoopManager.scheduleUpdateOnPNode(hostRootPNode)
  }
}

export { Reconciler }
