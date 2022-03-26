import { observe } from "./observer/index";
import { isFuction } from "./utils";

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
    initData(vm)
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