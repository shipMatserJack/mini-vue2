export function patch(oldVnode, vnode) {
  if(!oldVnode) {
    return createEle(vnode); // 没有el元素，直接根据虚拟节点返回真实节点
  }
  if (oldVnode.nodeType === 1) {
    let parentEle = oldVnode.parentNode; // 找到老节点父元素
    let ele = createEle(vnode); // 根据vnode创建新节点
    parentEle.insertBefore(ele, oldVnode.nextSibling); // 插入新节点
    parentEle.removeChild(oldVnode) // 删除老节点
    return ele
  }
}

function createComponent(vnode) {
  let i = vnode.data;
  if((i = i.hook) && (i = i.init)) {
    i(vnode); // 调用init方法
  }
  if(vnode.componentInstance) { // 有属性说明子组件new完毕，并且组件对应的真实dom挂载到了componentInstance.$el
    return true;
  }
}

function createEle(vnode) {
  const {
    tag,
    data,
    children,
    text,
    vm
  } = vnode;
  if (typeof tag === 'string') { // 元素
    if(createComponent(vnode)) {
      // 返回组件对应的真实节点
      return vnode.componentInstance.$el;
    }

    vnode.el = document.createElement(tag);
    children.forEach(child => {
      vnode.el.appendChild(createEle(child))
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}