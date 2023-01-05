import React from 'react';
import createReactClass from 'create-react-class';

import toastr from 'toastr';
import _ from 'underscore';
import * as Utils from '../../Utils/utils.js';
import { API_URL } from '../../Api/constants';

const SearchPinsDocument = createReactClass({
  getInitialState() {
    return {
      result_pins: [],
      selected_pins: [],
      query: '',
    };
  },

  componentDidMount() {
    if (this.state.result_pins.length === 0) {
      this.searchPins();
    }
  },

  selectSearchedPin(event) {
    const { id } = event.target.dataset;
    this.props.AddPin(id);
  },

  addNewPin() {
    const value = this.state.query;
    const self = this;

    fetch(
      `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/pin/new/add?token=${this.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PinName: value,
        }),
      }
    ).then((response) => {
      self.searchPins();
      if (response.status == 200) {
        toastr.success(self.props.Resources.TagSearch.AddTagSuccess);
      } else {
        toastr.error(self.props.Resources.TagSearch.AddTagFail);
      }
    });
  },

  searchPins() {
    let { value } = this.refs.searchpin;
    value = Utils.normalizeTag(this.refs.searchpin.value);
    this.refs.searchpin.value = value;

    const self = this;

    $.ajax({
      type: 'GET',
      url: `${API_URL}/api/ws/v1/contentmanagement/${this.props.ManagementCloudId}/pin/list?token=${this.props.TemporaryToken}&search=${value}&size=100`,
      dataType: 'json',
      contentType: 'application/json; charset=utf-8',
      async: true,
      success(data) {
        self.setState({ result_pins: data, query: value });
      },
    });
  },

  render() {
    const self = this;
    const pins_result = _.map(this.state.result_pins, (pin, i) => (
      <div
        key={i}
        className="pin-item-search-result legende"
        data-id={pin.ContentmanagementPinId}
        data-value={pin.ContentmanagementPinName}
        onClick={self.selectSearchedPin}
      >
        {pin.ContentmanagementPinName}
      </div>
    ));

    let create_new_pin = '';
    if (
      this.state.query !== '' &&
      ((this.state.result_pins.length > 0 &&
        this.state.result_pins[0].ContentmanagementPinName !== this.state.query) ||
        this.state.result_pins.length === 0)
    ) {
      create_new_pin = (
        <a className="create-missing-tag legende" onClick={this.addNewPin}>
          {this.props.Resources.SearchResults.AddTagLabel} {this.state.query}
        </a>
      );
    }

    return (
      <div className="search-tags">
        <input
          type="text"
          placeholder={this.props.Resources.TagSearch.TagPlaceholder}
          ref="searchpin"
          onChange={this.searchPins}
        />
        <div className="searched-pins">
          {pins_result}
          {create_new_pin}
        </div>
      </div>
    );
  },
});

export default SearchPinsDocument;