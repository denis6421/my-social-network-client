import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import global_reducer from './global_reducer'

export default (history) => combineReducers({
    router: connectRouter(history),
    global:global_reducer
})