import React from 'react'

enum actionType {
    add,
    reduce
}

interface a1 {
    type: actionType.add,
    payload: {
        add: number
    }
}

interface a2 {
    type: actionType.reduce,
    payload: {
        reduce: number
    }
}

// 和typescript一起使用reducer的最佳实践
type action1 = a1 | a2
function reducer(state: typeof initState, action: action1) {
    return state
}

const initState = {
    count: 3
}

function init(state) {
    return state;
}

export function BestReducer() {
    const [state, dispatch] = React.useReducer(reducer, initState, init)
    state.count
    dispatch({
        type: actionType.reduce,
        payload: {
            reduce: 7
        }
    })
}


// 也行
interface action {
    add?: {
        num: number
    },
    reduce?: {
        num: number
    },
    ride?: {
        times: number
    },
    replace?: {
        value?: number
    },
    reset?: any,
}


