import {
  PNodeTag,
  type IBeginWorkManager,
  type ICompleteWorkManager,
  type IHostConfig,
  type IPNode,
  type IPRootNode,
  type IWorkLoopManager,
} from '@plasticine/types'

import { logger } from '../logger'
import { createWorkInProgress } from '../p-node'
import { BeginWorkManager } from './begin-work-manager'
import { CompleteWorkManager } from './complete-work-manager'

class WorkLoopManager<HostContainer> implements IWorkLoopManager<HostContainer> {
  private workInProgress: IPNode<HostContainer> | null = null
  private hostConfig: IHostConfig
  private beginWorkManager: IBeginWorkManager
  private completeWorkManager: ICompleteWorkManager

  constructor(hostConfig: IHostConfig) {
    this.hostConfig = hostConfig
    this.beginWorkManager = new BeginWorkManager()
    this.completeWorkManager = new CompleteWorkManager(this.hostConfig)
  }

  /**
   * 为 PNode 调度更新
   *
   * 从传入的 PNode 出发，往上寻找到 PRootNode 后调用 renderRoot 开启调度
   */
  public scheduleUpdateOnPNode(pNode: IPNode): void {
    if (__DEV__) {
      logger.info('WorkLoopManager#scheduleUpdateOnPNode', '开始调度')
    }

    const root = this.findPRootNodeFromPNode(pNode)

    if (root) {
      // render phase + commit phase
      this.renderRoot(root)
    }
  }

  /**
   * 从任意 PNode 出发向上寻找到 PRootNode
   *
   * @param pNode 虚拟 DOM 树的任意 PNode 节点
   */
  private findPRootNodeFromPNode(pNode: IPNode): IPRootNode | null {
    let node = pNode
    let parent = node.return

    while (parent !== null) {
      node = parent
      parent = parent.return
    }

    if (node.tag === PNodeTag.HostRoot) {
      // HostRoot PNode 的 stateNode 是宿主环境容器节点对应的 PNode，其 stateNode 指向 PRootNode
      return node.stateNode
    }

    return null
  }

  private renderRoot(root: IPRootNode) {
    // 创建 render phase 的起始工作单元 PNode
    // mount 时会创建新 PNode，update 时则是对已有的 PNode 进行更新
    this.workInProgress = createWorkInProgress(root.current, {})

    if (__DEV__) {
      logger.info('WorkLoopManager#renderRoot', '创建 workInProgress', this.workInProgress)
    }

    // 开始 render phase 的工作循环
    try {
      this.workLoop()
    } catch (error) {
      if (__DEV__) {
        logger.error('WorkLoopManager#renderRoot', '执行 workLoop 过程中发生错误：', error)
      }

      this.workInProgress = null
    }

    // TODO render phase 结束，进入 commit phase
  }

  private workLoop() {
    while (this.workInProgress !== null) {
      this.performUnitOfWork(this.workInProgress)
    }
  }

  private performUnitOfWork(pNode: IPNode) {
    if (__DEV__) {
      logger.info('WorkLoopManager#performUnitOfWork', '开始消费工作单元', pNode)
    }

    // 开始消费工作单元，进入 `递` 阶段，消费完后会得到下一个工作单元
    const next = this.beginWorkManager.beginWork(pNode)

    if (__DEV__) {
      logger.info('WorkLoopManager#performUnitOfWork', 'beginWork 返回的下一个工作单元', next)
    }

    // 没有下一个工作单元，进入 `归` 阶段
    if (next === null) {
      this.completeUnitOfWork(pNode)
    } else {
      this.workInProgress = next
    }
  }

  private completeUnitOfWork(pNode: IPNode) {
    if (__DEV__) {
      logger.info('WorkLoopManager#completeUnitOfWork', '结束消费工作单元', pNode)
    }

    let node: IPNode | null = pNode

    while (node !== null) {
      // 对 node 进行 `归` 阶段的操作
      this.completeWorkManager.completeWork(node)

      // 对 node 的操作结束后再对其兄弟节点进行操作
      const sibling = node.sibling

      if (sibling !== null) {
        this.workInProgress = sibling
        return
      }

      // 没有兄弟节点，对父节点进行操作
      node = node.return
      this.workInProgress = node
    }
  }
}

export { WorkLoopManager }
