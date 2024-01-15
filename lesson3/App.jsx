import React from "./core/React.js";

// const App = React.createElement(
//   "div",
//   { id: "app" },
//   "app",
//   "---hi mini-react"
// );
const App = (
  <div id="app" name="app1">
    <h2 class="app1-1">h2</h2>
    <div class="app1-2">
      <div class="app1-2-1">app1-2-1</div>
      <ul>
        <li>1</li>
        <li>2</li>
        <li>3</li>
      </ul>
    </div>
  </div>
);
// const App = <div id="app">mini-react</div>;
// const AppOne = function () {
//   return (
//     <div class="1232">
//       <span>1232</span>666
//     </div>
//   );
// };
// console.log(AppOne);

export default App;
