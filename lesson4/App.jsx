import React from "./core/React.js";
let count = 10;
function Count() {
  const fn = () => {
    count++;
    console.log("click");
    React.update();
  };
  return (
    <div>
      count: {count}
      <button onClick={fn}>+1</button>
    </div>
  );
}
function App() {
  return (
    <div id="app">
      mini-react
      <Count num={10} />
      {/* <Count num={20} /> */}
      {/* <CountContainer /> */}
    </div>
  );
}
console.log(App());
export default App;
