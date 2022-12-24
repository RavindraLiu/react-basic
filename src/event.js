import { updateQueue } from "./Component";

/**
 * 给dom节点绑定事件, 实现所有事件的事件委托
 * @param {*} dom 真实的DOM元素节点 button
 * @param {*} eventType 事件类型onclick
 * @param {*} handler 原始的事件处理函数 handleClick
 */
export function addEvent(dom, eventType, handler) {
  let store = dom.store || (dom.store = {}); // 原生DOM在自定义属性, 这个对象存放着对应DOM的事件处理函数
  store[eventType] = handler; // store.onclick = handler 把处理函数保存在到真实DOM节点上
  if (!document[eventType]) {
    // 如果有很多个元素都绑定了click 往document上只挂一次就好
    document[eventType] = dispatchEvent; //document.onclick = dispatchEvent 事件委托,把按钮上所有的事件都触发到文档上
  }
}
/**
 * 合成事件
 * 1. 屏蔽浏览器的差异: 不同的浏览器存在不同差异
 * @param {*} event 原生事件对象
 */
function dispatchEvent(event) {
  updateQueue.isBatchingUpdate = true; // 在事件函数执行前，让批量更新标志设置为true, 切换为批量更新模式
  let { target, type } = event; // target=button 为真实DOM， type类型为click
  let syntheticEvent = createSyntheticEvent(event);
  while (target) {
    // 模式事件冒泡的过程
    let eventType = `on${type}`;
    let { store } = target;
    let handler = store && store[eventType];
    handler && handler.call(target, syntheticEvent);
    target = target.parentNode;
  }
  updateQueue.batchUpdate();
}

function createSyntheticEvent(event) {
  let syntheticEvent = {};
  for (const key in event) {
    syntheticEvent[key] = event[key];
  }
  syntheticEvent.isDefaultPrevented = false; // 是否阻止了默认事件
  return syntheticEvent;
}
