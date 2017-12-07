export default function parts(state = { user: undefined, status: 'no_status' }, action) {
  switch (action.type) {

    case 'USER_LOGGED_IN':
        return Object.assign({}, state, { user: action.user, status: 'success' });

    default:
      return state;
  }
}
