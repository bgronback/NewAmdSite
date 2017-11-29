import React, {Component, PropTypes} from 'react'
import TimePicker from 'material-ui/TimePicker'

export default class TimePickerInput extends Component {

    render() {
        var {input, label, meta: {touched, error}} = this.props;
        return (
            <TimePicker
                hintText={label}
                format="24hr"
                floatingLabelText={label}
                floatingLabelFixed={true}
                {...input}
                onChange={(event,  value) => input.onChange(value)}
                fullWidth={true}
            />

        )
    }

}

