import React, {Component, PropTypes} from 'react'
import DatePicker from 'material-ui/DatePicker'

export default class DateInput extends Component {

    render() {
        var {input, label, meta: {touched, error}} = this.props;

        return (
            <DatePicker
                hintText={label}
                floatingLabelText={label}
                floatingLabelFixed={true}
                container="inline"
                {...input}
                onChange={(event,  value) => input.onChange(value)}
                fullWidth={true}
            />

        )
    }

}

