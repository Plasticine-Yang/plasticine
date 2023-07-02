import {
  IPElement,
  IPNode,
  IPRootNode,
  IUpdateQueue,
  PElementProps,
  PNodeFlag,
  PNodeTag,
  PTextNode,
} from '@plasticine/types'
import { logger } from '../logger'

/** 虚拟 DOM 节点 */
class PNode<HostContainer> implements IPNode<HostContainer> {
  public type: any
  public tag: PNodeTag
  public child: IPNode<HostContainer> | null
  public sibling: IPNode<HostContainer> | null
  public return: IPNode<HostContainer> | null
  public stateNode: IPRootNode<HostContainer> | null
  public updateQueue: IUpdateQueue | null
  public alternate: IPNode<HostContainer> | null
  public memoizedState: any
  public pendingProps: PElementProps
  public flags: PNodeFlag
  public subtreeFlags: PNodeFlag

  constructor(tag: PNodeTag, pendingProps: PElementProps) {
    this.type = null
    this.tag = tag
    this.child = null
    this.sibling = null
    this.return = null
    this.stateNode = null
    this.updateQueue = null
    this.alternate = null
    this.memoizedState = null
    this.pendingProps = pendingProps
    this.flags = PNodeFlag.NoFlags
    this.subtreeFlags = PNodeFlag.NoFlags
  }

  /** 根据 PElement 创建 PNode 实例 */
  public static fromPElement(pElement: IPElement): IPNode | null {
    const { type, props } = pElement

    let pNodeTag: PNodeTag | null = null

    if (typeof type === 'string') {
      pNodeTag = PNodeTag.HostComponent
    } else {
      if (__DEV__) {
        logger.warn('PNode#fromPElement - 不支持的转换场景')
        logger.warn('pElement', pElement)
      }
    }

    if (pNodeTag !== null) {
      const pNode = new PNode(pNodeTag, props)

      pNode.type = type

      return pNode
    }

    return null
  }

  /** 根据 PTextNode 创建 PNode 实例 */
  public static fromTextNode(textNode: PTextNode): IPNode {
    return new PNode(PNodeTag.HostText, { textNodeContent: textNode })
  }
}

/** 虚拟 DOM 的根节点，用于关联宿主环境容器节点及其对应的 PNode */
class PRootNode<HostContainer> implements IPRootNode<HostContainer> {
  public current: IPNode<HostContainer>

  private hostContainer: HostContainer

  constructor(hostContainer: HostContainer, hostRootPNode: IPNode<HostContainer>) {
    this.hostContainer = hostContainer
    this.current = hostRootPNode

    hostRootPNode.stateNode = this
  }
}

export { PNode, PRootNode }
