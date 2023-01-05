import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import { connect } from 'react-redux';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Popover from '@material-ui/core/Popover';
import SearchBox from './Searchbox';
import FilterBar from './FilterBar';
import FilterSuggest from './FilterSuggest';
import FilterPanel from './FilterPanel';
import store from '../../Store/Store';
import * as Utils from '../../Utils/utils';
import * as SearchApi from '../../Api/SearchApi';

import { selectIsBoostOffer, selectDisplayName } from '../../Reducers/app/selectors';
import { withRouter } from '../../Utils/withRouter';

let SearchHeader = createReactClass({
  getInitialState() {
    return {
      newKeyWord: '',
      contextRequest: this.props.contextRequest != null ? this.props.contextRequest : [],
      menuAnchor: null,
      anchorPopoverAdvancedSearch: null,
      reset: false,
      selectedClassificationNode: null,
    };
  },

  componentDidMount() {
    window.addEventListener('keypress', this.onKeyPressAdvancedFilter, false);
  },

  componentWillMount() {
    this.state.newKeyWord = this.props.request.SearchValue.Value;
  },

  componentWillUnmount() {
    window.removeEventListener('keypress', this.onKeyPressAdvancedFilter, false);
  },

  componentWillReceiveProps(nextProps) {
    this.state.newKeyWord = nextProps.request.SearchValue.Value;

    if (
      nextProps.contextRequest != null &&
      this.state.contextRequest != undefined &&
      nextProps.contextRequest.length != this.state.contextRequest.length
    ) {
      this.state.contextRequest = nextProps.contextRequest;
    }
  },

  componentDidUpdate() {
    this.state.reset = false;
  },

  onKeyPressAdvancedFilter(event) {
    if (
      event.keyCode == 13 &&
      event.target.localName != 'input' &&
      event.target.localName != 'textarea'
    ) {
      if (this.state.anchorPopoverAdvancedSearch) {
        this.hideFilter();
      } else {
        this.displayFilter();
      }
    }
  },

  changeKeyword(event) {
    const self = this;

    const keyword = event.target.value;

    this.state.newKeyWord = keyword;

    setTimeout(() => {
      if (self.state.newKeyWord == keyword) {
        const newRequest = self.props.request;
        newRequest.LanguageCode = self.props.language;
        newRequest.SearchPaging = { From: 0, Size: self.props.size };
        newRequest.SearchValue = { Value: keyword };
        if (keyword != '') {
          newRequest.SearchSorting = { Name: '', Order: '' };
        } else {
          newRequest.SearchSorting = { Name: 'CreatedAt', Order: 'Desc' };
        }
        SearchApi.search(
          newRequest,
          self.props.contextRequest,
          self.props.managementCloudId,
          self.props.TemporaryToken
        );
        window.scroll(0, 0);
      }
    }, 500);
  },

  displayFilter() {
    this.openPopoverAdvancedSearch();

    $('.table-manage-object').addClass('filterbar-opacity');
    $('#container-result').addClass('filterbar-opacity');
    $('.searchbar').addClass('filterbar-opacity');
  },

  hideFilter() {
    const inputsearchsimple = document.getElementById('inputsearchsimple');
    const inputsearchglobal = document.getElementById('inputsearchglobal');

    if (inputsearchsimple != null && inputsearchglobal != null) {
      inputsearchsimple.value = inputsearchglobal.value;
    }

    $('.table-manage-object').removeClass('filterbar-opacity');
    $('#container-result').removeClass('filterbar-opacity');
    $('.searchbar').removeClass('filterbar-opacity');

    if (this.props.refreshCardOpacity != null) {
      this.props.refreshCardOpacity();
    }

    this.closePopoverAdvancedSearch();
  },

  parseClassificationChildren(branch) {
    const self = this;
    const { children } = branch;
    if (children !== undefined && children.length > 0) {
      _.each(children, (c) => {
        self.parseClassificationChildren(c);
      });
    }
    this.classificationChildren.push(branch.id);
  },

  buildNewSearchContainer(staticFilters) {
    const self = this;
    const newSearchContainer = JSON.parse(
      JSON.stringify(this.props.initialRequest.SearchContainerFilter)
    );
    _.mapObject(staticFilters, (value, key) => {
      const newObj = {};
      let originalType = 'ValueContainerFilter';
      const isDate = false;
      let alias = key;

      if (key === 'Manufacturers') {
        newObj.Property = 'ManufacturerManagementCloud';
      } else if (key === 'Companies') {
        newObj.Property = 'Company.Name';
      } else if (key === 'Classifications') {
        newObj.Property = 'Classifications.Id';
      } else if (key === 'Pins') {
        newObj.Property = 'Pins.Name_raw';
      } else if (key === 'Status') {
        newObj.Property = 'ManagementClouds.Status';
      } else if (key === 'Lod') {
        newObj.Property = 'Lod';
        originalType = 'RangeContainerFilter';
      } else if (key === 'ObjectType') {
        newObj.Property = 'ObjectTypeManagementCloud';
        alias = newObj.Property;
      } else {
        newObj.Property = key;
      }

      if (originalType === 'ValueContainerFilter') {
        if (key != 'Classifications') {
          newObj.Alias = alias;
          newObj.Values = _.pluck(_.where(value, { IsChecked: true }), 'Name');
        } else if (key === 'Classifications') {
          newObj.Alias = alias;
          newObj.Values = _.pluck(_.where(value, { IsChecked: true }), 'Value');
          newObj.Values = newObj.Values.concat(self.classificationChildren);
        }

        // Création d'un nouvel objet de typeContainer de filtre
        // Ajout de l'objet filtre à l'objet typeContainer
        if (newObj.Values.length > 0) {
          if (newSearchContainer[originalType] == null) {
            newSearchContainer[originalType] = [];
          }
          newSearchContainer[originalType].push(newObj);
        }
      } else if (originalType === 'RangeContainerFilter') {
        const min = _.pluck(_.where(value, { IsChecked: true }), 'Min');
        const max = _.pluck(_.where(value, { IsChecked: true }), 'Max');
        if (newSearchContainer[originalType] == null) {
          newSearchContainer[originalType] = [];
        }

        if (min.length > 0 && max.length > 0) {
          const newFrom = min[0];
          const newTo = max[0];

          const rangeItem = {
            From: newFrom,
            To: newTo,
          };

          if (newFrom != null) {
            newObj.isDate = isDate;
            newObj.Range = rangeItem;
            newObj.Alias = key;

            newSearchContainer[originalType].push(newObj);
          }
        }
      }
    });
    return newSearchContainer;
  },

  handleClassificationRequest(event, obj) {
    if (obj.id != null) {
      const self = this;
      let temp = $(event.currentTarget)
        .closest('.modal-panel')
        .find('nav li')
        .index($(event.currentTarget).closest('.modal-panel').find('nav li.active'));

      let li = $($(event.currentTarget).closest('.jqx-tree-item-li'));
      let parent = li.closest('.treeview');
      let isRoot = parent.hasClass('root');
      const indexes = [];
      while (!isRoot) {
        indexes.push(parent.parent().find('.treeview').index(parent));
        li = parent.parent();
        parent = li.closest('.treeview');
        isRoot = parent.hasClass('root');
      }

      const leaf = $(li.find('span')[1]).data('value');

      temp = obj.classificationLeafs.find((l) => parseInt(l.id, 10) === leaf);

      let selected = temp;
      for (let i = indexes.length - 1; i >= 0; i--) {
        selected = selected.children[indexes[i]];
      }

      this.classificationChildren = [];

      const { children } = selected;
      if (children != undefined && children.length > 0) {
        _.each(children, (c) => {
          self.parseClassificationChildren(c);
        });
      }
    } else {
      this.classificationChildren = [];
    }

    this.handleRequest(event, true);
  },

  handleOpenLibMenu(event) {
    this.setState({ menuAnchor: event.currentTarget });
  },

  handleCloseLibMenu() {
    this.setState({ menuAnchor: null });
  },

  handleRequest(event, hasEvent = true, isChip = false) {
    const self = this;
    let typeFilter = '';
    let alias = '';
    let isChecked;
    let isDate = false;
    let min;
    let max;
    let value;
    let property;

    // Initialisation des variables nécessaires
    if (hasEvent) {
      if (isChip) {
        property = event.currentTarget.parentElement.dataset.property;
        alias = property.split('.').length > 0 ? property.split('.')[0] : property;
        if (property === 'ManufacturerManagementCloud') {
          alias = 'Manufacturers';
        }

        value = event.currentTarget.parentElement.dataset.value;
        isChecked = event.currentTarget.parentElement.dataset.checked;
        typeFilter = event.currentTarget.parentElement.dataset.kindfilter;
      } else {
        property = event.currentTarget.dataset.property;
        alias = property.split('.').length > 0 ? property.split('.')[0] : property;
        if (property === 'ManufacturerManagementCloud') {
          alias = 'Manufacturers';
        }

        value = event.currentTarget.dataset.value;
        isChecked = event.currentTarget.dataset.checked;
        typeFilter = event.currentTarget.dataset.kindfilter;

        if (typeFilter === 'RangeContainerFilter') {
          min = event.currentTarget.dataset.from;
          max = event.currentTarget.dataset.to;
          if (
            event.currentTarget.dataset.isdate != undefined &&
            event.currentTarget.dataset.isdate != null
          ) {
            isDate = event.currentTarget.dataset.isdate;
          }
        }
      }
    } else {
      property = event.input[0].dataset.property;
      alias = property.split('.')[0];
      if (property === 'ManufacturerManagementCloud') {
        alias = 'Manufacturers';
      }
      min = event.from;
      max = event.to;
      isChecked = event.isChecked;
      typeFilter = '';
      if (
        event.input[0].dataset.kindfilter != undefined &&
        event.input[0].dataset.kindfilter != null
      ) {
        typeFilter = event.input[0].dataset.kindfilter;
      }
    }

    // Evite le problème d'une property name différente de son alias
    let type = 'ValueContainerFilter';
    if (typeFilter == 'InputContainerFilter') {
      type = 'InputContainerFilter';
    } else if (typeFilter == 'RangeContainerFilter') {
      type = 'RangeContainerFilter';
    }

    const newSearchContainer = self.buildNewSearchContainer(self.props.staticFilters);

    // Pour les filtres statiques
    if (alias != 'Properties') {
      // Le filtre est selectionné
      if (isChecked == 'true' || isChecked == true) {
        let added = false;
        const rangeItem = {
          From: min,
          To: max,
        };

        // Si le typeContainer n'existe pas, le filtre non plus
        if (newSearchContainer[type] == null) {
          newSearchContainer[type] = [];
          let newPropertyObject;
          if (type === 'InputContainerFilter') {
            newPropertyObject = {
              Property: property,
              Alias: alias,
              Value: value,
            };
          } else if (type === 'RangeContainerFilter') {
            newPropertyObject = {
              Property: property,
              Alias: alias,
              Range: rangeItem,
              isDate,
            };
          } else {
            newPropertyObject = {
              Property: property,
              Alias: alias,
              Values: [value],
            };
          }

          if (alias === 'Classifications') {
            newPropertyObject.Values = newPropertyObject.Values.concat(self.classificationChildren);
          }

          newSearchContainer[type].push(newPropertyObject);
          added = true;
        }

        // Si le filtre n'a pas été ajouté, on le rajoute au typeContainer correspondant
        if (!added) {
          _.each(newSearchContainer[type], (filters) => {
            if (filters.Alias === alias) {
              if (type === 'ValueContainerFilter') {
                if (alias === 'Classifications') {
                  filters.Values = [];
                }

                // Si la valeur n'est pas déjà présente dans le filtre
                if (filters.Values != null && filters.Values.indexOf(value) == -1) {
                  filters.Values.push(value);
                }

                if (alias === 'Classifications') {
                  filters.Values = filters.Values.concat(self.classificationChildren);
                }
              } else if (type === 'InputContainerFilter') {
                filters.Value = value;
              } else if (type === 'RangeContainerFilter') {
                filters.Range = rangeItem;
              }

              added = true;
            }
          });
        }

        if (!added) {
          let newPropertyObject;
          if (type === 'InputContainerFilter') {
            newPropertyObject = {
              Property: property,
              Alias: alias,
              Value: value,
            };
          } else if (type === 'RangeContainerFilter') {
            newPropertyObject = {
              Property: property,
              Alias: alias,
              Range: rangeItem,
              isDate,
            };
          } else {
            newPropertyObject = {
              Property: property,
              Alias: alias,
              Values: [value],
            };
          }

          if (alias === 'Classifications') {
            newPropertyObject.Values = newPropertyObject.Values.concat(self.classificationChildren);
          }
          newSearchContainer[type].push(newPropertyObject);
        }
      }
      // Le filtre est déselectionné
      else if (isChecked === 'false' || isChecked === false) {
        // Suppresion de la valeur du filtre
        let array = newSearchContainer[type];

        if (array === undefined) {
          array = [];
        }

        for (let i = 0; i < array.length; i += 1) {
          if (array[i].Property === property) {
            if (alias === 'Classifications') {
              array[i].Values = [];
            } else if (type === 'InputContainerFilter') {
              array[i].Value = '';
            } else if (type === 'RangeContainerFilter') {
              array[i].Range = [];
            } else {
              const arrValues = array[i].Values;
              const newArray = _.without(arrValues, value);
              array[i].Values = newArray;
            }
          }
        }

        // Si le filtre est désormais vide, on le supprime également
        if (newSearchContainer[type] != undefined) {
          for (let i = 0; i < newSearchContainer[type].length; i++) {
            if (type == 'InputContainerFilter') {
              if (newSearchContainer[type][i].Value.length == 0) {
                newSearchContainer[type] = _.without(
                  newSearchContainer[type],
                  newSearchContainer[type][i]
                );
              }
            } else if (type == 'RangeContainerFilter') {
              if (newSearchContainer[type][i].Range.length == 0) {
                newSearchContainer[type] = _.without(
                  newSearchContainer[type],
                  newSearchContainer[type][i]
                );
              }
            } else if (newSearchContainer[type][i].Values.length == 0) {
              newSearchContainer[type] = _.without(
                newSearchContainer[type],
                newSearchContainer[type][i]
              );
            }
          }
          // Si le typeContainer est désormais vide, on le supprime également
          if (newSearchContainer[type][0] == null) {
            delete newSearchContainer[type];
          }
        }
      }
    }

    this.launchRequest(newSearchContainer);
  },

  launchRequest(newSearchContainer) {
    // Mise à jour de la requete
    const newRequest = this.props.request;
    newRequest.SearchContainerFilter = newSearchContainer;
    newRequest.SearchPaging = { From: 0, Size: this.props.size };
    newRequest.LanguageCode = this.props.language;
    SearchApi.search(
      newRequest,
      this.props.contextRequest,
      this.props.managementCloudId,
      this.props.TemporaryToken
    );
  },

  changeContextRequest(event) {
    store.dispatch({ type: 'LOADER', state: true });

    const self = this;
    const context = event.currentTarget.dataset.value;
    let newContext = self.state.contextRequest;
    const currentCheck = Boolean(event.currentTarget.dataset.checked);

    event.currentTarget.checked = currentCheck;

    // if click on the only selected => do nothing (we can't unselect all)
    if (newContext.length === 1 && newContext.indexOf(context) > -1) {
      store.dispatch({ type: 'LOADER', state: false });
      return;
    }

    // if click "all" when all checked => only onfly library
    if (context === 'all' && newContext.length === 4) {
      newContext = ['library'];
    } else if (context === 'all' && currentCheck) {
      newContext = ['public', 'library', 'personal'];
      if (this.props.Settings.HasPrivateSite) {
        newContext.push('entity');
      }
    } else if (
      this.state.contextRequest.length > 1 &&
      _.indexOf(this.state.contextRequest, context) !== -1
    ) {
      newContext = _.without(this.state.contextRequest, context);
    } else if (_.indexOf(this.state.contextRequest, context) === -1) {
      newContext.push(context);
    } else {
      newContext = ['public', 'library', 'personal'];
      if (this.props.Settings.HasPrivateSite) {
        newContext.push('entity');
      }
      event.currentTarget.checked = true;
    }

    const newRequest = this.props.request;
    newRequest.SearchPaging = {
      From: 0,
      Size: 16,
    };
    newRequest.LanguageCode = this.props.Language;
    Utils.setCookie('libraries', newContext, 3650);

    this.setState({ contextRequest: newContext.concat() });
    setTimeout(() => {
      SearchApi.search(
        newRequest,
        newContext,
        self.props.managementCloudId,
        self.props.TemporaryToken
      );
    }, 250);
  },

  handleReset(event) {
    this.state.newKeyWord = '';
    const newRequest = JSON.parse(JSON.stringify(this.props.initialRequest));
    const isManage = this.props.IsManage == true;

    $('#searchglobal input').val('');
    $('#simple-filters-container input').val('');

    newRequest.SearchValue = { Value: '' };
    newRequest.SearchContainerDynamicFilter = [];
    newRequest.SearchContainerFilter = {};
    newRequest.LanguageCode = this.props.Language;

    if (isManage) {
      newRequest.IsManage = true;
    }

    if (this.props.params.groupId > 0) {
      newRequest.GroupId = this.props.params.groupId;
    }

    if (this.state.selectedClassificationNode != null) {
      this.state.selectedClassificationNode.Id = null;
      this.state.selectedClassificationNode.Name = '';
    }

    this.state.reset = true;

    SearchApi.search(
      newRequest,
      this.props.contextRequest,
      this.props.managementCloudId,
      this.props.TemporaryToken
    );
    if (!isManage) {
      store.dispatch({ type: `OPEN_OBJECT_CARD${this.props.SearchContextAction}`, data: 0 });
    }

    this.hideFilter();

    window.scroll(0, 0);
  },

  removeFilterTag(event) {
    this.handleRequest(event, true, true);
  },

  openPopoverAdvancedSearch() {
    const simpleFiltersContainer = document.getElementById('simple-filters-container');

    if (simpleFiltersContainer != null) {
      this.setState({ anchorPopoverAdvancedSearch: simpleFiltersContainer });
    }
  },

  closePopoverAdvancedSearch() {
    this.setState({ anchorPopoverAdvancedSearch: null });
  },

  onEnterPopoverAdvancedSearch() {
    // repeat element already set
    const currentSearch = this.state.newKeyWord;
    const inputsearchglobal = document.getElementById('inputsearchglobal');

    if (inputsearchglobal != null) {
      inputsearchglobal.value = currentSearch;
    }
  },

  changeSelectedClassification(classificationNode) {
    // Permet de lié les deux filtres des classifications
    this.setState({ selectedClassificationNode: classificationNode });
  },

  render() {
    const self = this;

    let librarySelect;
    let searchHeaderClassifClass = 'search-header-classif';

    if (this.props.params.groupId > 0) {
      searchHeaderClassifClass = 'search-header-classif';
    } else {
      librarySelect = (
        <div className="search-header-libraries">
          <FormControl
            className={this.state.isOpen ? 'filters-libraries open' : 'filters-libraries'}
            fullWidth
          >
            <button
              data-toggle="dropdown"
              className="dropdown-toggle"
              onClick={self.handleOpenLibMenu}
            >
              {`${self.props.resources.ContentManagement.SelectLibraries} (${self.state.contextRequest != undefined ? self.state.contextRequest.length : ''
                })`}
              <hr aria-hidden="true" />
            </button>

            <Menu
              id="materialv1menu"
              open={Boolean(self.state.menuAnchor)}
              anchorEl={self.state.menuAnchor}
              onClose={self.handleCloseLibMenu}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              style={{ margin: '14px 0 0 -18px' }}
            >
              <MenuItem
                data-value="all"
                data-checked={
                  (self.state.contextRequest.length === 3 && !this.props.Settings.HasPrivateSite) ||
                  (self.state.contextRequest.length == 4 && this.props.Settings.HasPrivateSite)
                }
                onMouseDown={self.changeContextRequest}
              >
                <Checkbox
                  checked={
                    (self.state.contextRequest.length === 3 &&
                      !this.props.Settings.HasPrivateSite) ||
                    (self.state.contextRequest.length == 4 && this.props.Settings.HasPrivateSite)
                  }
                />
                <ListItemText primary={self.props.resources.ContentManagement.AllLibrary} />
              </MenuItem>
              <MenuItem
                data-value="personal"
                data-checked={self.state.contextRequest.indexOf('personal') > -1}
                onMouseDown={self.changeContextRequest}
              >
                <Checkbox checked={self.state.contextRequest.indexOf('personal') > -1} />
                <ListItemText primary={self.props.resources.ContentManagement.MyLibrary} />
              </MenuItem>
              {!this.props.IsBoostOffer && (
                <MenuItem
                  data-value="public"
                  data-checked={self.state.contextRequest.indexOf('public') > -1}
                  onMouseDown={self.changeContextRequest}
                >
                  <Checkbox checked={self.state.contextRequest.indexOf('public') > -1} />
                  <ListItemText primary={self.props.resources.ContentManagement.BimAndCoLibrary} />
                </MenuItem>
              )}
              <MenuItem
                data-value="library"
                data-checked={self.state.contextRequest.indexOf('library') > -1}
                onMouseDown={self.changeContextRequest}
              >
                <Checkbox checked={self.state.contextRequest.indexOf('library') > -1} />
                <ListItemText
                  primary={self.props.resources.ContentManagement.MyOnflyLibrary.replace(
                    '[CompanyName]',
                    self.props.EntityName
                  )}
                />
              </MenuItem>
              {this.props.Settings.HasPrivateSite && (
                <MenuItem
                  data-value="entity"
                  data-checked={self.state.contextRequest.indexOf('entity') > -1}
                  onMouseDown={self.changeContextRequest}
                >
                  <Checkbox checked={self.state.contextRequest.indexOf('entity') > -1} />
                  <ListItemText
                    primary={self.props.resources.ContentManagement.MyEntityLibrary.replace(
                      '[CompanyName]',
                      self.props.EntityName
                    )}
                  />
                </MenuItem>
              )}
            </Menu>
          </FormControl>
        </div>
      );
    }

    const checkedInputs = _.where(self.props.staticFilters.Pins, { IsChecked: true });

    const inputNodes = checkedInputs.map((input, i) => {
      const name = input.Name;
      const label = input.Name;

      return (
        <Chip
          className="tag xs"
          key={i}
          data-checked={!input.IsChecked}
          data-value={name}
          data-kind-filter="ValueContainerFilter"
          data-property="Pins.Name_raw"
          label={label}
          onDelete={self.removeFilterTag}
        />
      );
    });

    const filterPanel = (
      <FilterPanel
        property="Classifications.Id"
        currentValue={self.props.staticFilters.Classifications}
        handleRequest={self.handleClassificationRequest}
        title={self.props.resources.SearchResults.ClassificationFilterTitle}
        request={self.props.request}
        changeSelectedClassification={self.changeSelectedClassification}
        selectedClassificationNode={self.state.selectedClassificationNode}
      />
    );

    return (
      <div id="new-filterbar">
        <div id="simple-filters-container">
          <div id="input-object-search">
            <input
              type="text"
              onChange={self.changeKeyword}
              defaultValue={this.state.newKeyWord}
              placeholder={self.props.resources.ContentManagement.SearchForPlaceHolder}
              id="inputsearchsimple"
            />
          </div>
          <div className={searchHeaderClassifClass}>{filterPanel}</div>
          {librarySelect}
          <Button onClick={self.displayFilter} className="advanced-search-btn btn-flat">
            {self.props.resources.ContentManagement.AdvancedSearch}
          </Button>
        </div>

        <Popover
          id="popover-advanced-search"
          open={Boolean(this.state.anchorPopoverAdvancedSearch)}
          onClose={this.hideFilter}
          onEnter={this.onEnterPopoverAdvancedSearch}
          PaperProps={{ id: 'paper-advanced-search' }}
          BackdropProps={{ invisible: true }}
          anchorEl={this.state.anchorPopoverAdvancedSearch}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <div id="more-filters-container">
            <SearchBox
              changeKeyword={self.changeKeyword}
              changeContextRequest={self.changeContextRequest}
              contextRequest={this.state.contextRequest}
            />

            <div id="more-filters">
              <div className="row">
                <div className="col-md-5 col-md-offset-1 col-xs-21 col-xs-offset-1 material-v1-element">
                  {filterPanel}
                </div>
                <div className="col-md-4 col-md-offset-2 col-xs-21 col-xs-offset-1">
                  <FilterSuggest
                    property="Pins.Name_raw"
                    staticFilters={self.props.staticFilters.Pins}
                    handleRequest={self.handleRequest}
                    title="Tags"
                    resources={self.props.resources}
                    reset={this.state.reset}
                  />
                </div>
                <div className="col-md-9 col-md-offset-1 col-xs-21 col-xs-offset-1 tags-results">
                  {inputNodes}
                </div>
                <div className="dotted-line col-xs-21 col-xs-offset-1" />
              </div>
              <div className="row">
                <FilterBar handleRequest={self.handleRequest} reset={this.state.reset} />
              </div>
              <div className="row row-actions">
                <div className="col-xs-21 col-xs-offset-1 filter-to-hide">
                  <Button
                    variant="contained"
                    onClick={self.hideFilter}
                    className="btn-raised pull-right"
                  >
                    {self.props.resources.ContentManagement.SearchFilterBtn}
                  </Button>
                  <Button
                    id="handle-reset-button"
                    onClick={self.handleReset}
                    className="btn-flat blue pull-right"
                    style={{ marginRight: '20px' }}
                  >
                    {self.props.resources.ContentManagement.SearchResetBtn}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Popover>
      </div>
    );
  },
});

const mapStateToProps = function (store, ownProps) {
  let currentSearchState;
  const { searchState } = store;
  const { searchGroupState } = store;
  const { appState } = store;
  const currentManageSearchState = store.manageSearchState;
  const isManage = ownProps.location.pathname == `/${appState.Language}/manage-objects`;

  if (ownProps.params.groupId > 0) {
    currentSearchState = searchGroupState;
  } else if (isManage == true) {
    currentSearchState = currentManageSearchState;
  } else {
    currentSearchState = searchState;
  }

  return {
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Roles: appState.Roles[appState.Language],
    language: appState.Language,
    resources: appState.Resources[appState.Language],
    request: currentSearchState.Request,
    size: currentSearchState.Size,
    contextRequest: currentSearchState.ContextRequest,
    EntityName: selectDisplayName(store),
    staticFilters: currentSearchState.StaticFilters,
    initialRequest: currentSearchState.InitialRequest,
    IsManage: isManage,
    Settings: appState.Settings,
    IsBoostOffer: selectIsBoostOffer(store),
  };
};

export default SearchHeader = withRouter(connect(mapStateToProps)(SearchHeader));