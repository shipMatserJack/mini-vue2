import {
  popTarget,
  pushTarget
} from "./dep";
import {
  queueWatcher
} from "./scheduler";

let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    this.cb = cb;
    this.options = options;
    this.id = id++;
    this.deps = [];
    this.depsId = new Set();
    // 默认初始化执行
    this.getter = exprOrFn;
    this.get();
  }
  // 用户更新会重新调用getter
  get() {
    pushTarget(this); // 将watcher放入dep中
    this.getter(); // vm._update(vm._render())
    popTarget(); // 更新完移除watcher
  }
  update() {
    // 缓存watcher,避免多次调用同一个watcher的update
    queueWatcher(this);
  }
  run() {
    this.get()
  }
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.depsId.add(id);
      this.deps.push(dep);
      dep.addSub(this);
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