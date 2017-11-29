import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"
import { reducer as formReducer } from "redux-form"
import parts from "./parts"
import estimate from "./estimates"

export const reducers = combineReducers({
    routing: routerReducer,
    form: formReducer,
    parts: parts,
    estimate: estimate
});
