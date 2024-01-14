# mini-react 笔记

## 实现最简单 mini-react

目标是：页面上能显示 app, 代码如下：

```js
const dom = document.createElement("div");
dom.id = "app";

document.querySelector("#root").append(dom);

const textNode = document.createTextNode("");

textNode.nodeValue = "app";

dom.append(textNode);
```

1.  使用对象描述 el

```js
const el = {
  type: "div",
  props: {
    id: "app",
    children: [
      {
        type: "TEXT_ELEMENT",
        props: {
          nodeValue: "app",
          children: [],
        },
      },
    ],
  },
};
```

2. 使用抽离 textElement

```js
const textEl = {
  type: "TEXT_ELEMENT",
  props: {
    nodeValue: "app",
    children: [],
  },
};

const el = {
  type: "div",
  props: {
    id: "app",
    children: [textEl],
  },
};
```

3. 使用对象中的属性代替直接赋值

```js
const app = document.createElement(el.type);
app.id = el.props.id;

document.querySelector("#root").append(app);
const textNode = document.createTextNode("");
textNode.nodeValue = textEl.props.nodeValue;

app.append(textNode);
```

4. 动态创建

```js
function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

const textEl = createTextNode("app");
const el = createElement("div", { id: "app" }, textEl);
```

依旧正常显示 app

5. 创建 render 函数来统一处理

```js
function render(el, container) {
  // 根据不同类型创建不同的dom
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  // 添加属性
  Object.keys(el.props).forEach((key) => {
    if (key !== "children") {
      dom[key] = el.props[key];
    }
  });

  // 处理子元素
  const children = el.props.children;
  children.forEach((child) => {
    render(child, dom);
  });

  // 添加到容器中
  container.append(dom);
}
// 使用render
const App = createElement("div", { id: "app" }, "app", "---hi mini-react");
console.log(App);
render(App, document.querySelector("#root"));
```

6. 根据 react 的 api 构建核心方法

```js
const ReactDOM = {
  createRoot(container) {
    return {
      render(el) {
        render(el, container);
      },
    };
  },
};

ReactDOM.createRoot(document.querySelector("#root")).render(App);
```

### 学到

- 数据结构设计的合理可以降低解构的算法复杂度。

### 问题

- append 和 appendChild 的区别？
-
