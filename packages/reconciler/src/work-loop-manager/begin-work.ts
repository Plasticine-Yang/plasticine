import { PNodeTag, type IPNode, IPElement } from '@plasticine/types'

import { logger } from '../logger'
import { mountChildPNode, reconcileChildPNode } from '../reconciler'

function beginWork(pNode: IPNode): IPNode | null {
  const tag = pNode.tag

  switch (tag) {
    case PNodeTag.HostRoot:
      return updateHostRoot(pNode)

    case PNodeTag.HostComponent:
      return updateHostComponent(pNode)

    // 文本节点已经是叶子节点，没有子节点
    case PNodeTag.HostText:
      return null

    default:
      if (__DEV__) {
        logger.warn('尚未支持的 PNode tag:', tag)
      }

      return null
  }
}

function updateHostRoot(pNode: IPNode): IPNode | null {
  const baseState = pNode.memoizedState
  const updateQueue = pNode.updateQueue

  if (updateQueue !== null) {
    // ReactDOM.createRoot(rootEl).render(<App />)
    // HostRoot 的 updateQueue 中的 Update 存放的是 `<App />`
    // 这里消费完后得到的 memoizedState 就是 <App />，正是 rootEl 对应的 hostRootFiber 的下一个子节点
    const { memoizedState } = updateQueue.process(baseState)

    // 新的 PElement 与 PNode 进行 diff 得到 PElement 对应的 PNode
    const nextChildPElement = (pNode.memoizedState = memoizedState)
    const nextChildPNode = reconcileChildren(pNode, nextChildPElement)

    // 更新 pNode.child
    pNode.child = nextChildPNode

    // 消费完更新队列后将其清空
    updateQueue.clear()

    return nextChildPNode
  }

  return null
}

function updateHostComponent(pNode: IPNode): IPNode | null {
  // <div>foo</div> 的 nextChildPElement 为 'foo'，从 props.children 中获取
  const nextChildPElement = pNode.pendingProps.children

  if (nextChildPElement) {
    const nextChildPNode = reconcileChildren(pNode, nextChildPElement)

    pNode.child = nextChildPNode

    return nextChildPNode
  }

  return null
}

function reconcileChildren(pNode: IPNode, childPElement: IPElement) {
  const current = pNode.alternate

  if (current === null) {
    // mount
    return mountChildPNode(pNode, null, childPElement)
  } else {
    // update
    return reconcileChildPNode(pNode, current, childPElement)
  }
}

export { beginWork }
