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
  // 根据不同类型创建不同的dom
  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode("") : document.createElement(el.type)

  // 添加属性
  Object.keys(el.props).forEach(key => {
    if (key !== 'children') {
      dom[key] = el.props[key]
    }
  })

  // 处理子元素
  const children = el.props.children
  children.forEach(child => {
    render(child, dom)
  })

  // 添加到容器中
  container.append(dom)
}

const React = {
  render,
  createElement
}

export default React


