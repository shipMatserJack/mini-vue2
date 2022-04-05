export function isFuction(val) {
  return typeof val === 'function';
}
export function isObject(val) {
  return typeof val === 'object' && val !== null
}
export function noop() {
  return () => {}
}

// mergeOptions start---------------------------------------------------
const lifeCycleHooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
]
let strats = {}; // 存放策略
lifeCycleHooks.forEach(hook => {
  strats[hook] = mergeHook;
})
// {} {beforeCreate:Fn} => {beforeCreate::[fn]}
// {beforeCreate::[fn]} {beforeCreate:Fn} => {beforeCreate::[fn, fn]}
function mergeHook(parentVal, childVal) {
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal); // 后续
    } else {
      return [childVal] // 第一次
    }
  } else {
    return parentVal;
  }
}
export function mergeOptions(parent, child) {
  const options = {};
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (parent.hasOwnProperty(key)) {
      continue;
    }
    mergeField(key);
  }

  function mergeField(key) {
    const parentVal = parent[key];
    const childVal = child[key];
    // 策略模式
    if (strats[key]) {
      options[key] = strats[key](parentVal, childVal);
    } else {
      if (isObject(parentVal) && isObject(childVal)) {
        options[key] = {
          ...parentVal,
          ...childVal
        };
      } else {
        options[key] = child[key];
      }
    }
  }
  return options;
}

// mergeOptions end--------------------------------------------------------

// 异步更新 nextTick start ----------------------------------------------------
const calllbacks = [];

function flushCallbacks() {
  calllbacks.forEach(cb => cb());
  wait = false;
}

function timer(flushCallbacks) {
  let timeFn = () => {};
  if (Promise) {
    timeFn = () => {
      Promise.resolve().then(flushCallbacks);
    }
  } else if (MutationObserver) {
    let textNode = document.createTextNode(1);
    let observe = new MutationObserver(flushCallbacks);
    observe.observe(textNode, {
      characterData: true
    })
    timeFn = () => {
      textNode.textContent = 3;
    }
  } else if (setImmediate) {
    timeFn = () => {
      setImmediate(flushCallbacks);
    }
  } else {
    timeFn = () => {
      setTimeout(flushCallbacks);
    }
  }
  timeFn();
}
let wait = false;
export function nextTick(cb) {
  calllbacks.push(cb);
  if (!wait) {
    wait = true;
    timer(flushCallbacks);
  }
}
// 异步更新 nextTick end ----------------------------------------------------