import {
  isObject
} from "../utils";
import {
  arrayMethods
} from "./array";
import Dep from "./dep";

class Observer {
  constructor(data) {
    this.dep = new Dep(); // 数据可能是对象或数组

    // 将observer实例赋给__ob__, 且__ob__不可枚举
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false // 不可枚举
    })
    if (Array.isArray(data)) {
      // 重写数组原型方法
      data.__proto__ = arrayMethods
      // 如果数组中数据是对象类型，监控对象变化
      this.observeArray(data);
    } else {
      // 对象劫持
      this.walk(data);
    }
  }
  // 监控数组，遍历观测
  observeArray(data) {
    data.forEach(item => observe(item));
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key])
    })
  }
}

function dependArray(value) {
  for (let i = 0; i < value.length; i++) {
    let current = value[i];
    current.__ob__ && current.__ob__.dep.depend();
    // 如果是多维数组
    if (Array.isArray(current)) {
      dependArray(current);
    }
  }
}

function defineReactive(data, key, value) {
  // 每个属性都有dep
  let dep = new Dep();
  // value可能是对象，需递归观测
  let childOb = observe(value);

  Object.defineProperty(data, key, {
    get() {
      // 取值时将wathcer和dep对应起来
      if (Dep.target) { // 此时是在模版中取值的
        dep.depend(); // 让dep记住watcher
        if (childOb) {
          childOb.dep.depend(); // 让对象和数组也记录watcher
          if (Array.isArray(value)) { // 对数组内部进行依赖收集
            dependArray(value)
          }
        }
      }
      return value
    },
    set(newVal) {
      if (newVal !== value) {
        observe(newVal); // 赋值新对象，需将此对象劫持
        value = newVal;
        dep.notify(); //通知watcher更新视图
      }
    }
  })
}
export function observe(data) {
  // 如果是对象才观测
  if (!isObject(data)) {
    return;
  }
  // 对象被监测过
  if (data.__ob__) {
    return data.__ob__;
  }
  // 默认最外层data必须是对象
  return new Observer(data)
}