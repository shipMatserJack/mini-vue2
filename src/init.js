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
  }
}
