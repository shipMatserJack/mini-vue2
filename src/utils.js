export function isFuction(val) {
  return typeof val === 'function';
}
export function isObject(val) {
  return typeof val === 'object' && val !== null
}
export function noop() {
  return () => {}
}
// {} {beforeCreate:Fn} => {beforeCreate::[fn]}
// {beforeCreate::[fn]} {beforeCreate:Fn} => {beforeCreate::[fn, fn]}
export function mergeOptions(parent, child) {
  const options = {};
  for (let key in parent) {
    mergeField(key)
  }
  for (let key in child) {
    if (parent.hasOwnproperty(key)) {
      continue;
    }
    mergeField(key);
  }

  function mergeField(key) {
    const parentVal = parent[key];
    const childVal = child[val];
    if (isObject(parentVal) && isObject(childVal)) {
      options[key] = {
        ...parentVal,
        ...childVal
      };
    } else {
      options[key] = child[key];
    }
  }
  return options;
}

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