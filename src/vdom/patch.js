export function patch(oldVnode, vnode) {
  if(!oldVnode) {
    return createEle(vnode); // 没有el元素，直接根据虚拟节点返回真实节点
  }
  if (oldVnode.nodeType === 1) { // 第一次渲染是元素节点
    let parentEle = oldVnode.parentNode; // 找到老节点父元素
    let ele = createEle(vnode); // 根据vnode创建新节点
    parentEle.insertBefore(ele, oldVnode.nextSibling); // 插入新节点
    parentEle.removeChild(oldVnode) // 删除老节点
    return ele
  } else {
    //! 标签不同，直接替换
    if (oldVnode.tag !== vnode.tag) {
      return oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el);
    }
    
    vnode.el = oldVnode.el; // 表示当前新节点，复用老节点
    //! 如果两个都是文本节点，比较内容
    if(vnode.tag === undefined) {
      if(oldVnode.text !== vnode.text) {
        el.textContent = vnode.text;
      }
      return
    }
    //! 标签相同，比对属性
    patchProps(vnode, oldVnode.data)
    //! 比对子元素
    const oldChildren = oldVnode.child || []
    const newChildren = vnode.child || []
    if(oldChildren.length && newChildren.length) {
      // 双方都有儿子
    }else if(newChildren.length) {
      // 老的没有新的有
      for(let i=0; i<newChildren.length;i++) {
        const child = createEle(newChildren[i]);
        el.appendChild(child); // 循环创建新节点
      }
    }else if(oldChildren.length) {
      // 老的有新的没有
      el.innerHTML = ''
    }
  }
}

function patchProps(vnode, oldProps = {}) {
  const newProps = vnode.data || {};
  const el = vnode.el;

  // 如果老的有，新的没有，直接删除
  const newStyle = newProps.style || {}
  const oldStyle = oldProps.style || {}
  for(let key in oldStyle) {
    if(!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for(let key in oldProps) {
    if(!newProps[key]) {
      el.removeAttribute(key)
    }
  }

  for(let key in newProps) {
    if(key === 'style') {
      for(let styleName in newProps.style){
        el.style[styleName] = newProps.style[styleName]
      }
    }else {
      el.setAttribute(key, newProps[key])
    }
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

export function createEle(vnode) {
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
    patchProps(vnode)
    children.forEach(child => {
      vnode.el.appendChild(createEle(child))
    });
  } else {
    vnode.el = document.createTextNode(text);
  }
  return vnode.el;
}