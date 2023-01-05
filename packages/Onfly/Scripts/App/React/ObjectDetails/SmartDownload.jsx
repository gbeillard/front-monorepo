import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';

import _ from 'underscore';
import toastr from 'toastr';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Typography from '@material-ui/core/Typography';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';

const PROPERTY_DESIGNATION = 'Official_423';
const PADDING_BOTTOM = 20;

let SmartDownload = createReactClass({
  getInitialState() {
    return {
      data: null,
      allPropertiesSelected: false,
      step: 1,
      smproperties: [],
      smvariantshow: [],
      smvariants: [],
      smpropertiesgroup: [],
      update: false,
      scrollHorizontal: 0,
      scrollVertical: 0,
    };
  },

  componentDidMount() {
    store.dispatch({ type: 'GET_PROPERTIES_GROUP_LIST', token: this.props.TemporaryToken });
    this.loadPropertiesList();

    window.addEventListener('resize', this.resizeSmartDownload);
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeSmartDownload);
  },

  componentDidUpdate(prevProps, prevState) {
    const self = this;

    this.state.update = false;

    this.resizeSmartDownload(false);

    // Si l'étape a changé
    if (this.state.step != prevState.step) {
      this.scrollToCurrentStep(true);
    }

    if (prevProps.Language != this.props.Language) {
      this.refreshTablePropertiesSelect();
    }
  },

  refreshTablePropertiesSelect() {
    const self = this;
    const objSource = {
      datatype: 'json',
      datafields: [
        { name: 'ItemId', type: 'string' },
        { name: 'ParentId', type: 'string' },
        { name: 'TreeId', type: 'string' },
        { name: 'Id', type: 'int' },
        { name: 'PropertyId', type: 'int' },
        { name: 'Name', type: 'string' },
        { name: 'Domain', type: 'string' },
        { name: 'DomainId', type: 'int' },
        { name: 'Type', type: 'string' },
        { name: 'Unit', type: 'string' },
        { name: 'EditType', type: 'string' },
        { name: 'IsGroup', type: 'bool' },
        { name: 'PropertiesGroupFilter', type: 'string' },
        { name: 'PropertiesGroupIdFilter', type: 'string' },
        { name: 'Subsets', type: 'array' },
      ],
      hierarchy: {
        keyDataField: { name: 'ItemId' },
        parentDataField: { name: 'ParentId' },
      },
      id: 'TreeId',
      url: `${API_URL}/api/ws/v3/onfly/${this.props.ManagementCloudId}/bimobjects/${this.props.bimobjectId}/properties/grids/all/${this.props.Language}?token=${this.props.TemporaryToken}`,
    };
    const divId = `#detail-pdt-${this.props.bimobjectId}`;

    const dataAdapter = new $.jqx.dataAdapter(objSource, {
      loadComplete() {
        if ($(`${divId} #bimobject-properties-smart`).length > 0) {
          const rows = _.find(
            $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('getRows'),
            (item) => item.Id == 7
          );
          if (rows != undefined) {
            const item = _.find(rows.records, (item) => item.ItemId == 'OFFICIAL_PROPERTY_217');
            if (item != undefined) {
              self.state.update = true;
              $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('checkRow', item.ItemId);
              self.state.update = false;
            }
          }
          $(`${divId} #bimobject-properties-smart`)
            .jqxTreeGrid('getRows')
            .flatMap((x) => x.records)
            .forEach((item) => {
              if (item.Subsets.find((x) => self.props.selectedSubsets.has(x.Id))) {
                $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('checkRow', item.ItemId);
              }
            });
        }
      },
    });

    $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('destroy');
    $(`${divId} #bimobject-properties-smart`).jqxTreeGrid({
      width: '100%',
      filterMode: 'simple',
      selectionMode: 'custom',
      source: dataAdapter,
      altRows: false,
      sortable: false,
      pageable: false,
      checkboxes: true,
      filterable: true,
      enableHover: true,
      hierarchicalCheckboxes: true,
      localization: self.getLocalization(),
      columns: [
        {
          text: self.props.resources.BimObjectDetails.PropertiesTableDomainLabel,
          // width: 330,
          dataField: 'Domain',
          cellClassName: 'jqx-custom-cell',
          renderer(text, align, height) {
            if (self.state.allPropertiesSelected) {
              return `<div class="jqx-custom-header jqx-custom-header-properties"><div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all"><div class="jqx-tree-grid-checkbox-tick jqx-checkbox-check-checked"></div></span>${text}</div></div>`;
            }
            return `<div class="jqx-custom-header jqx-custom-header-properties"><div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all jqx-checkbox-all"></span>${text}</div></div>";`;
          },
        },
        { text: 'PropertiesGroupIdFilter', datafield: 'PropertiesGroupIdFilter', hidden: true },
        { text: 'PropertiesGroupFilter', datafield: 'PropertiesGroupFilter', hidden: true },
        {
          text: self.props.resources.BimObjectDetails.PropertiesTableNameLabel,
          // width: 470,
          dataField: 'Name',
          cellClassName: 'jqx-custom-cell',
          renderer(text, align, height) {
            return `<div class='jqx-custom-header'>${text}</div>`;
          },
          cellsrenderer(rowKey, dataField, value, data) {
            if (data.IsGroup) {
              return '';
            }
            return value;
          },
        },
        {
          text: self.props.resources.BimObjectDetails.PropertiesTableUnitLabel,
          // width: 280,
          dataField: 'Unit',
          cellClassName: 'jqx-custom-cell',
          renderer(text, align, height) {
            return `<div class='jqx-custom-header'>${text}</div>`;
          },
        },
        { text: 'IsGroup', dataField: 'IsGroup', hidden: true },
        { text: 'Type', dataField: 'Type', hidden: true },
        { text: 'Id', dataField: 'Id', hidden: true },
        { text: 'TreeId', dataField: 'TreeId', hidden: true },
      ],
    });

    $(`${divId} #bimobject-properties-smart`).on('click', '.jqx-checkbox-header', () => {
      switch (!self.state.allPropertiesSelected) {
        case true:
          var rows = $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('getRows');
          rows.forEach((item) => {
            $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('checkRow', item.ItemId);
          });

          self.selectAllPropertiesState('checked');

          break;

        case false:
          var rows = $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('getRows');
          rows.forEach((item) => {
            if (item.ItemId != 'OFFICIAL_PROPERTY_217') {
              $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('uncheckRow', item.ItemId);
            }
          });

          self.selectAllPropertiesState('unchecked');

          break;
      }

      $(
        $(`${divId} #bimobject-properties-smart #filterbimobject-properties-smart`).children()[0]
      ).css('margin-top', '0px');
    });

    $(`${divId} #bimobject-properties-smart`).on('rowCheck', (event) => {
      const { args } = event;
      const { row } = args;

      if (row.IsGroup == false) {
        const { smproperties } = self.state;
        const { smvariantshow } = self.state;

        if (_.find(smproperties, (item) => item.TreeId == row.TreeId) == undefined) {
          const property = { Property: `${row.Type}_${row.PropertyId}`, Name: row.Name };

          if (property.Property == PROPERTY_DESIGNATION) {
            // Insert designation
            smvariantshow.splice(1, 0, property);
          } else {
            smvariantshow.push(property);
          }

          smproperties.push({
            Type: row.Type,
            Id: row.Id,
            TreeId: row.TreeId,
            PropertyId: row.PropertyId,
          });

          self.setState({ smvariantshow, smproperties });

          self.selectAllPropertiesState(self.determineAllPropertiesState());
        }
      }
    });

    $(`${divId} #bimobject-properties-smart`).on('rowUncheck', (event) => {
      const { args } = event;
      const { row } = args;

      if (row.IsGroup == false) {
        if (row.PropertyId == 217) {
          setTimeout(() => {
            $(`${divId} #bimobject-properties-smart`).jqxTreeGrid('checkRow', row.ItemId);
          }, 1);
        } else {
          let { smproperties } = self.state;
          let { smvariantshow } = self.state;

          const variant = `${row.Type}_${row.PropertyId}`;
          smvariantshow = smvariantshow.filter((sm) => sm.Property != variant);
          const temp = smproperties.filter((item) => item.TreeId !== row.TreeId);
          smproperties = temp;

          self.setState({ smvariantshow, smproperties });

          self.selectAllPropertiesState(self.determineAllPropertiesState());
        }
      }
    });

    $(document).find("span[id^='jqxWidget']").hide();
  },

  selectAllPropertiesState(state) {
    const self = this;

    switch (state) {
      case 'checked':
        self.setState({ allPropertiesSelected: true });
        $('#bimobject-properties-smart .jqx-custom-header-properties').empty();
        $('#bimobject-properties-smart .jqx-custom-header-properties').append(
          '<div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all jqx-checkbox-all"><div class="jqx-tree-grid-checkbox-tick jqx-checkbox-check-checked"></div></span>Domain</div>'
        );
        break;

      case 'unchecked':
        self.setState({ allPropertiesSelected: false });
        $('#bimobject-properties-smart .jqx-custom-header-properties').empty();
        $('#bimobject-properties-smart .jqx-custom-header-properties').append(
          '<div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all jqx-checkbox-all"></span>Domain</div>'
        );
        break;

      case 'indeterminate':
        self.setState({ allPropertiesSelected: false });
        $('#bimobject-properties-smart .jqx-custom-header-properties').empty();
        $('#bimobject-properties-smart .jqx-custom-header-properties').append(
          '<div class="jqx-checkbox-header"><span class="jqx-tree-grid-checkbox jqx-tree-grid-indent jqx-checkbox-default jqx-fill-state-normal jqx-rc-all jqx-checkbox-all"><div class="jqx-tree-grid-checkbox-tick jqx-checkbox-check-indeterminate"></div></span>Domain</div>'
        );
        break;
    }
  },

  determineAllPropertiesState() {
    const rows = $('#bimobject-properties-smart').jqxTreeGrid('getRows');
    let countRows = 0;

    rows.forEach((item) => {
      countRows += item.records.length;
    });

    if (this.state.smproperties.length == countRows) {
      return 'checked';
    }
    if (this.state.smproperties.length == 0) {
      return 'unchecked';
    }
    return 'indeterminate';
  },

  getLocalization(isVariantGrid) {
    const Localizationobj = {};
    Localizationobj.filterSearchString = this.props.resources.GridMetaLabels.Search;
    if (isVariantGrid) {
      Localizationobj.emptydatastring = this.props.resources.GridMetaLabels.NoDataToShowVariant;
    } else {
      Localizationobj.emptydatastring = this.props.resources.GridMetaLabels.NoDataToShow;
    }
    return Localizationobj;
  },

  loadPropertiesList() {
    const self = this;

    fetch(
      `${API_URL}/api/ws/v2/onfly/${this.props.ManagementCloudId}/bimobjects/${this.props.bimobjectId}/variants/values/${this.props.modelId}/${this.props.Language}?token=${this.props.TemporaryToken}`,
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
        const variantList = _.sortBy(json, 'VariantId');

        const smvariants = [];

        // Sélection automatique de la variante
        if (variantList != null && self.props.selectedVariantId > 0) {
          const type =
            self.state.smproperties != null && self.state.smproperties.length > 0
              ? self.state.smproperties[0].Type
              : 'Official';
          smvariants.push({ Type: type, VariantId: self.props.selectedVariantId });
        }

        self.setState({ data: variantList, smvariants });
        if ($('#bimobject-properties-smart').length > 0) {
          self.refreshTablePropertiesSelect();
        }
      });
  },

  nextStep() {
    if (this.state.step == 1) {
      this.stepVariants();
    } else if (this.state.step == 2) {
      if (this.state.smvariants.length > 0) {
        this.createBundle();
      } else {
        toastr.warning(this.props.resources.BimObjectDetails.SelectVariantMessage);
      }
    }
  },

  previousStep() {
    if (this.state.step == 2) {
      this.stepProperties();
    }
  },

  stepProperties() {
    this.setState({ step: 1 });
  },

  stepVariants() {
    this.setState({ step: 2, update: this.state.step == 1 });
  },

  createBundle() {
    this.props.createBundle(
      this.props.modelId,
      this.state.smproperties,
      this.state.smvariants,
      this.state.smpropertiesgroup
    );
  },

  setPropertyGroup(id, name, subset, remove, searchGroup) {
    const subsetArray = subset.split('-');
    if (remove) {
      if (searchGroup) {
        this.state.smpropertiesgroup = _.filter(
          this.state.smpropertiesgroup,
          (group) => group.Id != id
        );
      } else {
        let deleteAllSubsets = false;
        // this.state.smpropertiesgroup = _.filter(this.state.smpropertiesgroup, (group) => group.Id == id && group.Subsets != subset);
        _.each(this.state.smpropertiesgroup, (group) => {
          if (group.Id == id && group.Subsets.includes(subsetArray[0])) {
            group.Subsets.splice(group.Subsets.indexOf(subsetArray[0]), 1);
            group.SubsetsFilter.splice(group.SubsetsFilter.indexOf(subset), 1);
            if (group.Subsets.length == 0) {
              deleteAllSubsets = true;
            }
          }
        });
        if (deleteAllSubsets) {
          this.state.smpropertiesgroup = _.filter(
            this.state.smpropertiesgroup,
            (group) => group.Id != id
          );
        }
      }
    } else {
      let groupFind = false;
      _.each(this.state.smpropertiesgroup, (group) => {
        if (searchGroup) {
          if (group.Id == id) {
            groupFind = true;
          }
        } else if (group.Id == id && !group.Subsets.includes(subsetArray[0])) {
          groupFind = true;
          group.Subsets.push(subsetArray[0]);
          group.SubsetsFilter.push(subset);
        }
      });
      if (!groupFind) {
        const subsets = [];
        subsets.push(subsetArray[0]);
        const subsetsFilter = [];
        subsetsFilter.push(subset);
        this.state.smpropertiesgroup.push({
          Id: id,
          Name: name,
          Subsets: subsets,
          SubsetsFilter: subsetsFilter,
        });
      }
    }

    var rows = $('#bimobject-properties-smart').jqxTreeGrid('getRows');
    rows.forEach((item) => {
      const { records } = item;
      records.forEach((r) => {
        if (r.ItemId != 'OFFICIAL_PROPERTY_217') {
          $('#bimobject-properties-smart').jqxTreeGrid('uncheckRow', r.ItemId);
        }
      });
    });
    var rows = $('#bimobject-properties-smart').jqxTreeGrid('getRows');
    const data = this.state.smpropertiesgroup;
    $.each(rows, (index, row) => {
      if (row != undefined) {
        $.each(data, (dIndex, d) => {
          let check = false;
          if (d != undefined) {
            const item = _.find(row.records, (item) => {
              if (
                item.PropertiesGroupIdFilter != null &&
                item.PropertiesGroupIdFilter.indexOf(`${d.Id}-${d.Name}`) != -1
              ) {
                $.each(d.SubsetsFilter, (index, sf) => {
                  if (
                    item.PropertiesGroupFilter != null &&
                    item.PropertiesGroupFilter.indexOf(sf) != -1
                  ) {
                    $('#bimobject-properties-smart').jqxTreeGrid('checkRow', item.ItemId);
                    check = true;
                  }
                });
              }
            });

            if (check) {
              $('#bimobject-properties-smart').jqxTreeGrid('expandRow', row.uid);
            }
          }
        });
      }
    });
  },

  handleSelectAllClick(event) {
    const self = this;

    const smvariants = [];

    if (event.currentTarget.checked) {
      const type =
        self.state.smproperties != null && self.state.smproperties.length > 0
          ? self.state.smproperties[0].Type
          : 'Official';

      _.each(self.state.data, (variant) => {
        smvariants.push({ Type: type, VariantId: variant.VariantId });
      });
    }

    this.setState({ smvariants });
  },

  isSelected(id) {
    return _.findIndex(this.state.smvariants, { VariantId: id }) !== -1;
  },

  selectVariant(event, id) {
    const variantIndex = _.findIndex(this.state.smvariants, { VariantId: id });

    const newSmvariants = this.state.smvariants;

    if (variantIndex !== -1) {
      newSmvariants.splice(variantIndex, 1);
    } else {
      const type =
        this.state.smproperties != null && this.state.smproperties.length > 0
          ? this.state.smproperties[0].Type
          : 'Official';

      newSmvariants.push({ Type: type, VariantId: id });
    }

    this.setState({
      smvariants: newSmvariants,
    });
  },

  onScrollTableBody(event) {
    const tableBody = document.querySelector(
      `#detail-pdt-${this.props.bimobjectId} #block-variants-table-body`
    );

    if (tableBody != null) {
      // Scroll horizontal
      if (this.state.scrollHorizontal != tableBody.scrollLeft) {
        document.querySelector(
          `#detail-pdt-${this.props.bimobjectId} #block-variants-table-header`
        ).scrollLeft = tableBody.scrollLeft;
        this.state.scrollHorizontal = tableBody.scrollLeft;
      }
      // Scroll vertical
      else if (this.state.scrollVertical != tableBody.scrollTop) {
        document.querySelector(
          `#detail-pdt-${this.props.bimobjectId} #block-variants-table-body-checkbox`
        ).scrollTop = tableBody.scrollTop;

        this.state.scrollVertical = tableBody.scrollTop;
      }
    }
  },

  resizeSmartDownload(keepScrollStep = true) {
    const PADDING_BOTTOM = 20;
    const parentSelector = `#detail-pdt-${this.props.bimobjectId}`;
    const smartDownloadHeight =
      document.documentElement.offsetHeight - document.getElementById('page-wrapper').offsetTop;
    const SDContainerHeight = document.querySelector(
      `${parentSelector} #smart-download-container`
    ).offsetHeight;
    let SDContentHeight = document.querySelector(
      `${parentSelector} #smart-download-content`
    ).offsetHeight;
    const SDContentMinHeight = parseInt(
      $(`${parentSelector} #smart-download-content`).css('min-height'),
      10
    );

    SDContentHeight = smartDownloadHeight - (SDContainerHeight - SDContentHeight) - PADDING_BOTTOM;

    const inputObjectSearch = document.getElementById('input-object-search');

    if (inputObjectSearch != null) {
      SDContentHeight -= inputObjectSearch.offsetHeight + PADDING_BOTTOM;
    }

    if (SDContentHeight < SDContentMinHeight) {
      SDContentHeight = SDContentMinHeight;
    }

    // Set height of content
    document.querySelector(
      `${parentSelector} #smart-download-content`
    ).style.height = `${SDContentHeight}px`;

    switch (this.state.step) {
      case 1:
        const propertiesGroupSDLHeight =
          document.querySelector(`${parentSelector} .properties-groups-list`).offsetHeight +
          parseInt($(`${parentSelector} .properties-groups-list`).css('margin-bottom'), 10);
        document.querySelector(
          `${parentSelector} #bimobject-properties-smart-container`
        ).style.height = `${SDContentHeight - propertiesGroupSDLHeight}px`;
        break;
      case 2:
        this.resizeTableHeaderVariants();

        const downloadContentMessage = document.querySelector(
          `${parentSelector} #download-content-message`
        );
        const blockVariantsTableHeader = document.querySelector(
          `${parentSelector} #block-variants-table-header`
        );

        if (blockVariantsTableHeader != null && downloadContentMessage != null) {
          const othersHeight =
            blockVariantsTableHeader.offsetHeight + downloadContentMessage.offsetHeight;

          document.querySelector(`${parentSelector} #block-variants-table-body`).style.height = `${SDContentHeight - othersHeight
            }px`;
          document.querySelector(
            `${parentSelector} #block-variants-table-body-checkbox`
          ).style.height = `${SDContentHeight - othersHeight}px`;
        }
        break;
    }

    if (keepScrollStep) {
      this.scrollToCurrentStep(false);
    }
  },

  scrollToCurrentStep(animated) {
    const parentSelector = `#detail-pdt-${this.props.bimobjectId}`;
    let leftStep = 0;

    leftStep -=
      document.querySelector(`${parentSelector} #smart-download-content`).offsetWidth *
      (this.state.step - 1);

    document.querySelector(`${parentSelector} #step-container`).style.transition = animated
      ? '1s'
      : '0s';
    document.querySelector(`${parentSelector} #step-container`).style.left = `${leftStep}px`;
  },

  resizeTableHeaderVariants() {
    const parentSelector = `#detail-pdt-${this.props.bimobjectId}`;

    _.each(this.state.smvariantshow, (property) => {
      const cell = document.querySelector(
        `${parentSelector} .table-cell-body-${property.Property}`
      );

      if (cell != null) {
        document.querySelector(
          `${parentSelector} #table-cell-head-${property.Property}`
        ).style.width = `${cell.offsetWidth}px`;
      } else {
        document.querySelector(
          `${parentSelector} #table-cell-head-${property.Property}`
        ).style.width = '249px';
      }
    });
  },

  render() {
    const self = this;
    let classBtnPrevStep = 'hidden';
    let currentStep1 = '';
    let currentStep2 = '';

    if (this.state.step == 1) {
      currentStep1 = 'current';
    } else if (this.state.step == 2) {
      currentStep2 = 'current';
      classBtnPrevStep = '';
    }

    let classOverlay = 'overlay';
    let classDivSmartDownload = 'download-wizard download-disabled';

    if (_isPlugin) {
      classOverlay = 'overlay hidden';
      classDivSmartDownload = 'download-wizard';
    }

    /* const buttons = this.props.PropertiesGroupList.map((option, index) => {
      if (option.Tags != null && option.Tags.length > 0) {
          return <MenuPropertiesGroup key={`menu-properties-group-${option.Id}`} Tags={option.Tags} Name={option.Name} Id={option.Id} setPropertyGroup={this.setPropertyGroup} />;
      }
      return <MenuPropertiesGroupWithoutTag key={`menu-properties-group-${option.Id}`} Name={option.Name} Id={option.Id} setPropertyGroup={this.setPropertyGroup} />;
    }); */

    let variantsTable;

    if (this.state.data != null) {
      const nbVariantSelected = this.state.smvariants.length;
      const nbTotalVariant = this.state.data.length;

      const columns = this.state.smvariantshow.map((property, index) => (
        <TableCell
          key={`column-${property.Property}`}
          id={`table-cell-head-${property.Property}`}
          align="left"
        >
          {property.Name}
        </TableCell>
      ));

      const rows = this.state.data.map((variant, index) => (
        <TableRowVariant
          key={`row-variant-${variant.VariantId}`}
          Variant={variant}
          SMVariantShow={self.state.smvariantshow}
          IsSelected={self.isSelected}
          SelectVariant={self.selectVariant}
          Update={self.state.update}
          Index={index}
          OtherTableBlock="block-variants-table-body-checkbox"
        />
      ));

      const rowsCheckBox = this.state.data.map((variant, index) => (
        <TableRowVariant
          key={`row-variant-${variant.VariantId}`}
          Variant={variant}
          IsSelected={self.isSelected}
          SelectVariant={self.selectVariant}
          Update={self.state.update}
          IsCheckBox
          Index={index}
          OtherTableBlock="block-variants-table-body"
        />
      ));

      variantsTable = (
        <div id="bimobject-variants-smart">
          <div id="variants-table-header-container">
            <div id="block-variants-table-header-checkbox">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell id="table-cell-head-checkbox" padding="checkbox">
                      <Checkbox
                        id="checkbox-variants-all"
                        indeterminate={nbVariantSelected > 0 && nbVariantSelected < nbTotalVariant}
                        checked={nbVariantSelected === nbTotalVariant}
                        onChange={self.handleSelectAllClick}
                      />
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </div>
            <div id="block-variants-table-header">
              <div>
                <Table>
                  <TableHead>
                    <TableRow>{columns}</TableRow>
                  </TableHead>
                </Table>
              </div>
              <div className="cale-container">
                <div className="cale" />
              </div>
            </div>
          </div>
          <div id="variants-table-body-container">
            <div id="block-variants-table-body-checkbox">
              <Table>
                <TableBody>{rowsCheckBox}</TableBody>
              </Table>
            </div>
            <div id="block-variants-table-body" onScroll={self.onScrollTableBody}>
              <Table>
                <TableBody>{rows}</TableBody>
              </Table>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div id="smart-download-container" className="panel-smart-download no-deploy-card">
        <div id="smart-download-heading" className="panel-heading">
          <Button
            variant="contained"
            size="small"
            className="btn-raised no-deploy-card"
            onClick={this.props.cancelSmartDownload}
          >
            {this.props.resources.MetaResource.Back}
          </Button>
          <h4>Smart Download :{this.props.modelName}</h4>
        </div>
        <div className="panel-body">
          <div id="dvSmartDownload" className={classDivSmartDownload}>
            <div id="smart-download-step-content" className="step-content">
              <div className="stepwizard-row">
                <div className="stepwizard-step" onClick={this.stepProperties}>
                  <span className={`btn btn-default btn-circle btn-lg ${currentStep1}`}>1</span>
                  <p>{this.props.resources.BimObjectDetails.DownloadModalWizardStepTwo}</p>
                </div>
                <div className="stepwizard-step" onClick={this.stepVariants}>
                  <span className={`btn btn-default btn-circle btn-lg ${currentStep2}`}>2</span>
                  <p>{this.props.resources.BimObjectDetails.DownloadModalWizardStepThree}</p>
                </div>
              </div>
            </div>

            <div id="smart-download-content">
              <div id="step-container">
                <div id="step-one-container" className="step">
                  <ul className="properties-groups-list">{/* {buttons} */}</ul>
                  <div id="bimobject-properties-smart-container">
                    <div id="bimobject-properties-smart" />
                  </div>
                </div>
                <div id="step-two-container" className="step">
                  <div id="download-content-message">
                    <Typography variant="subtitle1">
                      {`${this.props.resources.BimObjectDetails.DownloadModalFinalContains} `}
                      <span id="props-count" className="count-blue">
                        {this.state.smproperties.length}
                      </span>
                      {` ${this.props.resources.BimObjectDetails.DownloadModalFinalProperties}`}{' '}
                      {`${this.props.resources.BimObjectDetails.DownloadModalFinalAnd} `}
                      <span id="variants-count" className="count-blue">
                        {this.state.smvariants.length}
                      </span>
                      {` ${this.props.resources.BimObjectDetails.DownloadModalFinalVariants}`}
                    </Typography>
                  </div>
                  {variantsTable}
                </div>
              </div>
            </div>

            <div id="smart-download-button-step" className="row">
              <div className="col-xs-11 text-right">
                <Button
                  variant="contained"
                  onClick={this.previousStep}
                  className={`btn-raised ${classBtnPrevStep}`}
                  style={{ marginTop: `${15}px` }}
                >
                  <KeyboardArrowLeftIcon />{' '}
                  {this.props.resources.EditionWizardNavigation.PrevButton}
                </Button>
              </div>
              <div className="col-xs-11 col-xs-offset-1">
                {this.state.step == 2 ? (
                  <Button
                    variant="contained"
                    onClick={this.nextStep}
                    className="btn-raised"
                    style={{ marginTop: `${15}px` }}
                  >
                    {this.props.resources.BimObjectDetailsModels.DownloadLabel}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={this.nextStep}
                    className="btn-raised"
                    style={{ marginTop: `${15}px` }}
                  >
                    {this.props.resources.EditionWizardNavigation.NextButton}
                    <KeyboardArrowRightIcon className="no-deploy-card" />
                  </Button>
                )}
              </div>
            </div>
            <div className={classOverlay}>
              <p className="disabled-text">
                {this.props.resources.BimObjectDetails.DownloadSmartDownloadLabel}
                <br />
                <br />
                <Button
                  variant="contained"
                  size="large"
                  id="smart-download-request"
                  className="btn-raised no-deploy-card"
                  href={`${this.props.PlatformUrl}/${this.props.Language}/bimandco-plugins/trackdownload?type=Revit`}
                  target="_blank"
                >
                  {this.props.resources.BimObjectDetails.DownloadPlugin}
                </Button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

const TableRowVariant = createReactClass({
  getInitialState() {
    return {
      isSelected: this.props.IsSelected(this.props.Variant.VariantId),
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.isSelected != nextState.isSelected || nextProps.Update;
  },

  componentWillReceiveProps(nextProps) {
    const isSelected = nextProps.IsSelected(nextProps.Variant.VariantId);

    if (this.state.isSelected != isSelected) {
      this.setState({ isSelected });
    }
  },

  handleClick(event, id) {
    this.setState({ isSelected: !this.state.isSelected });

    this.props.SelectVariant(event, id);
  },

  onMouseEnterTableRowVariant() {
    document
      .querySelector(`#${this.props.OtherTableBlock} table tr:nth-child(${this.props.Index + 1})`)
      .classList.add('is-hover');
  },

  onMouseLeaveTableRowVariant() {
    document
      .querySelector(`#${this.props.OtherTableBlock} table tr:nth-child(${this.props.Index + 1})`)
      .classList.remove('is-hover');
  },

  render() {
    const self = this;

    const variant = self.props.Variant;
    const { isSelected } = self.state;
    const NB_MAX_CARACTERES_CELL = 49;

    let cells;
    if (self.props.SMVariantShow != null) {
      cells = self.props.SMVariantShow.map((property, index) => {
        let cellContent;
        const cellClass = `table-cell-body-${property.Property}`;
        let propertyContainerClass = 'property-container';

        if (property.Property == PROPERTY_DESIGNATION) {
          propertyContainerClass += ' property-designation-container';
        }

        if (isSelected) {
          propertyContainerClass += ' selected';
        }

        cellContent = (
          <div className={propertyContainerClass}>
            <span>{variant[property.Property]}</span>
            <Tooltip
              title={variant[property.Property]}
              enterDelay={200}
              placement="left"
              TransitionComponent={Zoom}
            >
              <span className="ellipsis">...</span>
            </Tooltip>
          </div>
        );

        return (
          <TableCell
            key={`variant-${variant.VariantId}-cell-${property.Property}`}
            className={cellClass}
            align="left"
          >
            {cellContent}
          </TableCell>
        );
      });
    }

    let rowContent;

    if (this.props.IsCheckBox) {
      rowContent = (
        <TableCell
          className={`table-cell-body-checkbox ${isSelected ? 'selected' : ''}`}
          padding="checkbox"
        >
          <Checkbox checked={isSelected} />
        </TableCell>
      );
    } else {
      rowContent = cells;
    }

    return (
      <TableRow
        hover
        role="checkbox"
        aria-checked={isSelected}
        selected={isSelected}
        onClick={(event) => self.handleClick(event, variant.VariantId)}
        onMouseEnter={self.onMouseEnterTableRowVariant}
        onMouseLeave={self.onMouseLeaveTableRowVariant}
      >
        {rowContent}
      </TableRow>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;
  const { propertiesGroupState } = store;

  return {
    resources:
      appState.Resources[appState.Language] != null ? appState.Resources[appState.Language] : [],
    TemporaryToken: appState.TemporaryToken,
    Language: appState.Language,
    PropertiesGroupList:
      propertiesGroupState.GroupsList != null ? propertiesGroupState.GroupsList : [],
    PlatformUrl: appState.PlatformUrl,
    Settings: appState.Settings,
    ManagementCloudId: appState.ManagementCloudId,
  };
};

export default SmartDownload = connect(mapStateToProps)(SmartDownload);