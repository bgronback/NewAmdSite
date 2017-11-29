import React, {Component, PropTypes} from 'react'
import TextField from 'material-ui/TextField'

export default class TextAreaInput extends Component {

    render() {
        var {input, label, pattern, type, step, placeholder, meta: {touched, error}, disabled} = this.props;

        var errorText = touched && error ? error : '';

        return (

            <TextField hintText={placeholder}
                       fullWidth={true}
                       pattern={pattern}
                       type={type}
                       step={step}
                       disabled={disabled}
                       errorText = {errorText}
                       floatingLabelText={label}
                       floatingLabelFixed={true}
                       multiLine={true}
                       rows={2}
                {...input}
            />

        )
    }

}

