import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux'
import { Form } from "react-bootstrap"
import { push } from "react-router-redux"
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import TextInput from "./../Widgets/FormFields/material/TextInput"
import TextAreaInput from "./../Widgets/FormFields/material/TextAreaInput"
import NumberInput from "./../Widgets/FormFields/material/NumberInput"
import KeyBinding from 'react-keybinding-component'
import Snackbar from 'material-ui/Snackbar'
import FormSubmit from "./../common/FormSubmit"
import validatePart from './validatePart'
import { Field, SubmissionError, reduxForm, change } from "redux-form"
import LinearProgress from 'material-ui/LinearProgress'

export class PartEdit extends React.Component {

    constructor(props) {
        super(props);

        // bind <this> to the event method - alternative to mapDispatchToProps
        this.formSubmit = this.formSubmit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.routerWillLeave = this.routerWillLeave.bind(this);
    }

    componentWillMount() {
        this.props.dispatch({ type: 'PART_FETCH', partId: this.props.params.partId });
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
    }

    routerWillLeave(nextLocation) {
        if (!this.props.pristine && !this.props.submitting) {
            return 'Your edits are not saved. Are you sure you want to leave?'
        }
    }

    cancel(key) {
        this.props.dispatch(push('/parts'));
    }

    render() {
        const {part, handleSubmit, error, invalid, pristine, submitting} = this.props;

        if (!part) {
            return (<LinearProgress mode="indeterminate"/>);
        } else {
            return <Row style={{margin: '20px'}}>
                <KeyBinding onKey={ (e) => { if (e.keyCode === 27) this.cancel() } } />
                <Form horizontal onSubmit={handleSubmit(this.formSubmit)}>
                    <Field name="_id" component='input' type="hidden"/>
                    <Col>
                        <Row>
                            <Col sm={4}>
                                <Field component={TextInput} name="brand" label="Brand"/>
                            </Col>
                            <Col sm={4}>
                                <Field component={TextInput} name="partNumber" label="Part Number"/>
                            </Col>
                            <Col sm={4}>
                                <Field component={NumberInput} name="price" label="Price"/>
                            </Col>
                        </Row>
                        <Row>
                          <Col sm={12}>
                            <Field component={TextInput} name="name" label="Name"/>
                          </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Field component={TextAreaInput} name="description" label="Description"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Field component={TextInput} name="image" label="Image"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <Field component={TextInput} name="info" label="Info"/>
                            </Col>
                        </Row>
                    </Col>
                    <div style={{textAlign: 'center'}}>
                        <FormSubmit className="button-bar" error={error} invalid={invalid} submitting={submitting} pristine={pristine} cancel={this.cancel}/>
                    </div>
                </Form>
                <Snackbar
                    open={submitting}
                    message="Saving part..."
                    autoHideDuration={4000}
                />
            </Row>
        }
    }

    // submit the form
    formSubmit(values) {
        const {dispatch} = this.props;
        return new Promise((resolve, reject) => {
            dispatch({
                type: 'PART_ADD_EDIT',
                part: {
                    _id: values._id,
                    brand: values.brand,
                    partNumber: values.partNumber,
                    name: values.name,
                    price: values.price,
                    description: values.description,
                    image: values.image,
                    info: values.info,
                    applications: values.applications
                },
                callbackError: (error) => {
                    reject(new SubmissionError({_error: error}));
                },
                callbackSuccess: () => {
                    resolve();
                    dispatch(push('/parts'));
                }
            });
        });
    }
}

function mapStateToProps(state, props) {
    return {
        part: state.parts.selected,
        initialValues: state.parts.selected
    }
}

const PartEditForm = reduxForm({
    form: 'part_edit',
    validate: validatePart,
    enableReinitialize: true
})(PartEdit);

export default connect(mapStateToProps)(PartEditForm);
