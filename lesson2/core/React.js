function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
      })
    }
  }
}


function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el]
    }
  }
  // // 根据不同类型创建不同的dom
  // const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode("") : document.createElement(el.type)

  // // 添加属性
  // Object.keys(el.props).forEach(key => {
  //   if (key !== 'children') {
  //     dom[key] = el.props[key]
  //   }
  // })

  // // 处理子元素
  // const children = el.props.children
  // children.forEach(child => {
  //   render(child, dom)
  // })

  // // 添加到容器中
  // container.append(dom)
}

function performWorkOfUnit(work) {
  // 如果没有dom，就创建dom
  if (!work.dom) {
    // 1. 渲染dom
    const dom = work.dom = work.type === 'TEXT_ELEMENT' ? document.createTextNode("") : document.createElement(work.type)

    // 把当前dom添加到父节点中
    work.parent.dom.append(dom)
    // 2. 添加props
    Object.keys(work.props).forEach(key => {
      if (key !== 'children') {
        dom[key] = work.props[key]
      }
    })
  }

  // 3. 处理子元素
  const children = work.props.children
  let prevChild = null
  children.forEach((child, index) => {
    // 为了不破坏原有虚拟dom（child）的结构，我们创建一个新的work
    const newWork = {
      type: child.type,
      props: child.props,
      child: null,
      parent: work,
      sibling: null,
      dom: null
    }
    // 第一个节点
    if (index === 0) {
      work.child = newWork
    } else {
      prevChild.sibling = newWork
    }

    // 每次都把上一个节点赋值给prevChild
    prevChild = newWork
  })

  // 4. 转换链表,设置好指针 返回下一个要执行的任务
  // 有孩子节点，返回孩子节点
  if (work.child) {
    return work.child
  }
  // 没有孩子节点，返回兄弟节点
  if (work.sibling) {
    return work.sibling
  }
  // 否则返回父节点的兄弟节点
  return work.parent?.sibling

}

// 添加任务调度器

let nextUnitOfWork = null
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {

    nextUnitOfWork = performWorkOfUnit(nextUnitOfWork)

    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)

}

requestIdleCallback(workLoop)

const React = {
  render,
  createElement
}

export default React


