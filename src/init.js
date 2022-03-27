import { compileToFunction } from "./compiler/index";
import { mountComponent } from "./lifecycle";
import { initState } from "./state";

/**
 * 在Vue的基础上做混合操作
 * @param {*} Vue 
 */
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this;
    vm.$options = options;
    // 对数据进行初始化 watch computed props data ...
    initState(vm);
    if(vm.$options.el) {
      // 挂载数据
      vm.$mount(vm.$options.el)
    }
  }
  Vue.prototype.$mount = function(el) {
    const vm = this;
    const options = vm.$options;
    el = document.querySelector(el);
    // 模版 => render函数 => 虚拟dom => diff算法 =>更新虚拟dom => 渲染节点
    if(!options.render) {
      let template = options.template;
      if(!template && el) {
        template = el.outerHTML;
        const render = compileToFunction(template)
        options.render = render;
      }
    }
    // 组件挂载
    mountComponent(vm, el);
  }
}

