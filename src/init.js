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
    vm.$el = el;
    // 模版 => render函数(组件挂载) => 虚拟dom => diff算法 =>更新虚拟dom => 渲染节点
    if(!options.render) {
      let template = options.template;
      if(!template && el) {
        template = el.outerHTML;
        // render函数
        const render = compileToFunction(template)
        options.render = render;
      }
    }
    // 组件挂载
    mountComponent(vm, el);
  }
}

// 调用原型的_init方法进行初始化流程
// 1. 调用initState方法对数据初始化 props data watch computed ...
// 2. 调用$mount方法挂载数据
//   2.1 调用compileToFunction生成render函数
//      2.1.1 调用parserHTML方法正则匹配进行html词法解析
//      2.1.2 createAstElement方法ast语法解析生成抽象语法🌲
//      2.1.3 generate方法遍历ast生成方法字符串（其中原型方法_c和_v会生成vnode）
//      2.1.4 new Function + with 生成render函数
//   2.2 调用mountComponent进行组件挂载
//      2.2.1 调用updateComponent方法（_render方法 => _update方法）
//      2.2.2 调用原型的_render方法生成返回vnode
//      2.2.3 调用原型的_update方法更新元素
//      2.2.4 调用path方法做diff算法更新vnode
//      2.2.5 最后生成realdom挂载到页面根元素
