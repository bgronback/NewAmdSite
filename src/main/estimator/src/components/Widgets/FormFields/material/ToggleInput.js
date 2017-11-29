import React, {Component, PropTypes} from 'react'
import Toggle from 'material-ui/Toggle'
import Col from "react-bootstrap/lib/Col";

export default class ToggleInput extends Component {

    render() {
        var {input, label, placeholder, disabled} = this.props;

        return (
            <Col md={12} className="toggle-group">
                <Col xs={8}>
                    <label>{label}</label>
                    <p>{placeholder}</p>
                </Col>
                <Col xs={2}>
                    <Toggle
                       toggled={input.value ? true : false}
                       onToggle={input.onChange}
                       disabled={disabled}
                    />
                </Col>
            </Col>
        )
    }
}

