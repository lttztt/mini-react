import React from "./core/React.js";
import ReactDOM from "./core/ReactDom.js";
import App from "./App.jsx";

// const app = React.createElement('div', { id: 'app' }, 'hi', '-----', 'mini-react')

// const app = (
//   <div id="app">
//     <h2>
//       <span>h2h2</span>
//     </h2>
//     <div class="app2">
//       <div class="app2-1">app2-1</div>
//       <div class="app2-2">app2-2</div>
//     </div>
//   </div>
// );
ReactDOM.createRoot(document.querySelector("#root")).render(<App />);
