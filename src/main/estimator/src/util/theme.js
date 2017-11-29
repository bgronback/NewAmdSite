import {blue500} from 'material-ui/styles/colors'
import {blue700} from 'material-ui/styles/colors'
import {grey400} from 'material-ui/styles/colors'
import {pinkA200} from 'material-ui/styles/colors'
import {grey100} from 'material-ui/styles/colors'
import {grey300} from 'material-ui/styles/colors'
import {grey500} from 'material-ui/styles/colors'
import {darkBlack} from 'material-ui/styles/colors'
import {fullBlack} from 'material-ui/styles/colors'
import {white} from 'material-ui/styles/colors'
import {fade} from 'material-ui/utils/colorManipulator'

import _spacing from 'material-ui/styles/spacing'

var _spacing2 = _interopRequireDefault(_spacing);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

export default {
  spacing: _spacing2.default,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: blue500,
    primary2Color: blue700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    secondaryTextColor: (0, fade)(darkBlack, 0.54),
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    disabledColor: (0, fade)(darkBlack, 0.3),
    pickerHeaderColor: blue500,
    clockCircleColor: (0, fade)(darkBlack, 0.07),
    shadowColor: fullBlack
  }
}