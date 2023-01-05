import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import _ from 'underscore';
import toastr from 'toastr';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';

// material ui icons
import AddIcon from '@material-ui/icons/Add.js';
import EditIcon from '@material-ui/icons/Edit.js';
import CancelIcon from '@material-ui/icons/Cancel.js';
import AutocompleteManufacturer from '../Autocomplete/AutocompleteManufacturer.jsx';
import * as Utils from '../../Utils/utils.js';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';

let SuppliersList = createReactClass({
  getInitialState() {
    return {
      suppliers: [],
      manufacturersSupplier: [],
      manufacturersSupplierList: [],
      supplierId: '',
      supplierToDelete: '',
      supplierToUpdate: '',
      heightRequestWindows: $(window).height() - 282,
      widthRequestWindows: $(window).width() - 50,
      orderBy: '',
      order: 'desc',
      supplierContactNameInput: 'row hidden',
      customManufacturer: '',
      selectedManufacturer: '',
      contactNameInputDisabled: false,
      newKeyWord: '',
      selectedTags: this.props.selectedTags != null ? this.props.selectedTags : [],
    };
  },

  componentWillMount() {
    this.getSuppliersList();
  },

  componentDidMount() {
    window.addEventListener('resize', this.updateSize);
  },

  updateSize() {
    const newHeightRequestWindows = $(window).height() - 282;
    const newWidthRequestWindows = $(window).width() - 50;
    this.setState({
      heightRequestWindows: newHeightRequestWindows,
      widthRequestWindows: newWidthRequestWindows,
    });
  },

  createSortHandler(event) {
    const columId = event.target.parentElement.dataset.id;
    this.handleRequestSort(columId);
  },

  handleRequestSort(property) {
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.suppliers.sort((a, b) =>
          b[property].toLowerCase() < a[property].toLowerCase() ? -1 : 1
        )
        : this.state.suppliers.sort((a, b) =>
          a[property].toLowerCase() < b[property].toLowerCase() ? -1 : 1
        );

    this.setState({
      suppliers: data,
      order,
      orderBy: property,
    });
  },

  getSuppliersList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/supplier/complete/list?token=${this.props.TemporaryToken}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.setState({ suppliers: json });
      });
  },

  addSupplierToOnfly() {
    const self = this;
    let isOk = true;
    store.dispatch({ type: 'LOADER', state: true });

    const supplierManufId = self.state.selectedManufacturer;
    const fname = self.supplierContactFirstName.value;
    const lname = self.supplierContactLastName.value;
    const contactMail = self.supplierContactEmail.value;
    const supplierComments = self.supplierContactDescription.value;
    const knonwUserId = self.state.supplierId;
    const supplierName = self.state.customManufacturer;

    if (supplierName == '' && supplierManufId < 1) {
      isOk = false;
      toastr.error(self.props.resources.ContentManagement.SupplierErrorName);
    }
    if (!Utils.validateEmail(contactMail)) {
      isOk = false;
      toastr.error(self.props.resources.ContentManagement.SupplierErrorMail);
    } else {
      if (fname == '') {
        isOk = false;
        toastr.error(self.props.resources.ContentManagement.SupplierErrorFirstName);
      }
      if (lname == '') {
        isOk = false;
        toastr.error(self.props.resources.ContentManagement.SupplierErrorLastName);
      }
    }

    if (isOk) {
      fetch(
        `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/supplier/add?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            SupplierId: knonwUserId != '' ? knonwUserId : null,
            SupplierManufacturerId: supplierManufId != '' ? supplierManufId : null,
            SupplierFirstName: fname,
            SupplierLastName: lname,
            SupplierEmail: contactMail,
            SupplierComments: supplierComments,
            SupplierName: supplierName,
          }),
        }
      ).then((response) => {
        if (response.status == 200) {
          self.getSuppliersList();
          self.resetPageDatas();
          $('#add-supplier').modal('hide');
          store.dispatch({ type: 'LOADER', state: false });
          toastr.success('request sended');
        } else {
          store.dispatch({ type: 'LOADER', state: false });
          const jsonResponse = JSON.parse(response.text());
          toastr.error(jsonResponse.ModelState);
        }
      });
    } else {
      store.dispatch({ type: 'LOADER', state: false });
    }
  },

  setSupplierEdit(event) {
    const self = this;
    const id = parseInt(event.currentTarget.dataset.id);

    fetch(
      `${API_URL}/api/ws/v1/request/content/${this.props.ManagementCloudId}/supplier/${id}/details?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        }
        self.resetPageDatas();
        toastr.error('Failed to load supplier details');
      })
      .then((json) => {
        if (json != 'error' && json != undefined) {
          self.setState({ supplierToUpdate: json.SupplierId });

          if (json.SupplierManufacturerName != '') {
            self.supplierNameEdit.value = json.SupplierManufacturerName;
            if (json.SupplierName != null && json.SupplierName != '') {
              self.supplierNameEdit.value += ` (${json.SupplierName})`;
            }
          } else {
            self.supplierNameEdit.value = json.SupplierName;
          }

          self.supplierContactFirstNameEdit.value = json.SupplierFirstName;
          self.supplierContactLastNameEdit.value = json.SupplierLastName;
          self.supplierContactEmailEdit.value = json.SupplierEmail;
          self.supplierContactDescriptionEdit.value = json.SupplierComments;
        }
      });
  },

  DisabledSupplier() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${self.props.ManagementCloudId}/supplier/${self.state.supplierToDelete}/enabled?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SupplierIsEnabled: false,
        }),
      }
    ).then((response) => {
      if (response.status == 200) {
        self.resetPageDatas();
        self.getSuppliersList();

        toastr.success(self.props.resources.ContentManagement.SupplierDeleteSuccess);
      } else {
        self.resetPageDatas();
        toastr.error(self.props.resources.ContentManagement.SupplierDeleteError);
      }
    });
  },

  EditSupplier() {
    const self = this;

    const newDescription = self.supplierContactDescriptionEdit.value;

    fetch(
      `${API_URL}/api/ws/v1/request/content/${self.props.ManagementCloudId}/supplier/${self.state.supplierToUpdate}/edit?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SupplierComments: newDescription,
        }),
      }
    ).then((response) => {
      if (response.status == 200) {
        self.resetPageDatas();
        self.getSuppliersList();
        $('#edit-supplier').modal('hide');

        toastr.success(self.props.resources.ContentManagement.SupplierUpdateSuccess);
      } else {
        self.resetPageDatas();
        toastr.error(self.props.resources.ContentManagement.SupplierUpdateError);
      }
    });
  },

  resetPageDatas() {
    this.setState({
      supplierToDelete: '',
      manufacturersSupplier: [],
      supplierId: '',
    });
  },

  setSupplierToDelete(event) {
    const { id } = event.currentTarget.dataset;
    this.state.supplierToDelete = id;
  },

  cleanAddSupplierModal() {
    this.setState({
      selectedManufacturer: '',
      supplierContactNameInput: 'row hidden',
      customManufacturer: '',
    });
    this.supplierContactFirstName.value = '';
    this.supplierContactLastName.value = '';
    this.supplierContactEmail.value = '';
    this.supplierContactDescription.value = '';
  },

  handleUpdateInputManufacturerContact(emailToCheck) {
    const self = this;

    fetch(`${API_URL}/api/ws/v1/manufacturer/isemailuser?token=${self.props.TemporaryToken}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        UserEmail: emailToCheck,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        if (json != 'null') {
          const existingUser = JSON.parse(json);
          self.supplierContactFirstName.value = existingUser.FirstName;
          self.supplierContactLastName.value = existingUser.LastName;
          self.setState({
            contactNameInputDisabled: true,
            supplierId: existingUser.Id,
          });
        } else {
          self.supplierContactFirstName.value = '';
          self.supplierContactLastName.value = '';
          self.setState({
            contactNameInputDisabled: false,
            supplierId: '',
          });
        }
      });
  },

  setManufacturerChoice(valueKey) {
    if (valueKey.ManufId != '') {
      this.setState({
        selectedManufacturer: valueKey.ManufId,
        customManufacturer: '',
      });
    } else {
      this.setState({
        selectedManufacturer: '',
        customManufacturer: valueKey.CustomValue,
      });
    }
  },

  handleChangeSupplierContactEmail(event) {
    if (Utils.validateEmail(event.target.value)) {
      this.setState({ supplierContactNameInput: 'row' });
      this.handleUpdateInputManufacturerContact(event.target.value);
    } else {
      this.setState({ supplierContactNameInput: 'row hidden' });
    }
  },

  handleChangeSuplierName(event) {
    this.props.suplierDetails.SuplierName = event.target.value;
  },

  addTagToSelectedList(item) {
    if (this.state.selectedTags.indexOf(item) == -1) {
      this.state.selectedTags.push(item);
      this.setState({ selectedTags: this.state.selectedTags });
    }
  },

  render() {
    const self = this;

    const manufsSupplier = _.map(this.state.manufacturersSupplier, (supp, i) => (
      <option value={supp.ManufacturerId}>{supp.ManufacturerName}</option>
    ));

    const columnData = [
      {
        id: 'SupplierName',
        numeric: false,
        label: self.props.resources.ContentManagement.SupplierNameLabel,
        sortable: true,
        classname: 'col-name',
      },
      {
        id: 'SupplierContact',
        numeric: false,
        label: self.props.resources.ContentManagement.SupplierContactLabel,
        sortable: true,
        classname: 'col-contact',
      },
      {
        id: 'SupplierDescription',
        numeric: false,
        label: self.props.resources.ContentManagement.SupplierDescriptionLabel,
        sortable: false,
        classname: 'col-description',
      },
      {
        id: 'EditSupplier',
        numeric: false,
        sortable: false,
        classname: 'col-edit',
      },
      {
        id: 'DeleteSupplier',
        numeric: false,
        sortable: false,
        classname: 'col-delete',
      },
    ];

    const awesomeTableHead = _.map(columnData, (column, i) => {
      const SPACING = 25;
      const orderByState = self.state.orderBy == column.id;
      const cellWidth = self.state.widthRequestWindows / 23;
      const cellTitleWidth = self.state.widthRequestWindows / 23 - SPACING;

      let designedCellWidth;
      let designedCellTitleWidth;

      switch (column.id) {
        case 'SupplierName':
          designedCellWidth = `${(cellWidth * 3).toString()}px`;
          designedCellTitleWidth = `${(cellTitleWidth * 3).toString()}px`;
          break;
        case 'SupplierContact':
          designedCellWidth = `${(cellWidth * 5).toString()}px`;
          designedCellTitleWidth = `${(cellTitleWidth * 5).toString()}px`;
          break;
        case 'SupplierDescription':
          designedCellWidth = `${(cellWidth * 13).toString()}px`;
          designedCellTitleWidth = `${(cellTitleWidth * 13).toString()}px`;
          break;
        case 'EditSupplier':
          designedCellWidth = `${cellWidth.toString()}px`;
          designedCellTitleWidth = `${cellTitleWidth.toString()}px`;
          break;
        case 'DeleteSupplier':
          designedCellWidth = `${cellWidth.toString()}px`;
          designedCellTitleWidth = `${cellTitleWidth.toString()}px`;
          break;
      }

      return (
        <TableCell
          key={column.id}
          sortDirection={orderByState ? self.state.order : false}
          className={column.classname}
        >
          <Tooltip
            title="clic to sort"
            placement={column.numeric ? 'bottom-end' : 'bottom-start'}
            enterDelay={300}
          >
            <TableSortLabel
              active={self.state.orderBy == column.id}
              direction={self.state.order}
              data-id={column.id}
              onClick={column.sortable ? self.createSortHandler : null}
            >
              <span className="title-ellipsis" style={{ width: designedCellTitleWidth }}>
                {column.label}
              </span>
            </TableSortLabel>
          </Tooltip>
        </TableCell>
      );
    });

    const awesomeContentRequestsSuppliers = _.map(this.state.suppliers, (object, i) => {
      let supplierName = '';
      let manufacturerName = '';

      if (object.SupplierManufacturerName != null) {
        manufacturerName = object.SupplierManufacturerName;
        if (object.SupplierName != null && object.SupplierName != '') {
          supplierName = ` (${object.SupplierName})`;
        }
      } else {
        manufacturerName = object.SupplierName;
      }

      return (
        <TableRow key={i}>
          <TableCell className="col-name">
            <span className="supplier-name">{manufacturerName}</span>
            {supplierName}
          </TableCell>
          <TableCell className="col-contact">{object.SupplierContact}</TableCell>
          <TableCell className="col-description">{object.SupplierDescription}</TableCell>
          <TableCell className="col-edit">
            <a
              data-toggle="modal"
              data-target="#edit-supplier"
              data-id={object.SupplierId}
              onClick={self.setSupplierEdit}
            >
              <EditIcon style={{ color: '#06baec' }} />
            </a>
          </TableCell>
          <TableCell className="col-delete">
            <a
              data-toggle="modal"
              data-target="#confirm-delete-supplier"
              data-id={object.SupplierId}
              onClick={self.setSupplierToDelete}
            >
              <CancelIcon style={{ color: '#757575' }} />
            </a>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <div className="content-request-container">
        <div className="container-fluid">
          <div className="cr-top">
            <div className="row bandeau-title bt-supplier">
              <h2 className="text-center">
                {self.props.resources.ContentManagement.SuppliersTitle}
              </h2>
              <Tooltip title={self.props.resources.ContentManagement.TooltipAddSupplier}>
                <Fab
                  color="primary"
                  data-toggle="modal"
                  data-target="#add-supplier"
                  id="add-content-request"
                  onClick={self.cleanAddSupplierModal}
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </div>
          </div>

          <Paper className="row table-request tr-supplier">
            <Table className="suppliers-table">
              <TableHead id="awesomeTableHeader">
                <TableRow>{awesomeTableHead}</TableRow>
              </TableHead>
              <TableBody>{awesomeContentRequestsSuppliers}</TableBody>
            </Table>
          </Paper>

          <div
            className="modal fade"
            id="add-supplier"
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="myModalLabel">
                    {this.props.resources.ContentManagement.SupplierAddLabel}
                  </h4>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <AutocompleteManufacturer selectManuf={this.setManufacturerChoice} />
                  </div>
                  <div className="row">
                    <TextField
                      label={self.props.resources.ContentManagement.SupplierDetailsContactEmail}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      onChange={self.handleChangeSupplierContactEmail}
                      inputRef={(input) => (self.supplierContactEmail = input)}
                    />
                  </div>
                  <div className={self.state.supplierContactNameInput}>
                    <div className="col-xs-11">
                      <TextField
                        label={
                          self.props.resources.ContentManagement.SupplierDetailsContactFirstName
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={self.state.contactNameInputDisabled}
                        inputRef={(input) => (self.supplierContactFirstName = input)}
                      />
                    </div>
                    <div className="col-xs-11 col-xs-offset-1">
                      <TextField
                        label={
                          self.props.resources.ContentManagement.SupplierDetailsContactLastName
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled={self.state.contactNameInputDisabled}
                        inputRef={(input) => (self.supplierContactLastName = input)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <TextField
                      label={self.props.resources.ContentManagement.SupplierDetailsDescription}
                      InputLabelProps={{
                        className: 'label-for-multiline',
                        shrink: true,
                      }}
                      placeholder={self.props.resources.ContentManagement.SupplierDescriptionLabel}
                      fullWidth
                      multiline
                      rows="2"
                      rowsMax="4"
                      inputRef={(input) => (self.supplierContactDescription = input)}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn-second btn-grey"
                      data-dismiss="modal"
                      onClick={self.resetPageDatas}
                    >
                      {this.props.resources.MetaResource.Cancel}
                    </button>
                    <button
                      type="button"
                      className="btn-second btn-blue"
                      id="confirm-add-supplier-button"
                      onClick={self.addSupplierToOnfly}
                    >
                      {this.props.resources.MetaResource.Confirm}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="confirm-delete-supplier"
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="myModalLabel">
                    {this.props.resources.ContentManagement.SupplierDeleteLabel}
                  </h4>
                </div>
                <div className="modal-body">
                  {this.props.resources.ContentManagement.SupplierDeleteMessage}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-second btn-grey"
                    data-dismiss="modal"
                    onClick={self.resetPageDatas}
                  >
                    {this.props.resources.MetaResource.Cancel}
                  </button>
                  <button
                    type="button"
                    className="btn-second btn-red"
                    id="confirm-deletion-button"
                    data-dismiss="modal"
                    onClick={self.DisabledSupplier}
                  >
                    {this.props.resources.MetaResource.Confirm}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="edit-supplier"
            tabIndex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>{this.props.resources.ContentManagement.SupplierEditLabel}</h3>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <TextField
                      label={self.props.resources.ContentManagement.SupplierDetailsName}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      disabled
                      inputRef={(input) => (self.supplierNameEdit = input)}
                    />
                  </div>
                  <div className="row">
                    <TextField
                      label={self.props.resources.ContentManagement.SupplierDetailsContactEmail}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      fullWidth
                      disabled
                      inputRef={(input) => (self.supplierContactEmailEdit = input)}
                    />
                  </div>
                  <div className="row">
                    <div className="col-xs-11">
                      <TextField
                        label={
                          self.props.resources.ContentManagement.SupplierDetailsContactFirstName
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        inputRef={(input) => (self.supplierContactFirstNameEdit = input)}
                      />
                    </div>
                    <div className="col-xs-11 col-xs-offset-1">
                      <TextField
                        label={
                          self.props.resources.ContentManagement.SupplierDetailsContactLastName
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        disabled
                        inputRef={(input) => (self.supplierContactLastNameEdit = input)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <TextField
                      label={self.props.resources.ContentManagement.SupplierDetailsDescription}
                      InputLabelProps={{
                        className: 'label-for-multiline',
                        shrink: true,
                      }}
                      fullWidth
                      multiline
                      rows="4"
                      inputRef={(input) => (self.supplierContactDescriptionEdit = input)}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                    {this.props.resources.MetaResource.Cancel}
                  </button>
                  <button
                    type="button"
                    className="btn-second btn-blue"
                    id="confirm-deletion-button"
                    onClick={self.EditSupplier}
                  >
                    {this.props.resources.MetaResource.Confirm}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Language: appState.Language,
    UserId: appState.UserId,
    RoleKey: appState.RoleKey,
    RoleName: appState.RoleName,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
    resources: appState.Resources[appState.Language],
  };
};

export default SuppliersList = connect(mapStateToProps)(SuppliersList);