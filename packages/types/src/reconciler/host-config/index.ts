import type { PElementProps, PTextNode } from '../../core'

export interface IHostConfig<HostComponent = any, HostText = any> {
  /** 创建宿主环境的组件 - 比如 DOM 的 div */
  createHostComponent(type: any, props: PElementProps): HostComponent

  /** 创建宿主环境的文本节点 */
  createHostText(textNode: PTextNode): HostText

  /** 将 child 元素插入到 parent 元素中 */
  appendChild(parent: HostComponent, child: HostComponent): void
}
