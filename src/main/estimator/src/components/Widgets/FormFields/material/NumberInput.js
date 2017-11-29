import React, {Component, PropTypes} from 'react'
import TextField from 'material-ui/TextField'




export default class NumberInput extends Component {

    render() {
        var {input, label, step, placeholder, meta: {touched, error}, disabled, min} = this.props;

        var errorText = touched && error ? error : '';

        return (
            <TextField hintText={placeholder}
                       fullWidth={true}
                       step={step}
                       disabled={disabled}
                       type="number"
                       min={min}
                       errorText = {errorText}
                       floatingLabelText={label}
                       floatingLabelFixed={true}

                {...input}
            />
        )
    }

}

