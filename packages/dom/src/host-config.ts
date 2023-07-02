import type { IHostConfig, PElementProps, PTextNode } from '@plasticine/types'

class BrowserHostConfig implements IHostConfig<Element, Text> {
  public createHostComponent(type: any, props: PElementProps): Element {
    const element: Element = document.createElement(type)

    for (const [key, value] of Object.entries(props)) {
      element.setAttribute(key, value)
    }

    return element
  }

  public createHostText(textNode: PTextNode): Text {
    return document.createTextNode(String(textNode))
  }

  public appendChild(parent: Element, child: Element): void {
    parent.appendChild(child)
  }
}

export { BrowserHostConfig }
