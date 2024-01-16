
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        const isTextNode = typeof child === 'string' || typeof child === "number"
        return isTextNode ? createTextNode(child) : child
      })
    }
  }
}

function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

// 任务入口设置初始任务参数
function render(el, container) {
  nextUnitOfWork = {
    dom: container,
    props: {
      children: [el]
    }
  }
  rootNode = nextUnitOfWork
}

function createDom(fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type)
    //  TODO 这里是每创建一个DOM就添加到页面中
    // fiber.parent.dom.append(dom)
    Object.keys(fiber.props).forEach(key => {
      if (key !== 'children') {
        dom[key] = fiber.props[key]
      }
    })
  }
}

function initChildren(fiber, children) {
  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      child: null,
      sibling: null,
      dom: null,
    }
    if (index === 0) {
      fiber.child = newFiber
    } else {
      prevChild.sibling = newFiber
    }
    prevChild = newFiber
  })
}

// 每次执行的任务，转化成链表依次执行
function performWorkOfUnit(fiber) {
  const isFunction = typeof fiber.type === 'function'
  let children = fiber.props.children
  if (isFunction) {
    children = [fiber.type(fiber.props)]
  } else {
    createDom(fiber)
  }
  initChildren(fiber, children)
  if (fiber.child) {
    return fiber.child
  }
  if (fiber.sibling) {
    return fiber.sibling
  }
  let nextFiber = fiber
  while (nextFiber) {
    if (nextFiber.sibling) {
      // console.log('有sibling');
      // console.log(nextFiber);
      return nextFiber.sibling
    }
    // console.log('没有');
    // console.log(nextFiber);
    nextFiber = nextFiber.parent
  }

}


function worker(IdleDeadline) {
  let shouldYield = false
  if (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performWorkOfUnit(nextUnitOfWork)
    if (!nextUnitOfWork && rootNode) {
      commitRoot()
    }

    shouldYield = IdleDeadline.timeRemaining() < 1

  }
  requestIdleCallback(worker)
}

requestIdleCallback(worker)

function commitRoot() {
  commitWork(rootNode.child)
  rootNode = null
}

function commitWork(fiber) {
  if (!fiber) return
  let parentFiber = fiber.parent
  while (!parentFiber.dom) {
    parentFiber = parentFiber.parent
  }
  if (fiber.dom) {
    parentFiber.dom.append(fiber.dom)
  }
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

let nextUnitOfWork = null
let rootNode = null

const React = {
  render,
  createElement
}

export default React