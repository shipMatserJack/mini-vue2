import Watcher from "./observer/watcher";
import {
  nextTick
} from "./utils";
import {
  patch
} from "./vdom/patch";

export function lifecycleMixin(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this;
    const prevVnode = vm._vnode; // 保存当前虚拟节点
    if (!prevVnode) { // 初次渲染
      vm.$el = patch(vm.$el, vnode);
    } else {
      vm.$el = patch(prevVnode, vnode);
    }
    vm._vnode = vnode
  }
  Vue.prototype.$nextTick = nextTick;
}

export function mountComponent(vm, el) {
  // 更新函数 数据变化后 会再次调用此函数
  const updateComponent = () => {
    // 调用render函数，生成虚拟dom
    vm._update(vm._render());
  }
  callHook(vm, 'beforeMount');
  // 观察者模式
  new Watcher(vm, updateComponent, () => {
    console.log('视图更新了')
  }, true);
  callHook(vm, 'mounted');
}

export function callHook(vm, hook) {
  const handlers = vm.$options[hook];
  if (handlers) {
    for (let i = 0; i < handlers.length; i++) {
      handlers[i].call(vm);
    }
  }
}