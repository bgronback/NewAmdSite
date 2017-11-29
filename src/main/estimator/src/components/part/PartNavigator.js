import React from 'react'
import { connect } from 'react-redux'
import PartList from './PartList'

class PartNavigator extends React.Component {
  
    render() {
        return  <PartList {...this.props}/>
    }
}

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(PartNavigator);
