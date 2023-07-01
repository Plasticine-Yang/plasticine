import type { IHostConfig, IPElement, IPRootNode, IReconciler } from '@plasticine/types'

import { PNode, PRootNode } from './p-node'

class Reconciler<HostContainer> implements IReconciler {
  private hostConfig: IHostConfig

  constructor(hostConfig: IHostConfig) {
    this.hostConfig = hostConfig
  }

  public createPRootNode(hostContainer: HostContainer): IPRootNode<HostContainer> {
    const hostRootPNode = new PNode<HostContainer>()
    const pRootNode = new PRootNode<HostContainer>(hostContainer, hostRootPNode)

    return pRootNode
  }

  public updatePRootNode(pRootNode: IPRootNode<HostContainer>, appElement: IPElement): void {}
}

export { Reconciler }
