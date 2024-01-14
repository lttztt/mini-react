// Description: demo for requestIdleCallback
// 可以发现每个任务的剩余时间都是不一样的，这就是requestIdleCallback的特点，它会根据当前浏览器的负载情况，来分配时间片，这样就不会影响到用户的交互体验。

let taskId = 0
function worker(deadline) {
  taskId++

  let shouldYield = false;
  while (!shouldYield) {
    // task run 任务运行
    console.log(`task id ${taskId}执行`);
    // dom 渲染

    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(worker)

}

requestIdleCallback(worker)