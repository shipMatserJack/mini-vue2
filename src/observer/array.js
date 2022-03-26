/**
 * 1. 重写数组原型方法，对可能改变数组的非基本类型的方法进行重写
 * 2. 如果新增数据，对新增数据进行劫持
 */

const oldArrayPrototype = Array.prototype
export let arrayMethods = Object.create(oldArrayPrototype);
// arrayMethods.__proto__ = Array.prototype 继承

let methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  arrayMethods[method] = function(...args) {
    oldArrayPrototype[method].call(this, ...args);
    let inserted;
    // 根据当前数组获取observe实例
    let ob = this.__ob__ // __ob__由Observer类赋予
    // 处理新增逻辑
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        // array.splice(0,1,'xxx'), 截掉前两位
        inserted = args.slice(2)
      default:
        break;
    }
    // 有新增的内容就要继续劫持
    if (inserted) ob.observeArray(inserted)
  }
})