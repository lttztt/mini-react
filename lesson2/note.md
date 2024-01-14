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

重点：

### 转化规则是

1. child
2. sibling
3. 叔叔
