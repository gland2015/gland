import React from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

// import E from "./example/pagination";

import { Test } from './example/react-spring/drag'

// import { Test } from './example/react-spring/test'

function App() {
    let [a, setA] = React.useState(3)

    console.log('dddaaaaddadddddaa', a)

    return (
        <div>
            <button onClick={() => {
                setA(++a)
            }} >adddd</button>
            <Test />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
