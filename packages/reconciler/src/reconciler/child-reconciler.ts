import { PELEMENT_TYPE, isArray, isObject, isPTextNode } from '@plasticine/shared'
import {
  PNodeFlag,
  type IChildReconciler,
  type IPElement,
  type IPNode,
  type PElementChildren,
  PTextNode,
} from '@plasticine/types'
import { logger } from '../logger'
import { PNode } from '../p-node'

class ChildReconciler implements IChildReconciler {
  constructor(private shouldTrackSideEffects: boolean) {}

  public reconcileChildPNode(
    wip: IPNode<any>,
    current: IPNode<any> | null,
    childPElement: PElementChildren,
  ): IPNode | null {
    // 单节点
    if (isObject(childPElement)) {
      let childPNode: IPNode | null = null

      switch ((childPElement as IPElement).$$typeof) {
        case PELEMENT_TYPE:
          childPNode = this.reconcileSingleElement(wip, current, childPElement as IPElement)
          break

        default:
          if (__DEV__) {
            logger.warn('ChildReconciler#reconcileChildPNode - 不支持的单节点 childPElement 处理情况')
            logger.warn('wip', wip)
            logger.warn('current', current)
            logger.warn('childPElement', childPElement)
          }

          break
      }

      if (childPNode !== null) {
        // mount 时打上 Placement flag
        const placedPNode = this.placeSingleChild(childPNode)
        return placedPNode
      }

      return childPNode
    }

    // 多节点
    if (isArray(childPElement)) {
      // TODO
    }

    // 文本节点
    if (isPTextNode(childPElement)) {
      const childPNode = this.reconcileSingleTextNode(wip, current, childPElement)

      if (childPNode !== null) {
        const placedPNode = this.placeSingleChild(childPNode)
        return placedPNode
      }

      return childPNode
    }

    if (__DEV__) {
      logger.warn('ChildReconciler#reconcileChildPNode - 不支持的 childPElement 处理情况')
      logger.warn('wip', wip)
      logger.warn('current', current)
      logger.warn('childPElement', childPElement)
    }

    return null
  }

  /** 调和单个 PElement 节点 */
  private reconcileSingleElement(wip: IPNode, current: IPNode | null, childPElement: IPElement): IPNode | null {
    const childPNode = PNode.fromPElement(childPElement)

    if (childPNode) {
      childPNode.return = wip
      return childPNode
    }

    return null
  }

  /** 调和单个文本节点 */
  reconcileSingleTextNode(wip: IPNode, current: IPNode | null, childPElement: PTextNode) {
    const childPNode = PNode.fromTextNode(childPElement)

    childPNode.return = wip

    return childPNode
  }

  /** 标记 Placement flag */
  private placeSingleChild(childPNode: IPNode): IPNode {
    // PNode 对应的 current PNode 为 null 说明是 mount，需要标记 Placement
    const shouldTagPlacement = childPNode.alternate === null

    if (this.shouldTrackSideEffects && shouldTagPlacement) {
      childPNode.flags |= PNodeFlag.Placement
    }

    return childPNode
  }
}

/** 用于 mount 时调和子节点，不需要为子节点标记 flags */
const childReconcilerForMount = new ChildReconciler(false)
const mountChildPNode = childReconcilerForMount.reconcileChildPNode.bind(childReconcilerForMount)

/** 用于 update 时调和子节点，需要为子节点标记 flags */
const childReconcilerForUpdate = new ChildReconciler(true)
const reconcileChildPNode = childReconcilerForMount.reconcileChildPNode.bind(childReconcilerForUpdate)

export { mountChildPNode, reconcileChildPNode }
