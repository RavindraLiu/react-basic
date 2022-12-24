import { findDOM, compareTwoVdom } from "./react-dom";

export let updateQueue = {
  isBatchingUpdate: false, // 是否进行批量更新，如果true就是批量异步的，如果是false就是非批量同步的
  updaters: new Set(),
  batchUpdate() {
    updateQueue.isBatchingUpdate = false;
    for (const updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.updaters.clear();
  },
};
/**
 * 定义更新器, 当我们执行setState的时候来确定是怎样更新的
 */
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingStates = []; // 保存当前要更新的队列
    this.callbacks = []; // 保存当前要执行的回调函数
  }
  /**
   * 添加要改变的分状态到更新的队列， 1. 收集分状态 2. 触发更新逻辑
   * @param {*} partialState 分状态
   */
  addState(partialState, callback) {
    this.pendingStates.push(partialState);
    if (typeof callback === "function") {
      this.callbacks.push(callback);
    }
    // 触发更新
    this.emitUpdate();
  }
  // emitUpdate，不管状态和属性变化都会让组件刷新, 都会执行此方法
  // 后面会再次加判断, 是否批量更新变量，如果是就先不更新，如果是同步，就直接更新
  emitUpdate(nextProps) {
    this.nextProps = nextProps; // 传递的新的属性
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this); // 如果是批量，先把当前的updater进行保存
    } else {
      this.updateComponent(); // 直接更新
    }
  }
  // 根据 pendingStates的长度, 或者组件属性发生变化 判断是否要更新组件
  updateComponent() {
    const { classInstance, pendingStates, nextProps } = this;
    if (nextProps || pendingStates.length > 0) {
      // 表示将要进行的更新
      shouldUpdate(classInstance, this.getState());
    }
  }
  /**
   * 根据老状态和分状态生成最终的新状态
   * @returns
   */
  getState() {
    const { classInstance, pendingStates } = this;
    let { state } = classInstance; // 获取实例中的原始状态
    pendingStates.forEach((nextState) => {
      if (typeof nextState === "function") {
        nextState = nextState(state);
      }
      state = {
        ...state,
        ...nextState, // 使用新状态, 更新老装填
      };
    });
    pendingStates.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState; // 更新最新装填
  classInstance.forceUpdate(); // 更新组件, 调用实例的类组件方法进行更新
}

export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    // 每个类组件的实力都配有一个自己的Updater更新器
    this.updater = new Updater(this);
  }
  // Component存在公共的setState
  /**
   *
   * @param {*} partialState 更新的分状态 partialState可能是函数 或者是一个对象，函数就直接执行
   * @param {*} callback 回调函数
   */
  setState(partialState, callback) {
    this.updater.addState(partialState);
  }
  /**
   * 强制更新组件的逻辑
   * 组件更新
   * 1. 获取老的虚拟DOM
   * 2. 根据最新的属性和状态计算出信息的虚拟DOM
   * 3. 然后进行比较, 查找差异, 然后把这些差异同步到真实的DOM上
   */
  forceUpdate() {
    console.log("组件更新");
    // 强制更新, 拿到老的虚拟dom
    let oldRenderVdom = this.oldRenderVdom;
    // 根据老的虚拟DOM,生成老的真实DOM,
    let oldDom = findDOM(oldRenderVdom); // 获取真实dom
    let newRenderVdom = this.render(); // 渲染出新的vdom
    compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom; // 更新之后让新的vdom成为老的vdom
  }
}
