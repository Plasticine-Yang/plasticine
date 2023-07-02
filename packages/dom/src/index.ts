import { Reconciler } from '@plasticine/reconciler'
import type { IHostConfig, IReconciler, IRenderer, IRoot } from '@plasticine/types'

import { BrowserHostConfig } from './host-config'
import { logger } from './logger'

class BrowserRenderer implements IRenderer<Element> {
  private reconciler: IReconciler<Element>
  private hostConfig: IHostConfig<Element, Text>

  constructor() {
    this.hostConfig = new BrowserHostConfig()
    this.reconciler = new Reconciler(this.hostConfig)
  }

  public createRoot(hostContainer: Element): IRoot {
    const pRootNode = this.reconciler.createPRootNode(hostContainer)

    if (__DEV__) {
      logger.info('createRoot', pRootNode)
    }

    return {
      render: (appElement) => {
        if (__DEV__) {
          logger.info('调用 createRoot 的 render')
        }

        this.reconciler.updatePRootNode(pRootNode, appElement)
      },
    }
  }
}

const browserRenderer = new BrowserRenderer()

export { BrowserRenderer }

export default browserRenderer
