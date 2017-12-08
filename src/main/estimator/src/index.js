import "babel-polyfill"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { store } from "./store.js"
import { router } from "./router.js"

import 'react-widgets/lib/less/react-widgets.less'
import injectTapEventPlugin from 'react-tap-event-plugin'

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import * as Colors from 'material-ui/styles/colors';
import {MuiThemeProvider} from "material-ui";

const getTheme = () => {
    let overwrites = {
        "appBar": {
            "color": Colors.grey900
        }
    };
    return getMuiTheme(baseTheme, overwrites);
};

require('./stylesheets/application.less');

injectTapEventPlugin();

ReactDOM.render(
    <MuiThemeProvider muiTheme={getTheme()}>
      <Provider store={store}>
        {router}
      </Provider>
    </MuiThemeProvider>,
      document.getElementById('app')

);
