import {
  popTarget,
  pushTarget
} from "./dep";
import {
  queueWatcher
} from "./scheduler";

let id = 0;
/**
 * @desc 包含了渲染watcher 和 用户watcher
 */
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.user = !!options.user; // 是否是用户watcher
    this.lazy = !!options.lazy; // 是计算属性conputed的标识
    this.dirty = !!options.lazy; // 默认lazy:true, dirty:true
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = [];
    this.depsId = new Set();

    if (typeof exprOrFn === 'string') {
      // 将表达式转换成函数
      this.getter = function () {
        // 数据取值时，进行依赖收集
        // age.n => vm['age']['n']
        let path = exprOrFn.split('.'); // [age, n]
        let obj = vm;
        for (let i = 0; i < path.length; i++) {
          obj = obj[path[i]]
        }
        return obj;
      }
    } else {
      this.getter = exprOrFn;
    }
    // 默认初始化执行
    // 第一次的value
    this.value = this.lazy ? undefined : this.get();
  }
  // 用户更新会重新调用getter
  get() {
    pushTarget(this); // 将watcher放入dep中
    const value = this.getter.call(this.vm); // vm._update(vm._render())
    popTarget(); // 更新完移除watcher
    return value;
  }
  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      // 缓存watcher,避免多次调用同一个watcher的update
      queueWatcher(this);
    }
  }
  run() {
    const newValue = this.get();
    const oldValue = this.value;
    this.value = newValue;
    // 用户watcher
    if (this.user) {
      this.cb.call(this.vm, newValue, oldValue);
    }
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
    }
  }
  evaluate() {
    this.dirty = false; // 表示取过值了
    this.value = this.get(); // 用户的getter执行
  }
  depend() {
    let i = this.deps.length;
    while(i--){
      this.deps[i].depend(); // lastName, firstName 收集渲染watcher
    }
  }
}

// 每个组件渲染都对应一个watcher
export default Watcher

// wathcher和dep的关系（多对多的关系）
// watcher负责更新视图，dep负责依赖收集watcher
// 页面渲染前，会讲当前watcher放到Dep类上
// 在vue中模板渲染时用的变量，需进行依赖收集，收集对象的渲染watcher
// 取值时，给每个属性加dep属性，存放这个渲染watcher（同一个watcher会对应多个dep）
// 每个属性可能对应多个视图，对应多个watcher
// dep.depend() => 通知dep存放watcher => Dep.target.addDep() => 通知watcher存放dep