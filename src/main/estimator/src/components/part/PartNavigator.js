import React from 'react'
import { connect } from 'react-redux'
import PartList from './PartList'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

class PartNavigator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: undefined,
            password: undefined
        };
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(event){
        this.props.dispatch({ type: 'USER_LOGIN', username: this.state.username, password: this.state.password });
    }
  
    render() {
        const { users } = this.props;
        if (users.user) {
            return <PartList {...this.props}/>
        } else {
            return <div style={{ textAlign: 'center'}}>
                <TextField
                    hintText="Enter your Username"
                    floatingLabelText="Username"
                    onChange = {(event, newValue) => this.setState({username: newValue})}
                />
                <br/>
                <TextField
                    type="password"
                    hintText="Enter your Password"
                    floatingLabelText="Password"
                    onChange = {(event, newValue) => this.setState({password: newValue})}
                />
                <br/>
                <RaisedButton label="Submit" primary={true} style={{ margin: 15 }} onClick={(event) => this.handleLogin(event)}/>
            </div>
        }
    }
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(PartNavigator);
