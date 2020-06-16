import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createStore, applyMiddleware, compose } from "redux"
import { routerMiddleware, ConnectedRouter } from "connected-react-router"
import reduxThunk from "redux-thunk"
import * as serviceWorker from "./serviceWorker"
import createBrowserHistory from "history/createBrowserHistory"
import reducers from './reducers/reducers'
import "./index.css"
import App from "./App"


const history = createBrowserHistory()
const store = createStore(
  reducers(history),
  {},
  compose(applyMiddleware(routerMiddleware(history), reduxThunk))
)


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
    <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
)

serviceWorker.unregister()
