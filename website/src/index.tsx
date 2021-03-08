import React from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

import { RichEditorDoc } from "./pages";

function App() {
    return (
        <div>
            <RichEditorDoc />
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
