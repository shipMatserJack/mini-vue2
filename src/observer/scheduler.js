import { nextTick } from "../utils";

let queue = [];
let has = {}; // 列表维护存放哪些watcher

function flushSchedulerQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].run();
  }
  queue = [];
  has = {}
  pending = false;
}

let pending = false;
export function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    queue.push(watcher);
    has[id] = true;
    // 开启一次更新操作，批处理（防抖）
    if (!pending) {
      pending = true;
      nextTick(flushSchedulerQueue) // 保证在flushSchedulerQueue后执行就能确保拿到最新dom（nextTick实现原理）
    }
  }
}