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