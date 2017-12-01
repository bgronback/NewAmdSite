import React from "react"
import { connect } from "react-redux"
import { push } from "react-router-redux"
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import FileCloud from 'material-ui/svg-icons/file/cloud'

export class App extends React.Component {

    render() {
        const {user, children} = this.props;

        return (
            <div>
                <AppBar className="navbar-static-top"
                    title="AMD Installation" onLeftIconButtonTouchTap={ () => {this.props.dispatch(push('/'))}}
                    iconElementRight={
                    <IconMenu
                            iconButtonElement={
                              <IconButton touch={true}>
                                <MoreVertIcon />
                              </IconButton>
                            }>
                            <MenuItem primaryText="Parts" leftIcon={<FileCloud/>} onTouchTap={ () => {this.props.dispatch(push('/parts/'))}}/>
                        </IconMenu>
                    }
                />
                <div className="container-fluid">
                    {children}
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(App);
