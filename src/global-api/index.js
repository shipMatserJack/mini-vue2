import {
  mergeOptions
} from '../utils';

export function initGlobalApi(Vue) {
  Vue.options = {}; // 存放全局配置，每个组件初始化时都会和options选项进行合并

  Vue.mixin = function (options) {
    this.options = mergeOptions(this.options, options);
    console.log(this.options);
    return this;
  }

  Vue.options.components = {};
  Vue.options._base = Vue; // 无论后续创建多少个子类，都可在_base找到Vue
  Vue.component = function (id, definition) {
    // 保证组件的隔离，每个组件都会产生新的类，继承父类
    definition = this.options._base.extend(definition);
    this.options.components[id] = definition;
  }

  Vue.extend = function (opts) {
    const Super = this; // this指向Vue
    const Sub = function VueComponent(options) {
      this._init(options);
    }
    // 原型继承
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.options = mergeOptions(Super.options, opts)
    return Sub;
  }
}