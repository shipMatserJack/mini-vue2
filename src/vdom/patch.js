export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType === 1) {
    let parentEle = oldVnode.parentNode; // 找到老节点父元素
    let ele = createEle(vnode); // 根据vnode创建新节点
    parentEle.insertBefore(ele, oldVnode.nextSibling); // 插入新节点
    parentEle.removeChild(oldVnode) // 删除老节点
    return ele
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
    vnode.el = document.createElement(tag);
    children.forEach(child => {
      vnode.el.appendChild(createEle(child))
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}