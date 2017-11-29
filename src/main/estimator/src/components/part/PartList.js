import React, {Component} from 'react'
import CircularProgress from 'material-ui/CircularProgress'
import DeletePrompt from "./../common/DeletePrompt";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter} from 'material-ui/Table'
import {Toolbar, ToolbarSeparator} from 'material-ui/Toolbar'
import FlatButton from 'material-ui/FlatButton'
import {push} from "react-router-redux"
import ImageEdit from 'material-ui/svg-icons/image/edit'
import TextField from 'material-ui/TextField'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Snackbar from 'material-ui/Snackbar'

export default class PartList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      delete_show: false,
      search_scope: 1,
      search_text: props.parts.search_text ? props.parts.search_text : '', // controlled input must be set to something, initially
      selected: undefined,
      enable_delete: false
    };

    this.partDelete = this.partDelete.bind(this);
    this.showDelete = this.showDelete.bind(this);
    this.hideDelete = this.hideDelete.bind(this);
    this.handleScopeChange = this.handleScopeChange.bind(this);
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.search = this.search.bind(this);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.renderTable = this.renderTable.bind(this);
  }

  componentWillMount() {
    if (this.state.search_text) {
      this.search();
    }
  }

  handleRowSelection(selectedRows) {
      if (selectedRows.length > 0) {
        this.setState({selected: selectedRows.slice(0), enable_delete: true});
      }
  }

  handleScopeChange(event, index, value) {
    this.setState({search_scope: value});
  }

  handleSearchTextChange(event, value) {
    this.setState({search_text: value});
  }

  handleKeyPress(event) {
    if (event.charCode === 13) {
      event.preventDefault();
      this.search();
    }
  }

  showDelete() {
      this.setState({delete_show: true});
  }

  hideDelete() {
    this.setState({delete_show: false});
  }

  partDelete() {
    this.props.dispatch({
      type: 'PART_DELETE',
      partId: this.props.parts.list[this.state.selected]._id
    });
    this.setState({selected: undefined, enable_delete: false});
    this.hideDelete();
  }

  search() {
    if (this.state.search_text && this.state.search_text.length > 2) {
      this.setState({searching: true});
      this.props.dispatch({type: 'PART_FETCH_LIST', key: this.state.search_text});
    }
  }

  render() {
    var props = this.props,
      parts = props.parts;

    return <div className="container">
          <Toolbar>
            <FlatButton label="New" primary={true} style={{marginTop: 10}} onClick={() => this.props.dispatch(push('/part/-1')) }/>
            <FlatButton label="Delete" disabled={!this.state.enable_delete} style={{marginTop: 10}} onClick={this.showDelete}/>
            <ToolbarSeparator style={{marginTop: 10, marginRight: 20}}/>
            <SelectField style={{marginTop: 5, marginRight: 5}}
                         value={this.state.search_scope}
                         onChange={this.handleScopeChange}>
              <MenuItem value={1} primaryText="Part"/>
            </SelectField>
            <TextField fullWidth={true} placeholder="Search text..." id="part-search" style={{marginTop: 5, marginRight: 5}}
                       onChange={this.handleSearchTextChange} onKeyPress={this.handleKeyPress}
                       value={this.state.search_text}/>
            <FlatButton label="Search" style={{marginTop: 10}} onTouchTap={() => {this.search()}} disabled={!this.state.search_text || this.state.search_text.length < 3}/>
          </Toolbar>
          <Table onRowSelection={(selection) => {this.handleRowSelection(selection)}} multiSelectable={false} fixedHeader={false} style={{ tableLayout: 'auto' }}>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>Brand</TableHeaderColumn>
                <TableHeaderColumn>Part Number</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Edit</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            {this.renderTable(parts)}
          </Table>
          <DeletePrompt show={this.state.delete_show} item={(this.state.selected && parts.list[this.state.selected]) ? parts.list[this.state.selected]._id : 'part'} hideDelete={this.hideDelete}
                        itemDelete={this.partDelete}/>
          <Snackbar
            open={parts.status === 'success' && parts.list.length === 500}
            message="Results limited to 500 parts. Refine your search."
            autoHideDuration={4000}
          />
        </div>;
  }

  renderTable(parts) {
    switch (parts.status) {
      case 'success':
        return <TableBody showRowHover={true} deselectOnClickaway={true}>
            {parts.list ? parts.list.map((row, index) => (
              <TableRow key={index}>
                <TableRowColumn>{row.brand}</TableRowColumn>
                <TableRowColumn>{row.partNumber}</TableRowColumn>
                <TableRowColumn>{row.name}</TableRowColumn>
                <TableRowColumn><FlatButton icon={<ImageEdit />}
                                            primary={true}
                                            onTouchTap={() => { this.props.dispatch(push(`/part/` + row._id)) }}/>
                </TableRowColumn>
              </TableRow>
            )) : <TableRow key={0} selectable={false}>
              <TableRowColumn>No records found</TableRowColumn></TableRow>}
          </TableBody>;
      case 'no_status':
            return <TableFooter>
                <TableRow>
                  <TableRowColumn colSpan="6" style={{textAlign: 'center'}}>
                    <i>Use search field above to find existing parts containing some text (requires 3+ characters).</i>
                  </TableRowColumn>
              </TableRow>
            </TableFooter>;
      default:
        return <TableFooter>
            <TableRow>
              <TableRowColumn colSpan="3" style={{textAlign: 'center'}}>
                <CircularProgress size={50} thickness={3} style={{marginTop: 50}}/>
              </TableRowColumn>
            </TableRow>
          </TableFooter>;
    }
  }

}
