import { isObject } from "../utils";
import { arrayMethods } from "./array";

class Observer {
  constructor(data) {
    // 将observer实例赋给__ob__, 且__ob__不可枚举
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false // 不可枚举
    })
    if(Array.isArray(data)) {
      // 重写数组原型方法
      data.__proto__ = arrayMethods
      // 如果数组中数据是对象类型，监控对象变化
      this.observeArray(data);
    } else {
      // 对象劫持
      this.walk(data);
    }
  }
  observeArray(data) {
    data.forEach(item => observe(item));
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}
function defineReactive(data,key,value) {
  // value可能是对象，需递归观测
  observe(value)
  Object.defineProperty(data, key, {
    get() {
      return value
    },
    set(newVal) {
      // 赋值新对象，需将此对象劫持
      observe(newVal)
      value = newVal
    }
  })
}
export function observe(data) {
  // 如果是对象才观测
  if(!isObject(data)) {
    return;
  }
  // 对象被监测过
  if(data.__ob__) {
    return;
  }
  // 默认最外层data必须是对象
  return new Observer(data)
}