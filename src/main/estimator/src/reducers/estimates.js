import MODELS from '../util/models'
import MAKES from '../util/makes'
import YEARS from '../util/years'

export default function estimate(state = { estimate: undefined, status: undefined, makes: MAKES, models: [], years: [], parts: undefined, services: [] }, action) {

    switch (action.type) {
        case 'PART_ADD_SUCCESS':
            return Object.assign({}, state, { status: 'PART_SAVED' });


        case 'PART_EDIT_SUCCESS':
            return Object.assign({}, state, { status: 'PART_SAVED' });


        case 'MAKE_SELECTED':
            const m = MODELS.filter(model => { return model.make === action.make });
            return Object.assign({}, state, { status: 'MODELS_UPDATED',
                models: m[0] ? m[0].models : [],
                years: []
            }
        );

        case 'MODEL_SELECTED':
            const y = YEARS.filter(year => { return year.model === action.model });
            return Object.assign({}, state, { status: 'YEARS_UPDATED',
                years: y[0] ? y[0].years : []
            }
        );

        case 'PARTS_FETCHED':
            return Object.assign({}, state, { status: 'PARTS_FETCHED',
                parts: action.parts
            }
        );

        case 'ESTIMATE_SUBMIT':
            return state;

        case 'ESTIMATE_SUBMITTED':
            return Object.assign({}, state, { status: 'submitted' });

        default:
            return state;
  }
}
