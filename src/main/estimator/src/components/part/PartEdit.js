import React from 'react'
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
import { Field, SubmissionError, reduxForm, FieldArray } from "redux-form"
import LinearProgress from 'material-ui/LinearProgress'
import {Tabs, Tab} from 'material-ui/Tabs'
import SelectInput from "./../Widgets/FormFields/material/SelectInput"
import Add from 'material-ui/svg-icons/content/add'
import Delete from 'material-ui/svg-icons/action/delete'
import IconButton from 'material-ui/IconButton'
import MenuItem from "material-ui/MenuItem"
import MAKES from '../../util/makes'
import MODELS from '../../util/models'
import BRANDS from '../../util/brands'
import { connect } from 'react-redux'

export class PartEdit extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            tab_value: 'part'
        };

        // bind <this> to the event method - alternative to mapDispatchToProps
        this.formSubmit = this.formSubmit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.handleTabChange = this.handleTabChange.bind(this);
        this.routerWillLeave = this.routerWillLeave.bind(this);
        this.renderApplications = this.renderApplications.bind(this);
    }

    componentWillMount() {
        this.props.dispatch({ type: 'PART_FETCH', partId: this.props.params.partId });
    }

    componentDidMount() {
        this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
    }

    handleTabChange(value) {
        this.setState({tab_value: value});
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
                    <Tabs value={this.state.tab_value} onChange={this.handleTabChange}>
                        <Tab value="part" label="Part">
                            <Col>
                                <Row>
                                    <Col sm={3}>
                                        <Field component={SelectInput} label="Brand" name="brand">
                                            {BRANDS.map((type, index) => {
                                                return <MenuItem key={index} value={type.value} primaryText={type.text}/>
                                            })}
                                        </Field>
                                    </Col>
                                    <Col sm={3}>
                                        <Field component={TextInput} name="partNumber" label="Part Number"/>
                                    </Col>
                                    <Col sm={3}>
                                        <Field component={NumberInput} name="price" label="Price"/>
                                    </Col>
                                    <Col sm={3}>
                                        <Field component={NumberInput} name="labor" label="Labor"/>
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
                            </Col>
                        </Tab>
                        <Tab value="applications" label="Applications">
                            <FieldArray name="applications" component={this.renderApplications}/>
                        </Tab>
                    </Tabs>
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

    renderApplications({ fields, meta: { touched, error } }) {
        const YEARS = [
            {text: "1964", value: 1964},
            {text: "1965", value: 1965},
            {text: "1966", value: 1966},
            {text: "1967", value: 1967},
            {text: "1968", value: 1968},
            {text: "1969", value: 1969},
            {text: "1970", value: 1970},
            {text: "1971", value: 1971},
            {text: "1972", value: 1972},
            {text: "1973", value: 1973},
            {text: "1974", value: 1974},
            {text: "1975", value: 1975},
            {text: "1976", value: 1976}
        ];

        var models = [];
        MODELS.forEach((m) => { models = models.concat(m.models) });

        // Add models found in catalog, but not available for estimates
        models.push({text: "Scamp", value: "SCAMP"});
        models.push({text: "Valiant", value: "VALIANT"});
        models.push({text: "Duster", value: "DUSTER"});

        models.sort(function (a, b) { return a.value.localeCompare(b.value) });

        return (
            <Col>
                {fields.map((action, index) =>
                    <Row key={index}>
                        <Col sm={12}>
                            <Row>
                                <Col sm={3}>
                                    <Field component={SelectInput} label="Make" name={`${action}.make`}>
                                        {MAKES.map((type, index) => {
                                            return <MenuItem key={index} value={type.value} primaryText={type.text}/>
                                        })}
                                    </Field>
                                </Col>
                                <Col sm={4}>
                                    <Field component={SelectInput} label="Model" name={`${action}.model`}>
                                        {models.map((type, index) => {
                                            return <MenuItem key={index} value={type.value} primaryText={type.text}/>
                                        })}
                                    </Field>
                                </Col>
                                <Col sm={2}>
                                    <Field component={SelectInput} label="From" name={`${action}.from`}>
                                        {YEARS.map((type, index) => {
                                            return <MenuItem key={index} value={type.value} primaryText={type.text}/>
                                        })}
                                    </Field>
                                </Col>
                                <Col sm={2}>
                                    <Field component={SelectInput} label="To" name={`${action}.to`}>
                                        {YEARS.map((type, index) => {
                                            return <MenuItem key={index} value={type.value} primaryText={type.text}/>
                                        })}
                                    </Field>
                                </Col>
                                <Col sm={1} style={{marginTop: 20}}>
                                    <IconButton tooltip="Remove Application"
                                                touch={true}
                                                target="_blank"
                                                tooltipPosition="bottom-right"
                                                onClick={() => fields.remove(index)}>
                                        <Delete/>
                                    </IconButton>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                )}
                <Row>
                    <IconButton tooltip="Add Application"
                                touch={true}
                                target="_blank"
                                tooltipPosition="bottom-right"
                                onClick={() => fields.push({})}>
                        <Add/>
                    </IconButton>
                    {touched && error && <span>{error}</span>}
                </Row>
            </Col>
        )
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
                    labor: values.labor,
                    description: values.description,
                    image: values.image,
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
