function worker(IdleDeadline) {
  let shouldYield = false
  if (!shouldYield) {
    // 执行任务
    console.log('执行任务');

    if (IdleDeadline.didTimeout < 1) {
      shouldYield = true
    }
  }
  // requestIdleCallback(worker)
}
requestIdleCallback(worker)