import type { IPNode } from '@plasticine/types'

import { PNode } from './p-node'

function createWorkInProgress<HostContainer>(current: IPNode<HostContainer>): IPNode<HostContainer> {
  let wip: IPNode<HostContainer> | null = current.alternate

  if (wip === null) {
    // mount
    wip = new PNode(current.tag)
    wip.stateNode = current.stateNode

    // 建立双缓存树节点指向
    wip.alternate = current
    current.alternate = wip
  } else {
    // update
  }

  return wip
}

export { createWorkInProgress }
