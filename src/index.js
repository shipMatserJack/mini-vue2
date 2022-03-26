import { initMixin } from "./init";

/**
 * 
 * @param {Obj} options 用户传入的选项
 */
function Vue(options) {
  // 初始化操作
  this._init(options);
}
initMixin(Vue);


export default Vue