# 第三节

**上一节代码遗留的问题**
如果执行过程中遇到 requestIdleCallback 没有空余时间，且间隔时间较长（1-2s）后才有空余时间，用户看到的可能是只渲染了几个节点，然后之后才渲染剩余节点。能不能做到统一添加到父节点的。

## 小步走实现思路

1. type 的处理
2. 区分 FC 和非 FC
3. 添加到视图的处理

## 实现统一提交

## 支持 function component

> 以下简称 FC

**先试试直接使用**

```js
function Count() {
  return <div>count</div>;
}
const App = (
  <div id="app">
    mini-react
    <Count />
  </div>
);
```

浏览器报错，提供的 tagName 不是一个有效的名称。无法识别 function Count
那就需要处理它：问题出在我们 createDom 的时候没有判断类型属于 function 的情况

在创建 dom 的时候分析，FC 不需要 dom，同时在 initChildren 中 children 是一个数组，由于 FC 是一个函数则需要执行一下得到返回的对象

```js
const isFunctionComponent = typeof fiber.type === "function";
// 如果是不是函数组件，就创建dom
if (!isFunctionComponent) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));
    updateProps(dom, fiber.props);
  }
}
// 处理函数组件的children包裹成函数
const children = isFunctionComponent ? [fiber.type()] : fiber.props.children;
// 统一使用children参数
initChildren(fiber, children);
```

当前的 fiber 的父级插入 fiber.dom,由于 function component 没有 dom，所以报错了

```js
fiber.parent.dom.append(fiber.dom);
```

改造： 需要往上级一直找有 dom 的父级，然后使用 append 把 dom 插入

```js
// 递归调用
function commitWork(fiber) {
  if (!fiber) return;
  // 由于FC没有dom，所以需要找到最近的有dom的父级
  let parentFiber = fiber.parent;
  if (!parentFiber.dom) {
    parentFiber = parentFiber.parent;
  }
  // 如果有dom，就添加到父级dom上，不然会添加一个null
  if (fiber.dom) {
    parentFiber.dom.append(fiber.dom);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
```

**但是如果函数组件再嵌套的话还是会找不到 parent 的有效 dom**

```js
// 改成循环往上边找
while (!parentFiber.dom) {
  parentFiber = parentFiber.parent;
}
```

**使用 props**
