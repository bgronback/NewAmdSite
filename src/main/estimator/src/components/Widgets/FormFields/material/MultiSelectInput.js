import React, {Component, PropTypes} from 'react'
import ChipInput from 'material-ui-chip-input'

export default class MultiSelectInput extends Component {

    render() {
        var {input, label, placeholder, meta: {touched, error}, disabled, dataSource} = this.props;

        var errorText = touched && error ? error : '';

        var hintText = placeholder;

        return (<ChipInput
            {...input}
            onRequestAdd={(addedChip) => {
              let values = input.value || [];
              values = values.slice();
              values.push(addedChip);
              input.onChange(values);
            }}
            onRequestDelete={(deletedChip) => {
              let values = input.value || [];
              values = values.filter(v => v !== deletedChip);
              input.onChange(values);
            }}
            onBlur={() => input.onBlur()}
            hintText={hintText}
            floatingLabelText={label}
            disabled={disabled}
            dataSource={dataSource}
            openOnFocus={true}
            errorText = {errorText}
            fullWidth
          />
        )
    }

}

