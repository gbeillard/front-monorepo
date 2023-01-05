/* eslint-disable @typescript-eslint/no-this-alias */
import React from 'react';
import createReactClass from 'create-react-class';
import styled from '@emotion/styled';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MUI_MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import MUI_Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';

import { Icon, Divider } from '@bim-co/componentui-foundation';
import { selectIsBoostOffer } from '../../Reducers/app/selectors';
import { fetchCollections } from '../../Reducers/Collections/actions';
import { sendAnalytics } from '../../Reducers/analytics/actions';
import { searchCollections } from '../../Reducers/Collections/utils';
import { sortObjectArray } from '../../Reducers/Sets/Properties/utils';
import { GroupType } from '../../Reducers/groups/constants';
import { getGroupName } from '../../Reducers/groups/utils';

import { API_URL } from '../../Api/constants';
import * as GroupsApi from '../../Api/GroupsApi';
import store from '../../Store/Store';

const BimObjectModes = {
  LINK: 1,
  DUPLICATE: 2,
  ASK: 3,
};

let AutocompleteGroup = createReactClass({
  getInitialState() {
    return {
      value: '',
      projects: [],
      collections: [],
      newKeyWord: '',
      openModal: false,
      modalGroup: null,
    };
  },

  componentDidMount() {
    this.updateAutoCompleteInputGroup();

    if (this.props.WithCollection) {
      store.dispatch(fetchCollections());
    }
  },

  componentDidUpdate(prevProps) {
    if (this.props.WithCollection && prevProps.Collections !== this.props.Collections) {
      this.setCollections(this.props.Collections);
    }
  },

  renderSuggestionsContainer(options) {
    const { containerProps, children } = options;

    return (
      <Paper {...containerProps} square style={{ position: 'absolute', zIndex: 20, width: '100%' }}>
        {children}
      </Paper>
    );
  },

  getSuggestionValue(suggestion) {
    return suggestion.textKey;
  },

  renderSuggestion(suggestion, { query, isHighlighted }) {
    const value = this.getSuggestionValue(suggestion);
    const matches = match(value, query);
    const parts = parse(value, matches);

    return (
      <>
        <MenuItem selected={isHighlighted} component="div">
          {suggestion?.isFavorite && (
            <IconContainer>
              <Icon icon="favorite" size="s" />
            </IconContainer>
          )}
          <div>
            {parts.map((part, index) =>
              part.highlight ? (
                <span key={String(index)} style={{ fontWeight: 500 }}>
                  {part.text}
                </span>
              ) : (
                <strong key={String(index)} style={{ fontWeight: 300 }}>
                  {part.text}
                </strong>
              )
            )}
          </div>
        </MenuItem>
        {suggestion.valueKey === 'bimandco' && <Divider />}
      </>
    );
  },

  renderInput(inputProps) {
    return (
      <TextField
        autoComplete="off"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
        {...inputProps}
      />
    );
  },

  handleChange(event, { method, newValue }) {
    event.preventDefault();
    event.stopPropagation();

    if (method === 'click') {
      this.setState({ value: '' });
    } else {
      this.setState({ value: event.target.value });
    }
  },

  updateAutoCompleteInputGroup(value) {
    const self = this;

    const request = {
      GroupSearch: value,
      Size: 20,
    };

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${self.props.ManagementCloudId}/groups/search?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    )
      .then((response) => response.json())
      .then((json) => {
        const groupsMappeds = [];
        const resultsList = json.Documents;
        for (let i = 0; i < resultsList.length; i++) {
          const current = resultsList[i];

          const textKey = self.props.WithCollection
            ? getGroupName(self.props.resources, current.Name, GroupType.Project)
            : current.Name;

          const line = {
            textKey,
            valueKey: current.Id,
            groupType: GroupType.Project,
          };
          groupsMappeds.push(line);
        }

        self.setState({ projects: groupsMappeds });
      });
  },

  handleSuggestionsFetchRequested({ value }) {
    const self = this;
    self.setState({ newKeyWord: value });
    setTimeout(() => {
      if (self.state.newKeyWord === value) {
        self.updateAutoCompleteInputGroup(value);

        if (self.props.WithCollection) {
          self.setCollections(searchCollections(self.props.Collections, value));
        }
      }
    }, 500);
  },

  handleSuggestionsClearRequested() {
    this.setState({ projects: [], collections: [] });
  },

  handleSuggestionSelected(
    event,
    { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }
  ) {
    const modalGroup = {
      modalGroup: { Id: suggestion.valueKey, Name: suggestion.textKey },
    };
    let selectedGroup = this.props.Groups.find((curr) => curr.Id === suggestion.valueKey);

    if (this.props.WithCollection && !selectedGroup) {
      selectedGroup = {
        ...this.props.Collections?.find((c) => c.Id === suggestion.valueKey),
      };
    }

    if (selectedGroup != null) {
      selectedGroup.BimObjectAddMode = BimObjectModes.LINK;
    }

    if (suggestion.valueKey === 'bimandco') {
      this.props.AddToBimAndCo(modalGroup);
    } else if (suggestion.valueKey === 'privatecloud') {
      this.props.AddToPrivateCloud(modalGroup);
    } else if (selectedGroup?.BimObjectAddMode === BimObjectModes.LINK) {
      if (suggestion?.groupType === GroupType.Collection) {
        this.props.sendAnalytics('user-added-object-to-collection');
      }

      this.keepObjects(suggestion.valueKey);
    } else if (selectedGroup?.BimObjectAddMode === BimObjectModes.DUPLICATE) {
      this.copyObjects(suggestion.valueKey);
    } else {
      this.setState({ openModal: true });
      this.setState(modalGroup);
    }
  },

  keepObjects(groupId) {
    GroupsApi.addObjectsToGroup(
      this.props.ManagementCloudId,
      groupId,
      this.props.SelectedObjects,
      this.props.TemporaryToken,
      this.props.resources,
      false
    ).then(() => this.setState({ openModal: false }));
  },

  copyObjects(groupId) {
    GroupsApi.addObjectsToGroup(
      this.props.ManagementCloudId,
      groupId,
      this.props.SelectedObjects,
      this.props.TemporaryToken,
      this.props.resources,
      true
    ).then(() => this.setState({ openModal: false }));
  },

  shouldRenderSuggestions() {
    return true;
  },

  setCollections(collections) {
    const self = this;

    const newCollections = collections?.map((collection) => ({
      textKey: getGroupName(self.props.resources, collection?.Name, GroupType.Collection),
      valueKey: collection?.Id,
      isFavorite: collection?.IsFavorite,
      groupType: GroupType.Collection,
    }));

    this.setState({ collections: newCollections });
  },

  getGroupList() {
    let groupList = [...this.state.projects, ...this.state.collections];

    groupList = sortObjectArray(
      groupList?.filter((g) => !g?.isFavorite),
      'textKey'
    );

    if (this.props.WithCollection) {
      const favoriteCollection = this.state.collections?.find((g) => g?.isFavorite);

      if (favoriteCollection) {
        groupList.unshift(favoriteCollection);
      }
    }

    const currentContextRequest = this.props.CurrentContextRequest;

    // add to plateform private cloud only if only entity object result!
    if (
      currentContextRequest.length === 1 &&
      currentContextRequest[0] === 'entity' &&
      this.props.Settings.HasPrivateSite
    ) {
      groupList.unshift({
        textKey: 'Private Cloud',
        valueKey: 'privatecloud',
      });
    }

    // add to bimandco plateform
    if (this.props.IsBoostOffer === false) {
      groupList.unshift({ textKey: 'BIM&CO', valueKey: 'bimandco' });
    }

    return groupList;
  },

  render() {
    const self = this;

    const inputProps = {
      placeholder: self.props.resources.ContentManagement.AutoCompleteGroupPlaceHolder,
      value: this.state.value,
      onChange: this.handleChange,
    };

    return (
      <div>
        <Modal open={this.state.openModal} onClose={() => this.setState({ openModal: false })}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="myModalLabel">
                  {this.props.resources.ManageObjects.BimObjectCopyModalTitle}
                </h4>
                <button
                  type="button"
                  className="close"
                  onClick={() => this.setState({ openModal: false })}
                >
                  <CloseIcon aria-hidden="true" />
                </button>
              </div>
              <div className="modal-body" style={{ padding: '15px' }}>
                <p>{this.props.resources.ManageObjects.BimObjectCopyModalText1}</p>
                <br />
                <p>{this.props.resources.ManageObjects.BimObjectCopyModalText2}</p>
                <p>{this.props.resources.ManageObjects.BimObjectCopyModalText3}</p>
              </div>
              <div className="modal-footer">
                <Button
                  color="primary"
                  variant="text"
                  component="span"
                  onClick={() => this.keepObjects(this.state.modalGroup.Id)}
                >
                  {this.props.resources.ManageObjects.ButtonKeepObject}
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => this.copyObjects(this.state.modalGroup.Id)}
                >
                  {this.props.resources.ManageObjects.ButtonCreateCopy}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
        <Autosuggest
          renderInputComponent={this.renderInput}
          onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
          renderSuggestionsContainer={this.renderSuggestionsContainer}
          getSuggestionValue={this.getSuggestionValue}
          renderSuggestion={this.renderSuggestion}
          onSuggestionSelected={this.handleSuggestionSelected}
          focusInputOnSuggestionClick={false}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
          suggestions={this.getGroupList()}
          inputProps={inputProps}
        />
      </div>
    );
  },
});

const Modal = styled(MUI_Modal)`
  overflow-y: auto;
  z-index: 3300 !important;
`;

const MenuItem = styled(MUI_MenuItem)`
  display: flex;
  align-items: center;
`;

const IconContainer = styled.div`
  display: inline-flex;
  margin-right: 8px;
`;

const mapStateToProps = function (store) {
  const { appState } = store;
  const currentManageSearchState = store.manageSearchState.ContextRequest;
  const { collections } = store.collectionsState;
  const resources = appState.Resources[appState.Language];

  return {
    platformUrl: appState.platform_url,
    Language: appState.Language,
    resources,
    TemporaryToken: appState.TemporaryToken,
    ManagementCloudId: appState.ManagementCloudId,
    Settings: appState.Settings,
    CurrentContextRequest: currentManageSearchState,
    Groups: store.groupsState.GroupsList,
    Collections: collections,
    IsBoostOffer: selectIsBoostOffer(store),
  };
};

const mapDispatchToProps = (dispatch) => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  sendAnalytics: (event) => dispatch(sendAnalytics(event)),
});

export default AutocompleteGroup = connect(mapStateToProps, mapDispatchToProps)(AutocompleteGroup);