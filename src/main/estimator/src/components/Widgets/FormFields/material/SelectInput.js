import React, {Component, PropTypes} from 'react'
import SelectField from 'material-ui/SelectField'

export default class SelectInput extends Component {

    render() {
        var {input, label, children, placeholder, meta: {touched, error}, isLoading, loadingMessage, disabled} = this.props;

        var errorText = touched && error ? error : '';

        var loadingMessage = loadingMessage ? loadingMessage : 'Loading...';

        var hintText = isLoading ? loadingMessage : placeholder;

        return (
            <SelectField
                floatingLabelText={label}
                fullWidth={true}
                hintText={hintText}
                floatingLabelFixed={true}
                errorText = {errorText}
                value={input}
                {...input}
                onChange={(event, index, value) => input.onChange(value)}
                children={children}
                disabled={isLoading || disabled}
            />
        )
    }

}

