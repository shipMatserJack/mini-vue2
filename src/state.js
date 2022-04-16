import Dep from "./observer/dep";
import {
  observe
} from "./observer/index";
import Watcher from "./observer/watcher";
import {
  isFuction,
  noop
} from "./utils";

export function stateMixin(Vue) {
  Vue.prototype.$watch = function (key, handler, options = {}) {
    options.user = true; // 用户的watcher，区别于内部渲染watcher
    //1.创建watcer
    const watcher = new Watcher(this, key, handler, options)
    if (options.immediate) {
      handler(watcher.value);
    }
  }
}

function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key]
    },
    set(newVal) {
      vm[source][key] = newVal
    }
  })
}

// 初始化状态
export function initState(vm) {
  const opts = vm.$options;
  // if(opts.props) {
  //   initProps(vm, opt.props);
  // }
  // if(opts.methods) {
  //   initMethods(vm, opt.methods);
  // }
  if (opts.data) {
    initData(vm);
  }
  if (opts.watch) {
    initWatch(vm, opts.watch);
  }
  if (opts.computed) {
    initComputed(vm, opts.computed);
  }
}

// 初始化data
function initData(vm) {
  let data = vm.$options.data;
  // 这时候vm和data没任何关系，通过_data进行关联
  data = vm._data = isFuction(data) ? data.call(vm) : data;
  // 将_data代理到vm上，vm.xxx => vm._data.xxx
  for (let key in data) {
    proxy(vm, '_data', key)
  }
  observe(data);
}

// 初始化watch
function initWatch(vm, watch) {
  for (let key in watch) {
    const handler = watch[key];
    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

// 初始化computed
// 1. 创建计算属性watcher（表达式内响应式变量，firstName, lastName）
// 2. 分别找到dep, dep收集渲染watcher
// 3. 进行模版渲染
function initComputed(vm, computed) {
  const watchers = vm._conputedWatchers = {}
  for (let key in computed) {
    const userDef = computed[key];
    // 依赖属性变化重新取值
    const getter = typeof userDef === 'function' ? userDef : userDef.get;
    // 每个计算属性本质是watcher
    // 将watcher和属性做一个映射
    watchers[key] = new Watcher(vm, getter, noop(), {
      lazy: true
    }) // 默认不执行
    // 将key定义在vm
    defineComputed(vm, key, userDef);
  }
}




// ----------------------------------------分割线------------------------------------------------

function createWatcher(vm, key, handler) {
  // 核心是原型的$watch方法
  return vm.$watch(key, handler)
}

function createComputedGetter(key) {
  return function computedGetter() {
    // 通过key可以拿到对应的watcher，这个watcher包含了getter
    const watcher = this._conputedWatchers[key]
    // 根据dirty判断是否重新取值
    if (watcher.dirty) {
      watcher.evaluate();
    }
    // 如果当前取完值后Dep.target还有值，需向上收集
    if (Dep.target) { // 渲染watcher
      // 计算属性内部有两个 dep firstName lastName
      watcher.depend(); // watcher 对应多个dep
    }
    return watcher.value;
  }
}

function defineComputed(vm, key, userDef) {
  let sharedProperty = {};
  if (typeof userDef === 'function') {
    sharedProperty.get = userDef;
  } else {
    sharedProperty.get = createComputedGetter(key);
    sharedProperty.set = userDef.set || noop();
  }
  // computed就是defineProperty
  Object.defineProperty(vm, key, sharedProperty);
}