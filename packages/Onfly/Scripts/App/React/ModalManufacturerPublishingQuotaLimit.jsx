import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import CloseIcon from '@material-ui/icons/Close.js';
import * as Fancychart from '../../fancychart.js';

import * as Utils from '../Utils/utils.js';

// material ui icons

class ModalManufacturerPublishingQuotaLimit extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.showModalManufacturerPublishQuota &&
      nextProps.manufacturerQuotaPublishVMList != null &&
      nextProps.manufacturerQuotaPublishVMList.length > 0
    ) {
      this.showModalManufacturerPublishQuota(nextProps.manufacturerQuotaPublishVMList);
    }
  }

  getColorPerPercentage(percentage) {
    const colors = ['#d1d929', '#F7AC38', '#e9485b']; // $acid-green, $neutral-orange, $danger-zone-red

    let colorSelect = colors[2];

    if (percentage <= 50) {
      colorSelect = colors[0];
    } else if (percentage <= 80) {
      colorSelect = colors[1];
    } else {
      colorSelect = colors[2];
    }

    return colorSelect;
  }

  resetModal() {
    const self = this;

    const modalPublishQuota = '#manufacturer-publish-quota-modal';

    $(`${modalPublishQuota} #manufacturer-quota-limit-alert`).empty();
    $(`${modalPublishQuota} #manufacturer-quota-option-list`).empty();
    $(`${modalPublishQuota} #manufacturer-quota-option-list`).show();

    $(`${modalPublishQuota} #donut-storage-space`).empty();

    $(`${modalPublishQuota} #storage-info`).show();

    $(`${modalPublishQuota} #manufacturer-quota-links`).html(
      `<button class='btn-second btn-grey' data-dismiss='modal'>${self.props.resources.MetaResource.Close}</button>`
    );

    $(`${modalPublishQuota} #table-manufacturers-publishing-quota`).hide();
    $(`${modalPublishQuota} #table-manufacturers-publishing-quota tbody`).empty();
  }

  // PARAM : manufacturerQuotaPublishVMList - List<ManufacturerQuotaPublishObjectViewModel>
  // PARAM : multiplePublishing - bool
  //        False par défaut
  //        True Si plusieurs objets sont publiés en même temps
  showModalManufacturerPublishQuota(manufacturerQuotaPublishVMList, multiplePublishing) {
    multiplePublishing = multiplePublishing || false;

    const self = this;

    const modalPublishQuota = '#manufacturer-publish-quota-modal';

    self.resetModal();

    if (manufacturerQuotaPublishVMList.length == 1) {
      // Publication de un ou plusieurs objet(s) d'un fabricant
      const manufacturerQuotaPublishVM = manufacturerQuotaPublishVMList[0];

      const chart = new Fancychart.Fancychart(115, 115, '#e5e5e5');
      let usedStorageSpacePercent = Math.round(
        (manufacturerQuotaPublishVM.UsedStorageSpace / manufacturerQuotaPublishVM.MaxStorageSpace) *
        100
      );

      if (usedStorageSpacePercent > 100) {
        usedStorageSpacePercent = 100;
      }

      const colorStorageSpace = self.getColorPerPercentage(usedStorageSpacePercent);

      let storageSpaceToRelease = '';
      let sizeStorageSpaceToRelease = 0;

      if (
        manufacturerQuotaPublishVM.MediaType != null &&
        manufacturerQuotaPublishVM.MediaType != '' &&
        manufacturerQuotaPublishVM.MediaSize > 0
      ) {
        // Upload de fichiers
        if (manufacturerQuotaPublishVM.MediaSize <= manufacturerQuotaPublishVM.MaxStorageSpace) {
          sizeStorageSpaceToRelease =
            manufacturerQuotaPublishVM.UsedStorageSpace +
            manufacturerQuotaPublishVM.MediaSize -
            manufacturerQuotaPublishVM.MaxStorageSpace;
        }
      } else if (
        manufacturerQuotaPublishVM.ObjectSize <= manufacturerQuotaPublishVM.MaxStorageSpace
      ) {
        // Publication d'objet
        sizeStorageSpaceToRelease =
          manufacturerQuotaPublishVM.UsedStorageSpace +
          manufacturerQuotaPublishVM.ObjectSize -
          manufacturerQuotaPublishVM.MaxStorageSpace;
      }

      if (sizeStorageSpaceToRelease > 0) {
        storageSpaceToRelease = `<strong>${Utils.getReadableSize(
          sizeStorageSpaceToRelease
        )}</strong>`;
      }

      let manufacturerQuotaLimitAlert =
        self.props.resources.BimObjectPublish.ManufacturerQuotaLimitAlert;
      manufacturerQuotaLimitAlert = manufacturerQuotaLimitAlert.replace(
        '[ManufacturerName]',
        `<strong>${manufacturerQuotaPublishVM.ManufacturerName}</strong>`
      );

      const donutValue = Utils.getReadableSize(manufacturerQuotaPublishVM.UsedStorageSpace);
      const donutMaxValue = Utils.getReadableSize(manufacturerQuotaPublishVM.MaxStorageSpace);

      let objectPublishTitle = self.props.resources.BimObjectPublish.YourObjectSingularTitle;
      let classIconObject = 'icons-svg icon-cube';

      // Si plusieurs objets sont publiés en même temps
      if (multiplePublishing) {
        objectPublishTitle = self.props.resources.BimObjectPublish.YourObjectsPluralTitle;
        classIconObject = 'icons-svg icon-cubes';
      }

      // Liens
      const baseUrl = `${self.props.PlatformUrl}/${self.props.Language}/onflyconnect?token=${self.props.TemporaryToken}&returnUrl=`;
      const manageObjectsLink = `${baseUrl}/${self.props.Language}/${manufacturerQuotaPublishVM.ManufacturerControllerDisplay}/${manufacturerQuotaPublishVM.ManufacturerDisplayId}/edit/objects`;

      const upgradePlanLink = `${baseUrl}/${self.props.Language}/${manufacturerQuotaPublishVM.ManufacturerControllerDisplay}/${manufacturerQuotaPublishVM.ManufacturerDisplayId}/edit/subscription`;

      $(`${modalPublishQuota} #manufacturer-quota-limit-alert`).html(manufacturerQuotaLimitAlert);

      chart.donut(
        `${modalPublishQuota} #donut-storage-space`,
        usedStorageSpacePercent,
        colorStorageSpace
      );

      $(`${modalPublishQuota} .donut-value`).text(donutValue); // .css('color',colorStorageSpace)
      $(`${modalPublishQuota} .donut-max-value`).text(donutMaxValue);

      $(`${modalPublishQuota} #your-object-publish .title`).html(objectPublishTitle);
      $(`${modalPublishQuota} #object-size`).html(
        `<i class='${classIconObject}' aria-hidden='true'></i>${Utils.getReadableSize(
          manufacturerQuotaPublishVM.ObjectSize
        )}`
      );

      // Affiche la taille des fichiers uploadé
      if (
        manufacturerQuotaPublishVM.MediaType != null &&
        manufacturerQuotaPublishVM.MediaType != '' &&
        manufacturerQuotaPublishVM.MediaSize > 0
      ) {
        $(`${modalPublishQuota} #files-size`).html(
          `<i class='icons-svg icon-file' aria-hidden='true'></i> + ${Utils.getReadableSize(
            manufacturerQuotaPublishVM.MediaSize
          )}`
        );
        $(`${modalPublishQuota} #files-size`).show();
      }

      let manufacturerOptionTittle = '';

      switch (manufacturerQuotaPublishVM.MediaType) {
        case 'document':
          manufacturerOptionTittle =
            self.props.resources.BimObjectPublish.ManufacturerQuotaToAddMoreDocuments;
          break;
        case '3dmodel':
          manufacturerOptionTittle =
            self.props.resources.BimObjectPublish.ManufacturerQuotaToAddMoreModels;
          break;
        case '2dmodel':
          manufacturerOptionTittle =
            self.props.resources.BimObjectPublish.ManufacturerQuotaToAddMoreModels;
          break;
        case 'photo':
          manufacturerOptionTittle =
            self.props.resources.BimObjectPublish.ManufacturerQuotaToAddMorePhotos;
          break;
        default:
          manufacturerOptionTittle =
            self.props.resources.BimObjectPublish.ManufacturerQuotaToPublishMore;
      }

      $(`${modalPublishQuota} #manufacturer-option-title`).html(manufacturerOptionTittle);

      // Affichage des ressources et des boutons en fonction du role
      if (
        ['member', 'object_creator', 'content_manager', 'validator'].includes(
          manufacturerQuotaPublishVM.Role
        )
      ) {
        $(`${modalPublishQuota} #manufacturer-quota-option-list`).prepend(
          `<li>${self.props.resources.BimObjectPublish.ManufacturerQuotaContactAdmin}</li>`
        );
      }

      if (['admin', 'content_manager'].indexOf(manufacturerQuotaPublishVM.Role) > -1) {
        if (storageSpaceToRelease != '') {
          let liFreeUpStorageSpace =
            self.props.resources.BimObjectPublish.ManufacturerQuotaFreeUpStorageSpace;
          liFreeUpStorageSpace = `<li>${liFreeUpStorageSpace.replace(
            '[StorageSpaceToRelease]',
            storageSpaceToRelease
          )}</li>`;

          $(`${modalPublishQuota} #manufacturer-quota-option-list`).prepend(liFreeUpStorageSpace);
        }

        $(`${modalPublishQuota} #manufacturer-quota-links`).append(
          `<a id='manage-objects-link' class='btn-second' href='${manageObjectsLink}' target='_blank'>${self.props.resources.EditionPagesWizard.ManufacturerObjects}</a>`
        );
      }

      if (['admin'].indexOf(manufacturerQuotaPublishVM.Role) > -1) {
        $(`${modalPublishQuota} #manufacturer-quota-option-list`).prepend(
          `<li>${self.props.resources.BimObjectPublish.ManufacturerQuotaUpgradeYourPlan}</li>`
        );

        $(`${modalPublishQuota} #manufacturer-quota-links`).append(
          `<a class='btn-first btn-blue' href='${upgradePlanLink}' target='_blank'>${self.props.resources.BimObjectPublish.ManufacturerUpgradePlan}</a>`
        );
      }

      $(modalPublishQuota).modal('show');
    } else if (manufacturerQuotaPublishVMList.length > 1) {
      // Publication de plusieurs objets de plusieurs fabricants (Uniquement pour les admins BIM&CO)
      $.each(manufacturerQuotaPublishVMList, (index, manufacturerQuotaPublishVM) => {
        const storageSpaceToRelease =
          manufacturerQuotaPublishVM.UsedStorageSpace +
          manufacturerQuotaPublishVM.ObjectSize -
          manufacturerQuotaPublishVM.MaxStorageSpace;

        $(`${modalPublishQuota} #table-manufacturers-publishing-quota tbody`).append(
          `${'<tr>' + '<td>'}${manufacturerQuotaPublishVM.ManufacturerName}</td>` +
          `<td>${Utils.getReadableSize(manufacturerQuotaPublishVM.MaxStorageSpace)}</td>` +
          `<td>${Utils.getReadableSize(manufacturerQuotaPublishVM.UsedStorageSpace)}</td>` +
          `<td>${Utils.getReadableSize(manufacturerQuotaPublishVM.ObjectSize)}</td>` +
          `<td>${Utils.getReadableSize(storageSpaceToRelease)}</td>` +
          '</tr>'
        );
      });

      $(`${modalPublishQuota} #manufacturer-quota-limit-alert`).html(
        'You have reached the limit of the following manufacturers plans.'
      );

      $(`${modalPublishQuota} #manufacturer-option-block`).hide();
      $(`${modalPublishQuota} #storage-info`).hide();

      $(`${modalPublishQuota} #table-manufacturers-publishing-quota`).show();

      $(modalPublishQuota).modal('show');
    }
  }

  render() {
    const self = this;

    return (
      <div
        className="modal fade"
        id="manufacturer-publish-quota-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="manufacturer-publish-quota-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <CloseIcon />
              </button>
              <h3 id="manufacturer-quota-limit-alert" />
            </div>
            <div className="modal-body">
              <div id="manufacturer-option-block">
                <h3 id="manufacturer-option-title" />
                <ul id="manufacturer-quota-option-list" />
              </div>
              <div id="storage-info">
                <div className="donut-global">
                  <h4 className="title">
                    {self.props.resources.BimObjectPublish.YourStorageSpaceTitle}
                  </h4>
                  <div id="manufacturer-storage-space" className="donut-container">
                    <div className="donut-info">
                      <h4 className="donut-value" />
                      <h4 className="donut-max-value" />
                    </div>
                    <div id="donut-storage-space" />
                  </div>
                </div>
                <div id="your-object-publish">
                  <h4 className="title" />
                  <h4 id="object-size" />
                  <h4 id="files-size" />
                </div>
              </div>
              <table id="table-manufacturers-publishing-quota" className="table table-striped">
                <thead>
                  <tr>
                    <th>Manufacturer</th>
                    <th>Max. storage</th>
                    <th>Used storage</th>
                    <th>Selected objects</th>
                    <th>Storage to be freed</th>
                  </tr>
                </thead>
                <tbody />
              </table>
              <div id="manufacturer-quota-links" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

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
    PlatformUrl: appState.PlatformUrl,
  };
};

export default ModalManufacturerPublishingQuotaLimit = connect(mapStateToProps)(
  ModalManufacturerPublishingQuotaLimit
);