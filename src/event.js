import { updateQueue } from "./Component";

/**
 * 给dom节点绑定事件
 * @param {*} dom 真实的DOM元素节点 button
 * @param {*} eventType 事件类型onclick
 * @param {*} handler 原始的事件处理函数 handleClick
 */
export function addEvent(dom, eventType, handler) {
  let store = dom.store || (dom.store = {});
  store[eventType] = handler; // store.onclick = handler 把处理函数保存在到真实DOM节点上
  if (!document[eventType]) {
    document[eventType] = dispatchEvent; //document.onclick = dispatchEvent 事件委托,把按钮上所有的事件都触发到文档上
  }
}
/**
 * 合成事件
 * 1. 屏蔽浏览器的差异: 不同的浏览器存在不同差异
 * @param {*} event
 */
function dispatchEvent(event) {
  updateQueue.isBatchingUpdate = true; // 在事件函数执行前，让批量更新标志设置为true
  let { target, type } = event; // target=button 为真实DOM， type类型为click
  let syntheticEvent = createSyntheticEvent(event);
  let eventType = `on${type}`;
  let { store } = target;
  let handler = store && store[eventType];
  handler && handler(event);
  updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
  let syntheticEvent = {};
  for (const key in nativeEvent) {
    let value = nativeEvent[key];
    if (typeof value === "function") {
      value = value.bind(nativeEvent);
    }
    syntheticEvent[key] = value;
  }
  syntheticEvent.nativeEvent = nativeEvent;
  syntheticEvent.isDefaultPrevented = false; // 是否阻止了默认事件
}
