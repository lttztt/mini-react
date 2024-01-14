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
}
function createDom(type) {
  return type === 'TEXT_ELEMENT' ? document.createTextNode("") : document.createElement(type)
}

function updateProps(dom, props) {

  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber) {
  const children = fiber.props.children
  let prevChild = null
  children.forEach((child, index) => {
    // 为了不破坏原有虚拟dom（child）的结构，我们创建一个新的work
    const newFiber = {
      type: child.type,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null,
      dom: null
    }
    // 第一个节点
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }

    // 每次都把上一个节点赋值给prevChild
    prevChild = newFiber
  })
}
function performWorkOfUnit(fiber) {
  // 如果没有dom，就创建dom
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber.type)

    fiber.parent.dom.append(dom)
    updateProps(dom, fiber.props)
  }

  // 3. 处理子元素
  initChildren(fiber)

  // 4. 转换链表,设置好指针 返回下一个要执行的任务
  // 有孩子节点，返回孩子节点
  if (fiber.child) {
    return fiber.child
  }
  // 没有孩子节点，返回兄弟节点
  if (fiber.sibling) {
    return fiber.sibling
  }
  // 否则返回父节点的兄弟节点
  return fiber.parent?.sibling

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


