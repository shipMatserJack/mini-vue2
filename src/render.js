import {createElement, createTextElement} from './vdom/index'
export function renderMixin(Vue) {
  // 标签
  Vue.prototype._c = function() {
    return createElement(this, ...arguments)
  }
  // 文本
  Vue.prototype._v = function(text) {
    return createTextElement(text)
  }
  Vue.prototype._s = function(val) {
    return JSON.stringify(val)
  }
  Vue.prototype._render = function() {
    console.log('render');
    const vm = this;
    const render = vm.$options.render; // 解析出来的render，同时可能是用户写的
    const vnode = render.call(vm);
    return vnode;
  }
}