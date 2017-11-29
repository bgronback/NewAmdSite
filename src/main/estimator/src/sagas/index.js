import { takeLatest } from "redux-saga"
import { fork } from "redux-saga/effects"
import { partFetchList, partAddEdit, partDelete, partFetch } from "./parts"
import { estimateAddEdit, yearSelected } from "./estimates"

export function* sagas() {
    yield [
        fork(takeLatest, 'PART_FETCH_LIST', partFetchList),
        fork(takeLatest, 'PART_ADD_EDIT', partAddEdit),
        fork(takeLatest, 'PART_DELETE', partDelete),
        fork(takeLatest, 'PART_FETCH', partFetch),
        fork(takeLatest, 'ESTIMATE_SUBMIT', estimateAddEdit),
        fork(takeLatest, 'YEAR_SELECTED', yearSelected)
    ];
}
