import MODELS from '../util/models'
import MAKES from '../util/makes'
import YEARS from '../util/years'

export default function estimate(state = { estimate: undefined, status: undefined, makes: MAKES, models: [], years: [], parts: undefined }, action) {

    switch (action.type) {
        case 'PART_ADD_SUCCESS':
            return Object.assign({}, state, { status: 'PART_SAVED' });


        case 'PART_EDIT_SUCCESS':
            return Object.assign({}, state, { status: 'PART_SAVED' });


        case 'MAKE_SELECTED':
            return Object.assign({}, state, { status: 'MODELS_UPDATED',
                models: MODELS.filter(model => { return model.make === action.make })[0].models,
                years: []
            }
        );

        case 'MODEL_SELECTED':
            return Object.assign({}, state, { status: 'YEARS_UPDATED',
                years: YEARS.filter(year => { return year.model === action.model })[0].years
            }
        );

        case 'PARTS_FETCHED':
            return Object.assign({}, state, { status: 'PARTS_FETCHED',
                parts: action.parts
            }
        );

        case 'ESTIMATE_SUBMIT':
            return state;

        default:
            return state;
  }
}