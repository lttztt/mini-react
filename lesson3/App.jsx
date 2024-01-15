import React from "./core/React.js";
function Count({ num }) {
  return <div>count: {num}</div>;
}
function CountContainer() {
  return <Count />;
}
// const App = (
//   <div id="app">
//     mini-react
//     <Count />
//     {/* <CountContainer /> */}
//   </div>
// );
function App() {
  return (
    <div id="app">
      mini-react
      <Count num={10} />
      <Count num={20} />
      {/* <CountContainer /> */}
    </div>
  );
}
export default App;
