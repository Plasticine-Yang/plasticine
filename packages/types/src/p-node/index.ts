export interface IPNode<HostContainer> {
  stateNode: IPRootNode<HostContainer> | null
}

export interface IPRootNode<HostContainer> {
  /** 双缓存树中渲染在宿主环境视图的那颗树的根节点 */
  current: IPNode<HostContainer>
}
