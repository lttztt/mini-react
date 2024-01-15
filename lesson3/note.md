# 第三节

**上一节代码遗留的问题**
如果执行过程中遇到 requestIdleCallback 没有空余时间，且间隔时间较长（1-2s）后才有空余时间，用户看到的可能是只渲染了几个节点，然后之后才渲染剩余节点。能不能做到统一添加到父节点的。

## 实现统一提交

## 支持 function component

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
