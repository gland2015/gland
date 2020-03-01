import React from 'react'
import ReactDOM from 'react-dom'
import './styles.scss'

import { Editor, RemoteDataProvider  } from '@gland/geditor/core'
import { Toolbar, entityComponent } from '@gland/geditor/simpleToolbar';

const config = {
    entityComponent,
    RemoteDataProvider
}

function App() {
    return <div>
        <h1>hello!</h1>
        <Editor Toolbar={Toolbar} config={config} />
    </div>
}


ReactDOM.render(<App />, document.getElementById('root'))


