const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*` // 标签名
const qnameCapture = `((?:${ncname}\\:)?${ncname})` // 获取标签名, match后的索引为1的 <aa:xx></aa:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配开始标签
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配标签属性
const startTagClose = /^\s*(\/?)>/ // 匹配标签关闭
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // 匹配模板字符 {{}}


function start(tagName, attributes) {
  console.log('satrt---', tagName, attributes)
}

function end(tagName) {
  console.log('end---', tagName)
}

function chars(text) {
  console.log('chars---', text);
}

function parserHTML(html) { // <div id="app">123</app>
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
      if(endTagMatch) {
        end(endTagMatch[1]);
        advance(endTagMatch[0].length);
        continue;
      }
    };
    let text; // 123</div>
    if(textEnd > 0) {
      text = html.substring(0, textEnd)
    }
    if (text) {
      chars(text);
      advance(text.length);
    }
  }
}
export function compileToFunction(template) {
  parserHTML(template);
}