import { observe } from "./observer/index";
import Watcher from "./observer/watcher";
import { isFuction } from "./utils";

export function stateMixin (Vue) {
  Vue.prototype.$watch = function(key, handler, options={}) {
    options.user = true; // 用户的watcher，区别于内部渲染watcher
    //1.创建watcer
    const watcher = new Watcher(this, key, handler, options)
    if(options.immediate) {
      handler(watcher.value);
    }
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm ,key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}

export function initState(vm) {
  const opts = vm.$options;
  // if(opts.props) {
  //   initProps();
  // }
  if(opts.data) {
    initData(vm);
  }
  if(opts.watch) {
    initWatch(vm, opts.watch);
  }
}

function initData(vm) {
  let data = vm.$options.data;
  // 这时候vm和data没任何关系，通过_data进行关联
  data = vm._data = isFuction(data)? data.call(vm) : data;
  // 将_data代理到vm上，vm.xxx => vm._data.xxx
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data);
}

function initWatch(vm, watch) {
  for(let key in watch) {
    const handler = watch[key];
    if(Array.isArray(handler)) {
      for(let i=0; i<handler.length; i++){
        createWatcher(vm, key, handler[i]);
      }
    }else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (vm, key, handler) {
  return vm.$watch(key, handler)
}