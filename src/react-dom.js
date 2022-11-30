import { REACT_TEXT } from "./utils";
import { addEvent } from "./event";

// 渲染真实的元素
function render(vdom, container) {
  mount(vdom, container);
}

function mount(vdom, container) {
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM);
}

function createDOM(vdom) {
  let { type, props } = vdom;
  let dom;
  if (type === REACT_TEXT) {
    // 文本
    dom = document.createTextNode(props);
  } else if (typeof type === "function") {
    //类组件在编译后也是函数组件;
    if (type.isReactComponent) {
      // 说明是个类组件
      return mountClassComponent(vdom);
    } else {
      // 初始化函数式组件,
      return mountFunctionComponent(vdom);
    }
  } else {
    // 如果type是一个普通字符串, 说明是一个原生组件 div span p....
    dom = document.createElement(type);
  }

  if (props) {
    // dom元素 老属性对象 新属性对象
    updateProps(dom, {}, props);
    // 只有一个儿子的情况
    if (typeof props.children === "object" && props.children.type) {
      mount(props.children, dom);
    } else if (Array.isArray(props.children)) {
      reconcileChildren(props.children, dom);
    }
  }
  vdom.dom = dom; // 创建真实DOM, 把虚拟DOM和真实DOM进行关联
  return dom;
}

function mountClassComponent(vdom) {
  let { type: ClassComponent, props } = vdom;
  let classInstance = new ClassComponent(props);
  let renderVDOM = classInstance.render();
  // 缓存上次渲染的虚拟DOM
  vdom.classInstance = classInstance;
  classInstance.oldRenderVdom = renderVDOM;
  let dom = createDOM(renderVDOM);
  return dom;
}

function mountFunctionComponent(vdom) {
  let { type: FunctionComponent, props } = vdom;
  let renderVdom = FunctionComponent(props); // 函数的执行结果是一个虚拟DOM
  // 缓存上次渲染的虚拟DOM,放在虚拟DOM上
  vdom.oldRenderVom = renderVdom;
  return createDOM(renderVdom);
}

function reconcileChildren(children, parentDOM) {
  for (let i = 0; i < children.length; i++) {
    mount(children[i], parentDOM);
  }
}

function updateProps(dom, oldProps = {}, newProps = {}) {
  for (const key in newProps) {
    if (key === "children") {
      continue;
    } else if (key === "style") {
      // 处理style上的属性
      let styleObj = newProps[key];
      for (const attr in styleObj) {
        dom.style[attr] = styleObj[attr];
      }
    } else if (/^on[A-Z].*/.test(key)) {
      // dom[key.toLowerCase()] = newProps[key];
      addEvent(dom, key.toLowerCase(), newProps[key]);
    } else {
      // className
      dom[key] = newProps[key];
    }
  }

  for (const key in oldProps) {
    if (!newProps.hasOwnProperty(key)) {
      dom[key] = null;
    }
  }
}
/**
 * 从虚拟DOM上获取真实的DOM
 * findDOM: 查找上次的真实dom，如果是type是真实的DOM类型字符，直接返回，
 * 如果是函数组件或者类组件, 只有通过老的虚拟dom通过递归的方式查找才能找到真实的DOM，
 * @param {*} vdom 原生div => 真实的div节点  函数组件oldRenderVdom才可能有真实的DOM
 * @returns
 */
export function findDOM(vdom) {
  if (!vdom) return null;
  if (vdom.dom) {
    // 当vdom对应原生组件的情况, 可以返回真实DOM
    return vdom.dom;
  } else {
    // 如果是类组件或者函数组件的话
    // 渲染挂在函数组件的时候，在虚拟dom.oldRenderVdom上才可能有真实的DOM
    let oldRenderVdom = vdom.classInstance // 区分函数组件和类组件通过虚拟DOM的classInstance
      ? vdom.classInstance.oldRenderVdom
      : vdom.oldRenderVdom;
    return findDOM(oldRenderVdom);
  }
}
/**
 * 比较虚拟dom 更新真实dom
 * @param {*} parentNode 真实元素的父节点
 * @param {*} oldVdom
 * @param {*} newVdom
 */
export function compareTwoVdom(parentNode, oldVdom, newVdom) {
  let oldDom = findDOM(oldVdom); // 获取老的真实dom
  let newDom = createDOM(newVdom); // 生成新的真实DOM
  parentNode.replaceChild(newDom, oldDom);
}

const ReactDOM = {
  render,
};

export default ReactDOM;
