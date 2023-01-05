import React from 'react';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import { Input } from '@bim-co/componentui-foundation';
import _ from 'underscore';

// Material UI
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Material UI Icon
import iconSearch from '../../../../Content/images/icon-search.svg';

let MappingMenu = createReactClass({
  render() {
    const domainList = this.props.DomainList;
    const nbPropertiesToConnectLater =
      this.props.NbPropertiesToConnectLater != null ? this.props.NbPropertiesToConnectLater : 0;
    const handleClickMenuDomain = this.props.HandleClickMenuDomain;
    const handleClickMenuToConnectLater = this.props.HandleClickMenuToConnectLater;
    const handleChangeSearch = this.props.HandleChangeSearch;

    let domainsListNav;
    // not used, but will be used back after fixing in backend
    if (domainList != null) {
      domainsListNav = _.map(domainList, (domain, i) => (
        <ListItem
          key={`nav-domain-${domain.Id}`}
          id={`domain-title-${domain.Id}`}
          onClick={(event) => handleClickMenuDomain(event, domain)}
          button
          divider={nbPropertiesToConnectLater > 0 && i + 1 == domainList.length}
        >
          <ListItemText primary={domain.Name} />
        </ListItem>
      ));
    }

    return (
      <div id="dictionary-domains" className="left-panel">
        {domainList != null && handleChangeSearch != null ? (
          <Input
            placeholder={this.props.Resources.ContentManagementDictionary.Search}
            onChange={handleChangeSearch}
            iconLeft={iconSearch}
          />
        ) : null}
        <div id="lp-nav-container">
          {domainList != null ? (
            <List component="nav" className="lp-nav">
              {/*domainsListNav*/}
              {nbPropertiesToConnectLater > 0 ? (
                <ListItem
                  key="nav-domain-to-connect-later"
                  id="connect-later-title"
                  button
                  onClick={handleClickMenuToConnectLater}
                >
                  <ListItemText
                    primary={this.props.Resources.ContentManagementDictionary.ToConnectLater}
                  />
                  <span className="badge-nb-properties">{nbPropertiesToConnectLater}</span>
                </ListItem>
              ) : null}
            </List>
          ) : null}
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Language: appState.Language,
    Resources: appState.Resources[appState.Language],
  };
};

export default MappingMenu = connect(mapStateToProps)(MappingMenu);