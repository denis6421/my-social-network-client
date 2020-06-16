

import {
    SET_DATA_TO_GLOBAL_REDUCER
}from './types'

export const setDataToGlobalReducer = (name, value) => async dispatch => {
    dispatch({
        type: SET_DATA_TO_GLOBAL_REDUCER,
        payload: { name, value }
    })
}

