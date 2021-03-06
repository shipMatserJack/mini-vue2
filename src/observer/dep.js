/**
 * 每个属性都分配一个dep, 用来存放watcher
 */
let id = 0;
class Dep {
  constructor() {
    this.id = id++;
    this.subs = []; // 用来存放watcher
  }
  depend() {
    // dep要存放watcher，watcher要存放dep，多对多关系
    if(Dep.target) {
      Dep.target.addDep(this); // 将dep传给watcher
    }
  }
  addSub(watcher) {
    this.subs.push(watcher);
  }
  notify() {
    this.subs.forEach(watcher => watcher.update());
  }
}
Dep.target = null;

let stack = [];

export function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher)
}
export function popTarget() {
  stack.pop();
  Dep.target = stack[stack.length -1];
}

export default Dep