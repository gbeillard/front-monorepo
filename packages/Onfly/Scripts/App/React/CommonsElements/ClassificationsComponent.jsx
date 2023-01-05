import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import _ from 'underscore';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft.js';
import ChevronRightIcon from '@material-ui/icons/ChevronRight.js';
import ClearIcon from '@material-ui/icons/Clear.js';
import InfoIcon from '@material-ui/icons/InfoRounded.js';

import * as Utils from '../../Utils/utils.js';
import TreeView from './TreeView.jsx';
import store from '../../Store/Store';

let ClassificationsComponent = createReactClass({
  getInitialState() {
    return {
      selectedClassificationId: null,
      selectedClassificationName: '',
      selectedClassificationColor: '',
    };
  },

  componentDidMount() {
    this.selectDefaultClassification(this.props);
  },

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (this.props.Language !== nextProps.Language || nextProps.classifications.length === 0) {
      store.dispatch({
        type: 'GET_CLASSIFICATIONS_LIST',
        language: nextProps.Language,
        token: this.props.TemporaryToken,
        managementcloudId: this.props.ManagementCloudId,
        subDomain: this.props.SubDomain,
      });
    }

    this.selectDefaultClassification(nextProps);
  },

  selectDefaultClassification(nextProps) {
    if (this.state.selectedClassificationId == null && nextProps.classifications.length > 0) {
      let current = _.find(nextProps.classifications, (item) => item.Official);

      if (current === null || current === undefined) {
        current = nextProps.classifications[0];
      }

      this.setState({
        selectedClassificationId: current.Classification,
        selectedClassificationName: current.Name,
        selectedClassificationColorCode: current.ColorCode,
      });
      store.dispatch({
        type: 'GET_CLASSIFICATION_NODES',
        language: this.props.Language,
        token: this.props.TemporaryToken,
        classificationId: current.Classification,
      });
    }
  },

  selectClassification(event) {
    const self = this;
    const { id } = event.target.dataset;
    const { name } = event.target.dataset;
    const { color } = event.target.dataset;
    store.dispatch({
      type: 'GET_CLASSIFICATION_NODES',
      language: this.props.Language,
      token: this.props.TemporaryToken,
      classificationId: id,
    });
    this.setState({
      selectedClassificationId: id,
      selectedClassificationName: name,
      selectedClassificationColor: color,
    });
  },

  selectNode(node) {
    const nodeInfo = {
      ClassificationId: this.state.selectedClassificationId,
      ClassificationName: this.state.selectedClassificationName,
      ColorCode:
        this.state.selectedClassificationColor == ''
          ? null
          : this.state.selectedClassificationColor,
      Id: node.id,
      NodeName: node.text,
    };
    this.props.selectNode(nodeInfo);
  },

  removeSelectedNode(event) {
    const nodeInfo = {
      Id: event.currentTarget.dataset.id,
    };
    this.props.removeSelectedNode(nodeInfo);
  },

  scrollClassificationTabs(event) {
    // Gère le scroll horizontale des onglets des classifications
    if (event.currentTarget != null) {
      const directionButton = event.currentTarget.dataset.direction;

      if (directionButton !== '') {
        const componentId = this.props.id ? `#${this.props.id} ` : '';

        const fixedTabsContainer = $(`${componentId}#fixedTabsContainer`);
        const movableTabsContainer = $(`${componentId}#movableTabsContainer`);
        const classificationTabsContainer = $(`${componentId}#classificationTabsContainer`);

        const leftTabs = parseInt(movableTabsContainer.css('left'), 10);
        let newLeftTabs = 0;

        if (directionButton === 'right') {
          const diffWidthMax =
            fixedTabsContainer.width() - classificationTabsContainer[0].scrollWidth;

          newLeftTabs = leftTabs - fixedTabsContainer.width();

          if (newLeftTabs <= diffWidthMax) {
            newLeftTabs = diffWidthMax;
          }
        } else if (directionButton === 'left') {
          if (leftTabs < 0) {
            newLeftTabs = leftTabs + fixedTabsContainer.width();
          }

          if (newLeftTabs >= 0) {
            newLeftTabs = 0;
          }
        }

        if (leftTabs !== parseInt(newLeftTabs, 10)) {
          movableTabsContainer.animate(
            {
              left: newLeftTabs,
            },
            1000
          );
        }
      }
    }
  },

  isPrivateNode(node) {
    const nodeClassif = this.props.classifications.find(
      (classification) => classification.Classification === node.ClassificationId
    );
    if (nodeClassif) {
      return true;
    }
    return false;
  },

  render() {
    let classification;
    let classificationLeafs;
    let selectedNodes;
    const self = this;

    // Quand le Onfly n'a pas de classification
    if (self.props.classifications.length === 0) {
      return (
        <Grid container wrap="nowrap" spacing={1}>
          <Grid item>
            <InfoIcon />
          </Grid>
          <Grid item>
            <Typography variant="subtitle1">
              {this.props.resources.ContentManagement.NoClassification}
            </Typography>
          </Grid>
        </Grid>
      );
    }

    // selectedNodes
    if (this.props.selectedNodes != null) {
      selectedNodes = this.props.selectedNodes.map((node, i) => {
        const classifColor =
          node.ColorCode != null
            ? Utils.getClassificationColor(node.ColorCode, true)
            : Utils.getClassificationColor(node.ClassificationId, false);
        return this.isPrivateNode(node) ? (
          <ul className="results" key={i} style={{ display: 'inline-block' }}>
            <li className="classification-name">{node.ClassificationName}</li>
            <li className={`classificationNode ${classifColor}`}>
              {node.NodeName}
              <span
                className="delete-bimobject-classificationNode"
                data-id={node.Id}
                onClick={self.removeSelectedNode}
              >
                <ClearIcon />
              </span>
            </li>
          </ul>
        ) : null;
      });
    }

    // classifications List
    const classificationsTabs = this.props.classifications.map((classification, i) => {
      let classStr = '';
      let classStrA = '';
      if (self.state.selectedClassificationId === classification.Classification) {
        classStr = 'active';
        if (classification.ColorCode != null) {
          classStrA = Utils.getClassificationColor(classification.ColorCode, true);
        } else {
          classStrA = Utils.getClassificationColor(classification.Classification, false);
        }
      }
      return (
        <li className={classStr} key={i}>
          <a
            href="#home-pills"
            data-toggle="tab"
            aria-expanded="true"
            data-id={classification.Classification}
            data-name={classification.Name}
            data-color={classification.ColorCode}
            onClick={self.selectClassification}
            className={classStrA}
          >
            {classification.Name}
          </a>
        </li>
      );
    });

    // treeview
    if (this.props.classifications.length > 0) {
      if (
        this.props.classificationNodes[this.state.selectedClassificationId] != null &&
        this.props.classificationNodes[this.state.selectedClassificationId][this.props.Language] !=
        null
      ) {
        classification = _.find(
          this.props.classifications,
          (c) => c.Classification == self.state.selectedClassificationId
        );
        classificationLeafs =
          this.props.classificationNodes[this.state.selectedClassificationId][this.props.Language];
      }
    }

    const contentModal = (
      <div>
        <TreeView
          classificationList={classificationLeafs}
          classificationId={this.state.selectedClassificationId}
          root
          isOpen
          loading={false}
          selectNode={this.selectNode}
          Resources={this.props.resources}
          selectedItem={this.props.selectedItem}
        />
      </div>
    );

    return (
      <div>
        {this.props.selectedNodes != null ? (
          <div id="selected-nodes-classif" className="row">
            {selectedNodes}
          </div>
        ) : null}
        <nav className="navigation nav-classif">
          <div id="nav-classif-tabs-container">
            <div className="tab-scroll-arrow">
              <Button
                id="button-scroll-left"
                onClick={this.scrollClassificationTabs}
                data-direction="left"
              >
                <ChevronLeftIcon />
              </Button>
            </div>
            <div id="fixedTabsContainer">
              <div id="movableTabsContainer">
                <ul id="classificationTabsContainer" className="nav nav-tabs">
                  {classificationsTabs}
                </ul>
              </div>
            </div>
            <div className="tab-scroll-arrow">
              <Button
                id="button-scroll-right"
                onClick={this.scrollClassificationTabs}
                data-direction="right"
              >
                <ChevronRightIcon />
              </Button>
            </div>
          </div>
        </nav>
        <div id="classification-tree-container">
          <div
            id="jqxtree-classification"
            className="jqx-widget jqx-widget-metro jqx-widget-content jqx-widget-content-metro jqx-tree jqx-tree-metro"
          >
            {contentModal}
          </div>
        </div>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;
  const { classificationsState } = store;

  const currentClassifs = classificationsState.ClassificationsList[appState.Language];
  const filteredClassifs =
    currentClassifs != null
      ? appState.SubDomain !== 'community'
        ? _.filter(currentClassifs, (item) => item.IsEnabled)
        : currentClassifs
      : [];

  return {
    Language: appState.Language,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    resources: appState.Resources[appState.Language],
    classifications: filteredClassifs,
    classificationNodes: classificationsState.ClassificationNodes,
    SubDomain: appState.SubDomain,
  };
};

export default ClassificationsComponent = connect(mapStateToProps)(ClassificationsComponent);