/* eslint-disable max-lines-per-function */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import createReactClass from "create-react-class";
import { connect } from "react-redux";
import _ from "underscore";
import toastr from "toastr";
import Dropzone from "react-dropzone";

import styled from "@emotion/styled";

// material ui icons
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown.js";
import LockIcon from "@material-ui/icons/Lock.js";
import CloseIcon from "@material-ui/icons/Close.js";
import { Dropdown, getColorNameFromId } from "@bim-co/componentui-foundation";

import { ControlPointDuplicateRounded } from "@material-ui/icons";
import ModalManufacturerPublishingQuotaLimit from "../../ModalManufacturerPublishingQuotaLimit.jsx";
import * as Utils from "../../../Utils/utils.js";
import store from "../../../Store/Store";
import { API_URL } from "../../../Api/constants";

import {
  fetchAllSubsets as fetchAllSubsetsAction,
  updateSubsetTwoDModelReference as updateSubsetTwoDModelReferenceAction,
  updateSubsetThreeDModelReference as updateSubsetThreeDModelReferenceAction,
} from "../../../Reducers/Sets/Subsets/actions";

import { selectAllSubsetsForDisplaySorted } from "../../../Reducers/Sets/Subsets/selectors";

// custom design
const SubsetHeader = styled.th`
  width: 25%;
`;
const DeleteHeader = styled.th`
  width: 5%;
`;

const is3D = (modelType) => {
  const threeDStatic = ["3D_static", "3D Static"];
  const threeDParam = ["3D_parametric", "3D Parametric"];
  const threeDModel = [...threeDParam, ...threeDStatic];

  return threeDModel.includes(modelType);
};

const is2D = (modelType) => {
  const twoDStatic = ["2D_static", "2D Static"];
  const twoDParam = ["2D_parametric", "2D Parametric"];
  const twoDModel = [...twoDStatic, ...twoDParam];

  return twoDModel.includes(modelType);
};

// eslint-disable-next-line no-confusing-arrow
const getDisplayName = (subset) =>
  !subset?.IsDefault ? `${subset.Set.Name} - ${subset.Name}` : subset.Set.Name;

let EditorStepModels = createReactClass({
  getInitialState() {
    return {
      data: [],
      selectedVariantId: 0,
      selectedModelId: 0,
      selectedModelType: "",
      file: null,
      fileType: null,
      deletedModelId: 0,
      deletedModelType: "",
      isEditName: false,
      showModalManufacturerPublishQuota: false,
      manufacturerQuotaPublishVMList: [],
    };
  },

  componentDidMount() {
    this.loadBimObjectVariantsList();
    this.props.fetchAllSubsets();
  },

  componentDidUpdate(prevProps) {
    if (
      (this.props.updateSubsetTwoDModelReferenceSuccess !==
        prevProps.updateSubsetTwoDModelReferenceSuccess &&
        this.props.updateSubsetTwoDModelReferenceSuccess) ||
      (this.props.updateSubsetThreeDModelReferenceSuccess !==
        prevProps.updateSubsetThreeDModelReferenceSuccess &&
        this.props.updateSubsetThreeDModelReferenceSuccess)
    ) {
      this.loadBimObjectVariantsList();
    }
  },

  loadBimObjectVariantsList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v3/bimobjects/${this.props.bimObjectId}/variants/subsets?token=${this.props.TemporaryToken}`,
      {
        method: "GET",
        headers: {
          "Accept-Language": this.props.Language,
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        self.setState({ data: json });
        store.dispatch({ type: "LOADER", state: false });
      });
  },

  selectVariant(variantId) {
    let selectedModelId = 0;
    let selectedModelType = "";
    const objectIds = Object.keys(this.state.data[variantId].Models);
    if (objectIds.length > 0) {
      selectedModelId = this.state.data[variantId].Models[objectIds[0]].Id;
      selectedModelType = this.state.data[variantId].Models[objectIds[0]].Type;
    }
    this.setState({
      selectedVariantId: variantId,
      selectedModelId,
      selectedModelType,
      isEditName: false,
    });
  },

  selectModel(modelId, modelType) {
    if (this.state.selectedModelId !== modelId) {
      this.setState({
        selectedModelId: modelId,
        selectedModelType: modelType,
        isEditName: false,
      });
    }
  },

  on2dModelDrop(files) {
    const self = this;
    $("#choice-variants-modal").modal();
    self.setState({ file: files[0], fileType: "2d", deletedModelId: 0 });
  },

  on3dModelDrop(files) {
    const self = this;
    self.setState({ file: files[0], fileType: "3d", deletedModelId: 0 });
    $("#choice-variants-modal").modal();
  },

  validateUpload() {
    const self = this;

    if ($("#choice-variants-modal input:checkbox:checked").length > 0) {
      $("#choice-variants-modal").modal("hide");

      const variants = [];
      $(".variants-choices input:checked").each((index, element) => {
        variants.push(element.value);
        element.checked = false;
      });

      const data = new FormData();
      data.append("file", this.state.file);
      data.append("variants", variants.toString());
      data.append("workspace", "official");

      store.dispatch({ type: "LOADER", state: true });

      $.ajax({
        type: "POST",
        url: `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/${this.state.fileType}/upload?token=${this.props.TemporaryToken}`,
        data,
        processData: false,
        contentType: false,
        async: true,
        success() {
          self.loadBimObjectVariantsList();
        },
        error(XMLHttpRequest) {
          store.dispatch({ type: "LOADER", state: false });

          // L'upload de model n'est pas autorisé
          if (XMLHttpRequest.status === 403) {
            const manufacturerQuotaPublishVMList = XMLHttpRequest.responseJSON;

            $("#list-internal-file-upload").modal("hide");

            if (
              manufacturerQuotaPublishVMList != null &&
              manufacturerQuotaPublishVMList.length > 0
            ) {
              self.setState({
                showModalManufacturerPublishQuota: true,
                manufacturerQuotaPublishVMList,
              });
              self.setState({
                showModalManufacturerPublishQuota: false,
              });
            }
          }
        },
      });
      $('input[id="checkBoxAllVariants"]').prop("checked", false);
    } else {
      toastr.error(
        self.props.resources.ContentManagement.SelectAtLeastOneVariant
      );
    }
  },

  prepareDeleteModel(model) {
    const { Id, Type } = model;

    this.setState({
      deletedModelId: Id,
      deletedModelType: Type,
    });

    $("#confirm-deletion-modal").modal();
  },

  deleteModel() {
    const self = this;
    const id = this.state.deletedModelId;
    const variants = [];
    let url = "";

    if ($("#confirm-deletion-modal input:checkbox:checked").length > 0) {
      $("#confirm-deletion-modal input:checkbox:checked").each(
        (index, element) => {
          if (element.value !== "allVariantsE") {
            variants.push(element.value);
          }
          element.selected = false;
        }
      );

      let modelType = "";
      if (is3D(this.state.selectedModelType)) {
        modelType = "3d";
      } else if (is2D(this.state.selectedModelType)) {
        modelType = "2d";
      }

      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/${modelType}/${id}/remove/variant`;

      if (modelType !== "") {
        store.dispatch({ type: "LOADER", state: true });
        const urlWithToken = `${url}?token=${this.props.TemporaryToken}`;
        fetch(urlWithToken, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ GetVariantIds: variants }),
        }).then(() => {
          self.loadBimObjectVariantsList();
        });
      }
      $("#confirm-deletion-modal").modal("hide");
    } else {
      alert("Veuillez sélectionner au moins une variante");
    }
  },

  onModelComplementDrop(files) {
    const self = this;
    let url = "";

    if (is3D(this.state.selectedModelType)) {
      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/3d/${this.state.selectedModelId}/complement/upload?token=${this.props.TemporaryToken}`;
    } else if (is2D(this.state.selectedModelType)) {
      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/2d/${this.state.selectedModelId}/complement/upload?token=${this.props.TemporaryToken}`;
    }

    if (url !== "") {
      store.dispatch({ type: "LOADER", state: true });

      const data = new FormData();
      data.append("file", files[0]);

      fetch(url, {
        method: "POST",
        body: data,
      }).then(() => {
        self.loadBimObjectVariantsList();
      });
    }
  },

  onModelPreviewDrop(files) {
    const self = this;
    let url = "";

    if (is3D(this.state.selectedModelType)) {
      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/3d/${this.state.selectedModelId}/preview/upload?token=${this.props.TemporaryToken}`;
    } else if (is2D(this.state.selectedModelType)) {
      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/2d/${this.state.selectedModelId}/preview/upload?token=${this.props.TemporaryToken}`;
    }

    if (url !== "") {
      store.dispatch({ type: "LOADER", state: true });

      const data = new FormData();
      data.append("file", files[0]);
      data.append("variant", this.state.selectedVariantId);

      fetch(url, {
        method: "POST",
        body: data,
      }).then(() => {
        self.loadBimObjectVariantsList();
      });
    }
  },

  deletePreview(previewId) {
    const self = this;

    let url = "";

    if (is3D(this.state.selectedModelType)) {
      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/3d/${this.state.selectedModelId}/preview/${previewId}/remove?token=${this.props.TemporaryToken}`;
    } else if (is2D(this.state.selectedModelType)) {
      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/2d/${this.state.selectedModelId}/preview/${previewId}/remove?token=${this.props.TemporaryToken}`;
    }

    if (url !== "") {
      store.dispatch({ type: "LOADER", state: true });

      fetch(url, {
        method: "POST",
      }).then(() => {
        self.loadBimObjectVariantsList();
      });
    }
  },

  deleteComplement(complementId) {
    const self = this;

    store.dispatch({ type: "LOADER", state: true });

    fetch(
      `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/3d/${this.state.selectedModelId}/complement/${complementId}/remove?token=${this.props.TemporaryToken}`,
      {
        method: "POST",
      }
    ).then(() => {
      self.loadBimObjectVariantsList();
    });
  },

  changeSoftware(event) {
    const { value } = event.target;
    const modelId = event.target.dataset.id;
    const modelType = event.target.dataset.type;

    this.editModel(modelId, modelType, value, null, null, null);
  },

  changeLod(event) {
    const { value } = event.target;
    const modelId = event.target.dataset.id;
    const modelType = event.target.dataset.type;

    this.editModel(modelId, modelType, null, value, null, null);
  },

  setValue(selectedSubset, currentSubsets) {
    const currentType = this.state.selectedModelType;
    const currentObjectId = this.props.bimObjectId;
    const currentModel =
      this.state.data[this.state.selectedVariantId].Models[
        this.state.selectedModelId
      ];
    const currentVariant = this.state.selectedVariantId;
    // remove ONE
    if (selectedSubset?.length < currentSubsets?.length) {
      let updatedSubsets = [];
      if (is3D(currentType)) {
        // current subset
        if (selectedSubset) {
          updatedSubsets = selectedSubset.map((elem) => elem.value);
        }
        // call api, send empty subsets list and refresh
        this.props.updateSubsetThreeDModelReference(
          currentObjectId,
          currentModel.Id,
          currentVariant,
          updatedSubsets
        );
      } else if (is2D(currentType)) {
        // current subset
        if (selectedSubset) {
          updatedSubsets = selectedSubset.map((elem) => elem.value);
        }
        // call api, send empty subsets list and refresh
        this.props.updateSubsetTwoDModelReference(
          currentObjectId,
          currentModel.Id,
          currentVariant,
          updatedSubsets
        );
      }
    } else if (selectedSubset?.length > currentSubsets?.length) {
      let addSubsetId = [];

      if (selectedSubset) {
        addSubsetId = selectedSubset.map((elem) => elem.value);
      }

      if (is3D(currentType)) {
        // current added
        const updatedSubsets = addSubsetId;

        // add existing
        currentModel.Subsets.forEach((item) => {
          updatedSubsets.push(item.Id);
        });

        // call api, send all current subsets and refresh
        this.props.updateSubsetThreeDModelReference(
          currentObjectId,
          currentModel.Id,
          currentVariant,
          updatedSubsets
        );
      } else if (is2D(currentType)) {
        // current added
        const updatedSubsets = selectedSubset.map((elem) => elem.value);

        // add existing
        currentModel.Subsets.forEach((item) => {
          updatedSubsets.push(item.Id);
        });

        // call api, send all current subsets and refresh
        this.props.updateSubsetTwoDModelReference(
          currentObjectId,
          currentModel.Id,
          currentVariant,
          updatedSubsets
        );
      }
    } else if (!selectedSubset) {
      if (is3D(currentType)) {
        // call api, send empty subsets list and refresh
        this.props.updateSubsetThreeDModelReference(
          currentObjectId,
          currentModel.Id,
          currentVariant,
          []
        );
      } else if (is2D(currentType)) {
        // call api, send empty subsets list and refresh
        this.props.updateSubsetTwoDModelReference(
          currentObjectId,
          currentModel.Id,
          currentVariant,
          []
        );
      }
    }
  },

  changeName(event) {
    const modelId = event.target.dataset.id;
    const modelType = event.target.dataset.type;
    this.setState({
      isEditName: true,
      selectedModelId: modelId,
      selectedModelType: modelType,
    });
  },

  confirmChangeName(event) {
    const modelId = event.target.dataset.id;
    const modelType = event.target.dataset.type;
    const value = $(
      `#v${this.state.selectedVariantId}m${modelId}t${modelType.substring(
        0,
        2
      )}-name`
    ).val();

    this.editModel(modelId, modelType, null, null, value, null);
    this.setState({ isEditName: false });
  },

  editModel(modelId, modelType, softwareId, Lod, Name, typeFormat) {
    const self = this;
    let url = "";

    if (is3D(this.state.selectedModelType)) {
      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/3d/edit/?token=${this.props.TemporaryToken}`;
    } else if (is2D(this.state.selectedModelType)) {
      url = `${API_URL}/api/ws/v1/bimobject/${this.props.bimObjectId}/model/2d/edit/?token=${this.props.TemporaryToken}`;
    }

    if (url !== "") {
      store.dispatch({ type: "LOADER", state: true });

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ModelId: modelId,
          ModelName: Name,
          SoftwareId: softwareId,
          ModelLevelOfDetail: Lod,
          ModelTypeFormat: typeFormat,
        }),
      }).then(() => {
        self.loadBimObjectVariantsList();
      });
    }
  },

  handleClickOnCheckbox(event) {
    const ancestor =
      event.target.parentNode.parentNode.parentNode.parentNode.parentNode
        .parentNode.parentNode;

    if (event.target.value === "allVariantsE") {
      if (event.target.checked) {
        $('#confirm-deletion-modal input[name="variants"]').prop(
          "checked",
          true
        );
      } else {
        $('#confirm-deletion-modal input[name="variants"]').prop(
          "checked",
          false
        );
      }
    } else if (event.target.value === "allVariantsU") {
      if (event.target.checked) {
        $('#choice-variants-modal input[name="variants"]').prop(
          "checked",
          true
        );
      } else {
        $('#choice-variants-modal input[name="variants"]').prop(
          "checked",
          false
        );
      }
    } else if (event.target.checked) {
      let allChecked = true;

      if (ancestor.id === "confirm-deletion-modal") {
        $("#confirm-deletion-modal input:checkbox").each(() => {
          if (this.value !== "allVariantsE" && this.checked !== true) {
            allChecked = false;
          }
        });
      } else {
        $("#choice-variants-modal input:checkbox").each(() => {
          if (this.value !== "allVariantsU" && this.checked !== true) {
            allChecked = false;
          }
        });
      }
      if (allChecked) {
        $('input[id="checkBoxAllVariants"]').prop("checked", true);
      }
    } else {
      $('input[id="checkBoxAllVariants"]').prop("checked", false);
    }
  },

  onFileRejected() {
    toastr.error(this.props.resources.ContentManagement.FileNotSupported);
  },

  render() {
    const self = this;

    let rowsVariants;
    let variantModelClass = "hidden";
    let variantPreviewClass = "hidden";
    let variantPreviewTableClass = "hidden";
    let variantComplementClass = "";
    let variantComplementTableClass = "hidden";
    let rowViewable;
    let rowComplement;
    let variantsSelection;

    // variants list
    if (this.state.data.length !== 0) {
      let cpt = 0;
      rowsVariants = _.map(this.state.data, (variant, i) => {
        cpt++;

        const sw = _.map(variant.Softwares, (software, soft) => (
          <img src={software} alt={soft} key={soft} height="22" />
        ));

        let classStr = "tr-variant";
        if (i === self.state.selectedVariantId) {
          classStr += " tr-selected";
        }

        const countModels = Object.keys(variant.Models).length;

        return (
          <tr
            key={i}
            data-id={i}
            onClick={() => self.selectVariant(i)}
            className={classStr}
          >
            <td>{cpt}</td>
            <td>{variant.Ref}</td>
            <td>{variant.Designation}</td>
            <td>{sw}</td>
            <td className="text-right">
              {countModels} <KeyboardArrowDownIcon />
            </td>
          </tr>
        );
      });

      // modal variants selection
      variantsSelection = _.map(this.state.data, (variant, i) => {
        if (
          self.state.deletedModelId === 0 ||
          variant.Models[self.state.deletedModelId] != null
        ) {
          return (
            <div key={i}>
              <label>
                <input
                  type="checkbox"
                  name="variants"
                  value={variant.Id}
                  onClick={self.handleClickOnCheckbox}
                />{" "}
                {variant.Ref}
              </label>
            </div>
          );
        }
      });
    }

    // models list
    let variantModels;
    let selectedModel = null;

    if (this.state.selectedVariantId !== 0) {
      variantModels = _.map(
        this.state.data[this.state.selectedVariantId].Models,
        (model, i) => {
          variantModelClass = "";

          const onflySubsets =
            self.props.onflySubsets?.map((subset) => ({
              value: subset.Id,
              label: getDisplayName(subset),
              color: getColorNameFromId(subset.Id),
            })) ?? [];

          const currentSubsets =
            model.Subsets?.map((subset) => ({
              value: subset.Id,
              label: getDisplayName(subset),
              color: getColorNameFromId(subset.Id),
            })) ?? [];

          if (model.WorkspaceId === 1) {
            const softwares = [];
            softwares.push(
              <option key="-" value="-">
                -
              </option>
            );

            _.each(self.props.Softwares, (software) => {
              softwares.push(
                <option key={software.Id} value={software.Id}>
                  {software.Name +
                    (software.Version != undefined
                      ? ` (${software.Version})`
                      : "")}
                </option>
              );
            });

            let classStr = "tr-variant";
            if (model.Id == self.state.selectedModelId) {
              classStr += " tr-selected";
              selectedModel = model;
              if (self.props.IsBimAndCoAdmin) {
                variantPreviewClass = "";
              }
              if (model.Type === "3D Parametric") {
                variantComplementClass = "";
              }
            }

            let buttonValidateEditName;
            if (
              this.state.isEditName &&
              model.Id == this.state.selectedModelId
            ) {
              buttonValidateEditName = (
                <button
                  className="btn btn-sm btn-default"
                  type="button"
                  onClick={self.confirmChangeName}
                  data-id={model.Id}
                  data-type={model.Type}
                >
                  OK
                </button>
              );
            }

            // if modeltype containe space
            const modelType = model.Type.replace('_',' ').split(' ')[0];

            return (
              <tr
                key={model.Id}
                onClick={() => self.selectModel(model.Id, model.Type)}
                className={classStr}
              >
                <td>{modelType}</td>

                <td>

                  <div className="input-group">
                    <input
                      type="text"
                      id={`v${self.state.selectedVariantId}m${
                        model.Id
                      }t${model.Type.substring(0, 2)}-name`}
                      defaultValue={model.Name}
                      className="form-control"
                      data-id={model.Id}
                      data-type={model.Type}
                      onChange={self.changeName}
                    />
                    <span className="input-group-btn">
                      {buttonValidateEditName}
                    </span>
                  </div>
                </td>
                <td>
                  <select
                    className="model-software form-control"
                    defaultValue={model.Software}
                    data-id={model.Id}
                    data-type={model.Type}
                    onChange={self.changeSoftware}
                  >
                    {softwares}
                  </select>
                </td>
                <td>
                  <select
                    defaultValue={model.Lod}
                    className="form-control"
                    data-id={model.Id}
                    data-type={model.Type}
                    onChange={self.changeLod}
                  >
                    <option value="0">-</option>
                    <option value="100">100</option>
                    <option value="200">200</option>
                    <option value="300">300</option>
                    <option value="400">400</option>
                    <option value="500">500</option>
                  </select>
                </td>
                <td>{Utils.getReadableSize(model.Size)}</td>
                <td>
                  <Dropdown
                    isMulti
                    onControlOpen={() => self.selectModel(model.Id, model.Type)}
                    onChange={(selectedSubset) =>
                      self.setValue(selectedSubset, currentSubsets)
                    }
                    options={onflySubsets}
                    value={currentSubsets}
                    hasOptionTags
                    placeholder={
                      this.props.resources.ContentManagement.SearchSubset
                    }
                    canDeleteItem={false}
                  />
                </td>
                <td className="text-right">
                  <a
                    className="delete-btn"
                    onClick={() => self.prepareDeleteModel(model)}
                  >
                    <CloseIcon data-id={model.Id} data-type={model.Type} />
                  </a>
                </td>
              </tr>
            );
          }
        }
      );
    }

    // preview list
    if (selectedModel != null && selectedModel.ViewableModel != null) {
      variantPreviewTableClass = "";

      rowViewable = (
        <tr>
          <td>{selectedModel.ViewableModel.Name}</td>
          <td>{selectedModel.ViewableModel.Extension}</td>
          <td>{Utils.getReadableSize(selectedModel.ViewableModel.Size)}</td>
          <td className="text-right">
            <a
              className="delete-btn"
              onClick={() => this.deletePreview(selectedModel.ViewableModel.Id)}
            >
              <CloseIcon />
            </a>
          </td>
        </tr>
      );
    }

    const createRowComplement = (complement) => (
      <tr key={complement.Id}>
        <td>{complement.Name}</td>
        <td>{complement.Extension}</td>
        <td>{Utils.getReadableSize(complement.Size)}</td>
        <td className="text-right">
          <a className="delete-btn" onClick={() => this.deleteComplement(complement.Id)}>
            <CloseIcon />
          </a>
        </td>
      </tr>
    );

    // complement list
    if (
      selectedModel != null &&
      selectedModel.Complement3DModel != null &&
      selectedModel.Type === "3D Parametric"
    ) {
      variantComplementTableClass = "";
      rowComplement = selectedModel.Complement3DModel.map(complement => (
          <tr>
            <td>{complement.Name}</td>
            <td>{complement.Extension}</td>
            <td>{Utils.getReadableSize(complement.Size)}</td>
            <td className="text-right">
              <a
                  className="delete-btn"
                  onClick={() => this.deleteComplement(complement.Id)}
              >
                <CloseIcon />
              </a>
            </td>
          </tr>
      ));
    }

    let classOverlay = "overlay";
    if (this.props.permissions.bimobject_models) {
      classOverlay += " hidden";
    }

    return (
      <div className="container-fluid">
        <div className="panel edit-object">
          <div className="col-md-23">
            <h3>{this.props.resources.EditModelsPage.BlockTitle}</h3>

            <table className="table table-striped" id="bimobject-variants">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{this.props.resources.EditModelsPage.VariantsRef}</th>
                  <th>
                    {this.props.resources.EditModelsPage.VariantsDesignation}
                  </th>
                  <th>
                    {this.props.resources.EditModelsPage.VariantsSoftwares}
                  </th>
                  <th className="text-right" />
                </tr>
              </thead>
              <tbody>{rowsVariants}</tbody>
            </table>
            <br />
            <div className="container-fluid">
              <div className={variantModelClass}>
                <table className="table table-striped" id="bimobject-models">
                  <thead>
                    <tr>
                      <th>{this.props.resources.EditModelsPage.ModelType}</th>
                      <th>{this.props.resources.EditModelsPage.ModelName}</th>
                      <th>
                        {this.props.resources.EditModelsPage.ModelSoftware}
                      </th>
                      <th>{this.props.resources.EditModelsPage.ModelLod}</th>
                      <th>{this.props.resources.EditModelsPage.ModelSize}</th>
                      <SubsetHeader style={{ width: "25%" }}>
                        {this.props.resources.ContentManagement.Subset}
                      </SubsetHeader>
                      <DeleteHeader style={{ width: "5%" }} />
                    </tr>
                  </thead>
                  <tbody>{variantModels}</tbody>
                </table>

                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-11">
                      <div className={variantPreviewClass}>
                        <label>
                          {this.props.resources.EditModelsPage.PreviewModel}
                        </label>
                        <Dropzone
                          multiple={false}
                          onDrop={this.onModelPreviewDrop}
                          onDropRejected={this.onFileRejected}
                          accept=".obj, .zip"
                          maxSize={104857600}
                          className="dropzone-area"
                        >
                          <h4>{this.props.resources.EditModelsPage.DragBox}</h4>
                          <p className="legende">
                            {this.props.resources.EditModelsPage.SupportedFiles}{" "}
                            .obj, .zip
                            <br />
                            {this.props.resources.EditModelsPage.SizeMax.replace(
                              "{0}",
                              "30"
                            )}
                          </p>
                        </Dropzone>
                        <div className={variantPreviewTableClass}>
                          <table
                            className="table table-striped"
                            id="bimobject-models-preview"
                          >
                            <thead>
                              <tr>
                                <th>
                                  {
                                    this.props.resources.EditModelsPage
                                      .ModelFileName
                                  }
                                </th>
                                <th>
                                  {
                                    this.props.resources.EditModelsPage
                                      .ModelExtension
                                  }
                                </th>
                                <th>
                                  {
                                    this.props.resources.EditModelsPage
                                      .ModelSize
                                  }
                                </th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>{rowViewable}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-11 col-md-offset-1">
                      <div className={variantComplementClass}>
                        <label>
                          {this.props.resources.EditModelsPage.ComplementFile}
                        </label>
                        <Dropzone
                          multiple={false}
                          onDrop={this.onModelComplementDrop}
                          onDropRejected={this.onFileRejected}
                          maxSize={104857600}
                          accept=".txt, .zip, .adsklib"
                          className="dropzone-area"
                        >
                          <h4>{this.props.resources.EditModelsPage.DragBox}</h4>
                          <p className="legende">
                            {this.props.resources.EditModelsPage.SupportedFiles} .txt, .zip,
                            .adsklib
                            <br />
                            {this.props.resources.EditModelsPage.SizeMax.replace(
                              "{0}",
                              "30"
                            )}
                          </p>
                        </Dropzone>
                        <div className={variantComplementTableClass}>
                          <table
                            className="table table-striped"
                            id="bimobject-models-complement"
                          >
                            <thead>
                              <tr>
                                <th>
                                  {
                                    this.props.resources.EditModelsPage
                                      .ModelFileName
                                  }
                                </th>
                                <th>
                                  {
                                    this.props.resources.EditModelsPage
                                      .ModelExtension
                                  }
                                </th>
                                <th>
                                  {
                                    this.props.resources.EditModelsPage
                                      .ModelSize
                                  }
                                </th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              {rowComplement?.length && rowComplement.map((row) => row)}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classOverlay}>
            <p className="disabled-text">
              <LockIcon />
            </p>
          </div>
        </div>

        <div id="gestion-modele" className="panel edit-object">
          <div className="col-md-23">
            <h3>{this.props.resources.EditModelsPage.BlockTitleAdd}</h3>
          </div>
          <div className="col-md-11">
            <h4>{this.props.resources.EditModelsPage.BlockTitleAdd3DModel}</h4>
            <Dropzone
              multiple={false}
              onDrop={self.on3dModelDrop}
              onDropRejected={this.onFileRejected}
              accept=".top, .pln, .uel, .icn, .step, .stp, .adb, .iii, .ddd, .nwf , .nwd, .catpart, .bcf, .fbx, .ndw, .lcf, .namexchange, .sldprt, .sat, .obj, .xsh, .c4d, .aof, .mcd, .vwx, .dae, .dwg, .rte, .rvt, .skp, .3dm, .3ds, .max, .gsm, .rfa, .ifc, .blend, .rft, .itl, .dgn"
              maxSize={104857600}
              className="dropzone-area"
            >
              <h4>{this.props.resources.EditModelsPage.DragBox}</h4>
              <p className="legende">
                {this.props.resources.EditModelsPage.SupportedFiles} .top, .pln,
                .uel, .icn, .step, .stp, .adb, .iii, .ddd, .nwf, .nwd, .catpart,
                .bcf, .fbx, .ndw, .lcf, .namexchange, .sldprt, .sat, .obj, .xsh,
                .c4d, .aof, .mcd, .vwx, .dae, .dwg, .rte, .rvt, .skp, .3dm,
                .3ds, .max, .gsm, .rfa, .ifc, .blend, .dgn, .itl, .rft
                <br />
                {this.props.resources.EditModelsPage.SizeMax.replace(
                  "{0}",
                  "30"
                )}
              </p>
            </Dropzone>
          </div>
          <div className="col-md-11 col-md-offset-1">
            <h4>{this.props.resources.EditModelsPage.BlockTitleAdd2DModel}</h4>
            <Dropzone
              multiple={false}
              onDrop={this.on2dModelDrop}
              onDropRejected={this.onFileRejected}
              accept=".dxf, .dwg, .rfa"
              maxSize={104857600}
              className="dropzone-area"
            >
              <h4>{this.props.resources.EditModelsPage.DragBox}</h4>
              <p className="legende">
                {this.props.resources.EditModelsPage.SupportedFiles} .dxf, .dwg,
                .rfa
                <br />
                {this.props.resources.EditModelsPage.SizeMax.replace(
                  "{0}",
                  "30"
                )}
              </p>
            </Dropzone>
          </div>
          <div className={classOverlay}>
            <p className="disabled-text">
              <LockIcon />
            </p>
          </div>
        </div>

        <div
          className="modal fade"
          id="choice-variants-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="myModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  {
                    this.props.resources.EditModelsPage
                      .SelectVariantsModelModalTitle
                  }
                </h4>
              </div>
              <div className="modal-body">
                <div>
                  <label>
                    <input
                      type="checkbox"
                      id="checkBoxAllVariants"
                      name="variants"
                      value="allVariantsU"
                      onClick={self.handleClickOnCheckbox}
                    />
                    <strong>
                      {this.props.resources.DeleteModelModal.ModalAllVariants}
                    </strong>
                  </label>
                  <br />
                  <br />
                </div>
                <p />
                <div className="variants-choices">{variantsSelection}</div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-second btn-grey"
                  data-dismiss="modal"
                >
                  {this.props.resources.EditModelsPage.CloseBtnLabel}
                </button>
                <button
                  type="button"
                  className="btn-second btn-blue"
                  onClick={this.validateUpload}
                >
                  {this.props.resources.EditModelsPage.SaveBtnLabel}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade"
          id="confirm-deletion-modal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="confirmationModal"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <CloseIcon />
                </button>
                <h4 className="modal-title" id="myModalLabel">
                  {this.props.resources.DeleteModelModal.ModalChoiceTitle}
                </h4>
              </div>
              <div className="modal-body">
                <div>
                  <label>
                    <input
                      type="checkbox"
                      id="checkBoxAllVariants"
                      name="variants"
                      value="allVariantsE"
                      onClick={self.handleClickOnCheckbox}
                    />
                    <strong>
                      {this.props.resources.DeleteModelModal.ModalAllVariants}
                    </strong>
                  </label>
                  <br />
                  <br />
                </div>
                <p />
                <div className="variants-choices">{variantsSelection}</div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-second btn-grey"
                  data-dismiss="modal"
                >
                  {this.props.resources.DeleteModelModal.CancelBtn}
                </button>

                <button
                  type="button"
                  className="btn-second btn-red"
                  onClick={this.deleteModel}
                >
                  {this.props.resources.DeleteModelModal.ConfirmBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
        <ModalManufacturerPublishingQuotaLimit
          showModalManufacturerPublishQuota={
            this.state.showModalManufacturerPublishQuota
          }
          manufacturerQuotaPublishVMList={
            this.state.manufacturerQuotaPublishVMList
          }
        />
      </div>
    );
  },
});

const mapStateToProps = (store) => {
  const { appState, setSubsetsState } = store;

  return {
    resources: appState.Resources[appState.Language],
    ready: typeof appState.Resources[appState.Language] !== "undefined",
    entityType: appState.EntityType,
    entityId: appState.EntityId,
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    RoleKey: appState.RoleKey,
    Languages: appState.Languages,
    Softwares: appState.Softwares,
    Language: appState.Language,
    IsBimAndCoAdmin: appState.IsBimAndCoAdmin,
    onflySubsets: selectAllSubsetsForDisplaySorted(store),
    updateSubsetTwoDModelReferenceSuccess:
      setSubsetsState.api.updateSubsetTwoDModelReference.success,
    updateSubsetThreeDModelReferenceSuccess:
      setSubsetsState.api.updateSubsetThreeDModelReference.success,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchAllSubsets: () => dispatch(fetchAllSubsetsAction()),
  updateSubsetTwoDModelReference: (
    bimObjectId,
    modelId,
    variantId,
    subsetsIds
  ) =>
    dispatch(
      updateSubsetTwoDModelReferenceAction(
        bimObjectId,
        modelId,
        variantId,
        subsetsIds
      )
    ),
  updateSubsetThreeDModelReference: (
    bimObjectId,
    modelId,
    variantId,
    subsetsIds
  ) =>
    dispatch(
      updateSubsetThreeDModelReferenceAction(
        bimObjectId,
        modelId,
        variantId,
        subsetsIds
      )
    ),
});

export default EditorStepModels = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorStepModels);
