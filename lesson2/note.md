# 实现任务调度器

## 使用 window.requestIdleCallback

```js
// 可以发现每个任务的剩余时间都是不一样的，这就是requestIdleCallback的特点，它会根据当前浏览器的负载情况，来分配时间片，这样就不会影响到用户的交互体验。
function worker(IdleDeadline) {
  // Description: demo for requestIdleCallback
  console.log(IdleDeadline.timeRemaining());
}

window.requestIdleCallback(worker);
```

### 改造成任务处理

```js
let taskId = 0;
function worker(deadline) {
  taskId++;

  let shouldYield = false;
  while (!shouldYield) {
    // task run 任务运行
    console.log(`task id ${taskId}执行`);
    // dom 渲染

    shouldYield = deadline.timeRemaining() < 1;
  }
  requestIdleCallback(worker);
}

requestIdleCallback(worker);
```

## 把渲染的树转化成可以让任务一个接着一个执行的链表

**重点：待补充，需要再看一遍**

### 转化规则是

1. child
2. sibling
3. 叔叔

**initChildren 函数分析**

```js
function initChildren(fiber) {
  const children = fiber.props.children;
  let prevChild = null;
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null,
    };
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      // 每次给当前节点的上一个设置自身为sibling
      prevChild.sibling = newFiber;
    }
    // 每次都把上一个节点赋值给prevChild
    prevChild = newFiber;
  });
}
```

主要工作是遍历 fiber 的 children，把 fiber 的 child 信息完善成包含 parent、sibling、dom 信息的 newFiber。由于 每次执行会记录当前 fiber 为下一个任务的 prevChild，所以在不是第一个索引的时候设置上一个 prevChild 的 sibling 值是当前 newFiber。

### 在线演示树表转链表演示

[链接](https://pythontutor.com/render.html#mode=edit)

```js
function getLine(el) {
  const children = el.children;
  let preChild = null;
  children.forEach((child, index) => {
    const newWork = {
      type: child.type,
      children: child.children,
      child: null,
      parent: el,
      sibling: null,
    };
    if (index == 0) {
      el.child = newWork;
    } else {
      preChild.sibling = newWork;
    }
    preChild = newWork;
  });
  if (el.child) {
    return el.child;
  }
  if (el.sibling) {
    return el.sibling;
  }
  if (el.parent.sibling) {
    return el.parent.sibling;
  }
}
let next = {
  type: "a",
  children: [
    {
      type: "b",
      children: [
        { type: "b1", children: [] },
        { type: "b2", children: [] },
      ],
    },
    {
      type: "c",
      children: [
        { type: "c1", children: [] },
        { type: "c2", children: [] },
      ],
    },
  ],
};
while (next) {
  next = getLine(next);
}
```
