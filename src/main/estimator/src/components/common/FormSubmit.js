import React, { PropTypes } from "react";
import { FormGroup, HelpBlock, Button } from "react-bootstrap";
import { push } from "react-router-redux";
import RaisedButton from 'material-ui/RaisedButton';

// Form submit component
export default class FormSubmit extends React.Component {

  render() {
    const {error, invalid, submitting, pristine, buttonSaveLoading, buttonSave, cancel} = this.props;
    return (
      <div>
        {error &&
        <FormGroup validationState="error">
          <HelpBlock>{error}</HelpBlock>
        </FormGroup>}

        <FormGroup className="submit">
          <RaisedButton label="Cancel" secondary={true} style={{margin: 6}} onClick={cancel}></RaisedButton>
          <RaisedButton type="submit" label="Save" primary={true} style={{margin: 6}} disabled={pristine || submitting}></RaisedButton>
        </FormGroup>
      </div>
    );
  }
}

// prop checks
FormSubmit.propTypes = {
  error: PropTypes.string,  // redux-form general `_error` message
  invalid: PropTypes.bool,  // redux-form invalid prop
  submitting: PropTypes.bool,   // redux-form invalid submitting
  buttonSaveLoading: PropTypes.string, // save button loading text, default is "Saving..."
  buttonSave: PropTypes.string    // save button text, default is "Save"
};
