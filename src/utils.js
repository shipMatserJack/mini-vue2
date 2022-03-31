export function isFuction(val) {
  return typeof val === 'function';
}
export function isObject(val) {
  return typeof val === 'object' && val !== null
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