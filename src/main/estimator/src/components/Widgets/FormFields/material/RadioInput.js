import React, {Component, PropTypes} from 'react'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';



export default class SelectInput extends Component {

    render() {
        var {input, label, ...rest} = this.props;
        return (
            <div className="material-radio">
                <RadioButtonGroup {...input} {...rest}
                    valueSelected={input.value}
                    onChange={(event, value) => input.onChange(value)}
                />
            </div>
        )
    }

}

