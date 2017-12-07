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


export class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            stepIndex: -1,
            visited: [],
            snackbar: false,
            selected: []
        };
        this.formSubmit = this.formSubmit.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleRowSelection = this.handleRowSelection.bind(this);
        this.renderSelectParts = this.renderSelectParts.bind(this);
        this.renderSelectCar = this.renderSelectCar.bind(this);
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

    getStepContent(stepIndex) {
        // return all steps, hiding those not selected to maintain form fields active
        return <div>
            <div style={stepIndex === -1 ? {} : { display: 'none' }}>{this.renderDefault()}</div>
            <div style={stepIndex === 0 ? {} : { display: 'none' }}>{this.renderSelectCar()}</div>
            <div style={stepIndex === 1 ? {} : { display: 'none' }}>{this.renderSelectParts()}</div>
            <div style={stepIndex === 2 ? {} : { display: 'none' }}>{this.renderReview()}</div>
            <div style={stepIndex === 3 ? {} : { display: 'none' }}>{this.renderSubmit()}</div>
        </div>
    }

    render() {
        const { handleSubmit, error, invalid, pristine, submitting } = this.props;
        const { stepIndex } = this.state;

        return (
            <Row>
                <Form horizontal onSubmit={handleSubmit(this.formSubmit)}>
                    <Stepper linear={false} activeStep={stepIndex}>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 0})}>
                                Vehicle
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.setState({stepIndex: 1})}>
                                Parts
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
                                disabled={stepIndex === 0}
                                onClick={this.handlePrev}
                                style={{marginRight: 12}}
                            />
                            <RaisedButton
                                label={stepIndex === 3 ? "Submit" : "Next"}
                                disabled={stepIndex === 3 ? (pristine || submitting) : false}
                                primary={true}
                                type="submit"
                                onClick={this.handleNext}
                            />
                        </div>
                    </div>
                </Form>
                <Snackbar
                    open={this.state.snackbar}
                    message="Your estimate was successfully submitted!"
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestSnackbarClose}
                />
            </Row>
        );
    }

    renderSelectCar() {
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

        return <div className="container-fluid">
            <p style={{textAlign: 'center'}}>Select your car make, model, and year</p>
                <Row>
                    <Col sm={4}>
                        <Field component={SelectInput} label="Make" name="make" disabled={!estimate.makes.length} normalize={makeSelected}>
                            {estimate.makes.map((type, index) => {return <MenuItem key={index} value={type.value} primaryText={type.text}/>})}
                        </Field>
                    </Col>
                    <Col sm={4}>
                        <Field component={SelectInput} label="Model" name="model" disabled={!estimate.models.length} normalize={modelSelected}>
                            {estimate.models.map((type, index) => {return <MenuItem key={index} value={type.value} primaryText={type.text}/>})}
                        </Field>
                    </Col>
                    <Col sm={4}>
                        <Field component={SelectInput} label="Year" name="year" disabled={!estimate.years.length} normalize={yearSelected}>
                            {estimate.years.map((type, index) => {return <MenuItem key={index} value={type.value} primaryText={type.text}/>})}
                        </Field>
                    </Col>
                </Row>
            </div>
    }

    renderSelectParts() {
        var parts = this.props.estimate.parts;
        return <div className="container-fluid">
                <p style={{textAlign: 'center'}}>Select sheet metal parts you will need.</p>
            <Table onRowSelection={(selection) => {this.handleRowSelection(selection)}} multiSelectable={true} wrapperStyle={{ maxHeight: '500px' }}>
                <TableHeader enableSelectAll={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn>Brand</TableHeaderColumn>
                        <TableHeaderColumn>Part Number</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Price</TableHeaderColumn>
                        <TableHeaderColumn>Image</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                {this.renderTable(parts)}
            </Table>
        </div>
    }

    renderTable(parts) {
        return <TableBody showRowHover={true} deselectOnClickaway={true}>
            {parts ? parts.map((row, index) => (
                <TableRow key={index}>
                    <TableRowColumn>{row.brand}</TableRowColumn>
                    <TableRowColumn>{row.partNumber}</TableRowColumn>
                    <TableRowColumn style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>{row.name}</TableRowColumn>
                    <TableRowColumn>{row.price}</TableRowColumn>
                    <TableRowColumn><img src={row.image} alt={row.name} width="50"/></TableRowColumn>
                </TableRow>
            )) : <TableRow key={0} selectable={false}>
                <TableRowColumn>No records found</TableRowColumn></TableRow>}
        </TableBody>;
    }

    renderReview() {
        const {handleSubmit, error, invalid, pristine, submitting} = this.props;
        const parts = [];
        this.state.selected.forEach((selection) => { parts.push(this.props.estimate.parts[selection])});

        const partsTotal = parts ? parts.map(p => p.price).reduce((a, b) => (a + b), 0).toFixed(2) : 0.00;
        const laborTotal = parts ? parts.map(p => p.labor).reduce((a, b) => (a + b), 0).toFixed(2) : 0.00;
        const total = (parseFloat(partsTotal) + parseFloat(laborTotal)).toFixed(2);
        const materialTotal = (laborTotal * 0.10).toFixed(2); // TODO make percentage configurable
        const tax = (partsTotal * 0.04).toFixed(2); // TODO make percentage configurable
        const grandTotal = (parseFloat(total) + parseFloat(materialTotal) + parseFloat(tax)).toFixed(2);

        return <div className="container-fluid">
                    <h4 style={{textAlign: 'center'}}>Estimate Summary</h4>
                    <Table selectable={false}>
                        <TableHeader adjustForCheckbox={false} enableSelectAll={false} displaySelectAll={false}>
                            <TableRow>
                                <TableHeaderColumn>Part</TableHeaderColumn>
                                <TableHeaderColumn style={{ width: '30%' }}>Name</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'right'}}>Price</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'right'}}>Labor</TableHeaderColumn>
                                <TableHeaderColumn style={{textAlign: 'right'}}>Total</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody showRowHover={true} displayRowCheckbox={false}>
                            {parts ? parts.map((row, index) => (
                                <TableRow key={index}>
                                    <TableRowColumn>{row.partNumber}</TableRowColumn>
                                    <TableRowColumn style={{ width: '30%', whiteSpace: 'normal', wordWrap: 'break-word' }}>{row.name}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>{row.price}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>{row.labor ? row.labor : 0}</TableRowColumn>
                                    <TableRowColumn style={{textAlign: 'right'}}>{(row.price + row.labor).toFixed(2)}</TableRowColumn>
                                </TableRow>
                            )) : <TableRow key={0}>
                                <TableRowColumn>No parts selected</TableRowColumn></TableRow>}
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
                                <TableRowColumn style={{textAlign: 'right'}}><b>Estimate Total</b></TableRowColumn>
                                <TableRowColumn style={{textAlign: 'right'}}><b>{grandTotal}</b></TableRowColumn>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <p><em>Please note that the labor prices are based on reductions for certain panel overlaps and are subject to increase if no adjacent panels are being replaced. Also note that some operations cannot be performed independently; for example, a complete one piece trunk floor cannot be installed without removing the quarter panels.</em></p>
                </div>
    }

    renderSubmit() {
        return <div className="container-fluid">
            <Col>
                <Row>
                    <Col sm={6}>
                        <Field component={TextInput} name="name" label="Name"/>
                    </Col>
                    <Col sm={6}>
                        <Field component={TextInput} name="email" label="Email"/>
                    </Col>
                </Row>
                <Row>
                    <Col sm={6}>
                        <Field component={TextInput} name="phone" label="Phone"/>
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
        return <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
            <h2 style={{textAlign: 'center'}}>Save Money!</h2>
            <p>Want to save money on all of those extra parts needed to finish your car?
                In addition to the sheet metal required for our step in your restoration project,
                you can order parts from the <a href="http://www.autometaldirect.com/" target="_blank">AMD catalog</a> and save on the shipping. For additional parts at a discount, please call our parts sales division at 844-275-9254.</p>
            <br/>
            <p style={{textAlign: 'center'}}><em>Now, let's begin your estimate...</em></p>
            <br/>
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

        return new Promise((resolve, reject) => {
            dispatch({
                type: 'ESTIMATE_SUBMIT',
                estimate: {
                    make: values.make,
                    model: values.model,
                    year: values.year,
                    parts: parts,
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
