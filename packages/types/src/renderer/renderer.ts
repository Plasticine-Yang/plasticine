import type { IRoot } from './root'

export interface IRenderer<HostContainer = any> {
  createRoot(hostContainer: HostContainer): IRoot
}
