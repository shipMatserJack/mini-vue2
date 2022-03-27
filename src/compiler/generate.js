const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配模板字符 {{}}

/**
 * @desc 遍历AST, 生成字符串
 * @param {*} el 
 * @returns _c('div', {id: 'app', a: 1}, 'hello')
 */
export function generate(el) {
  let children = genChildren(el);
  let code  = `_c('${el.tag}',${
    el.attrs.length? genProps(el.attrs): 'undefined'
  }${
    children?`,${children}`:''
  })`;
  return code;
}

function genProps(attrs) {
  let str = '';
  for(let i=0; i<attrs.length; i++) {
    let attr = attrs[i];
    if(attr.name === 'style') {
      let styleObj = {};
      attr.value.replace(/([^;:]+):([^;:]+)/g, function() {
        styleObj[arguments[1]] = arguments[2];
      })
      attr.value = styleObj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`; // JSON.stringify 加双引号
  }
  return `{${str.slice(0,-1)}}`;
}

function genChildren(el) {
  let children = el.children;
  if(children) {
    return children.map(c=>gen(c)).join(',');
  }
  return false;
}

function gen(el) {
  // 元素
  if(el.type === 1) {
    return generate(el);
  } else {
    let text = el.text;
    if(!text.match(defaultTagRE)) {
      return `_v('${text}')`;
    }else {
      // 'hello' + arr + 'world'   hello {{arr}} world
      let tokens = [];
      let match;
      let lastIndex = defaultTagRE.lastIndex = 0;
      while(match = defaultTagRE.exec(text)) { //循环匹配
        let index = match.index; // 开始索引
        if(index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index))) // 第一段
        }
        tokens.push(`_s(${match[1].trim()})`) // 第二段
        lastIndex = index + match[0].length;
      }
      if(lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex))) // 第三段
      }
      return `_v(${tokens.join('+')})`;
    }
  }
}