// General imports
import React from 'react';
import createReactClass from 'create-react-class';

import toastr from 'toastr';
import _ from 'underscore';
import { KeyboardDatePicker as DatePicker } from '@material-ui/pickers';

// Materials UI elements
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Fab from '@material-ui/core/Fab';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Tooltip from '@material-ui/core/Tooltip';

// Materials UI Icons
import AddIcon from '@material-ui/icons/Add.js';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline.js';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline.js';
import CloseIcon from '@material-ui/icons/Close.js';
import CheckCircleIcon from '@material-ui/icons/CheckCircle.js';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked.js';
import AutocompleteSuppliers from '../Autocomplete/AutocompleteSuppliers.jsx';
import AutocompleteTag from '../Autocomplete/AutocompleteTag.jsx';
import * as Utils from '../../Utils/utils.js';
import * as DisplayDesign from '../../Utils/displayDesign.js';
import store from '../../Store/Store';
import ClassificationsComponent from './ClassificationsComponent.jsx';
import { API_URL } from '../../Api/constants';

const ContentRequest = createReactClass({
  getInitialState() {
    // eslint-disable-next-line no-undef
    const dueDateDefault = moment().add(7, 'd').format('YYYY-MM-DD');

    return {
      contentRequestDatas: {
        OnFlyId: '',
        Sender: '',
        ProjectName: '',
        EndDate: dueDateDefault,
        ObjectType: '',
        ObjectName: '',
        SupplierId: '',
        Description: '',
        RequestLods: [],
        RequestUnit: '',
        SoftwaresListRequired: [],
        DocumentsWanted: [],
        OtherDocumentName: '',
        CommentsModeler: '',
        ObjectClassifications: [],
        TagsList: [],
        VariantList: [],
        VariantIdCounter: 0,
        LinkedDocuments: [],
        LinkedDocumentsToRemove: [],
        SupplierName: '',
      },
      isReadOnly: true,
      authorisedExtensions: [],
      referenceFieldClass: '',
      classificationsFieldClass: '',
      tagsFieldClass: '',
      disableDocumentsField: true,
      lodsList: ['100', '200', '300', '400', '500', 'Data only'],
      showOtherDocInput: '',
      classificationsList: [],
    };
  },

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    store.dispatch({ type: 'APP/FETCH_DOCUMENT_TYPES' });
    this.setRequestCondition();
    this.getAuthorisedExtensions();
    this.loadClassificationsList();
  },

  componentDidMount() { },

  setRequestCondition() {
    const condition = this.props.RequestCondition;
    const self = this;

    switch (condition) {
      case 'Creation':
        self.mapRequestCreation();
        break;
      case 'Edit':
        self.mapRequestEdit();
        break;
      default:
        break;
    }
  },

  mapRequestCreation() {
    const currentRequest = this.state.contentRequestDatas;

    // On creation, set defaults values
    currentRequest.OnFlyId = this.props.ManagementCloudId;
    currentRequest.Sender = this.props.UserName;
    currentRequest.ObjectType = 'UserContent';
    currentRequest.RequestUnit = this.props.Language === 'en' ? 'Imperial' : 'Metric';
    currentRequest.SupplierId = 0;

    this.setState({
      contentRequestDatas: currentRequest,
      referenceFieldClass: 'hidden',
      showOtherDocInput: 'none',
      isReadOnly: false,
    });
  },

  mapRequestEdit() {
    const requestToMap = this.props.ContentRequestDatas;

    const mappedClassifications = [];
    _.each(requestToMap.ObjectClassifications, (classif, i) => {
      const mappedElement = `${classif.ClassificationTableId.toString()}#${classif.ClassificationId.toString()}#${classif.ClassificationName
        }`;
      mappedClassifications.push(mappedElement);
    });
    const mappedTags = [];
    _.each(requestToMap.TagsList, (tag, i) => {
      const mappedElement = `${tag.TagId.toString()}#${tag.TagName}`;
      mappedTags.push(mappedElement);
    });
    const mappedDate = `${requestToMap.EndDate.split('.')[2]}-${requestToMap.EndDate.split('.')[1]
      }-${requestToMap.EndDate.split('.')[0]}`;
    const mappedLods =
      requestToMap.ObjectLod !== undefined ? requestToMap.ObjectLod.split(';') : [];
    const parsedSoftwareList = [];
    _.each(requestToMap.SoftwaresListRequired, (soft, i) => {
      const parsedElement = parseInt(soft);
      parsedSoftwareList.push(parsedElement);
    });

    // RequestedBimObjectSupplierId
    const requestDatas = {
      OnFlyId: requestToMap.OnFlyId,
      Sender: requestToMap.RequesterName,
      ProjectName: requestToMap.ProjectName,
      EndDate: mappedDate,
      ObjectType: requestToMap.ObjectType,
      ObjectName: requestToMap.ObjectName,
      SupplierId: requestToMap.RequestedBimObjectSupplierId,
      Description: requestToMap.DescriptionAndComments,
      RequestLods: mappedLods,
      RequestUnit: requestToMap.ObjectUnit,
      SoftwaresListRequired: parsedSoftwareList,
      DocumentsWanted: requestToMap.DocumentsWanted,
      OtherDocumentName: requestToMap.DocumentOtherDetails,
      CommentsModeler: requestToMap.Comments,
      ObjectClassifications: mappedClassifications,
      TagsList: mappedTags,
      VariantList: requestToMap.VariantList !== undefined ? requestToMap.VariantList : [],
      VariantIdCounter: 0,
      LinkedDocuments: requestToMap.LinkedDocuments,
      LinkedDocumentsToRemove: [],
      SupplierName: requestToMap.SupplierName,
      RequestState: requestToMap.RequestState,
    };

    this.UpdateObjectTypeElements(requestToMap.ObjectType);

    const isAdmin = this.props.UserLevel.toLowerCase() == 'admin';

    const currentClassifClass = isAdmin ? '' : 'hidden';
    const currentTagsFieldClass = isAdmin ? '' : 'hidden';

    this.setState({
      contentRequestDatas: requestDatas,
      isReadOnly: !isAdmin,
      classificationsFieldClass: currentClassifClass,
      tagsFieldClass: currentTagsFieldClass,
    });
  },

  mapRequestUser() { },

  // API calls
  getAuthorisedExtensions() {
    const self = this;
    fetch(`${API_URL}/api/ws/v1/bimobject/document/extensions?token=${this.props.TemporaryToken}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        self.setState({ authorisedExtensions: json });
      });
  },

  loadClassificationsList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/classification/list/${self.props.Language}?token=${self.props.TemporaryToken}`,
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
        const result = _.sortBy(json, (object) => object.Official !== true);

        self.setState({
          classificationsList: result,
        });
      });
  },

  addNewTag(newTag) {
    const self = this;
    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/pin/new/add?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ PinName: newTag }),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.addTag(json);
      });
  },

  // Changes elements
  handleChangeEndDateRequest(date) {
    this.setState((prevState) => {
      const EndDate = date === null ? '' : date.format('YYYY-MM-DD');
      const contentRequestDatas = { ...prevState.contentRequestDatas, EndDate };
      return { ...prevState, contentRequestDatas };
    });
  },

  handleChangeObjectType(event) {
    const { value } = event.target;
    this.UpdateObjectTypeElements(value);
  },

  UpdateObjectTypeElements(value) {
    const currentRequest = this.state.contentRequestDatas;
    currentRequest.ObjectType = value;

    if (value == 'UserContent') {
      currentRequest.SupplierId = '';
      currentRequest.DocumentsWanted = [];
      currentRequest.OtherDocumentName = '';

      this.setState({
        contentRequestDatas: currentRequest,
        referenceFieldClass: 'hidden',
        disableDocumentsField: true,
        showOtherDocInput: 'none',
      });
    } else if (value === 'Manufacturer') {
      this.setState({
        contentRequestDatas: currentRequest,
        referenceFieldClass: '',
        disableDocumentsField: false,
      });
    }
  },

  handleChangeSelectedSupplier(supplier) {
    const currentRequest = this.state.contentRequestDatas;
    currentRequest.SupplierId = supplier.SupplierId;
    this.setState({ contentRequestDatas: currentRequest });
  },

  handleChangeSelectedLod(event) {
    if (!this.state.isReadOnly) {
      const currentValue = event.target.value;
      const currentRequest = this.state.contentRequestDatas;
      let lods_selected = currentRequest.RequestLods;
      const indexValue = lods_selected.indexOf(currentValue);

      if (indexValue > -1) {
        lods_selected.splice(indexValue, 1);
      } else {
        lods_selected.push(currentValue);
      }

      if (currentValue === 'Data only') {
        lods_selected = ['Data only'];
      } else {
        const indexDataOnly = lods_selected.indexOf('Data only');
        if (indexDataOnly > -1) {
          lods_selected.splice(indexDataOnly, 1);
        }
      }
      currentRequest.RequestLods = lods_selected;

      this.setState({ contentRequestDatas: currentRequest });
    }
  },

  handleChangeObjectUnit(event) {
    if (!this.state.isReadOnly) {
      const currentRequest = this.state.contentRequestDatas;
      currentRequest.RequestUnit = event.target.value;
      this.setState({ contentRequestDatas: currentRequest });
    }
  },

  handleChangeSoftwares(event) {
    if (!this.state.isReadOnly) {
      const currentRequest = this.state.contentRequestDatas;
      const currentValues = event.target.value;
      currentRequest.SoftwaresListRequired = currentValues;
      this.setState({ contentRequestDatas: currentRequest });
    }
  },

  checkFileSize() {
    const self = this;
    const currentRequest = this.state.contentRequestDatas;
    const linkedDocList = currentRequest.LinkedDocuments;
    $.each(self.docInput.files, (index, doc) => {
      if (doc.size > 10485760) {
        toastr.error(`file : ${doc.name} is too big`);
      } else {
        linkedDocList.push(doc);
      }
    });
    self.setState({ contentRequestDatas: currentRequest });
  },

  removeLinkedDocument(event) {
    const documentIndex = event.currentTarget.dataset.arrayposition;
    const currentRequest = this.state.contentRequestDatas;
    const linkedDocs = currentRequest.LinkedDocuments;
    const linkedDocsToRemove = currentRequest.LinkedDocumentsToRemove;
    linkedDocsToRemove.push(linkedDocs[documentIndex]);
    linkedDocs.splice(documentIndex, 1);

    this.setState({ contentRequestDatas: currentRequest });
  },

  handleChangeDocumentsWanted(event) {
    const self = this;
    let displayOtherDocInput;
    const currentValue = event.target.id;
    const currentRequest = self.state.contentRequestDatas;
    const documentTypes_selected = currentRequest.DocumentsWanted;
    const indexValue = documentTypes_selected.indexOf(currentValue);

    if (indexValue > -1) {
      documentTypes_selected.splice(indexValue, 1);
    } else {
      documentTypes_selected.push(currentValue);
    }

    if (documentTypes_selected.indexOf('Other') > -1) {
      displayOtherDocInput = 'inline-block';
    } else {
      displayOtherDocInput = 'none';
    }

    self.setState({
      contentRequestDatas: currentRequest,
      showOtherDocInput: displayOtherDocInput,
    });
  },

  removeClassificationNode(event) {
    if (!this.state.isReadOnly) {
      const self = this;
      const nodeId = event.target.dataset.id;
      const currentRequest = self.state.contentRequestDatas;
      const classif_selected = currentRequest.ObjectClassifications;
      for (let i = 0; i < classif_selected.length; i++) {
        if (classif_selected[i].split('#')[1] == nodeId) {
          classif_selected.splice(i, 1);
        }
      }
      this.setState({ contentRequestDatas: currentRequest });
    }
  },

  addClassificationNode(node) {
    const self = this;
    const currentRequest = self.state.contentRequestDatas;
    const classif_selected = currentRequest.ObjectClassifications;
    const currentTableId = node.ClassificationId;

    for (let i = 0; i < classif_selected.length; i++) {
      if (classif_selected[i].split('#')[0] === currentTableId) {
        classif_selected.splice(i, 1);
      }
    }
    const currentNode = `${currentTableId}#${node.Id}#${node.NodeName}`;
    classif_selected.push(currentNode);
    this.setState({ contentRequestDatas: currentRequest });
  },

  removeTag(event) {
    const { tag } = event.currentTarget.parentElement.dataset;
    const currentRequest = this.state.contentRequestDatas;
    const tags_selected = currentRequest.TagsList;
    if (tags_selected.includes(tag)) {
      const index = tags_selected.indexOf(tag);
      if (index > -1) {
        tags_selected.splice(index, 1);
      }
      this.setState({ contentRequestDatas: currentRequest });
    }
  },

  setTagChoice(valueKey) {
    if (valueKey.TagId !== '') {
      const tagId = valueKey.TagId;
      const tagName = valueKey.Value;
      const tagToAdd = `${tagId}#${tagName}`;
      this.addTag(tagToAdd);
    } else {
      let tagName = valueKey.Value;

      if (tagName != null) {
        tagName = tagName.trim();
      }
      this.addNewTag(tagName);
    }
  },

  addTag(tag) {
    const currentRequest = this.state.contentRequestDatas;
    const tags_selected = currentRequest.TagsList;
    if (!tags_selected.includes(tag)) {
      tags_selected.push(tag);
    }
    this.setState({ contentRequestDatas: currentRequest });
  },

  handleCancelButtonAction() {
    this.props.CancelButtonAction();
  },

  handleValidButtonAction() {
    this.props.ValidButtonAction({ ...this.state.contentRequestDatas });
  },

  addVariant() {
    if (!this.state.isReadOnly) {
      const newVariantId = this.state.contentRequestDatas.VariantIdCounter++;
      const currentRequest = this.state.contentRequestDatas;

      const newVariant = {
        Id: newVariantId,
        Reference: '',
        Designation: '',
      };

      const newVariantList = currentRequest.VariantList;
      newVariantList.push(newVariant);

      this.setState({
        contentRequestDatas: currentRequest,
      });
    }
  },

  removeVariant(event, index) {
    if (!this.state.isReadOnly) {
      const currentRequest = this.state.contentRequestDatas;
      const newVariantList = currentRequest.VariantList;
      newVariantList.splice(index, 1);
      this.setState({
        contentRequestDatas: currentRequest,
      });
    }
  },

  onChangeVariant(event, index) {
    if (index > -1) {
      this.state.contentRequestDatas.VariantList[index][event.target.name] = event.target.value;
    }
  },

  downloadAssociatedDoc(event) {
    const docUrl = event.currentTarget.dataset.url;
    window.location = docUrl;
  },

  onChangeAutoCompleteSupplier(supplierName) {
    this.state.contentRequestDatas.SupplierName = supplierName;
  },

  onChangeDescription(event) {
    this.setState({
      contentRequestDatas: {
        ...this.state.contentRequestDatas,
        Description: event.currentTarget.value,
      },
    });
  },

  onChangeCommentsModeler(event) {
    this.setState({
      contentRequestDatas: {
        ...this.state.contentRequestDatas,
        CommentsModeler: event.currentTarget.value,
      },
    });
  },

  // render elements
  render() {
    const self = this;

    const authorizeToEdit =
      self.props.RequestCondition == 'Creation' || self.props.UserLevel.toLowerCase() == 'admin';

    const lodsList = _.map(self.state.lodsList, (lod, i) => {
      const isChecked = self.state.contentRequestDatas.RequestLods.indexOf(lod) > -1;

      return (
        <li key={i} className="content-create-checkbox" style={{ display: 'inline-block' }}>
          <FormControlLabel
            control={
              <Checkbox
                value={lod}
                checked={isChecked}
                onChange={self.handleChangeSelectedLod}
                checkedIcon={<CheckCircleIcon style={{ color: DisplayDesign.acidBlue }} />}
                icon={<RadioButtonUncheckedIcon style={{ color: DisplayDesign.acidBlue }} />}
              />
            }
            label={lod}
            labelPlacement="end"
          />
        </li>
      );
    });

    const newSoftwareList = [];
    const softwareOrdered = _.sortBy(this.props.Softwares, (item) => item.Name + item.Version);
    _.each(softwareOrdered, (software, i) => {
      const softwareDisplay =
        software.Name + (software.Version != undefined ? ` (${software.Version})` : '');
      newSoftwareList.push(
        <MenuItem key={software.Id} value={software.Id}>
          <Checkbox
            checked={self.state.contentRequestDatas.SoftwaresListRequired.indexOf(software.Id) > -1}
          />
          {softwareDisplay}
        </MenuItem>
      );
    });

    const LinkedDocs = _.map(this.state.contentRequestDatas.LinkedDocuments, (doc, i) => {
      let iconByFile;
      const docName = doc.name != undefined ? doc.name : doc.DocumentName;
      const fileExtension = docName.split('.').pop();
      switch (fileExtension) {
        case 'jpg':
        case 'jpeg':
          iconByFile = <i className="icons-svg icon-file-image" />;
          break;
        case 'zip':
          iconByFile = <i className="icons-svg icon-file-zip" />;
          break;
        case 'pdf':
          iconByFile = <i className="icons-svg icon-file-pdf" />;
          break;
        case 'doc':
        case 'docx':
          iconByFile = <i className="icons-svg icon-file-text" />;
          break;
        case 'xls':
        case 'xlsx':
          iconByFile = <i className="icons-svg icon-file-excel" />;
          break;
        default:
          iconByFile = <i className="icons-svg icon-file" />;
          break;
      }

      const downloadClick =
        self.props.RequestCondition == 'Edit' && doc.DocumentUrl != undefined
          ? self.downloadAssociatedDoc
          : null;
      let removeIcon;
      if (!self.state.isReadOnly) {
        removeIcon = (
          <CloseIcon
            className="cross-documents"
            data-arrayposition={i}
            data-id={doc.id}
            onClick={self.removeLinkedDocument}
          />
        );
      }

      return (
        <div key={i} className="row">
          <form>
            <Button
              className="btn-raised grey btn-send linked-doc"
              data-url={doc.DocumentUrl}
              onClick={downloadClick}
            >
              {iconByFile}
              {docName}
            </Button>
          </form>
          <Fab size="small">{removeIcon}</Fab>
        </div>
      );
    });

    const documentsTitlesClass = self.state.disableDocumentsField
      ? 'disabledTitleColor'
      : 'enbledColorTitle';

    const documentTypesList = _.map(self.props.DocumentTypes, (object, i) => {
      let translatedName = object.TypeName;
      let isChecked = false;
      let checkedIcon;
      let uncheckedIcon;

      if (
        object.BimObjectDocumentTypeLangList != null &&
        object.BimObjectDocumentTypeLangList.length > 0
      ) {
        const index = object.BimObjectDocumentTypeLangList.findIndex(
          (id) => id.LanguageCode == self.props.Language
        );
        if (index > -1) {
          translatedName = object.BimObjectDocumentTypeLangList[index].Name;
        }
      }

      const currentDocs = self.state.contentRequestDatas.DocumentsWanted;
      _.each(currentDocs, (doc, i) => {
        if (doc == object.Key) {
          isChecked = true;
        }
      });

      // checked icon
      checkedIcon = <CheckCircleIcon style={{ color: DisplayDesign.acidBlue }} />;

      // unchecked icon
      if (self.state.disableDocumentsField) {
        uncheckedIcon = <RadioButtonUncheckedIcon style={{ color: DisplayDesign.disabledGrey }} />;
      } else {
        uncheckedIcon = <RadioButtonUncheckedIcon style={{ color: DisplayDesign.acidBlue }} />;
      }

      if (object.TypeName == 'Other') {
        return (
          <li
            key={`DocumentTypes-${object.TypeName}`}
            className="content-create-checkbox line-disabled-input-readable"
          >
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={self.state.disableDocumentsField}
                    data-value={object.Key}
                    value={object.TypeName}
                    id={object.Key}
                    checked={isChecked}
                    onChange={self.handleChangeDocumentsWanted}
                    checkedIcon={checkedIcon}
                    icon={uncheckedIcon}
                  />
                }
                label={translatedName}
              />
              <TextField
                id="anotherDocNameField"
                className="another-type-doc disabled-input-readable"
                fullWidth
                placeholder={
                  self.props.Resources.ContentManagement.ContentRequestCreateSetOtherDocumentName
                }
                style={{ display: self.state.showOtherDocInput }}
                disabled={self.state.isReadOnly}
                defaultValue={self.state.contentRequestDatas.OtherDocumentName}
                inputRef={(input) => {
                  self.state.contentRequestDatas.OtherDocumentName = input;
                }}
              />
            </div>
          </li>
        );
      }
      return (
        <li
          key={`DocumentTypes-${object.TypeName}`}
          className="content-create-checkbox line-disabled-input-readable"
        >
          <FormControlLabel
            control={
              <Checkbox
                disabled={self.state.disableDocumentsField}
                data-value={object.Key}
                value={object.TypeName}
                id={object.Key}
                checked={isChecked}
                onChange={self.handleChangeDocumentsWanted}
                checkedIcon={checkedIcon}
                icon={uncheckedIcon}
              />
            }
            label={translatedName}
            labelPlacement="end"
          />
        </li>
      );
    });

    // classifications List
    const selectedClassifItem = self.state.contentRequestDatas.ObjectClassifications.map(
      (node, i) => ({ Id: parseInt(node.split('#')[1], 10) })
    );

    // classifications
    const bimObjectClassificationNodes = self.state.contentRequestDatas.ObjectClassifications.map(
      (node, i) => {
        let classifName = '';
        let classifClass = '';
        const nodeName = node.split('#')[2];
        const classifId = node.split('#')[0];

        const index = self.state.classificationsList.findIndex(
          (id) => id.Classification.toString() === node.split('#')[0]
        );
        if (index > -1) {
          classifName = self.state.classificationsList[index].Name;
          if (self.state.classificationsList[index].ColorCode != null) {
            classifClass = `classificationNode ${Utils.getClassificationColor(
              self.state.classificationsList[index].ColorCode,
              true
            )}`;
          } else {
            classifClass = `classificationNode ${Utils.getClassificationColor(
              self.state.classificationsList[index].Classification
            )}`;
          }
        }

        return (
          <ul className="classification-results" style={{ display: 'inline-block' }} key={i}>
            <li className={classifClass}>
              {nodeName}
              <span className="delete-bimobject-classificationNode">
                <CloseIcon data-id={node.split('#')[1]} onClick={self.removeClassificationNode} />
              </span>
            </li>
          </ul>
        );
      }
    );

    // tags
    const tags = self.state.contentRequestDatas.TagsList.map((tag, i) => {
      const tagName = tag.split('#')[1];
      const deleteButton = !self.state.isReadOnly ? self.removeTag : '';

      return <Chip data-tag={tag} label={tagName} onDelete={deleteButton} className="tag" />;
    });

    // variants
    const tableVariants = self.state.contentRequestDatas.VariantList.map((variant, index) => (
      <TableRow key={`row-variant-${variant.Id}`}>
        <TableCell className="table-cell-index" align="center" padding="none">
          <span className={authorizeToEdit ? 'variant-index' : ''}>{index + 1}</span>
          {authorizeToEdit ? (
            <Tooltip title={self.props.Resources.EditPropertiesPage.RemoveRowLabel}>
              <IconButton
                color="secondary"
                className="button-remove-variant"
                onClick={(event) => self.removeVariant(event, index)}
              >
                <RemoveCircleOutlineIcon />
              </IconButton>
            </Tooltip>
          ) : null}
        </TableCell>
        <TableCell align="left" padding="none" className="table-cell-input">
          <InputBase
            name="Reference"
            multiline
            InputLabelProps={{
              className: 'label-for-multiline',
            }}
            fullWidth
            autoFocus
            onChange={(event) => self.onChangeVariant(event, index)}
            defaultValue={variant.Reference}
            disabled={self.state.isReadOnly}
            className="disabled-input-readable"
          />
        </TableCell>
        <TableCell align="left" padding="none" className="table-cell-input">
          <InputBase
            name="Designation"
            multiline
            InputLabelProps={{
              className: 'label-for-multiline',
            }}
            fullWidth
            onChange={(event) => self.onChangeVariant(event, index)}
            defaultValue={variant.Designation}
            disabled={self.state.isReadOnly}
            className="disabled-input-readable"
          />
        </TableCell>
      </TableRow>
    ));

    let currentBottomButtons;
    if (authorizeToEdit) {
      currentBottomButtons = (
        <div className="btn-container">
          <Button
            onClick={self.handleCancelButtonAction}
            className={self.props.CancelButtonClass}
            style={{ marginRight: '10px' }}
          >
            {self.props.CancelButtonLabel}
          </Button>
          <Button
            variant="contained"
            onClick={self.handleValidButtonAction}
            className={self.props.ValidButtonClass}
          >
            {self.props.ValidButtonLabel}
          </Button>
        </div>
      );
    }

    let addDocsDropZone;
    if (!self.state.isReadOnly) {
      addDocsDropZone = (
        <div className="row">
          <input
            accept={self.state.authorisedExtensions}
            id="input-upload-document"
            multiple
            type="file"
            style={{ display: 'none' }}
            onChange={self.checkFileSize}
            maxfilesize={10}
            ref={(ref) => (self.docInput = ref)}
          />
          <label htmlFor="input-upload-document">
            <Button variant="contained" component="span" className="button-add-file">
              <AddIcon />
            </Button>
          </label>
        </div>
      );
    }

    // view rendering
    return (
      <div className="container-fluid container-content-request-form">
        <div className="row">
          <div className="col-sm-17 col-sm-offset-3">
            <div className="panel">
              <h2>{self.props.Resources.ContentManagement.CreateContentRequestDefineRequest}</h2>

              <div className="row">
                <div className="col-sm-4">
                  <TextField
                    id="projectAuthorName"
                    label={self.props.Resources.ContentManagement.CreateContentRequestAuthorName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    disabled
                    value={self.state.contentRequestDatas.Sender}
                  />
                </div>
                <div className="col-sm-6 col-sm-offset-1">
                  <TextField
                    id="projectNameRequest"
                    label={self.props.Resources.ContentManagement.CreateContentRequestProjectName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                    disabled={self.state.isReadOnly}
                    defaultValue={self.state.contentRequestDatas.ProjectName}
                    inputRef={(input) => {
                      self.state.contentRequestDatas.ProjectName = input;
                    }}
                  />
                </div>
                <div className="col-sm-5 col-sm-offset-1">
                  <DatePicker
                    autoOk
                    label={self.props.Resources.ContentManagement.CreateContentRequestWantedDate}
                    cancelLabel={self.props.Resources.DatepickerElements.CancelButton}
                    okLabel={self.props.Resources.DatepickerElements.OkButton}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={self.state.contentRequestDatas.EndDate}
                    onChange={self.handleChangeEndDateRequest}
                    disablePast
                    disabled={self.state.isReadOnly}
                    format="DD/MM/YYYY"
                    style={{ width: '100%' }}
                  />
                </div>
                <div className="col-sm-5 col-sm-offset-1">
                  <FormControl fullWidth>
                    <TextField
                      select
                      label={
                        self.props.Resources.ContentManagement.CreateContentRequestKindOfObject
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={self.state.contentRequestDatas.ObjectType}
                      disabled={self.state.isReadOnly}
                      InputProps={{
                        className: 'disabled-input-readable',
                      }}
                      onChange={self.handleChangeObjectType}
                    >
                      <MenuItem value="UserContent">
                        {' '}
                        {self.props.Resources.SearchResults.ObjectTypeFilterGenericOfficial}{' '}
                      </MenuItem>
                      <MenuItem value="Manufacturer">
                        {' '}
                        {self.props.Resources.SearchResults.ObjectTypeFilterOfficial}{' '}
                      </MenuItem>
                    </TextField>
                  </FormControl>
                </div>
              </div>
            </div>

            <div className="panel">
              <h2>
                {self.props.Resources.ContentManagement.CreateContentRequestGeneralDescription}
              </h2>

              <div className="row">
                <div className="col-lg-10">
                  <TextField
                    label={self.props.Resources.ContentManagement.CreateContentRequestObjectName}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    id="objectNameRequest"
                    fullWidth
                    defaultValue={
                      self.state.contentRequestDatas.ObjectName != null &&
                      self.state.contentRequestDatas.ObjectName
                    }
                    disabled={self.state.isReadOnly}
                    inputRef={(input) => {
                      self.state.contentRequestDatas.ObjectName = input;
                    }}
                  />
                </div>

                <div
                  className={`${'col-lg-10 col-sm-offset-3' + ' '}${self.state.referenceFieldClass
                    }`}
                >
                  <AutocompleteSuppliers
                    TemporaryToken={self.props.TemporaryToken}
                    ManagementCloudId={self.props.ManagementCloudId}
                    SelectSupplier={self.handleChangeSelectedSupplier}
                    Resources={self.props.Resources}
                    SettedSupplierId={self.state.contentRequestDatas.SupplierId}
                    SettedSupplierName={self.state.contentRequestDatas.SupplierName}
                    OnChangeAutoCompleteSupplier={self.onChangeAutoCompleteSupplier}
                    Disabled={
                      !!(
                        self.props.RequestCondition == 'Edit' &&
                        self.state.contentRequestDatas.RequestState != 'draft'
                      )
                    }
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-24">
                  <div id="comments">
                    <TextField
                      id="descriptionContentRequest"
                      label={self.props.Resources.EditionPage.BimObjectDescriptionLabel}
                      style={{ marginTop: 0 }}
                      multiline
                      fullWidth
                      rows={2}
                      rowsMax={10}
                      disabled={self.state.isReadOnly}
                      placeholder={
                        self.props.Resources.ContentManagement
                          .ContentRequestCreateSetObjectDescription
                      }
                      InputLabelProps={{
                        className: 'label-for-multiline',
                        shrink: true,
                      }}
                      InputProps={{
                        className: 'disabled-input-readable',
                      }}
                      value={self.state.contentRequestDatas.Description}
                      onChange={self.onChangeDescription}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div id="block-variants-table" className="row">
                  <div id="block-variants-table-header">
                    <div>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell padding="none" />
                            <TableCell align="center" className="table-cell-header">
                              {self.props.Resources.EditModelsPage.VariantsRef}
                            </TableCell>
                            <TableCell align="center" className="table-cell-header">
                              {self.props.Resources.EditModelsPage.VariantsDesignation}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                      </Table>
                    </div>
                    <div className="cale-container">
                      <div className="cale" />
                    </div>
                  </div>
                  <div
                    id="block-variants-table-body"
                    className={
                      self.state.contentRequestDatas.VariantList.length > 0 ? '' : 'hidden'
                    }
                  >
                    <Table>
                      <TableBody>{tableVariants}</TableBody>
                    </Table>
                  </div>
                  <div id="block-variants-table-footer">
                    <div>
                      <Table>
                        <TableFooter>
                          <TableRow>
                            <TableCell className="table-cell-index" align="center" padding="none">
                              {authorizeToEdit ? (
                                <Tooltip title={self.props.Resources.EditPropertiesPage.AddRow}>
                                  <IconButton
                                    color="primary"
                                    className="button-add-variant"
                                    onClick={this.addVariant}
                                  >
                                    <AddCircleOutlineIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : null}
                            </TableCell>
                            <TableCell />
                            <TableCell />
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </div>
                    <div className="cale-container">
                      <div className="cale" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-10">
                  <div id="lodListDetails" className="content-request-lod">
                    <h3>{self.props.Resources.SearchResults.LodFilterTitle}</h3>
                    <ul>{lodsList}</ul>
                  </div>

                  <div id="unitListDetails">
                    <h3>{self.props.Resources.ContentManagement.CreateContentRequestUnits}</h3>
                    <RadioGroup
                      name="radioUnit"
                      value={self.state.contentRequestDatas.RequestUnit}
                      onChange={self.handleChangeObjectUnit}
                      style={{ display: 'inline-block' }}
                    >
                      <FormControlLabel
                        value="Imperial"
                        control={<Radio color="primary" />}
                        label={
                          self.props.Resources.ContentManagement.CreateContentRequestUnitImperial
                        }
                      />
                      <FormControlLabel
                        value="Metric"
                        control={<Radio color="primary" />}
                        label={
                          self.props.Resources.ContentManagement.CreateContentRequestUnitMetric
                        }
                      />
                    </RadioGroup>
                  </div>

                  <div id="softwaresChoice">
                    <h3>{self.props.Resources.SearchResults.SoftwareFilterTitle}</h3>
                    <FormControl fullWidth disabled={self.state.isReadOnly}>
                      <Select
                        multiple
                        value={self.state.contentRequestDatas.SoftwaresListRequired}
                        onChange={self.handleChangeSoftwares}
                        renderValue={(selected) => (
                          <div>
                            {selected.map((object, i) => {
                              const soft = self.props.Softwares.find((s) => s.Id == object);
                              const softwareDisplay =
                                soft.Name + (soft.Version != undefined ? ` (${soft.Version})` : '');
                              return (
                                <div className="disabled-input-readable">{softwareDisplay}</div>
                              );
                            })}
                          </div>
                        )}
                      >
                        {newSoftwareList}
                      </Select>
                    </FormControl>
                  </div>

                  <div id="documentsZone">
                    <h3>{self.props.Resources.ContentManagement.DocumentsListLabel}</h3>
                    {LinkedDocs}
                    {addDocsDropZone}
                  </div>
                </div>

                <div className="col-lg-10 col-sm-offset-3">
                  <div id="documentsList">
                    <h3 className={documentsTitlesClass}>
                      {self.props.Resources.ContentManagement.CreateContentRequestDocumentsWanted}
                    </h3>
                    <ul id="docsListDetails" style={{ marginTop: 0 }}>
                      {documentTypesList}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="row">
                <div id="commentsModeler">
                  <TextField
                    id="commentsModelerContentRequestv2"
                    label={self.props.Resources.ContentManagement.ContentRequestCommentsModeler}
                    style={{ marginTop: 0 }}
                    multiline
                    fullWidth
                    rows={2}
                    rowsMax={10}
                    InputLabelProps={{
                      className: 'label-for-multiline',
                      shrink: true,
                    }}
                    disabled={self.state.isReadOnly}
                    InputProps={{
                      className: 'disabled-input-readable',
                    }}
                    value={self.state.contentRequestDatas.CommentsModeler}
                    onChange={self.onChangeCommentsModeler}
                  />
                </div>
              </div>
            </div>

            <div className="panel">
              <div id="classifications" className="row">
                <div className={self.state.classificationsFieldClass}>
                  <div className="col-sm-23">
                    <h2>{self.props.Resources.EditClassificationsPage.ClassificationBlockTitle}</h2>
                  </div>

                  <div id="classification-tree-container" className="col-sm-23">
                    <ClassificationsComponent
                      selectNode={self.addClassificationNode}
                      selectedItem={selectedClassifItem}
                    />
                  </div>
                </div>

                <div className="col-sm-23">
                  <h2>{self.props.Resources.ContentManagement.SelectedClassificationsTitle}</h2>
                  {bimObjectClassificationNodes}
                </div>
              </div>
            </div>

            <div className="panel">
              <div id="tagsList" className="row">
                <div className="classif-entete col-sm-11">
                  <h2>{self.props.Resources.SearchResults.TagsTitle}</h2>
                </div>
                <div
                  className={`${'classif-entete col-sm-11 col-sm-offset-1' + ' '}${self.state.tagsFieldClass
                    }`}
                >
                  <AutocompleteTag selectTag={self.setTagChoice} />
                </div>
                <div className="col-sm-23">{tags}</div>
              </div>
            </div>

            {currentBottomButtons}
          </div>
        </div>
      </div>
    );
  },
});

export default ContentRequest;