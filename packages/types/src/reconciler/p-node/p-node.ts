import type { PElementProps } from '../../core'
import type { IUpdateQueue } from '../update'
import type { PNodeFlag } from './flag'
import type { PNodeTag } from './tag'

export interface IPNode<HostContainer = any, HostComponent = any> {
  child: IPNode<HostContainer, HostComponent> | null
  sibling: IPNode<HostContainer, HostComponent> | null
  return: IPNode<HostContainer, HostComponent> | null

  /**
   * 宿主环境的元素类型
   *
   * 可以是一个标签的类型字符串，如 div
   * 也可以是一个 FunctionComponent 的函数
   */
  type: any

  /** 用于标记 PNode 的种类 */
  tag: PNodeTag

  /**
   * - 对于 hostRootPNode，指向 PRootNode
   * - 对于普通的 PNode 节点，指向宿主环境的 Component
   */
  stateNode: IPRootNode<HostContainer> | HostComponent | null

  /** 存储更新的队列 */
  updateQueue: IUpdateQueue | null

  /** 指向该 PNode 在双缓存树中的另一颗树里的 PNode */
  alternate: IPNode<HostContainer, HostComponent> | null

  /** 指向更新后的状态 */
  memoizedState: any

  /** render 阶段在处理的 props */
  pendingProps: PElementProps

  /** 副作用 flags */
  flags: PNodeFlag

  /** 子树中的所有节点的副作用 flags */
  subtreeFlags: PNodeFlag
}

export interface IPRootNode<HostContainer = any> {
  /** 双缓存树中渲染在宿主环境视图的那颗树的根节点 */
  current: IPNode<HostContainer>
}
