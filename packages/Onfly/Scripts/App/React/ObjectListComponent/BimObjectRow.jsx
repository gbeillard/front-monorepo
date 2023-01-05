/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable vars-on-top */
/* eslint-disable react/no-deprecated */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-shadow */
/* eslint-disable react/button-has-type */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';

import { Select, Button, Tooltip as DS_Tooltip } from '@bim-co/componentui-foundation';
import moment from 'moment';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

// material ui icons
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

import { connect } from 'react-redux';
import { sendAnalytics } from '../../Reducers/analytics/actions';
import { updateCollectionBimObjects } from '../../Reducers/Collections/actions';
import CustomTooltip from '../CommonsElements/CustomTooltip.jsx';
import * as Utils from '../../Utils/utils.js';
import BimObjectDetails2 from '../ObjectDetails/BimObjectDetails2.jsx';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';
import ChipList from '../CommonsElements/ChipList.tsx';
import * as OnflyMuiThemeV1 from '../../Utils/onflyMuiThemeV1.js';
import { isFavorite, updateBimObjectGroupsList } from '../../Reducers/BimObject/utils';
import {
  selectGroupsFilter,
  selectHasFavoriteGroupFilter,
  selectIsFilteredByFavorites,
  selectObjectsCount,
  selectShowFilters,
} from '../../Reducers/BimObject/selectors';
import { searchObjects, setGroupFilters } from '../../Reducers/BimObject/actions';
import ConfiguratorForm from '../ObjectDetails/Configurator/ConfiguratorForm';
import { history } from '../../history';
import { withRouter } from '../../Utils/withRouter';

const RefsAndTags = styled.div({
  width: '100%',
});

const RefsAndTagsTitles = styled.h4({
  /* Références (35) */
  width: '207px',
  height: '16px',
  left: '32px',
  top: '16px',
  marginBottom: '8px',

  /* H5 - Label text field */
  fontFamily: 'Roboto',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '12px',
  lineHeight: '16px',
  /* identical to box height, or 133% */
  /* Neutre 7 */
  color: '#42526E',
});

const Reference = styled.div({
  display: 'inline-block',
  float: 'left',
  minWidth: '200px',
  width: 'calc(50% - 40px)',
  marginTop: '16px',
  marginRight: '40px',
});

const Tags = styled.div({
  display: 'inline-block',
  minWidth: '200px',
  width: '50%',
  marginTop: '16px',
});

let BimObjectRow = createReactClass({
  getInitialState() {
    return {
      IsOnManagementCloud:
        this.props.bimobject != null ? this.props.bimobject.IsOnManagementCloud : false,
      data: null,
      tabSelected: this.props.DefaultSelectedTabDetailsPage,
      DisplayFullDescription: false,
      bimobject: null,
      detailsPage: false,
      showViewer3D: false,
      cancelClose: false,
      cardHeaderIsVisible: true,
      currentReference: null,
      displayConfigurator: false,
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    const bool =
      (this.state.bimobject == null && nextState.bimobject != null) ||
      nextState.cardHeaderIsVisible != this.state.cardHeaderIsVisible ||
      nextState.showViewer3D != this.state.showViewer3D ||
      (nextState.bimobject != null && bimobject.Pins.length != nextState.bimobject.Pins.length) ||
      (nextProps.bimobject != null && bimobject.UpdatedAt !== nextProps.bimobject.UpdatedAt) ||
      (nextProps.bimobject != null && bimobject.Id !== nextProps.bimobject.Id) ||
      (nextProps.bimobject != null &&
        this.props.ObjectIdOpened !== nextProps.ObjectIdOpened &&
        (nextProps.bimobject.Id == nextProps.ObjectIdOpened ||
          nextProps.bimobject.Id == this.props.ObjectIdOpened)) ||
      (nextProps.bimobject != null && bimobject.Pins.length != nextProps.bimobject.Pins.length) ||
      (nextProps.bimobject != null && bimobject.Status != nextProps.bimobject.Status) ||
      (nextProps.bimobject != null && nextProps.bimobject.Name != bimobject.Name) ||
      (nextProps.bimobject != null && nextProps.bimobject.Description != bimobject.Description) ||
      (nextProps.bimobject != null && nextProps.bimobject.GroupsList != bimobject.GroupsList) ||
      this.state.bimobject?.GroupsList != nextState.bimobject?.GroupsList ||
      (this.state.data == null && nextState.data != null) ||
      this.state.tabSelected != nextState.tabSelected ||
      this.state.IsOnManagementCloud != nextState.IsOnManagementCloud ||
      this.state.DisplayFullDescription != nextState.DisplayFullDescription ||
      nextProps.Language != this.props.Language ||
      this.props.routeParams?.bimobjectId !== nextProps.routeParams?.bimobjectId ||
      nextState.displayConfigurator !== this.state.displayConfigurator;

    return bool;
  },

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.bimobject != null &&
      this.state.IsOnManagementCloud !== nextProps.bimobject.IsOnManagementCloud
    ) {
      this.setState({ IsOnManagementCloud: nextProps.bimobject.IsOnManagementCloud });
    }
  },

  addBimObjectToLibrary(event) {
    this.props.addBimObjectToLibrary(event.target.parentElement.dataset.id);
    this.setState({ IsOnManagementCloud: true });
  },

  confirmRemoveBimObjectFromLibrary(event) {
    this.props.confirmRemoveBimObjectFromLibrary(
      event.currentTarget.dataset.id,
      event.currentTarget.dataset.type
    );
  },

  cancelClose() {
    this.state.cancelClose = true;
  },

  selectBimObject(event) {
    if (!this.state.cancelClose && !this.state.detailsPage && !event.isPropagationStopped()) {
      const { bimobject } = this.props;

      // haven't find a better way to check the SELECT elements
      let isRefChange = event.target.parentElement.id === 'refsAndTags';
      isRefChange =
        isRefChange !== true
          ? event.target.parentElement.parentElement.id === 'refsAndTags'
          : isRefChange;
      isRefChange =
        isRefChange !== true
          ? event.target.parentElement.parentElement.parentElement.id === 'refsAndTags'
          : isRefChange;
      isRefChange =
        isRefChange !== true
          ? event.target.parentElement.parentElement.parentElement.parentElement.id ===
          'refsAndTags'
          : isRefChange;
      isRefChange =
        isRefChange !== true
          ? event.target.parentElement.parentElement.parentElement.parentElement.parentElement
            .id === 'refsAndTags'
          : isRefChange;
      isRefChange =
        isRefChange !== true
          ? event.target.parentElement.parentElement.parentElement.parentElement.parentElement
            .parentElement.id === 'refsAndTags'
          : isRefChange;
      isRefChange =
        isRefChange !== true
          ? event.target.parentElement.parentElement.parentElement.parentElement.parentElement
            .parentElement.parentElement.id === 'refsAndTags'
          : isRefChange;

      if ($(event.target).hasClass('btn-download')) {
        if (this.props.ObjectIdOpened !== bimobject.Id) {
          store.dispatch({
            type: `OPEN_OBJECT_CARD${this.props.SearchContextAction}`,
            data: bimobject.Id,
          });
        }
      } else if (
        !$(event.target).hasClass('add-button') === true &&
        !$(event.target).hasClass('btn-edit') === true &&
        !$(event.target).hasClass('remove-button') === true &&
        !$(event.target).hasClass('dropdown-toggle') === true &&
        !$(event.target).hasClass('search-component') === true &&
        !$(event.target).hasClass('no-deploy-card') === true &&
        !$(event.target).hasClass('viewer-closing-button') === true &&
        !(
          $(event.target).attr('id') !== null &&
          $(event.target).attr('id') !== undefined &&
          $(event.target).attr('id').startsWith('searchpincard')
        ) &&
        !(
          event.target !== null &&
          event.target.offsetParent !== null &&
          $(event.target.offsetParent).hasClass('tag-menu-item')
        ) &&
        !$(event.target).hasClass('carousel-control') === true &&
        !$(event.target.parentElement).hasClass('carousel-control') === true &&
        !$(event.target.parentElement.parentElement).hasClass('carousel-control') === true &&
        !$(event.target).hasClass('favorite-button') &&
        !$(event.target.parentElement).hasClass('favorite-button') &&
        !$(event.target.parentElement.parentElement).hasClass('favorite-button') &&
        !$(event.target.parentElement.parentElement.parentElement).hasClass('favorite-button') &&
        !isRefChange
      ) {
        store.dispatch({
          type: `OPEN_OBJECT_CARD${this.props.SearchContextAction}`,
          data: this.props.ObjectIdOpened == bimobject.Id ? 0 : bimobject.Id,
        });
      }
      this.props.sendAnalytics('user-opened-object');
    }
    this.state.cancelClose = false;
  },

  refreshCardOpacity() {
    const cards = $('.results-list-container .panel-object-std');
    const cardsNotOpened = cards.has('.opened');
    if (cardsNotOpened.length === 0) {
      cards.removeClass('filter-opacity');
    } else {
      cards.not('.opened').addClass('filter-opacity');
    }
  },

  contactAuthor() {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    // configure modal
    let receiverType;
    let receiverId;

    if (bimobject.Manufacturer != null && bimobject.Manufacturer.Id > 0) {
      receiverType = 'manufacturer';
      receiverId = bimobject.Manufacturer.Id;
    } else {
      receiverType = 'user';
      receiverId = bimobject.CreatorId;
    }

    const contactCreatorMessage = {
      subject: this.props.resources.BimObjectDetails.ContactCreatorDefaultSubject + bimobject.Name,
      bimObjectId: bimobject.Id,
      receiverType,
      receiverId,
    };

    this.props.openModalContactCreator(contactCreatorMessage);
  },

  componentDidMount() {
    let { bimobject } = this.props;

    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    window.addEventListener('resize', this.calculateOverflowTags);
    window.addEventListener('resize', this.calculateOverflowClassifications);
    window.addEventListener('resize', this.calculateSizeViewer3D);

    if (bimobject != null && bimobject.Status !== 'deleted') {
      this.calculateOverflowTags();
      this.calculateOverflowClassifications();
      this.calculateOverflowDescription();
    }

    if (this.props.bimobject == null) {
      this.loadBimObjectInformations(false);
    } else if (this.state.data == null && this.props.bimobject.Id == this.props.ObjectIdOpened) {
      this.loadBimObjectInformations();
    }
  },

  componentDidUpdate(prevProps) {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    if (bimobject != null && bimobject.Status !== 'deleted') {
      const isDeployed = !!(this.state.detailsPage || this.props.ObjectIdOpened == bimobject.Id);
      if (!isDeployed) {
        this.calculateOverflowTags();
        this.calculateOverflowClassifications();
        this.calculateOverflowDescription();
      }

      this.calculateSizeViewer3D();

      if (
        (prevProps.Language !== this.props.Language && isDeployed) ||
        (isDeployed && this.state.data == null) ||
        (isDeployed &&
          this.state.data != null &&
          this.state.data.LanguageCode != this.props.Language) ||
        prevProps.routeParams?.bimobjectId !== this.props.routeParams?.bimobjectId
      ) {
        this.state.data = null;
        this.state.currentReference = null;
        const cardContext = this.props.bimobject != null;
        this.loadBimObjectInformations(cardContext);
      }

      if (
        (this.props.ObjectIdOpened === bimobject.I && prevProps.ObjectIdOpened !== bimobject.Id) ||
        (prevProps.ObjectIdOpened === bimobject.Id && this.props.ObjectIdOpened === 0)
      ) {
        this.refreshCardOpacity();
      }
    }

    this.state.language = this.props.Language;
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.calculateOverflowTags);
    window.removeEventListener('resize', this.calculateOverflowClassifications);
    window.removeEventListener('resize', this.calculateSizeViewer3D);
  },

  loadBimObjectInformations(cardContext = true) {
    const self = this;

    let bimobjectId;
    if (this.props.bimobject != null) {
      bimobjectId = this.props.bimobject.Id;
    } else {
      bimobjectId = this.props.params.bimobjectId;
      store.dispatch({ type: 'LOADER', state: true });
    }

    // infos
    fetch(
      `${API_URL}/api/ws/v3/bimobjects/${bimobjectId}/details/${self.props.Language}?token=${self.props.TemporaryToken}&contentmanagementid=${self.props.ManagementCloudId}&card=${cardContext}&caoName=${window._softwarePlugin}&caoVersion=${window._softwarePluginVersion}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    ).then((response) => {
      if (response.status == 200) {
        return response.json().then((json) => {
          const dataObject = json;

          const queryString = new URLSearchParams(window.location.search);
          const variantIdFromUrl = queryString.has('variantId')
            ? queryString.get('variantId')
            : null;

          let currentReference;
          if (self.state.currentReference !== null && dataObject && dataObject.VariantValues) {
            // Permet de récupérer le nom de la variante sélectionné au cas où il aurai changé
            currentReference = _.findWhere(dataObject.VariantValues, {
              Id: self.state.currentReference.Id,
            });
            currentReference = {
              Id: currentReference.Id,
              Name: currentReference.Value,
              VariantId: currentReference.VariantId,
              VariantName: currentReference.Value,
            };
          } else if (
            self.state.currentReference === null &&
            dataObject &&
            dataObject.VariantValues
          ) {
            if (variantIdFromUrl) {
              currentReference = dataObject.VariantValues.filter(
                (f) => f.VariantId === variantIdFromUrl && f.Property.Id === 217
              );
            }

            // si non trouvé via l'url
            if (!currentReference) {
              currentReference = _.sortBy(
                dataObject.VariantValues.filter((f) => f.Property.Id === 217),
                ['VariantId']
              );
            }

            currentReference = {
              Id: currentReference[0]?.Id,
              Name: currentReference[0]?.Value,
              VariantId: currentReference[0]?.VariantId,
              VariantName: currentReference[0]?.Value,
            };
          }

          if (cardContext) {
            self.setState({
              data: dataObject,
              currentReference,
            });
          } else {
            store.dispatch({ type: 'LOADER', state: false });

            const linkedVariantIds = queryString.has('linkedVariantIds')
              ? queryString.get('linkedVariantIds')
              : null;
            const linkedReferences = linkedVariantIds
              ?.split(';')
              .map((id) => ({ VariantId: id, VariantName: '' }));

            self.setState({
              data: dataObject,
              bimobject: {
                ...dataObject,
                GroupsList: dataObject?.Groups,
              },
              detailsPage: true,
              IsOnManagementCloud: dataObject.IsOnContentManagement,
              currentReference,
              linkedReferences,
              displayConfigurator: variantIdFromUrl && linkedVariantIds,
            });
          }
        });
      }
      store.dispatch({ type: 'LOADER', state: false });

      if (!cardContext) {
        history.push(`/${self.props.Language}/not-found`);
      }
    });
  },

  calculateOverflowTags() {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    if (bimobject != null && bimobject.Pins != null && bimobject.Pins.length > 0) {
      let count = 0;
      const object = $(`#panel-object-${bimobject.Id} .bimobject-info .tags`);
      if (object != null && object.offset() != null) {
        const offsetTopParent = object.offset().top;
        const heightParent = object.height();
        object.find('.tag').each(function () {
          if ($(this).offset().top >= offsetTopParent + heightParent) {
            count++;
          }
        });

        if (count > 0) {
          object.find(`#more-tags-${bimobject.Id}`).html(`+${count}`).removeClass('hidden');
        } else {
          object.find(`#more-tags-${bimobject.Id}`).addClass('hidden');
        }
      }
    }
  },

  calculateOverflowClassifications() {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    if (bimobject != null) {
      let count = 0;
      const object = $(`#panel-object-${bimobject.Id} .bimobject-info .bimobject-classif`);
      if (object != null && object.offset() != null) {
        const offsetTopParent = object.offset().top;
        const heightParent = object.height();
        object.find('span.classif').each(function () {
          if ($(this).offset().top >= offsetTopParent + heightParent) {
            count++;
          }
        });

        if (count > 0) {
          object.find(`#more-classifs-${bimobject.Id}`).html(`+${count}`).removeClass('hidden');
        } else {
          object.find(`#more-classifs-${bimobject.Id}`).addClass('hidden');
        }
      }
    }
  },

  calculateOverflowDescription() {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    if (bimobject != null) {
      const heightParent = $(
        `#panel-object-${bimobject.Id} .bimobject-info .bimobject-description`
      ).height();
      const heightChild = $(
        `#panel-object-${bimobject.Id} .bimobject-info .bimobject-description .description-container`
      ).height();

      if (
        (heightChild > heightParent &&
          this.props.ObjectIdOpened == bimobject.Id &&
          this.state.data != null) ||
        this.state.DisplayFullDescription
      ) {
        $(`#panel-object-${bimobject.Id} .bimobject-info .view-more`).removeClass('hidden');
      } else {
        $(`#panel-object-${bimobject.Id} .bimobject-info .view-more`).addClass('hidden');
      }
    }
  },

  changeTabSelection(tab) {
    this.setState({ tabSelected: tab });
  },

  selectModelsTab(event) {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }
    event.stopPropagation();

    store.dispatch({
      type: `OPEN_OBJECT_CARD${this.props.SearchContextAction}`,
      data: bimobject.Id,
    });
    this.setState({ tabSelected: 'models' });
  },

  toggleFullDescription() {
    this.setState({ DisplayFullDescription: !this.state.DisplayFullDescription });
  },

  expandViewer3D(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showViewer3D: true });
  },

  closeViewer3D(event) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ showViewer3D: false });
  },

  calculateSizeViewer3D() {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    if (
      this.state.showViewer3D &&
      (this.state.detailsPage || this.props.ObjectIdOpened == bimobject.Id)
    ) {
      const width = $(`#iframe-viewer-${bimobject.Id}`).width();
      let height = $(window).height() - 300;
      const self = this;

      setTimeout(() => {
        if (
          width == $(`#iframe-viewer-${bimobject.Id}`).width() &&
          $(window).height() - 300 == height
        ) {
          if (width < height) {
            height = width;
          }
          const item = document.getElementById(`iframe-viewer-${bimobject.Id}`);
          if (item != null) {
            let model3DPreview;

            if (self.state.data && self.state.data.ThreeDModels) {
              // Recherche la première preview de l'objet
              for (const model of self.state.data.ThreeDModels) {
                if (model && model.ThreeDModelVariants) {
                  const threeDModelVariantFound = model.ThreeDModelVariants.find(
                    (threeDModelVariant) =>
                      threeDModelVariant &&
                      threeDModelVariant.Preview &&
                      threeDModelVariant.Variant.Id.toString() ===
                      self.state.currentReference?.VariantId
                  );

                  if (threeDModelVariantFound) {
                    model3DPreview = threeDModelVariantFound.Preview;
                    break;
                  }
                }
              }
            }

            if (model3DPreview) {
              const viewLink = `bimobjects/${bimobject.Id}/3dmodels/${model3DPreview.MediaKey}/View/${self.props.Language}?token=${self.props.TemporaryToken}&height=${height}&width=${width}`;
              item.innerHTML = `<iframe height='${height}' width='${width}' src='${self.props.PlatformUrl}/${viewLink}' className='no-deploy-card'/>`;
            }
          }
        }
      }, 400);
    }
  },

  toggleCarHeaderVisibility() {
    this.setState({ cardHeaderIsVisible: !this.state.cardHeaderIsVisible });
  },

  toggleConfigurator() {
    this.setState({ displayConfigurator: !this.state.displayConfigurator });
  },

  render() {
    let { bimobject } = this.props;
    if (bimobject == null) {
      bimobject = this.state.bimobject;
    }

    if (bimobject == null) {
      return null;
    }

    const self = this;
    const isDeployed = this.state.detailsPage || this.props.ObjectIdOpened === bimobject.Id;

    // start new variant display

    // Property.Id === 217 is to check if it's a reference
    let currentReferences =
      this.state.data !== null
        ? this.state.data.VariantValues.filter((f) => f.Property.Id === 217).map((v) => ({
          Id: v.Id,
          Name: v.Value,
          VariantId: v.VariantId,
          VariantName: v.Value,
        }))
        : [];

    // Trie les variantes par ordre alphabétique
    currentReferences = _.sortBy(currentReferences, 'Name');

    const onChangeReference = (event) => {
      const newRef = currentReferences.find((x) => x.Id === event.Id);
      self.setState({ currentReference: newRef });
      this.forceUpdate();
    };

    // end

    if (bimobject.Status === 'deleted') {
      if (this.state.detailsPage) {
        return (
          <div id="panel-object-error-404" className="panel-object-std">
            <div className="panel-object-content">
              <table>
                <tbody>
                  <tr>
                    <td className="bimobject-photo">
                      <div className="image-container">
                        <ErrorOutlineIcon className="icon-error" />
                      </div>
                    </td>
                    <td className="bimobject-info">
                      <Typography variant="h6" gutterBottom>
                        {self.props.resources.ContentManagement.Error404}
                      </Typography>
                      <Typography variant="subtitle1" gutterBottom>
                        {self.props.resources.ErrorPage.DeleteObject}
                      </Typography>
                    </td>
                    <td className="bimobject-actions" />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      return null;
    }

    if (
      this.props.params.groupId != null &&
      _.find(bimobject.GroupsList, (item) => item.Id === self.props.params.groupId) === null
    ) {
      return null;
    }

    let buttonAction = '';
    let buttonActionEdit;
    let classPanelObject = 'panel-object-std';

    if (this.props.animateDirection === 'left') {
      classPanelObject += ' animated slideInLeft';
    } else if (this.props.animateDirection === 'right') {
      classPanelObject += ' animated slideInRight';
    }

    if (isDeployed) {
      classPanelObject += ' opened';
    }

    let model3DPreview;

    if (self.state.data && self.state.data.ThreeDModels) {
      // Recherche la première preview de l'objet
      for (const model of self.state.data.ThreeDModels) {
        if (model && model.ThreeDModelVariants) {
          const threeDModelVariantFound = model.ThreeDModelVariants.find(
            (threeDModelVariant) => threeDModelVariant && threeDModelVariant.Preview
          );

          if (threeDModelVariantFound) {
            model3DPreview = threeDModelVariantFound.Preview;
            break;
          }
        }
      }
    }

    if (this.state.showViewer3D && isDeployed && model3DPreview) {
      return (
        <div className={classPanelObject} id={`panel-object-${bimobject.Id}`}>
          <div id={`panel-object-content-${bimobject.Id}`} className="panel-object-content">
            <div className="modal-header">
              <h2>{model3DPreview.Name}</h2>
              <CloseIcon onClick={this.closeViewer3D} className="no-deploy-card" />
            </div>
            <div id={`iframe-viewer-${bimobject.Id}`} />
          </div>
        </div>
      );
    }

    classPanelObject += ' panel-object';

    // S'il on ne se trouve pas dans un groupe
    if (this.props.params.groupId == null && !this.state.detailsPage) {
      if (this.state.IsOnManagementCloud) {
        buttonAction = (
          <span className="btn check-status">
            <i className="added-to-librairy" />
          </span>
        );
      }
    }

    if (bimobject.Status != 'published') {
      classPanelObject += ' not-published';
    }

    const tagsSorted = _.sortBy(bimobject.Pins, (value) => value.Name);

    const tags = <ChipList layout="inline" chips={tagsSorted} />;

    if (bimobject.CanEdit && !['member', 'partner', 'public_creator'].includes(self.props.RoleKey)) {
      if (
        bimobject.Status == 'published' ||
        ['object_creator', 'validator'].includes(self.props.RoleKey)
      ) {
        buttonActionEdit = (
          <Tooltip title={this.props.resources.BimObjectDetails.EditToolTip}>
            <Link
              to={`/${this.props.Language}/bimobject/${bimobject.Id}/edit/informations`}
              className="btn-edit"
            >
              <EditIcon />
            </Link>
          </Tooltip>
        );
      } else {
        buttonActionEdit = (
          <Tooltip title={this.props.resources.BimObjectDetails.EditToolTip}>
            <Link
              to={`/${this.props.Language}/bimobject/${bimobject.Id}/edit/publication`}
              className="btn-edit-fab"
            >
              <Fab>
                <EditIcon />
              </Fab>
            </Link>
          </Tooltip>
        );
      }
    }

    /* Button "Favorite" */
    const isBimObjectFavorite = isFavorite(bimobject);

    const handleClickFavorite = () => {
      const bimObjectFavorite = {
        Id: bimobject.Id,
        IsFavorite: !isBimObjectFavorite,
      };

      // Details page
      if (!self.props.bimobject) {
        self.setState({
          bimobject: updateBimObjectGroupsList(self.state.bimobject, bimObjectFavorite),
        });
      }

      // Is the last favorite bimObject is removed from the favorites
      if (
        isBimObjectFavorite &&
        this.props.isFilteredByFavorites &&
        this.props.objectsCount === 1
      ) {
        // Remove the favorite group filter
        const newGroupFilters = this.props.groupFilters
          .filter((group) => group.selected && !group.isFavorite)
          .map((selectedGroup) => selectedGroup.value);

        this.props.setGroupsFilter(newGroupFilters);
      }
      // If object is remove from favorites or the filters doesn't contain the favorite group filter
      else if (isBimObjectFavorite || !this.props.hasFavoriteGroupFilter) {
        // Reload filters
        const options = {
          withFilters: true,
          withResults: false,
        };

        this.props.searchObjects(options);
      }

      self.props.updateCollectionBimObjects([bimObjectFavorite]);

      // Add to favorites
      if (!isBimObjectFavorite) {
        this.props.sendAnalytics('user-added-object-to-collection');
      }
    };

    const favoriteTooltipValue = isBimObjectFavorite
      ? this.props.resources.BimObjectDetails.RemoveFromFavorite
      : this.props.resources.BimObjectDetails.AddToFavorite;
    const buttonFavorite = self.props.RoleKey !== 'partner' &&
      this.state.IsOnManagementCloud &&
      (bimobject.Status === 'published' || self.props.RoleKey !== 'member') && (
        <DS_Tooltip value={favoriteTooltipValue}>
          <Button
            variant={isBimObjectFavorite ? 'secondary' : 'alternative'}
            icon={isBimObjectFavorite ? 'favorite' : 'favorite-outline'}
            className="favorite-button"
            onClick={handleClickFavorite}
          />
        </DS_Tooltip>
      );

    const description = bimobject.Description;
    let contentManufacturer;
    let contactCreatorName;

    const MAX_CHARACTERS = 12;

    if (bimobject.Manufacturer != null && bimobject.Manufacturer.Id > 0) {
      contentManufacturer = (
        <Typography variant="subtitle1" className="brand-logo">
          <CustomTooltip Text={bimobject.Manufacturer.Name} MaxCharacters={MAX_CHARACTERS} />
        </Typography>
      );

      contactCreatorName = this.props.resources.BimObjectDetails.ContactCreatorLabel;
    } else {
      if (bimobject.ManufacturerTag != null) {
        contentManufacturer = (
          <Typography variant="subtitle1" className="brand-logo">
            <CustomTooltip
              Text={
                bimobject.ManufacturerTag.Name != null
                  ? bimobject.ManufacturerTag.Name
                  : bimobject.ManufacturerTag
              }
              MaxCharacters={MAX_CHARACTERS}
            />
          </Typography>
        );
      } else {
        contentManufacturer = (
          <Typography variant="subtitle1" className="brand-logo">
            <CustomTooltip
              Text={this.props.resources.SearchResults.ObjectTypeFilterGenericOfficial}
              MaxCharacters={MAX_CHARACTERS}
            />
          </Typography>
        );
      }
      contactCreatorName = this.props.resources.BimObjectDetails.ContactCreatorWithName;

      if (contactCreatorName != null && typeof contactCreatorName === 'string') {
        contactCreatorName = contactCreatorName.replace('[CreatorName]', bimobject.CreatorName);
      }
    }

    const classifications = [];
    if (bimobject.Classifications != null) {
      for (const i in bimobject.Classifications) {
        const color = `classif ${bimobject.Classifications[i].ColorCode != null
          ? Utils.getClassificationColor(bimobject.Classifications[i].ColorCode, true)
          : Utils.getClassificationColor(bimobject.Classifications[i].ClassificationId)
          }`;
        classifications.push(
          <span className={color} key={bimobject.Classifications[i].ClassificationId}>
            {bimobject.Classifications[i].LeafName}
          </span>
        );
      }
    } else if (bimobject.ClassificationNodes != null) {
      for (const i in bimobject.ClassificationNodes) {
        const color = `classif ${bimobject.ClassificationNodes[i].ColorCode != null
          ? Utils.getClassificationColor(bimobject.ClassificationNodes[i].ColorCode, true)
          : Utils.getClassificationColor(bimobject.ClassificationNodes[i].ClassificationId)
          }`;
        classifications.push(
          <span className={color} key={bimobject.ClassificationNodes[i].ClassificationId}>
            {bimobject.ClassificationNodes[i].NodeName}
          </span>
        );
      }
    }

    let photoDisplay;

    if (
      (!isDeployed ||
        this.state.data == null ||
        (this.state.data.Photos.length < 2 && model3DPreview === undefined)) &&
      !this.state.detailsPage
    ) {
      const classPhoto = isDeployed ? 'no-deploy-card' : '';
      photoDisplay = (
        <img
          id={`bimobject-default-photo-${bimobject.Id}`}
          src={`${bimobject.Photo}?width=120&height=120&scale=both`}
          alt={bimobject.Name}
          height="120"
          width="120"
          className={classPhoto}
        />
      );
    } else {
      const carouselControl = [];
      const photos = _.map(this.state.data.Photos, (photo, i) => {
        if (photo.IsDefault) {
          carouselControl.push(
            <li
              key={i}
              data-target={`#carousel-photos-${bimobject.Id}`}
              data-slide-to={i}
              className="active no-deploy-card hidden-xs"
            />
          );
          return (
            <div className="item active no-deploy-card" key={i}>
              <img
                src={`${photo.Path}?width=120&height=120&scale=both`}
                height="120"
                width="120"
                className="no-deploy-card"
              />
            </div>
          );
        }
        carouselControl.push(
          <li
            key={i}
            data-target={`#carousel-photos-${bimobject.Id}`}
            data-slide-to={i}
            className="no-deploy-card hidden-xs"
          />
        );
        return (
          <div className="item no-deploy-card" key={i}>
            <img
              src={`${photo.Path}?width=120&height=120&scale=both`}
              height="120"
              width="120"
              className="no-deploy-card"
            />
          </div>
        );
      });

      if (model3DPreview) {
        carouselControl.push(
          <li
            key="3dviewer"
            data-target={`#carousel-photos-${bimobject.Id}`}
            data-slide-to="viewer"
            className="no-deploy-card hidden-xs"
          />
        );
        photos.push(
          <div
            className={`item no-deploy-card ${photos.length === 0 ? 'active' : ''}`}
            key="viewer"
          >
            <div className="threedviewer-img no-deploy-card" onClick={this.expandViewer3D}>
              <span>3D</span>
            </div>
          </div>
        );
      }

      photoDisplay = (
        <div
          id={`carousel-photos-${bimobject.Id}`}
          className="carousel slide no-deploy-card"
          data-ride="carousel"
          data-interval="4000"
        >
          <div className="carousel-inner no-deploy-card" role="listbox">
            {photos}
            {photos.length > 1 && (
              <>
                <a
                  className="left carousel-control no-deploy-card"
                  role="button"
                  data-slide="prev"
                  href={`#carousel-photos-${bimobject.Id}`}
                >
                  <KeyboardArrowLeftIcon className="no-deploy-card" />
                </a>
                <a
                  className="right carousel-control no-deploy-card"
                  role="button"
                  data-slide="next"
                  href={`#carousel-photos-${bimobject.Id}`}
                >
                  <KeyboardArrowRightIcon className="no-deploy-card" />
                </a>
              </>
            )}
          </div>
          <ol className="carousel-indicators no-deploy-card">{carouselControl}</ol>
        </div>
      );
    }

    const variantConfigurator =
      this.state.linkedReferences && this.state.currentReference
        ? this.state.currentReference
        : null;
    const linkedVariantConfigurator =
      this.state.linkedReferences && this.state.currentReference
        ? this.state.linkedReferences
        : null;
    const configurator = (
      <ConfiguratorForm
        url={this.state.data?.Configurators[0]?.Url}
        bimobjectId={bimobject.Id}
        modelId={
          this.state.data?.ThreeDModels?.length > 0 ? this.state.data?.ThreeDModels[0].Id : 0
        }
        active={this.state.displayConfigurator}
        onClose={this.toggleConfigurator}
        variant={
          variantConfigurator && {
            ...variantConfigurator,
            VariantId: parseInt(variantConfigurator?.VariantId),
          }
        }
        linkedVariants={
          linkedVariantConfigurator &&
          linkedVariantConfigurator?.map((variantElm) => ({
            ...variantElm,
            VariantId: parseInt(variantElm?.VariantId),
          }))
        }
      />
    );

    return (
      <MuiThemeProvider theme={OnflyMuiThemeV1.theme}>
        {configurator}
        <div className={classPanelObject} id={`panel-object-${bimobject.Id}`}>
          <div id={`panel-object-content-${bimobject.Id}`} className="panel-object-content">
            <table
              onClick={this.selectBimObject}
              data-id={bimobject.Id}
              className={this.state.cardHeaderIsVisible || !isDeployed ? '' : 'hidden'}
            >
              <tbody>
                <tr>
                  <td className="bimobject-photo">
                    <div className="fab-name">
                      {contentManufacturer}
                      {bimobject.Manufacturer != null && bimobject.Manufacturer.Id > 0 ? (
                        <img
                          src="/Content/images/icon-certified-manufacturer.svg"
                          className="certified-manufacturer"
                          alt=""
                        />
                      ) : null}
                    </div>
                    {photoDisplay}
                    <a className="fab-contact no-deploy-card" onClick={this.contactAuthor}>
                      {contactCreatorName}
                    </a>
                  </td>
                  <td className="bimobject-info">
                    <div className={isDeployed ? 'bimobject-name opened' : 'bimobject-name'}>
                      {bimobject.Status !== 'published' ? <VisibilityOffIcon /> : null}
                      <span>{bimobject.Name}</span>
                    </div>

                    <div
                      className={
                        isDeployed && this.state.data != null
                          ? this.state.DisplayFullDescription
                            ? 'bimobject-description opened full'
                            : 'bimobject-description opened'
                          : 'bimobject-description'
                      }
                    >
                      <div className="description-container">{description}</div>
                    </div>

                    <span
                      className="view-more no-deploy-card hidden"
                      onClick={this.toggleFullDescription}
                    >
                      {this.state.DisplayFullDescription
                        ? this.props.resources.BimObjectDetails.ReadLess
                        : this.props.resources.BimObjectDetails.ReadMore}
                    </span>
                    <div
                      className={
                        isDeployed && this.state.data != null
                          ? 'bimobject-classif opened'
                          : 'bimobject-classif'
                      }
                    >
                      {isDeployed && this.state.data != null ? (
                        ''
                      ) : (
                        <span
                          className="more-classifs xs pull-right hidden"
                          id={`more-classifs-${bimobject.Id}`}
                        />
                      )}
                      {classifications}
                    </div>

                    <div className="bimobject-creation">
                      {this.props.resources.BimObjectDetailsInfos.CreationDateLabel} :
                      {moment(bimobject.CreatedAt, 'YYYYMMDDHHmmss').format('L')}
                      <br />
                      {this.props.resources.BimObjectDetailsInfos.UpdateDateLabel} :
                      {moment(bimobject.UpdatedAt, 'YYYYMMDDHHmmss').format('L')}
                      {bimobject.LastRevision != null ? ` | ${bimobject.LastRevision}` : null}
                    </div>

                    <RefsAndTags id="refsAndTags" className={isDeployed ? '' : 'hidden'}>
                      {this.state.data?.Configurators?.length > 0 ? (
                        <Button onClick={this.toggleConfigurator}>
                          {this.props.resources.BimObjectDetails.Configure}
                        </Button>
                      ) : (
                        this.state.data && (
                          <Reference>
                            <RefsAndTagsTitles>
                              {this.props.resources.BimObjectDetails.ReferencesList}
                            </RefsAndTagsTitles>
                            <Select
                              value={
                                this.state.currentReference !== null
                                  ? this.state.currentReference
                                  : currentReferences[0]
                              }
                              getOptionValue={(variant) => variant.Id}
                              getOptionLabel={(variant) => variant.Name}
                              onChange={onChangeReference}
                              options={currentReferences}
                            />
                          </Reference>
                        )
                      )}

                      <Tags>
                        <div
                          className={isDeployed && this.state.data != null ? 'tags opened' : 'tags'}
                        >
                          {bimobject.Pins && bimobject.Pins.length > 0 && (
                            <RefsAndTagsTitles>
                              {this.props.resources.BimObjectDetails.TagsList}
                            </RefsAndTagsTitles>
                          )}
                          {tags}
                        </div>
                      </Tags>
                    </RefsAndTags>
                  </td>
                  {bimobject.Status == 'published' ? (
                    <td className="bimobject-actions">
                      <Tooltip
                        title={this.props.resources.BimObjectDetails.DownloadBimObjectToolTip}
                      >
                        <button
                          className="btn-download no-deploy-card btn-action-card"
                          onClick={this.selectModelsTab}
                        >
                          <CloudDownloadIcon className="no-deploy-card" />
                        </button>
                      </Tooltip>
                      {buttonActionEdit}
                      {buttonFavorite}
                      {buttonAction}
                    </td>
                  ) : (
                    <td className="bimobject-actions">
                      {buttonActionEdit}
                      <Tooltip
                        title={this.props.resources.BimObjectDetails.DownloadBimObjectToolTip}
                      >
                        <button
                          className="btn-download no-deploy-card btn-action-card"
                          onClick={this.selectModelsTab}
                        >
                          <CloudDownloadIcon className="no-deploy-card" />
                        </button>
                      </Tooltip>
                      {buttonFavorite}
                      {buttonAction}
                    </td>
                  )}
                </tr>
              </tbody>
            </table>

            <BimObjectDetails2
              bimobjectId={bimobject.Id}
              displayed={isDeployed}
              canEdit={bimobject.CanEdit}
              data={this.state.data}
              selectedVariantId={
                this.state.currentReference != null
                  ? this.state.currentReference.VariantId
                  : currentReferences[0] != null
                    ? currentReferences[0].VariantId
                    : 0
              }
              tabSelected={this.state.tabSelected}
              changeTabSelection={this.changeTabSelection}
              detailsPage={this.state.detailsPage}
              expandViewer3D={this.expandViewer3D}
              cardHeaderIsVisible={this.state.cardHeaderIsVisible}
              toggleCarHeaderVisibility={this.toggleCarHeaderVisibility}
              loadBimObjectInformations={this.loadBimObjectInformations}
            />
          </div>
        </div>
      </MuiThemeProvider>
    );
  },
});

const mapStateToProps = function (store, ownProps) {
  let currentSearchState;
  const { searchState } = store;
  const { searchGroupState } = store;
  const currentManageSearchState = store.manageSearchState;
  const { appState } = store;
  const isManage = ownProps.location.pathname == `/${appState.Language}/manage-objects`;

  if (ownProps.params.groupId > 0) {
    currentSearchState = searchGroupState;
  } else if (isManage === true) {
    currentSearchState = currentManageSearchState;
  } else {
    currentSearchState = searchState;
  }

  return {
    resources: appState.Resources[appState.Language],
    ready: typeof appState.Resources[appState.Language] !== 'undefined',
    Language: appState.Language,
    RoleKey: appState.RoleKey,
    TemporaryToken: appState.TemporaryToken,
    ManagementCloudId: appState.ManagementCloudId,
    DefaultSelectedTabDetailsPage: appState.DefaultSelectedTabDetailsPage,
    ObjectIdOpened: currentSearchState.ObjectIdOpened,
    PlatformUrl: appState.PlatformUrl,
    SearchContextAction: currentSearchState.SearchContextAction,
    hasFavoriteGroupFilter: selectHasFavoriteGroupFilter(store),
    isFilteredByFavorites: selectIsFilteredByFavorites(store),
    objectsCount: selectObjectsCount(store),
    groupFilters: selectGroupsFilter(store),
  };
};

const mapDispatchToProps = (dispatch) => ({
  sendAnalytics: (event) => dispatch(sendAnalytics(event)),
  updateCollectionBimObjects: (bimObjects) => dispatch(updateCollectionBimObjects(bimObjects)),
  searchObjects: (options) => dispatch(searchObjects(options)),
  setGroupsFilter: (groups) => dispatch(setGroupFilters(groups)),
});

export default BimObjectRow = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BimObjectRow)
);