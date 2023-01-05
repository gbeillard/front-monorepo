import React from 'react';
import { connect } from 'react-redux';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import styled from '@emotion/styled';
import List from 'react-virtualized/dist/commonjs/List';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';

// Material UI
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

// Material UI Icon
import WatchLaterIcon from '@material-ui/icons/WatchLaterOutlined.js';
import MappingPropertyConnectedLine from './MappingPropertyConnectedLine.jsx';
import CustomTooltip from '../CommonsElements/CustomTooltip.jsx';
import * as Utils from '../../Utils/utils.js';

const lineType = {
  CONNECTED_PROPERTIES_LIST: 'connected-properties-list',
  DOMAIN_TITLE: 'domain-title',
  PROPERTY_LINE: 'property-line',
  CONNECT_LATER_TITLE: 'connect-later-title',
  DOMAIN_CONNECT_LATER_TITLE: 'domain-connect-later-title',
  PROPERTY_CONNECT_LATER_LINE: 'property-connect-later-line',
  HORIZONTAL_DIVIDER: 'horizontal-divider',
};

const lineSize = {
  DOMAIN_TITLE_SIZE: 42,
  PROPERTY_LINE_SIZE: 35,
  CONNECT_LATER_TITLE_SIZE: 109,
  HORIZONTAL_DIVIDER_SIZE: 1,
  CONNECTED_PROPERTY_LINE: 38,
};

const MAX_CHARACTERS = 22;

const DomainTypography = styled(Typography)({
  fontSize: '16px',
});
const SmallTypography = styled(Typography)({
  fontSize: '12px',
});

let MappingPropertiesListV2 = createReactClass({
  getInitialState() {
    return {
      AllPropertyListRendered: [],
      SelectAllDomainList: [],
      OpenPopoverConnectLater: false,
      AnchorElPopoverConnectLater: null,
      PropertyIdListToConnectLater: [],
      DomainSelect: null,
      SelectedTabType: '',
    };
  },

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    if (
      this.props.ConnectedPropertiesList != null &&
      this.props.ConnectedPropertiesList.length > 0
    ) {
      this.state.SelectedTabType = 'CONNECTED';
    } else if (
      (this.props.PropertiesDomainList != null && this.props.PropertiesDomainList.length > 0) ||
      (this.props.PropertiesDomainConnectLaterList != null &&
        this.props.PropertiesDomainConnectLaterList.length > 0)
    ) {
      this.state.SelectedTabType = 'TO_CONNECT';
    }

    this.buildRenderList(this.props);
  },

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    const typeTabs = [];

    if (nextProps.ConnectedPropertiesList != null && nextProps.ConnectedPropertiesList.length > 0) {
      typeTabs.push('CONNECTED');
    }

    if (
      (nextProps.PropertiesDomainList != null && nextProps.PropertiesDomainList.length > 0) ||
      (nextProps.PropertiesDomainConnectLaterList != null &&
        nextProps.PropertiesDomainConnectLaterList.length > 0)
    ) {
      typeTabs.push('TO_CONNECT');
    }

    if (typeTabs.length > 0 && typeTabs.indexOf(this.state.SelectedTabType) == -1) {
      this.state.SelectedTabType = typeTabs[0];
    }


    this.buildRenderList(nextProps);
  },

  buildRenderList(props) {
    const self = this;
    let allPropertyListRendered = [];
    const listIndexMenu = [];

    // Connected properties list
    if (props.ConnectedPropertiesList.length > 0 && this.state.SelectedTabType == 'CONNECTED') {
      const propertiesConnected = [];
      const propertiesConnectedDeleted = [];

      _.each(props.ConnectedPropertiesList, (domain, i) => {
        if (domain.PropertyList != null) {
          _.each(domain.PropertyList, (property, y) => {
            const isLastChild = y == domain.PropertyList.length - 1;

            if (property.IsDeleted) {
              propertiesConnectedDeleted.push({
                type: lineType.CONNECTED_PROPERTY_LINE,
                size: lineSize.CONNECTED_PROPERTY_LINE,
                PropertyMappingConnected: property.PropertyMappingConnected,
                PropertyConnected: property,
                domainId: domain.Id,
                isSelectAll: false,
                isLastChild,
              });
            } else {
              propertiesConnected.push({
                type: lineType.CONNECTED_PROPERTY_LINE,
                size: lineSize.CONNECTED_PROPERTY_LINE,
                PropertyMappingConnected: property.PropertyMappingConnected,
                PropertyConnected: property,
                domainId: domain.Id,
                isSelectAll: false,
                isLastChild,
              });
            }
          });
        }
      });

      if (propertiesConnectedDeleted.length > 0) {
        allPropertyListRendered.push({
          IsTitle: true,
          Name: props.Resources.ContentManagementDictionary.ConnectedToDeleteProperty,
          size: lineSize.CONNECTED_PROPERTY_LINE,
        });
        allPropertyListRendered = allPropertyListRendered.concat(propertiesConnectedDeleted);
      }

      if (propertiesConnected.length > 0) {
        if (propertiesConnectedDeleted.length > 0) {
          allPropertyListRendered.push({
            IsTitle: true,
            Name: props.Resources.ContentManagementDictionary.Connected,
            size: lineSize.CONNECTED_PROPERTY_LINE,
          });
        } else {
          allPropertyListRendered.push({
            IsTitle: true,
            Name: '',
            size: lineSize.CONNECTED_PROPERTY_LINE,
          });
        }
        allPropertyListRendered = allPropertyListRendered.concat(propertiesConnected);
      }

      listIndexMenu.push({
        type: lineType.CONNECTED_PROPERTIES_LIST,
        index: allPropertyListRendered.length - 1,
      });

      allPropertyListRendered.push({
        type: lineType.HORIZONTAL_DIVIDER,
        size: lineSize.HORIZONTAL_DIVIDER_SIZE,
      });
    }

    // Properties list
    if (props.PropertiesDomainList.length > 0 && this.state.SelectedTabType == 'TO_CONNECT') {
      _.each(props.PropertiesDomainList, (domain, i) => {
        const isSelectAll = self.state.SelectAllDomainList.indexOf(domain.Id) > -1;
        const isFirst = i == 0;

        if (domain.PropertyList.length > 0) {
          allPropertyListRendered.push({
            type: lineType.DOMAIN_TITLE,
            size: lineSize.DOMAIN_TITLE_SIZE + (isFirst ? 20 : 0),
            domain,
            isSelectAll,
            isFirst,
          });

          listIndexMenu.push({
            type: lineType.DOMAIN_TITLE,
            id: domain.Id,
            index: allPropertyListRendered.length - 1,
          });

          _.each(domain.PropertyList, (property, y) => {
            const isLastChild = y == domain.PropertyList.length - 1;
            allPropertyListRendered.push({
              type: lineType.PROPERTY_LINE,
              size: lineSize.PROPERTY_LINE_SIZE + (isLastChild ? 10 : 0),
              property,
              domainId: domain.Id,
              isSelectAll,
              isLastChild,
            });
          });
        }
      });

      allPropertyListRendered.push({
        type: lineType.HORIZONTAL_DIVIDER,
        size: lineSize.HORIZONTAL_DIVIDER_SIZE,
        domainId: props.PropertiesDomainList[props.PropertiesDomainList.length - 1].Id,
      });
    }

    // Properties to connect later list
    if (
      props.PropertiesDomainConnectLaterList != null &&
      props.PropertiesDomainConnectLaterList.length > 0 &&
      this.state.SelectedTabType == 'TO_CONNECT'
    ) {
      allPropertyListRendered.push({
        type: lineType.CONNECT_LATER_TITLE,
        size: lineSize.CONNECT_LATER_TITLE_SIZE,
        title: props.Resources.ContentManagementDictionary.ToConnectLater,
      });

      listIndexMenu.push({
        type: lineType.CONNECT_LATER_TITLE,
        index: allPropertyListRendered.length - 1,
      });

      _.each(props.PropertiesDomainConnectLaterList, (domain, i) => {
        allPropertyListRendered.push({
          type: lineType.DOMAIN_CONNECT_LATER_TITLE,
          size: lineSize.DOMAIN_TITLE_SIZE,
          domain,
          isSelectAll: false,
          isFirst: i == 0,
        });

        _.each(domain.PropertyList, (property, y) => {
          const isLastChild = y == domain.PropertyList.length - 1;

          allPropertyListRendered.push({
            type: lineType.PROPERTY_CONNECT_LATER_LINE,
            size: lineSize.PROPERTY_LINE_SIZE + (isLastChild ? 10 : 0),
            property,
            isSelectAll: false,
            isLast: i == props.PropertiesDomainConnectLaterList.length - 1 && isLastChild,
            isLastChild,
          });
        });
      });
    }

    if (props.SetListIndexMenu != null) {
      props.SetListIndexMenu(listIndexMenu);
    }

    this.setState({
      AllPropertyListRendered: allPropertyListRendered,
    });

    if (this.refList != null) {
      this.refList.recomputeRowHeights();
    }
  },

  rowRenderer({ key, index, style }) {
    const element = this.state.AllPropertyListRendered[index];
    let row = null;

    if (element != null) {
      switch (element.type) {
        case lineType.CONNECTED_PROPERTY_LINE:
          if (element.IsTitle == true) {
            row = (
              <Typography variant="h6" className="title-list">
                {element.Name}
              </Typography>
            );
          } else {
            row = (
              <MappingPropertyConnectedLine
                PropertyMapping={element.PropertyMappingConnected}
                PropertyConnected={element.PropertyConnected}
                DisconnectProperty={this.props.DisconnectProperty}
              />
            );
          }
          break;
        case lineType.DOMAIN_TITLE:
          row = (
            <DomainTitle
              Domain={element.domain}
              Resources={this.props.Resources}
              IsSelectAll={element.isSelectAll}
              IsToConnectLater={false}
              HandleClickButtonConnectLater={
                this.props.HandleClickButtonConnectLater != null
                  ? this.handleClickButtonConnectLater
                  : null
              }
              HandleSelectAllClick={this.handleSelectAllClick}
              IsFirst={element.isFirst}
            />
          );
          break;
        case lineType.PROPERTY_LINE:
          row = (
            <PropertyLine
              Property={element.property}
              IsSelectAll={element.isSelectAll}
              IsToConnectLater={false}
              Resources={this.props.Resources}
              HandleClickButtonConnect={this.props.HandleClickButtonConnect}
              HandleClickButtonConnectLater={
                this.props.HandleClickButtonConnectLater != null
                  ? this.handleClickButtonConnectLater
                  : null
              }
              IsLastChild={element.isLastChild}
            />
          );
          break;
        case lineType.CONNECT_LATER_TITLE:
          row = (
            <div id="connect-later-title-container">
              <WatchLaterIcon className="connect-later-icon" />
              <SmallTypography variant="h6">{element.title}</SmallTypography>
            </div>
          );
          break;
        case lineType.DOMAIN_CONNECT_LATER_TITLE:
          row = (
            <DomainTitle
              Domain={element.domain}
              Resources={this.props.Resources}
              IsSelectAll={element.isSelectAll}
              IsToConnectLater
              IsFirst={element.isFirst}
            />
          );
          break;
        case lineType.PROPERTY_CONNECT_LATER_LINE:
          row = (
            <PropertyLine
              Property={element.property}
              IsSelectAll={element.isSelectAll}
              IsToConnectLater
              Resources={this.props.Resources}
              HandleClickButtonConnect={this.props.HandleClickButtonConnect}
              IsLast={element.isLast}
              IsLastChild={element.isLastChild}
            />
          );
          break;
        case lineType.HORIZONTAL_DIVIDER:
          row = <div className="horizontal-divider" />;
          break;
        default:
          break;
      }
    }

    return (
      <div style={style} key={key}>
        {row}
      </div>
    );
  },

  getRowHeight({ index }) {
    const element = this.state.AllPropertyListRendered[index];
    let size = 0;

    if (element != null) {
      size = element.size != null ? element.size : size;
    }

    return size;
  },

  setListRef(ref) {
    this.refList = ref;
    this.props.SetListRef(ref);
  },

  handleSelectAllClick(domain) {
    const domainIndex = this.state.SelectAllDomainList.indexOf(domain.Id);

    if (domainIndex == -1) {
      this.state.SelectAllDomainList.push(domain.Id);
    } else {
      this.state.SelectAllDomainList.splice(domainIndex, 1);
    }

    this.buildRenderList(this.props);
  },

  handleClickButtonConnectLater(event, propertyIdList, domain) {
    const cookieConnecterLaterHelp = Utils.getCookie('connect-later-help');

    if (cookieConnecterLaterHelp != '' && cookieConnecterLaterHelp == 'false') {
      if (domain != null) {
        const domainIndex = this.state.SelectAllDomainList.indexOf(domain.Id);
        if (domainIndex > -1) {
          this.state.SelectAllDomainList.splice(domainIndex, 1);
        }
      }

      this.props.HandleClickButtonConnectLater(propertyIdList);
    } else if (this.openPopinConnectLaterHelp != null) {
      if (event.currentTarget != null) {
        Utils.setCookie('connect-later-help', 'true', 3650);

        event.currentTarget.classList.add('elevation');

        this.openPopinConnectLaterHelp(event.currentTarget, propertyIdList, domain);
      }
    }
  },

  openPopinConnectLaterHelp(anchorEl, propertyIdListToConnectLater, domain) {
    this.setState({
      OpenPopoverConnectLater: true,
      AnchorElPopoverConnectLater: anchorEl,
      PropertyIdListToConnectLater: propertyIdListToConnectLater,
      DomainSelect: domain,
    });
  },

  handleClosePopoverConnectLater() {
    this.setState({ OpenPopoverConnectLater: false });

    const btnConnectLater = document.querySelector('.btn-connect-later.elevation');

    if (btnConnectLater != null) {
      btnConnectLater.classList.remove('elevation');
    }
  },

  handleClickButtonConnecterLaterOk() {
    Utils.setCookie('connect-later-help', 'false', 3650);

    if (this.state.DomainSelect != null) {
      const domainIndex = this.state.SelectAllDomainList.indexOf(this.state.DomainSelect.Id);
      if (domainIndex > -1) {
        this.state.SelectAllDomainList.splice(domainIndex, 1);
      }
    }

    this.props.HandleClickButtonConnectLater(this.state.PropertyIdListToConnectLater);
    this.handleClosePopoverConnectLater();
  },

  handleOnRowsRendered({ overscanStartIndex, overscanStopIndex, startIndex, stopIndex }) {
    if (
      this.state.AllPropertyListRendered != null &&
      this.state.AllPropertyListRendered.length > 0
    ) {
      if (overscanStartIndex != startIndex || overscanStopIndex != stopIndex) {
        let element = this.state.AllPropertyListRendered[startIndex];
        if (overscanStopIndex == stopIndex) {
          element = this.state.AllPropertyListRendered[stopIndex];
        }

        if (element != null) {
          let navElementName;
          let navElementId;

          switch (element.type) {
            case lineType.PROPERTY_LINE:
              navElementName = `${lineType.DOMAIN_TITLE}-${element.domainId}`;
              navElementId = element.domainId;
              break;
            case lineType.DOMAIN_TITLE:
              navElementName = `${lineType.DOMAIN_TITLE}-${element.domain.Id}`;
              navElementId = element.domain.Id;
              break;
            case lineType.CONNECTED_PROPERTIES_LIST:
            case lineType.CONNECT_LATER_TITLE:
              navElementName = element.type;
              break;
            case lineType.DOMAIN_CONNECT_LATER_TITLE:
            case lineType.PROPERTY_CONNECT_LATER_LINE:
              navElementName = lineType.CONNECT_LATER_TITLE;
              break;
            case lineType.HORIZONTAL_DIVIDER:
              navElementName = `${lineType.DOMAIN_TITLE}-${element.domainId}`;
              navElementId = element.domainId;
              break;
            default:
              break;
          }

          if (navElementName != null) {
            if (this.props.HandleSelectorDomainList != null && navElementId != null) {
              this.props.HandleSelectorDomainList(navElementId);
            } else {
              const elementNavSelected = document.querySelector(
                `${this.props.SelectorDomainList} .selected:not(#${navElementName})`
              );
              const elementNav = document.querySelector(
                `${this.props.SelectorDomainList} #${navElementName}:not(.selected)`
              );

              if (elementNavSelected != null) {
                elementNavSelected.classList.remove('selected');
              }

              if (elementNav != null) {
                elementNav.classList.add('selected');

                const navContainer = document.querySelector(this.props.SelectorDomainList);

                if (navContainer != null) {
                  const elementNavOffSet =
                    elementNav.offsetTop + elementNav.offsetHeight - navContainer.scrollTop;
                  if (elementNavOffSet < 0 || elementNavOffSet > navContainer.offsetHeight) {
                    // If element is not visible in menu
                    elementNav.scrollIntoView(false);
                  }
                }
              }
            }
          }
        }
      }
    }
  },

  handleClickTab(event, tabType) {
    this.state.SelectedTabType = tabType;
    this.buildRenderList(this.props);
  },

  render() {
    let nbTabs = -1;

    let tabConnected;
    let tabToConnect;

    if (
      this.props.ConnectedPropertiesList != null &&
      this.props.ConnectedPropertiesList.length > 0
    ) {
      nbTabs++;
      tabConnected = (
        <Tab
          key={nbTabs}
          label={this.props.Resources.ContentManagementDictionary.Connected}
          onClick={(event) => this.handleClickTab(event, 'CONNECTED')}
        />
      );
    }

    if (
      (this.props.PropertiesDomainList != null && this.props.PropertiesDomainList.length > 0) ||
      (this.props.PropertiesDomainConnectLaterList != null &&
        this.props.PropertiesDomainConnectLaterList.length > 0)
    ) {
      nbTabs++;
      tabToConnect = (
        <Tab
          key={nbTabs}
          label={this.props.Resources.ContentManagementDictionary.ToConnect}
          onClick={(event) => this.handleClickTab(event, 'TO_CONNECT')}
        />
      );
    }

    let selectedTab = 0;

    let listId;

    switch (this.state.SelectedTabType) {
      case 'CONNECTED':
        listId = 'properties-connected';
        break;
      case 'TO_CONNECT':
        listId = 'mapping-properties-list';

        if (nbTabs > 0) {
          selectedTab = 1;
        }
        break;
      default:
        break;
    }

    return (
      <div id="list-container">
        <div id="tabs-container">
          <Tabs value={selectedTab} indicatorColor="primary" centered>
            {tabConnected}
            {tabToConnect}
          </Tabs>
        </div>

        <AutoSizer>
          {({ height, width }) => (
            <List
              id={listId}
              className={this.state.OpenPopoverConnectLater ? ' disable-will-change' : ''}
              ref={this.setListRef}
              width={width}
              height={height - 49}
              rowCount={this.state.AllPropertyListRendered.length}
              rowHeight={this.getRowHeight}
              rowRenderer={this.rowRenderer}
              containerStyle={{ minWidth: '400px' }}
              scrollToAlignment="start"
              onRowsRendered={this.handleOnRowsRendered}
            />
          )}
        </AutoSizer>

        <Popover
          id="popover-connect-later-help"
          open={this.state.OpenPopoverConnectLater}
          onClose={this.handleClosePopoverConnectLater}
          PaperProps={{ id: 'paper-connect-later-help' }}
          BackdropProps={{ id: 'backdrop-connect-later-help' }}
          anchorEl={this.state.AnchorElPopoverConnectLater}
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
        >
          <div id="paper-content">
            <div className="popover-body">
              <div className="popover-icon">
                <img
                  src="/Content/images/connect-later-help.svg"
                  className="img-connect-later"
                  alt="connecter-later-icon"
                />
              </div>
              <div className="popover-content">
                <SmallTypography className="title" variant="h6" color="inherit" gutterBottom>
                  {this.props.Resources.ContentManagementDictionary.IsToConnectLater}
                </SmallTypography>
                <div className="text-container">
                  <SmallTypography className="text" variant="body2" color="inherit" gutterBottom>
                    {this.props.Resources.ContentManagementDictionary.ConnecterLaterHelp}
                  </SmallTypography>
                  <SmallTypography
                    id="shortcut-select-multiple-text"
                    variant="body2"
                    color="inherit"
                    gutterBottom
                  >
                    {/* <span dangerouslySetInnerHTML={{ __html: helpSelectMultipleText }}></span> */}
                  </SmallTypography>
                </div>
              </div>
            </div>
            <div className="popover-footer">
              <Button color="inherit" size="small" onClick={this.handleClickButtonConnecterLaterOk}>
                {this.props.Resources.ContentManagementDictionary.ConnectLaterHelpOk}
              </Button>
            </div>
          </div>
        </Popover>
      </div>
    );
  },
});

const DomainTitle = createReactClass({
  handleSelectAllClick() {
    this.props.HandleSelectAllClick(this.props.Domain);
  },

  handleClickButtonConnectLater(event) {
    const propertyIdListToConnectLater = _.map(
      this.props.Domain.PropertyList,
      (property) => property.Id
    );

    this.props.HandleClickButtonConnectLater(
      event,
      propertyIdListToConnectLater,
      this.props.Domain
    );
  },

  render() {
    const domain = this.props.Domain;

    if (domain == null) {
      return null;
    }

    let buttonSelectAll;
    let buttonConnectlater;

    let labelBtnSelectAll = this.props.Resources.ContentManagementDictionary.SelectAll;

    if (this.props.IsSelectAll) {
      labelBtnSelectAll = this.props.Resources.ContentManagementDictionary.DeselectAll;

      if (labelBtnSelectAll != null) {
        labelBtnSelectAll = labelBtnSelectAll.replace('[DomainName]', domain.Name);
      }
    }

    if (this.props.HandleClickButtonConnectLater != null && !this.props.IsToConnectLater) {
      buttonSelectAll = (
        <Button
          className="btn-select-all"
          classes={{ label: 'btn-text' }}
          size="small"
          onClick={this.handleSelectAllClick}
        >
          {labelBtnSelectAll}
        </Button>
      );

      if (this.props.IsSelectAll) {
        buttonConnectlater = (
          <Button
            className="btn-connect-later"
            classes={{ label: 'btn-text' }}
            variant="outlined"
            onClick={this.handleClickButtonConnectLater}
            size="small"
          >
            {this.props.Resources.ContentManagementDictionary.ConnectLater}
          </Button>
        );
      }
    }

    const classNameLineContainer = `list-line-container${this.props.IsToConnectLater ? ' connect-later' : ''
      }${this.props.IsFirst ? ' first' : ''}${this.props.IsSelectAll ? ' select-all' : ''}`;

    let dividerContainer;

    if (!this.props.IsToConnectLater) {
      dividerContainer = <div className="vertical-divider" />;
    }

    return (
      <div className={classNameLineContainer}>
        {dividerContainer}
        <div className="list-line domain-title-line">
          <div className="list-cell domain-title">
            <DomainTypography variant="h6">{domain.Name}</DomainTypography>
          </div>
          <div className="list-cell domain-buttons">
            {buttonSelectAll}
            {buttonConnectlater}
          </div>
        </div>
      </div>
    );
  },
});

const PropertyLine = createReactClass({
  render() {
    const property = this.props.Property;

    if (property == null) {
      return null;
    }

    let connectLater;
    let btnConnect;

    if (!this.props.IsSelectAll) {
      btnConnect = (
        <Button
          className="btn-raised btn-connect"
          classes={{ label: 'btn-text' }}
          onClick={(event) =>
            this.props.HandleClickButtonConnect(property, this.props.IsToConnectLater)
          }
          variant="contained"
          size="small"
        >
          {this.props.Resources.ContentManagementDictionary.Connect}
        </Button>
      );

      if (this.props.HandleClickButtonConnectLater != null && !this.props.IsToConnectLater) {
        connectLater = (
          <Button
            className="btn-connect-later"
            classes={{ label: 'btn-text' }}
            onClick={(event) => this.props.HandleClickButtonConnectLater(event, [property.Id])}
            variant="outlined"
            size="small"
          >
            {this.props.Resources.ContentManagementDictionary.ConnectLater}
          </Button>
        );
      } else if (this.props.IsToConnectLater) {
        connectLater = (
          <span className="is-to-connect-later">
            <WatchLaterIcon className="connect-later-icon" />
            <span className="connect-later-text">
              {this.props.Resources.ContentManagementDictionary.IsToConnectLater}
            </span>
          </span>
        );
      }
    }

    let classNameLineContainer = `list-line-container${this.props.IsToConnectLater ? ' connect-later' : ''
      }${this.props.IsSelectAll ? ' select-all' : ''}`;
    classNameLineContainer +=
      (this.props.IsLast ? ' last' : '') + (this.props.IsLastChild ? ' last-child' : '');

    let dividerContainer;

    if (!this.props.IsToConnectLater) {
      dividerContainer = <div className="vertical-divider" />;
    }

    return (
      <div className={classNameLineContainer}>
        {dividerContainer}
        <div className="list-line property-line">
          <div className="list-cell property-name">
            <SmallTypography variant="subtitle1">
              <CustomTooltip Text={property.Name} MaxCharacters={MAX_CHARACTERS} />
            </SmallTypography>
          </div>
          <div className="list-cell column-property-cao-datatype">
            <SmallTypography variant="subtitle1" className="light-text">
              <CustomTooltip Text={property.DataTypeName} MaxCharacters={MAX_CHARACTERS} />
            </SmallTypography>
            {property.CAD_DisplayValue != null && property.CAD_DisplayValue !== '' ? (
              <SmallTypography variant="subtitle1" className="light-text cao-value">
                <CustomTooltip Text={property.CAD_DisplayValue} MaxCharacters={5} />
              </SmallTypography>
            ) : null}
          </div>
          <div className="list-cell">
            {connectLater}
            {btnConnect}
          </div>
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

export default MappingPropertiesListV2 = connect(mapStateToProps)(MappingPropertiesListV2);
