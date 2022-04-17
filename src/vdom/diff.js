function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

// 双指针比对儿子
function patchChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  const makeIndexByKey = (children) => {
    return children.reduce((memo, current, index) => {
      if(current.key) memo[current.key] = index;
      return memo;
    }, {})
  }
  const keysMap = makeIndexByKey(oldChildren);

  // 同时循环新老节点，有一方循环完成则退出循环
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    // 节点已经被移动，则指针向后/向前移动
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    }else if(!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    }
    // 头头比较，标签一致，key一致，则patch属性和子元素
    if (isSameVnode(oldStartVnode, newStartVnode)) {
      diff(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) {
      // 尾尾比较，标签一致，key一致，则patch属性和元素
      diff(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    }
    // 头尾比较 => reverse
    else if (isSameVnode(oldStartVnode, newEndVnode)) {
      diff(oldStartVnode, newEndVnode)
      // 放到oldEndVnode下一个元素的前面
      el.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
      oldStartVnode = oldChildren[++oldStartIndex]
      newEndVnode = newChildren[--newEndIndex]
    }
    // 尾头比较 => reserve
    else if (isSameVnode(oldEndVnode, newStartVnode)) {
      diff(oldEndVnode, newStartVnode)
      // 放到oldEndVnode下一个元素的前面
      el.insertBefore(oldEndVnode.el, oldStartVnode.el)
      oldEndVnode = oldChildren[--oldEndIndex]
      newStartVnode = newChildren[++newStartIndex]
    } else {
      // ✨核心：乱序比对
      // 1.需根据key和对应的索引将老节点生成映射表
      // 2.与老节点对比，移动新节点的指针
      const moveIndex = keysMap[newStartVnode.key] // 新的到老的中查找
      if(moveIndex === undefined) { // 不能复用则创建新的插到老的节点开头
        el.insertBefore(createEle(newStartVnode), oldEndVnode.el)
      }else {
        const moveNode = oldChildren[moveIndex]
        oldChildren[moveIndex] = null; // 此节点已被移动
        el.insertBefore(moveNode.el, oldStartVnode.el)
        diff(moveNode, newStartVnode) // 比较两个节点属性
      }
      newStartVnode = newChildren[++newStartIndex] // 新节点往后移动
    }
  }
  // 新的比老的多，添加新节点
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // 判断尾指针下个元素是否存在，确定插入节点，null时等于向后插入
      const anchor = newChildren[newEndIndex + 1] === null ? null : newChildren[newEndIndex + 1].el
      el.insertBefore(createEle(newChildren[i]), anchor)
    }
  }
  // 新的比老的少，删除老节点
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      if(oldChildren[i] !== null) el.removeChild(oldChildren[i].el)
    }
  }
}

// 比对属性
export function patchProps(vnode, oldProps = {}) {
  const newProps = vnode.data || {};
  const el = vnode.el;

  // 如果老的有，新的没有，直接删除
  const newStyle = newProps.style || {}
  const oldStyle = oldProps.style || {}
  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = ''
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      el.removeAttribute(key)
    }
  }

  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName]
      }
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}

/**
 * diff算法
 * @param {*} oldVnode 
 * @param {*} vnode 
 * @returns 
 */
export function diff(oldVnode, vnode) {
  //! 标签不同，直接替换
  if (oldVnode.tag !== vnode.tag) {
    return oldVnode.el.parentNode.replaceChild(createEle(vnode), oldVnode.el);
  }

  const el = vnode.el = oldVnode.el; // 表示当前新节点，复用老节点
  //! 如果两个都是文本节点，比较内容
  if (vnode.tag === undefined) {
    if (oldVnode.text !== vnode.text) {
      el.textContent = vnode.text;
    }
    return
  }
  //! 标签相同，比对属性
  patchProps(vnode, oldVnode.data)
  //! 🌟比对子元素
  const oldChildren = oldVnode.children || []
  const newChildren = vnode.children || []
  if (oldChildren.length && newChildren.length) {
    // 双方都有儿子，比对儿子
    patchChildren(el, oldChildren, newChildren)
  } else if (newChildren.length) {
    // 老的没有新的有
    for (let i = 0; i < newChildren.length; i++) {
      const child = createEle(newChildren[i]);
      el.appendChild(child); // 循环创建新节点
    }
  } else if (oldChildren.length) {
    // 老的有新的没有
    el.innerHTML = ''
  }
  return el;
}