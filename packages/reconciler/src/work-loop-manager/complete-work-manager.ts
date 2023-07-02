import { PNodeTag, type ICompleteWorkManager, type IHostConfig, type IPNode, PNodeFlag } from '@plasticine/types'

import { logger } from '../logger'

class CompleteWorkManager<HostComponent = any, HostText = any> implements ICompleteWorkManager {
  constructor(private hostConfig: IHostConfig<HostComponent, HostText>) {}

  public completeWork(pNode: IPNode): void {
    if (__DEV__) {
      logger.info('CompleteWorkManager#completeWork', pNode)
    }

    switch (pNode.tag) {
      case PNodeTag.HostRoot:
        this.completeHostRootWork(pNode)
        break

      case PNodeTag.HostComponent:
        this.completeHostComponentWork(pNode)
        break

      case PNodeTag.HostText:
        this.completeHostTextWork(pNode)
        break

      default:
        if (__DEV__) {
          logger.warn('CompleteWorkManager#completeWork - 不支持的 PNode tag', pNode)
        }

        break
    }
  }

  private completeHostRootWork(pNode: IPNode) {
    if (__DEV__) {
      logger.info('CompleteWorkManager#completeHostRootWork', pNode)
    }

    this.bubbleProperties(pNode)
  }

  private completeHostComponentWork(pNode: IPNode) {
    if (__DEV__) {
      logger.info('CompleteWorkManager#completeHostComponentWork', pNode)
    }

    const { createHostComponent } = this.hostConfig
    const current = pNode.alternate

    if (current !== null && pNode.stateNode) {
      // update - 可以复用 pNode.stateNode
      // TODO
    } else {
      // mount

      // 1. 离屏构建宿主环境 UI 节点
      const hostComponent = createHostComponent(pNode.type, pNode.pendingProps)

      // 2. 将构建的节点插入到宿主环境 UI 树中
      this.appendAllChildren(hostComponent, pNode)

      // 3. 关联 PNode 与宿主环境 UI 的节点
      pNode.stateNode = hostComponent
    }

    this.bubbleProperties(pNode)
  }

  private completeHostTextWork(pNode: IPNode) {
    if (__DEV__) {
      logger.info('CompleteWorkManager#completeHostTextWork', pNode)
    }

    const { createHostText } = this.hostConfig
    const current = pNode.alternate
    const pendingProps = pNode.pendingProps

    if (current !== null && pNode.stateNode) {
      // update - 可以复用 pNode.stateNode
      // TODO
    } else {
      // mount

      // 1. 离屏构建宿主环境文本节点
      const hostText = createHostText(pendingProps.textNodeContent)

      // 2. 关联 PNode 与宿主环境文本节点
      pNode.stateNode = hostText
    }

    this.bubbleProperties(pNode)
  }

  /**
   * 将 PNode 的子节点对应的宿主环境节点全都插入到 hostComponent 中
   *
   * 需要注意：
   *
   * const Foo = () => <h1></h1>
   * const Bar = () => <h2></h2>
   *
   * <Foo>
   *  <Bar />
   *  <h3>hello</h3>
   * </Foo>
   *
   * 实际应处理成：
   *
   * <h1>
   *   <h2></h2>
   *   <h3>hello</h3>
   * </h1>
   *
   * 也就是需要递归找到 FiberNode 中的第一个 HostComponent 或 HostText
   *
   * @param hostComponent 宿主环境节点
   * @param pNode 与宿主环境节点对应的 PNode
   */
  private appendAllChildren(hostComponent: HostComponent, pNode: IPNode) {
    if (__DEV__) {
      logger.info('CompleteWorkManager#appendAllChildren', hostComponent, pNode)
    }

    const { appendChild } = this.hostConfig

    let node = pNode.child

    while (node !== null) {
      // 回到最初的 PNode 时退出
      if (node === pNode) {
        return
      }

      // 找到宿主环境节点对应的 PNode - 将其 stateNode 插入到 hostComponent 中
      if (node.tag === PNodeTag.HostComponent || node.tag === PNodeTag.HostText) {
        // hostComponent 是宿主环境的父元素
        // node.stateNode 是宿主环境的子元素
        appendChild(hostComponent, node.stateNode)
      } else if (node.child !== null) {
        // 有子节点就往子节点遍历
        node = node.child

        continue
      }

      // 有兄弟节点就往兄弟节点遍历
      if (node.sibling !== null) {
        node = node.sibling

        continue
      }

      // 没有兄弟节点则回到父节点
      while (node !== null && node.sibling === null) {
        if (node.return === null || node.return === pNode) {
          return
        }

        node = node.return
      }
    }
  }

  /**
   * 冒泡 PNode 的所有子节点的属性
   *
   * 比如 subtreeFlags
   */
  private bubbleProperties(pNode: IPNode) {
    if (__DEV__) {
      logger.info('CompleteWorkManager#bubbleProperties', pNode)
    }

    let subtreeFlags: PNodeFlag = PNodeFlag.NoFlags
    let child = pNode.child

    while (child !== null) {
      subtreeFlags |= child.subtreeFlags
      subtreeFlags |= child.flags

      child = child.sibling
    }

    pNode.subtreeFlags |= subtreeFlags
  }
}

export { CompleteWorkManager }
