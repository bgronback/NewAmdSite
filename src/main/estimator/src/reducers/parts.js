export default function parts(state = { selected: undefined, list: [], status: 'no_status', search_text: undefined }, action) {
  switch (action.type) {
    case 'PARTS_LIST_SUCCESS':
        return Object.assign({}, state, { list: action.parts, status: 'success', search_text: action.search_text });

    case 'PART_FETCH_LIST':
      return Object.assign({}, state, { status: undefined });

    case 'PART_FETCH_SUCCESS':
      return Object.assign({}, state, { selected: action.part, status: undefined });

    case 'PART_ADD_SUCCESS':
      return Object.assign({}, state, { selected: undefined, status: 'PART_SAVED', list: [...state.list, action.part] });

    case 'PART_EDIT_SUCCESS':
      return Object.assign({}, state, { selected: undefined, status: 'PART_SAVED', list: state.list.map(part => Number(part.partId) === Number(action.part.partId) ? {...action.part} : part) });

    case 'PART_DELETE_SUCCESS':
      return Object.assign({}, state, { selected: undefined, status: 'success', list: state.list.filter(part => action.partId !== part._id) });

    default:
      return state;
  }
}
