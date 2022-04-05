import { isObject, isReservedTag } from "../utils";

export function createElement(vm, tag, data = {}, ...children) {
  // 如果tag是组件，应该渲染一个组件的vnode
  if(isReservedTag(tag)) {
    return  vnode(vm, tag, data, data.key, children, undefined);
  } else {
    const Ctor = vm.$options.components[tag];
    return createComponent(vm, tag, data, data.key, children, Ctor);
  }
}
export function createTextElement(vm, text) {
  return  vnode(vm, undefined, undefined, undefined, undefined, text);
}

function createComponent(vm, tag, data, key, children, Ctor) {
  if(isObject(Ctor)) {
    Ctor = vm.$options._base.extend(Ctor); // Vue.extend
  }
  // 渲染组件时需调用此方法
  data.hook = {
    init(vnode){
      const vm = vnode.componentInstance = new Ctor({_isComponent: true}); // new Sub，此选项会和组件配置进行合并
      vm.$mount(); // 挂载完毕后，会在vnode.componentInstance.$el
    }
  }
  return vnode(vm, `vue-component-${tag}`, data, key, undefined, {Ctor, children})
}

function vnode(vm, tag, data, key, children, text, componentOptions) {
  return {
    vm,
    tag,
    data,
    key,
    children,
    text,
    componentOptions
  }
}