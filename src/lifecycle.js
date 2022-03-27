export function mountComponent (vm ,el) {
  // 更新函数 数据变化后 会再次调用此函数
  const updateComponent = () => {
    // 调用render函数，生成虚拟dom
    vm._update(vm._render());
  }
  updateComponent();
}

export function lifecycleMixin (Vue) {
  Vue.prototype._update = function(vnode) {
    console.log('update', vnode);
  }
}