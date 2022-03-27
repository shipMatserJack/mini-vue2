import {createElement, createTextElement} from './vdom/index'
export function renderMixin(Vue) {
  // 标签
  Vue.prototype._c = function() {
    return createElement(this, ...arguments)
  }
  // 文本
  Vue.prototype._v = function(text) {
    return createTextElement(this, text)
  }
  Vue.prototype._s = function(val) {
    if (typeof val === 'object') {
      return JSON.stringify(val);
    }
    return val;
  }
  // 生成vnode
  Vue.prototype._render = function() {
    const vm = this;
    const render = vm.$options.render; // 解析出来的render，同时可能是用户写的
    const vnode = render.call(vm);
    return vnode;
  }
}