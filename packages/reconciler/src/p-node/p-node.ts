import type { IPNode, IPRootNode, IUpdateQueue, PNodeTag } from '@plasticine/types'

/** 虚拟 DOM 节点 */
class PNode<HostContainer> implements IPNode<HostContainer> {
  public tag: PNodeTag
  public child: IPNode<HostContainer> | null
  public sibling: IPNode<HostContainer> | null
  public return: IPNode<HostContainer> | null
  public stateNode: IPRootNode<HostContainer> | null = null
  public updateQueue: IUpdateQueue | null = null
  public alternate: IPNode<HostContainer> | null

  constructor(tag: PNodeTag) {
    this.tag = tag
    this.child = null
    this.sibling = null
    this.return = null
    this.alternate = null
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
