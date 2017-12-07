import { call, put } from "redux-saga/effects";
import ApiParts from "../api/parts";

export function* partFetchList(action) {
    const result = yield call(ApiParts.getPartsList, action.key);

    yield put({
        type: 'PARTS_LIST_SUCCESS',
        parts: result,
        search_text: action.key
    });
}

export function* partAddEdit(action) {
    const result = yield call(ApiParts.addEditPart, action.part);
    //return action.callbackError("Some error");   // show an error when the API fails

    yield put({
        type: action.part.partId ? 'PART_EDIT_SUCCESS' : 'PART_ADD_SUCCESS',
        part: result
    });

    // success
    action.callbackSuccess();
}

export function* partDelete(action) {
    yield call(ApiParts.deletePart, action.partId);

    yield put({
        type: 'PART_DELETE_SUCCESS',
        partId: action.partId
    });
}

export function* partFetch(action) {
    const result = yield call(ApiParts.fetchPart, action.partId);

    yield put({
        type: 'PART_FETCH_SUCCESS',
        part: result
    });
}
