import { combineReducers } from "redux"
import { routerReducer } from "react-router-redux"
import { reducer as formReducer } from "redux-form"
import parts from "./parts"
import estimates from "./estimates"
import users from "./users"

export const reducers = combineReducers({
    routing: routerReducer,
    form: formReducer,
    parts: parts,
    estimate: estimates,
    users: users
});
