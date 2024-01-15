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

/**
 * 
 * @param {*} el是 app组件这种 里边有 属性名 props children
// const App = React.createElement(
//   "div",
//   { id: "app" },
//   "app",
//   "---hi mini-react"
// );
 * @param {*} container 
 */
function render(el, container) {
  // console.log('执行render');
  // 任务的主入口，设置第一个任务的参数
  nextUnitOfWork = {
    dom: container, // 对应的真实dom #root
    props: {
      children: [el] // 传入的组件根节点
    }
  }
  root = nextUnitOfWork
}
// 储存根节点
let root = null
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
      // 每次给当前节点的上一个设置自身为sibling
      prevChild.sibling = newFiber
    }
    // 每次都把上一个节点赋值给prevChild
    prevChild = newFiber
  })
}
function performWorkOfUnit(fiber) {
  // console.log('执行performWorkOfUnit,fiber:');
  // console.log(fiber.dom);
  // console.log(fiber.child);
  // 如果没有dom，就创建dom
  if (!fiber.dom) {
    // console.log('没有dom，就创建dom', fiber.dom);
    const dom = fiber.dom = createDom(fiber.type)

    // 添加一个子节点就添加到父节点的dom中
    // fiber.parent.dom.append(dom)
    updateProps(dom, fiber.props)
  }

  // 3. 处理子元素
  // 每次处理只处理一个子元素
  initChildren(fiber)

  // 4. 转换链表,设置好指针 返回下一个要执行的任务
  // 由于此函数的返回值会被赋值给nextUnitOfWork，所以返回值必须是下一个要执行的任务
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
    // 没有任务的时候统一添加到dom
    // 只执行一次
    if (!nextUnitOfWork && root) {
      commitRoot()
    }

    shouldYield = deadline.timeRemaining() < 1
  }
  requestIdleCallback(workLoop)

}

function commitRoot() {
  commitWork(root.child)
  // 执行之后清空root
  root = null
}

function commitWork(fiber) {
  // 如果是空节点，就不处理
  if (!fiber) return
  fiber.parent.dom.append(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}

requestIdleCallback(workLoop)

const React = {
  render,
  createElement
}

export default React


