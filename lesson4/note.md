# 第四节

## 实现事件绑定

在 updateProps 中处理以 on 开头的添加事件绑定

```js
function updateProps(dom, props) {
  Object.keys(props).forEach((key) => {
    // 以on开头的是事件
    if (key.startsWith("on")) {
      const eventType = key.slice("2").toLowerCase();
      dom.addEventListener(eventType, props[key]);
    } else {
      if (key !== "children") {
        dom[key] = props[key];
      }
    }
  });
}
```

## 更新 props

修改或者添加 props 后续处理
