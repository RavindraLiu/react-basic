import React from "./react";
import ReactDOM from "./react-dom";
// import React from "react";
// import ReactDOM from "react-dom";
// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render("");

// function FunctionComponent(props) {
//   return (
//     <h1 className="title" style={{ color: "red" }}>
//       {props.name}
//     </h1>
//   );
// }
//
class Counter extends React.Component {
  // props的属性来自于Component, 通过props进行实例化
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  handleClick() {
    // setState可以修改状态, 并且让组件刷新
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);
    // setState可以修改状态, 并且让组件刷新
    this.setState({ number: this.state.number + 1 });
    console.log(this.state);
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
      // setState可以修改状态, 并且让组件刷新
      this.setState({ number: this.state.number + 1 });
      console.log(this.state);
    }, 1000);
  }

  render() {
    return (
      <>
        <h2>{this.props.name}</h2>
        <p>{this.state.number}</p>
        <button onClick={() => this.handleClick()}>+1</button>
      </>
    );
  }
}
class ClassComponent extends React.Component {
  render() {
    return <h1>我是类组件: {this.props.name}</h1>;
  }
}

let element = <ClassComponent name="killian" age={12}></ClassComponent>;
console.log(element);
ReactDOM.render(<Counter name="计算器" />, document.getElementById("root"));

// setState是怎样更新的， 1. 唯一更新this.state的方式 2. 重新渲染页面
// 渲染页面createDOM => 生成的虚拟DOM记录当前老的真实DOM  => 当更新的时候获取老的真实dom和createDOM获取新的真实dom
// 进行比较，当比较完成，进行更新操作

// setState可能会异步更新的, 同一个函数中会进行合并，控制批量更新使用isBatchUpdate = true, 批量更新实现各函数的代理
// 在React18以后m setTimeout也是同步的了， 因为实现的机制不一样
