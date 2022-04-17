import { generate } from './generate.js';
import { parserHTML } from './parser.js'
// html词法解析 => ast语法解析 => render函数(组件挂载调用_render返回vnode) => virtual domm => real dom
// 字符串转成代码 eval 耗性能且会有作用域的问题
// 模版引擎：new Function() + with
export function compileToFunction(template) {
  const root = parserHTML(template);
  const code = generate(root);
  const render = new Function(`with(this){return ${code}}`); //with语法将code绑定在vm上
  return render;
}