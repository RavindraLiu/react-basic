import { findDOM, compareTwoVdom } from "./react-dom";
export let updateQueue = {
  isBatchingUpdate: false, //是否进行批量更新，如果true就是批量异步的，如果是false就是非批量同步的
  updaters: new Set(),
  batchUpdate() {
    updateQueue.isBatchingUpdate = false;
    for (const updater of updateQueue.updaters) {
      updater.updateComponent();
    }
    updateQueue.updaters.clear();
  },
};
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance;
    this.pendingState = [];
  }
  /**
   *
   * @param {*} partialState 分状态
   */
  addState(partialState) {
    this.pendingState.push(partialState);
    this.emitUpdate();
  }
  emitUpdate() {
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.add(this); // 如果是批量，先把当前的updater进行保存
    } else {
      this.updateComponent(); // 直接更新
    }
  }

  updateComponent() {
    const { classInstance, pendingState } = this;
    if (pendingState.length > 0) {
      // 表示将要进行的更新
      shouldUpdate(classInstance, this.getState());
    }
  }

  getState() {
    const { classInstance, pendingState } = this;
    let { state } = classInstance; // 获取实例中的老状态
    pendingState.forEach((nextState) => {
      state = {
        ...state,
        ...nextState, // 使用新状态, 更新老装填
      };
    });
    pendingState.length = 0;
    return state;
  }
}

function shouldUpdate(classInstance, nextState) {
  classInstance.state = nextState; // 更新最新装填
  classInstance.forceUpdate(); // 更新组件
}

export class Component {
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    // 每个类组件的实力都配有一个自己的Updater更新器
    this.updater = new Updater(this);
  }

  setState(partialState) {
    this.updater.addState(partialState);
  }

  forceUpdate() {
    console.log("组件更新");
    // 强制更新, 拿到老的虚拟dom
    let oldRenderVdom = this.oldRenderVdom;
    // 根据老的虚拟DOM,生成老的真实DOM

    let oldDom = findDOM(oldRenderVdom); // 获取真实dom
    let newRenderVdom = this.render(); // 渲染出新的vdom
    compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
    this.oldRenderVdom = newRenderVdom; // 更新之后让新的vdom成为老的vdom
  }
}
