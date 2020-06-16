import { SET_DATA_TO_GLOBAL_REDUCER } from "../actions/types";

const initialState = {
  cart_list: [],
};

export default function (state = initialState, { payload, type }) {
  switch (type) {
    case "SET_DATA_TO_GLOBAL":
      const { name, value } = payload;

      return {
        ...state,
        [name]: value,
      };
    case SET_DATA_TO_GLOBAL_REDUCER:
      return {
        ...state,
        [payload.name]: payload.value,
      };
    default:
      return state;
  }
}
