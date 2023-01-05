import React from 'react';
import createReactClass from 'create-react-class';
import ElementSearch from '../ElementSearch.jsx';
import store from '../../../../../Store/Store';
import { API_URL } from '../../../../../Api/constants';

const objectTypeRef = ['userContent', 'genericOfficial', 'official'];
const ManufacturerTags = createReactClass({
  getInitialState() {
    return {
      manufacturerTag: this.props.initialData,
    };
  },

  _setManufacturer(manufacturertag) {
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    const currentBimobjectId = this.props.bimObjectId != null ? this.props.bimObjectId : -1;
    fetch(
      `${API_URL}/api/ws/v2/bimobject/${currentBimobjectId}/manufacturertag/add?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Id: manufacturertag.Id, Name: manufacturertag.Name }),
      }
    )
      .then((response) => {
        store.dispatch({ type: 'LOADER', state: false });
        return response.json();
      })
      .then((json) => {
        // if object has been already created =>
        if (currentBimobjectId != -1) {
          self.props._handleChooseManufacturerTag(
            json.ManufacturerTag,
            objectTypeRef[json.DisplayObjectType]
          );
        }
        // else it's only manufacturer tag creation => redirect to creation page
        else {
          const manufTag = {
            Id: json.Id,
            Name: json.Name,
          };
          self.props._handleChooseManufacturerTag(manufTag, 'official', true);
        }
      });
  },

  _removeManufacturer() {
    const self = this;

    // we update
    if (
      this.props.bimObjectId != null &&
      this.props.bimObjectId != undefined &&
      this.props.bimObjectId != -1
    ) {
      store.dispatch({ type: 'LOADER', state: true });

      fetch(
        `${API_URL}/api/ws/v2/bimobject/${this.props.bimObjectId}/manufacturertag/${this.state.manufacturerTag.Id}/remove?token=${this.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
        .then((response) => {
          store.dispatch({ type: 'LOADER', state: false });
          return response.json();
        })
        .then((json) => {
          self.props._handleChooseManufacturerTag(null, objectTypeRef[json]);
        });
    }
    // else if we are in creation process, we just clean data
    else {
      self.props._handleChooseManufacturerTag(null, 'userContent', true);
    }
  },

  render() {
    let manufacturer;
    if (this.state.manufacturerTag != null) {
      manufacturer = (
        <span className="manufacturers-infos">
          <h5>{this.state.manufacturerTag.Name}</h5>
        </span>
      );
    }
    let classString = 'panel edit-object';
    if (!this.props.isAuthorized) {
      classString += ' edit-disabled';
    }
    let removeButton;
    if (this.state.manufacturerTag != null) {
      removeButton = (
        <button
          className="btn-second btn-red remove-btn remove-manufacturer-btn"
          onClick={this._removeManufacturer}
        >
          {this.props.resources.EditionPage.RemoveManufButton}
        </button>
      );
    }

    return (
      <div className={classString}>
        <div className="col-md-7">
          <h3>{this.props.resources.EditionPages.ManufacturerBlockTitle}</h3>
          <p>{this.props.resources.EditionPages.ManufacturerBlockDescription}</p>
        </div>
        <div className="col-md-7 col-md-offset-1">
          <ElementSearch
            bimobjectId={this.props.bimObjectId}
            itemType="manufacturerTag"
            searchPlaceholder={this.props.resources.EditionPage.SearchManufPlaceholder}
            resources={this.props.resources}
            queryUrl={`${API_URL}/api/ws/v1/bimobject/manufacturertag/search?token=${this.props.TemporaryToken}`}
            addElement={this._setManufacturer}
          />
          <br />
          {removeButton}
        </div>
        <div className="col-md-7 col-md-offset-1">{manufacturer}</div>
      </div>
    );
  },
});

export default ManufacturerTags;