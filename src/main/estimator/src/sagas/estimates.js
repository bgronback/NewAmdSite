import { call, put } from "redux-saga/effects";
import ApiEstimates from "../api/estimates";

export function* estimateAddEdit(action) {
    const result = yield call(ApiEstimates.addEditEstimate, action.estimate);

    yield put({
        type: 'ESTIMATE_SUBMITTED',
        estimate: result
    });

    action.callbackSuccess();
}

export function* yearSelected(action) {
    const result = yield call(ApiEstimates.fetchParts, action.selection);

    yield put({
        type: 'PARTS_FETCHED',
        parts: result
    });

}