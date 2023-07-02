import { PNodeFlag, type IPNode, type PElementProps } from '@plasticine/types'

import { PNode } from './p-node'

function createWorkInProgress<HostContainer>(
  current: IPNode<HostContainer>,
  pendingProps: PElementProps,
): IPNode<HostContainer> {
  let wip: IPNode<HostContainer> | null = current.alternate

  if (wip === null) {
    // mount
    wip = new PNode(current.tag, pendingProps)
    wip.stateNode = current.stateNode

    // 建立双缓存树节点指向
    wip.alternate = current
    current.alternate = wip
  } else {
    // update
    wip.pendingProps = pendingProps

    // 新一轮工作流程开始，清除以往的副作用 flags
    wip.flags = PNodeFlag.NoFlags
  }

  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedState = current.memoizedState

  return wip
}

export { createWorkInProgress }
