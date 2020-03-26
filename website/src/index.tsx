import React from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

import E from "./example/pagination";

function App() {
    return (
        <div>
            <h1>hello!</h1>
            <E />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
