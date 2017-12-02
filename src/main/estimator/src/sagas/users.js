import { call, put } from "redux-saga/effects";
import ApiUsers from "../api/users";

export function* login(action) {
    const result = yield call(ApiUsers.login, action.username, action.password);

    yield put({
        type: 'USER_LOGGED_IN',
        user: result
    });

}