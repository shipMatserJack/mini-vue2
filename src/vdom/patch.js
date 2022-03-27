export function patch(oldVnode, vnode) {
  if (oldVnode.nodeType === 1) {
    let parentEle = oldVnode.parentNode; // 找到老节点父元素
    let ele = createEle(vnode);
    parentEle.insertBefore(ele, oldVnode.nextSibling);
    parentEle.removeChild(oldVnode)
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