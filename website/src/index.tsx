if (window.process?.env?.NODE_ENV !== "development") {
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker
                .register("/service-worker.js")
                .then((registration) => {})
                .catch((registrationError) => {});
        });
    }
}

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
