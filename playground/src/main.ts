import Plasticine from '@plasticine/core'
import PlasticineDOM from '@plasticine/dom'

const rootEl = document.querySelector('#root')

if (rootEl) {
  PlasticineDOM.createRoot(rootEl).render(Plasticine.createElement('div', { foo: 'bar', children: 'hello plasticine' }))
}
