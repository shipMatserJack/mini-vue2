import { initGlobalApi } from "./global-api/index";
import { initMixin } from "./init";
import { lifecycleMixin } from "./lifecycle";
import { renderMixin } from "./render";
import { stateMixin } from './state';

/**
 * 
 * @param {Obj} options 用户传入的选项
 */
function Vue(options) {
  // 初始化操作
  this._init(options);
}
// 扩展原型的
initMixin(Vue);
renderMixin(Vue);
lifecycleMixin(Vue);
stateMixin(Vue);

// 在类上扩展 Vue.mixin
initGlobalApi(Vue);

export default Vue


// import { compileToFunction } from "./compiler/index";
// import { createEle, patch } from "./vdom/patch";
// // diff算法
// const oldTemplate =  `<div a="1">
//   <li key="C">C</li>
//   <li key="A">A</li>
//   <li key="B">B</li>
//   <li key="D">D</li>
// </div>`
// const vm1 = new Vue({data: {message: 'hello world'}})
// const render1 = compileToFunction(oldTemplate)
// const oldVnode = render1.call(vm1);
// document.body.appendChild(createEle(oldVnode))

// const newTemplate = `<div b="2">
// <li key="B">B</li>
// <li key="C">C</li>
// <li key="D">D</li>
// <li key="A">A</li>
// </div>`
// const vm2 = new Vue({data: {message: 'hj'}})
// const render2 = compileToFunction(newTemplate)
// const newVnode = render2.call(vm2);

// setTimeout(()=>{
//   patch(oldVnode, newVnode)
// }, 1000)



// Vue入口文件，new Vue()会发生什么？