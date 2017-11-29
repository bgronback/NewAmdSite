import React, {Component, PropTypes} from 'react'
import TextField from 'material-ui/TextField'

class CurrencyInput extends Component {
    render() {
        var {input, label, pattern, type, step, placeholder, meta: {touched, error}} = this.props;
        return (
            <TextField hintText={placeholder}
                       fullWidth={true}
                       type="tel"
                       step={step}
                       floatingLabelText={label}
                       floatingLabelFixed={true}

                {...input}
            />
        )
    }
}
