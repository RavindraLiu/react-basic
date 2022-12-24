import { REACT_ELEMENT } from "./constants";
import { wrapToVdom } from "./utils";
import { Component } from "./Component";
/**
 *
 * @param {*} type 元素的类型
 * @param {*} config 元素中的props
 * @param {*} children  元素的孩子对象
 * @returns
 */
function createElement(type, config, children) {
  let key; // 用来实现DOM-DIFF, 高效快速进行DOM比较
  let ref; // 用来获取真实的DOM元素额

  if (config) {
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    delete config.ref;
    key = config.key;
    delete config.key;
  }

  let props = { ...config };
  if (arguments.length > 3) {
    // 如果有多个儿子，此处就是一个数组
    props.children = Array.prototype.slice.call(arguments, 2).map(wrapToVdom);
  } else {
    // 如果只有一个儿子，children是一个对象或者是字符串, 如果没有儿子，就是undefined
    // children不一定是数组
    props.children = wrapToVdom(children);
  }

  return {
    $$typeof: REACT_ELEMENT, // 表示当前一个虚拟DOM，也就是react元素
    type, // 虚拟DOM的类型
    ref,
    key,
    props, // 这是属性对象, id className style 属性
  };
}

const React = {
  createElement,
  Component,
};

export default React;
