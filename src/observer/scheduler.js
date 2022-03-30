let queue = [];
let has = {}; // 列表维护存放哪些watcher

export function queueWatcher (watcher) {
  watcher.id;
  queue.push(watcher);
}