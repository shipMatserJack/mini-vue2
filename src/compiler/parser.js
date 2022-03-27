const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 获取标签名, match后的索引为1的 <aa:xx></aa:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配标签属性
const startTagClose = /^\s*(\/?)>/ // 匹配标签关闭
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配模板字符 {{}}

let root = null; // 根节点
let stack = [];
/**
 * @desc 构建AST语法树，数据格式算法（栈）
 * 1、循环解析字符串，解析<开头
 * 2、先解析开始标签（正则匹配，解析属性，删除解析过的字符串）
 *    2.1、创建AST,构造栈存储节点，标记父元素
 * 3、再解析文本（同上）
 *    3.1、将本文放入栈中最后一个元素的儿子中
 * 4、最后解析结尾标签（同时）
 *    4.1、将元素弹出出栈
 */
function createAstElement (tagName, attrs) {
  return {
    tag: tagName,
    type: 1,
    children: [],
    parent: null,
    attrs
  }
}
function start(tagName, attrs) {
  let parent = stack[stack.length - 1]
  let element = createAstElement(tagName, attrs);
  if (!root) {
    root = element;
  }
  //  标记元素父亲
  if(parent) {
    element.parent = parent;
    parent.children.push(element);
  }
  stack.push(element);
}

function end(tagName) {
  let lastEle = stack.pop();
  if (lastEle.tag !== tagName) {
    throw new Error('标签有误')
  }
}

function chars(text) {
  text = text.replace(/\s/g, '');
  let parent = stack[stack.length - 1];
  if (text) {
    parent.children.push({
      type: 3,
      text
    })
  }
}

export function parserHTML(html) { // <div id="app">123</app>
  // 删除标签
  function advance(len) {
    html = html.substring(len);
  }
  // 解析开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen);
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 删除已经匹配的开始标签
      advance(start[0].length);
      let end;
      let attr;
      // 没遇到标签结尾就不停解析
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        })
        advance(attr[0].length);
      }
      if (end) {
        advance(end[0].length);
      }
      return match;
    };
    return false;
  }
  while (html) {
    let textEnd = html.indexOf('<'); // 解析的开头
    if (textEnd === 0) {
      const startTagMatch = parseStartTag() // 解析开始标签
      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue;
      };
      const endTagMatch = html.match(endTag);
      if (endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    };
    let text; // 123</div>
    if (textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text);
      advance(text.length);
    }
  }
  return root;
}