import React from "./core/React.js";
function Count({ num }) {
  return <div>Count:{num}</div>;
}
function App() {
  return (
    <div class="app">
      <div class="1">
        <div class="1-1">
          <div class="1-1-1">1</div>
        </div>
        <div class="1-2">1-2</div>
      </div>
      <div class="2">2</div>
      <div class="3">
        hi mini-react <Count num={10} />
        <hr />
        <Count num={20} />
      </div>
    </div>
  );
}
export default App;
