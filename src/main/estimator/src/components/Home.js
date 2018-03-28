import React from "react"
import { connect } from "react-redux"
import {
    Step,
    Stepper,
    StepButton,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import validateEstimate from './validateEstimate'
import { Field, SubmissionError, reduxForm, change } from "redux-form"
import { Form, FormGroup } from "react-bootstrap"
import SelectInput from "./Widgets/FormFields/material/SelectInput"
import Col from 'react-bootstrap/lib/Col'
import Row from 'react-bootstrap/lib/Row'
import MenuItem from "material-ui/MenuItem"
import Snackbar from 'material-ui/Snackbar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table'
import TextInput from "./Widgets/FormFields/material/TextInput"
import TextAreaInput from "./Widgets/FormFields/material/TextAreaInput"
import normalizePhone from '../util/normalizePhone'

export class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stepIndex: -1,
            visited: [],
            snackbar: false,
            selected: [],
            services: []
        };
        this.formSubmit = this.formSubmit.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.renderDefault = this.renderDefault.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.renderSelectParts = this.renderSelectParts.bind(this);
        this.renderSelectServices = this.renderSelectServices.bind(this);
        this.handleRequestSnackbarClose = this.handleRequestSnackbarClose.bind(this);
    }

    handleNext() {
        const {stepIndex} = this.state;
        if (stepIndex < 3) {
            this.setState({stepIndex: stepIndex + 1});
        }
    };

    handlePrev() {
        const {stepIndex} = this.state;
        if (stepIndex > 0) {
            this.setState({stepIndex: stepIndex - 1});
        }
    };

    handleRowSelection(selectedRows) {
        if (selectedRows.length > 0) {
            this.setState({selected: selectedRows.slice(0), enable_delete: true});
        }
    }

    handleServiceRowSelection(selectedRows) {
        if (selectedRows.length > 0) {
            this.setState({services: selectedRows.slice(0), enable_delete: true});
        }
    }

    getStepContent(stepIndex) {
        // return all steps, hiding those not selected to maintain form fields active
        return <div>
            <div style={stepIndex === -1 ? {} : { display: 'none' }}>{this.renderDefault()}</div>
            <div style={stepIndex === 0 ? {} : { display: 'none' }}>{this.renderSelectParts()}</div>
            <div style={stepIndex === 1 ? {} : { display: 'none' }}>{this.renderSelectServices()}</div>
            <div style={stepIndex === 2 ? {} : { display: 'none' }}>{this.renderReview()}</div>
            <div style={stepIndex === 3 ? {} : { display: 'none' }}>{this.renderSubmit()}</div>
        </div>
    }

    render() {
        const { handleSubmit, error, invalid, pristine, submitting } = this.props;
        const { stepIndex } = this.state;

        return this.props.estimate.status === 'submitted' ? (<div>
                <h2 style={{textAlign: 'center', marginTop: 100}}>Thank You!</h2>
                <Snackbar
                    open={this.state.snackbar}
                    message="Your estimate was successfully submitted!"
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestSnackbarClose}
                />
            </div>) : (
            <Row>
                <Form horizontal onSubmit={handleSubmit(this.formSubmit)}>
                    <Stepper linear={false} activeStep={stepIndex}>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 0})}>
                                Parts
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 1})}>
                                Services
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 2})}>
                                Review
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 3})}>
                                Submit
                            </StepButton>
                        </Step>
                    </Stepper>
                    <div>
                        <Col>{this.getStepContent(stepIndex)}</Col>
                        <div style={{textAlign: 'center', marginTop: 20}}>
                            <FlatButton
                                label="Back"
                                disabled={stepIndex == -1}
                                onClick={this.handlePrev}
                                style={{marginRight: 12}}
                            />
                            <RaisedButton
                                label={stepIndex === 3 ? "Submit" : "Next"}
                                disabled={this.props.estimate.parts === undefined || (stepIndex === 3 ? (pristine || submitting) : false)}
                                primary={true}
                                type="submit"
                                onClick={this.handleNext}
                            />
                        </div>
                    </div>
                </Form>
            </Row>
        );
    }

    renderSelectParts() {
        var parts = this.props.estimate.parts;
        return <div className="container-fluid">
            <h4 style={{textAlign: 'center', marginTop: 10}}>Select sheet metal parts you will need</h4>
            <Table onRowSelection={(selection) => {this.handleRowSelection(selection)}} multiSelectable={true} wrapperStyle={{ maxHeight: '400px' }}>
                <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ whiteSpace: 'nowrap', width: 50 }}>Image</TableHeaderColumn>
                        <TableHeaderColumn style={{ whiteSpace: 'nowrap', width: 100 }}>Brand</TableHeaderColumn>
                        <TableHeaderColumn style={{ whiteSpace: 'nowrap', width: 150 }}>Part Number</TableHeaderColumn>
                        <TableHeaderColumn style={{ whiteSpace: 'nowrap', width: 100 }}>Price</TableHeaderColumn>
                        <TableHeaderColumn style={{ whiteSpace: 'nowrap', width: '99%' }}>Name</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                {this.renderTable(parts)}
            </Table>
        </div>
    }

    renderSelectServices() {
        var parts = this.props.estimate.parts;
        return <div className="container-fluid">
            <h4 style={{textAlign: 'center', marginTop: 10}}>Select additional services for your car</h4>
            <Table onRowSelection={(selection) => {this.handleServiceRowSelection(selection)}} multiSelectable={true} wrapperStyle={{ maxHeight: '400px' }}>
                <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ whiteSpace: 'nowrap', width: 150 }}>Service</TableHeaderColumn>
                        <TableHeaderColumn style={{ whiteSpace: 'nowrap', width: 100 }}>Labor</TableHeaderColumn>
                        <TableHeaderColumn style={{ whiteSpace: 'nowrap', width: '99%' }}>Name</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody showRowHover={true} deselectOnClickaway={false}>
                    {parts ? parts.filter(p => !p.price).map((row, index) => (
                        <TableRow key={index} selected={this.state.services.includes(index)}>
                            <TableRowColumn style={{ whiteSpace: 'nowrap', width: 150 }}>{row.partNumber}</TableRowColumn>
                            <TableRowColumn style={{ whiteSpace: 'nowrap', width: 100 }}>{row.labor.toFixed(2)}</TableRowColumn>
                            <TableRowColumn style={{ whiteSpace: 'nowrap', width: '99%' }} title={row.description}>{row.name}</TableRowColumn>
                        </TableRow>
                    )) : <TableRow key={0} selectable={false}>
                        <TableRowColumn>No services found</TableRowColumn></TableRow>}
                </TableBody>
            </Table>
        </div>
    }

    renderTable(parts) {
        return <TableBody showRowHover={true} deselectOnClickaway={false}>
            {parts ? parts.filter(p => p.price).map((row, index) => (
                <TableRow key={index} selected={this.state.services.includes(index)}>
                    <TableRowColumn style={{ whiteSpace: 'nowrap', width: 50 }}><img src={row.image} alt={row.name} width="50"/></TableRowColumn>
                    <TableRowColumn style={{ whiteSpace: 'nowrap', width: 100 }}>{row.brand}</TableRowColumn>
                    <TableRowColumn style={{ whiteSpace: 'nowrap', width: 150 }}>{row.partNumber}</TableRowColumn>
                    <TableRowColumn style={{ whiteSpace: 'nowrap', width: 100 }}>{row.price.toFixed(2)}</TableRowColumn>
                    <TableRowColumn style={{ whiteSpace: 'nowrap', width: '99%' }} title={row.description}>{row.name}</TableRowColumn>
                </TableRow>
            )) : <TableRow key={0} selectable={false}>
                <TableRowColumn>No records found</TableRowColumn></TableRow>}
        </TableBody>;
    }

    renderReview() {
        const {handleSubmit, error, invalid, pristine, submitting} = this.props;
        const parts = [];
        this.state.selected.forEach((selection) => { parts.push(this.props.estimate.parts[selection])});
        const services = [];
        this.state.services.forEach((selection) => { services.push(this.props.estimate.parts.filter(p => !p.price)[selection])});

        const partsTotal = parts ? parts.map(p => p.price).reduce((a, b) => (a + b), 0).toFixed(2) : 0.00;
        const servicesTotal = services ? services.map(p => p.labor).reduce((a, b) => (a + b), 0).toFixed(2) : 0.00;
        const laborTotal = (parseFloat(servicesTotal) + parseFloat((parts ? parts.map(p => p.labor).reduce((a, b) => (a + b), 0).toFixed(2) : 0.00))).toFixed(2);
        const total = (parseFloat(partsTotal) + parseFloat(laborTotal)).toFixed(2);
        const materialTotal = (laborTotal * 0.10).toFixed(2); // TODO make percentage configurable
        const tax = (partsTotal * 0.04).toFixed(2); // TODO make percentage configurable
        const grandTotal = (parseFloat(total) + parseFloat(materialTotal) + parseFloat(tax)).toFixed(2);

        return <div className="container-fluid">
                    <h4 style={{textAlign: 'center'}}>Estimate Summary</h4>
                    <Table selectable={false}>
                        <TableHeader adjustForCheckbox={false} enableSelectAll={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn style={{ width: 150}}>Part/Service</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '90%' }}>Name</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'right', width: 100}}>Price</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'right', width: 120}}>Labor</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'right', width: 100}}>Total</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody showRowHover={true} displayRowCheckbox={false}>
                            {parts ? parts.map((row, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn style={{ width: 150}}>{row.partNumber}</TableRowColumn>
                                    <TableRowColumn style={{ width: '90%' }}>{row.name}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right', width: 100}}>{row.price.toFixed(2)}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right', width: 120}}>{row.labor ? row.labor.toFixed(2) : 0.00.toFixed(2)}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right', width: 100}}>{(row.price + row.labor).toFixed(2)}</TableRowColumn>
                                </TableRow>
                            )) : <TableRow key={0}>
                                <TableRowColumn>No parts selected</TableRowColumn></TableRow>}
                            {services ? services.map((row, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn style={{ width: 150}}>{row.partNumber}</TableRowColumn>
                                    <TableRowColumn style={{ width: '90%' }}>{row.name}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right', width: 100}}>{0.00.toFixed(2)}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right', width: 120}}>{row.labor.toFixed(2)}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right', width: 100}}>{(row.labor).toFixed(2)}</TableRowColumn>
                                </TableRow>
                            )) : <TableRow key={0}>
                                <TableRowColumn>No services selected</TableRowColumn></TableRow>}
                            <TableRow key={99996}>
                                <TableRowColumn></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>Subtotals</TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>{partsTotal}</TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>{laborTotal}</TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>{total}</TableRowColumn>
                            </TableRow>
                            <TableRow key={99997}>
                                <TableRowColumn></TableRowColumn>
                                <TableRowColumn></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>Materials</TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>{materialTotal}</TableRowColumn>
                            </TableRow>
                            <TableRow key={99998}>
                                <TableRowColumn></TableRowColumn>
                                <TableRowColumn></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>Sales Tax</TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}>{tax}</TableRowColumn>
                            </TableRow>
                            <TableRow key={99999}>
                                <TableRowColumn></TableRowColumn>
                                <TableRowColumn></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}><b>Total</b></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}><b>{grandTotal}</b></TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p style={{textAlign: 'justify', margin: 30}}><em>Please note that the labor prices are based on reductions for certain panel overlaps and are subject to increase if no adjacent panels are being replaced. Also note that some operations cannot be performed independently; for example, a complete one piece trunk floor cannot be installed without removing the quarter panels.</em></p>
                </div>
    }

    renderSubmit() {
        const lower = value => value && value.toLowerCase();
        return <div className="container-fluid">
            <Col>
                <Row>
                    <Col sm={6}>
                        <Field component={TextInput} name="name" label="Name"/>
                    </Col>
                    <Col sm={6}>
                        <Field component={TextInput} name="email" label="Email" normalize={lower}/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <Field component={TextInput} name="phone" label="Phone" normalize={normalizePhone}/>
                    </Col>
                    <Col sm={6}>
                        <Field component={TextInput} name="vin" label="Vehicle Identification Number (VIN)"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <Field component={TextAreaInput} name="comments" label="Comments"/>
                    </Col>
                </Row>
            </Col>
            <div>
                <br/>
                <p style={{textAlign: 'center'}}>You will receive an email confirmation of this estimate.</p>
            </div>
        </div>
    }

    renderDefault() {
        const { estimate } = this.props;

        const makeSelected = (value) => {
            this.props.dispatch({ type: 'MAKE_SELECTED', make: value });
            return value;
        };

        const modelSelected = (value) => {
            this.props.dispatch({ type: 'MODEL_SELECTED', model: value });
            return value;
        };

        const yearSelected = (value, previousValue, allValues) => {
            this.props.dispatch({ type: 'YEAR_SELECTED', selection: allValues });
            return value;
        };

        return <div className="container-fluid" style={{width: '100%', maxWidth: 700, textAlign: 'center'}}>
            <h3>AMD Installation Center Estimator</h3>
            <p style={{textAlign: 'justify'}}>Want to save money on all of those extra parts needed to finish your car? In addition to the sheet metal required for our step in your restoration project, you can order parts from the <a href="http://www.autometaldirect.com/" target="_blank">Auto Metal Direct</a> catalog and save on the shipping. For additional parts at a discount, please call our parts sales division at <a href="tel:+18442759254">(844) 275-9254</a>.</p>
            <p style={{textAlign: 'justify'}}>If you decide to use another facility to complete the repairs on your car or fix it yourself, please contact our parts division for technical support and a <span style={{color: 'red'}}>SUBSTANTIAL</span> discount on parts from <a href="http://www.autometaldirect.com/" target="_blank">Auto Metal Direct</a>, <a href="https://www.goodmarkindustries.com/" target="_blank">Goodmark</a>, <a href="http://www.dynacorn.com/" target="_blank">Dynacorn</a> and <a href="http://www.goldenstarauto.com/" target="_blank">Golden Star</a> at <a href="tel:+18442759254">(844) 275-9254</a>.</p>
            <br/>
            <h4>Begin by selecting your car make, model, and year:</h4>
            <Row>
                <Col sm={4}>
                    <Field component={SelectInput} label="Make" name="make" disabled={!estimate.makes.length} normalize={makeSelected} placeholder="Select make">
                        {estimate.makes.map((type, index) => {return <MenuItem key={index} value={type.value} primaryText={type.text}/>})}
                    </Field>
                </Col>
                <Col sm={4}>
                    <Field component={SelectInput} label="Model" name="model" disabled={!estimate.models.length} normalize={modelSelected} placeholder="Select model">
                        {estimate.models.map((type, index) => {return <MenuItem key={index} value={type.value} primaryText={type.text}/>})}
                    </Field>
                </Col>
                <Col sm={4}>
                    <Field component={SelectInput} label="Year" name="year" disabled={!estimate.years.length} normalize={yearSelected} placeholder="Select year">
                        {estimate.years.map((type, index) => {return <MenuItem key={index} value={type.value} primaryText={type.text}/>})}
                    </Field>
                </Col>
            </Row>
        </div>
    }

    handleRequestSnackbarClose() {
        this.setState({
            snackbar: false
        });
    };

    formSubmit(values) {
        const {dispatch} = this.props;
        // gather part numbers
        const parts = [];
        this.state.selected.forEach((selection) => { parts.push(this.props.estimate.parts[selection])});
        const services = [];
        this.state.services.forEach((selection) => { services.push(his.props.estimate.parts.filter(p => !p.price)[selection])});

        return new Promise((resolve, reject) => {
            dispatch({
                type: 'ESTIMATE_SUBMIT',
                estimate: {
                    make: values.make,
                    model: values.model,
                    year: values.year,
                    parts: parts,
                    services: services,
                    name: values.name,
                    email: values.email,
                    phone: values.phone,
                    vin: values.vin,
                    comments: values.comments
                },
                callbackError: (error) => {
                    reject(new SubmissionError({_error: error}));
                },
                callbackSuccess: () => {
                    resolve();
                    this.setState({
                        snackbar: true
                    });
                }
            });
        });
    }

}

function mapStateToProps(state, props) {
    return {
        user: state.user,
        estimate: state.estimate,
        initialValues: undefined
    }
}

const EstimateForm = reduxForm({
    form: 'estimate_form',
    validate: validateEstimate,
    enableReinitialize: true
})(Home);

export default connect(mapStateToProps)(EstimateForm);
