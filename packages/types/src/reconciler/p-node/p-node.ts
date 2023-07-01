import { IUpdateQueue } from '../update'
import { PNodeTag } from './tag'

export interface IPNode<HostContainer = any> {
  child: IPNode<HostContainer> | null
  sibling: IPNode<HostContainer> | null
  return: IPNode<HostContainer> | null

  /** 用于标记 PNode 的种类 */
  tag: PNodeTag

  /**
   * - 对于 hostRootPNode，指向 PRootNode
   * - 对于普通的 PNode 节点，指向宿主环境的 Component
   */
  stateNode: IPRootNode<HostContainer> | null

  /** 存储更新的队列 */
  updateQueue: IUpdateQueue | null

  /** 指向该 PNode 在双缓存树中的另一颗树里的 PNode */
  alternate: IPNode<HostContainer> | null
}

export interface IPRootNode<HostContainer = any> {
  /** 双缓存树中渲染在宿主环境视图的那颗树的根节点 */
  current: IPNode<HostContainer>
}
