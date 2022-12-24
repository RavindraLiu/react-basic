### react 是一个用于构建用户界面的 js 库, 核心专注于视图, 目的是实现组件化开发

1、 创建项目
`create-react-app myProject cd myProject yarn add cross-env`

2、JSX 渲染

2.1 什么是 jsx

    - jsx 是一种 js 和 html 混合的语法，将组件的结构，数据甚至样式都聚合在一起的写法

2.2 什么是元素

    - JSX 其实只是一种语法糖, 最终会通过 babeljs 转译成 `react.createElement`语法
    - `React.createElement`会返回一个 react 元素, 创建出来的是一个虚拟DOM
    - React 元素事实上是一个普通的 js 对象, 用来描述你屏幕的上看到的内容
    - ReactDOM用来确保浏览器中真实的DOM数据和React元素保持一致

    - 源代码 ====> (babel)编译之后的代码(React.createElement) ====> createElement执行返回虚拟DOM
    ```js
      {
         type: "h1",  元素的类型
         key: null,   用来区分统一父级元素的不同儿子
         ref: null,   用来获取真实的DOM元素
         props: {
            id: "title"
            children: "hello" // 一个儿子就是字符串, 多个儿子就是数组
         },

      }
    ```

2.3 项目启动

    - cross-env DISABLE_NEW_JSX_TRANSFORM=true 添加禁止jsx的转换

2.4 最能体现 react 核心设计的是 React16 - react17 fiber - react18 加入优先级调度 并发执行

3. 函数组件
   1, 函数组件接收一个单一的 props 对象并返回一个 React 元素
   2, 组件名成必须要大写字母开头
   3, 组件必须在使用的时候定义
   4, 组件的返回值只能使用一个根元素
   5, React 元素不但可以是一个 DOM 标签, 还可以是用户自定义组件
   6, 当 React 元素为用户自定义组件时, 它会将 JSX 所接收的属性转换为单个对象传递给组件, 这个对象称为 Props

   - render => vdom => vdom.type()

4. 类组件更新
5. 组件状态

   1. 组件的数据数据来源有两部分，分别是属性和状态对象
   2. 属性是父组件传递过来的
   3. 状态是自己内部的，改变状态的唯一方式就是 setState
   4. 属性和状态的变化都会影响视图的更新
   5. 不要直接修改 state, 构造函数式唯一可以给 this.state 赋值的地方

6. 合成事件和批量更新

   1. state 的更新会被合并, 当你调用 setState 的时候，React 会把你提供的对象合并到当前的 state
   2. State 的更新是异步的
      1. 处于性能考虑, React 可能会把多个 setState 调用合成一个调用
      2. 因为 this.props 和 this.state 可能异步更新, 所以你不要依赖他们的值来更新下一个状态
      3. 可能让 setState 接受一个函数而不是一个对象, 这个函数用上一个 state 作为第一个参数
   3. 事件处理
      1. React 事件的名称采用小驼峰，而不是纯大写
      2. 使用 jsx 语法需要传递一个函数作为事件处理函数，而不是一个字符串
      3. 不能通过 false 的方式阻止默认行为，你必须使用显示的使用 preventDefault
   4. 合成事件
      1. react17 以前绑定的是文档对象
      2. react17 以后绑定的是根元素
