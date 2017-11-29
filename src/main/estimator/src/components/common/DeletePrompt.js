import React, { PropTypes } from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class DeletePrompt extends React.Component {
    render() {
        const {show, item, hideDelete, itemDelete} = this.props;

        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={hideDelete}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onTouchTap={itemDelete}
            />
        ];

        return (
            <Dialog
                title="Confirm Delete"
                actions={actions}
                modal={true}
                open={show}>
                Are you sure you want to delete <strong>{item ? item : 'item'}</strong>?
            </Dialog>
        );
    }
}
