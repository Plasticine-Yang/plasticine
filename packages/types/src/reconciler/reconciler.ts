import type { IPElement } from '../core'
import type { IPRootNode } from './p-node'

/**
 * 宿主环境节点与虚拟 DOM 节点之间的协调器
 */
export interface IReconciler<HostContainer> {
  /**
   * 为宿主环境容器节点创建对应的虚拟 DOM 根节点
   *
   * @param hostContainer 宿主环境容器节点 - 用于挂载应用
   * @returns plasticine 虚拟 DOM 根节点
   */
  createPRootNode(hostContainer: HostContainer): IPRootNode<HostContainer>

  /**
   * 更新虚拟 DOM 根节点
   *
   * @param pRootNode 与宿主环境容器节点对应的虚拟 DOM 根节点
   * @param appElement 应用的入口 PElement
   */
  updatePRootNode(pRootNode: IPRootNode<HostContainer>, appElement: IPElement): void
}
