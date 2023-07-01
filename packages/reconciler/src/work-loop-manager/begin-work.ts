import { PNodeTag, type IPNode } from '@plasticine/types'

import { logger } from '../logger'

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

function updateHostRoot(pNode: IPNode<any>): IPNode | null {
  throw new Error('Function not implemented.')
}

function updateHostComponent(pNode: IPNode<any>): IPNode | null {
  throw new Error('Function not implemented.')
}

export { beginWork }
