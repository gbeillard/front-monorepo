// Requirements =>
// Need SelectedObjects as [] in case of multiselection
// Need SelectedObject as int in case of single object
// Need Resources as object
// Need ManagementCloudId as int
// Need TemporaryToken as string

import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close.js';
import * as ClassificationsApi from '../../Api/ClassificationsApi.js';
import store from '../../Store/Store';
import ClassificationsComponent from './ClassificationsComponent.jsx';

const SelectClassificationsModal = createReactClass({
  getInitialState() {
    return {
      classificationsListSelectMulti: [],
    };
  },

  selectNode(node) {
    const self = this;
    const listNode = self.state.classificationsListSelectMulti;
    const match = _.find(listNode, (item) => item.ClassificationId === node.ClassificationId);
    if (match != null) {
      const index = _.indexOf(listNode, match);
      listNode.splice(index, 1, node);
    } else {
      listNode.push(node);
    }
    self.setState({ classificationsListSelectMulti: listNode.splice(0) });
  },

  removeNode(node) {
    const self = this;
    const listNode = _.filter(
      self.state.classificationsListSelectMulti,
      (item) => item.Id.toString() != node.Id.toString()
    );
    self.setState({ classificationsListSelectMulti: listNode });
  },

  clearSelectedNodes() {
    this.setState({ classificationsListSelectMulti: [] });
  },

  addNodesToObjects() {
    const self = this;
    let data = [];

    const nodeListId = _.map(self.state.classificationsListSelectMulti, (node) => node.Id);

    if (self.props.SelectedObject != null && self.props.SelectedObject != undefined) {
      data = [{ BimObjectId: self.props.SelectedObject, NodeListId: nodeListId }];
    } else if (
      self.props.SelectedObjects != null &&
      self.props.SelectedObjects != undefined &&
      self.props.SelectedObjects.length > 0
    ) {
      data = _.map(self.props.SelectedObjects, (item) => ({
        BimObjectId: item,
        NodeListId: nodeListId,
      }));
    }

    if (data !== []) {
      store.dispatch({ type: 'LOADER', state: true });
      ClassificationsApi.setClassificationNodeForObjectList(
        self.props.TemporaryToken,
        self.props.ManagementCloudId,
        data,
        self.props.Resources
      );
      clearSelectedNodes();
    }
  },

  render() {
    const self = this;
    const id = 'choose-classification';

    return (
      <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-large">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title" id="myModalLabel">
                {self.props.Resources.ContentManagement.ChooseClassificationsForObjects}
              </h2>
              <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />
            </div>
            <div className="modal-body">
              <ClassificationsComponent
                id={id}
                selectNode={self.selectNode}
                removeSelectedNode={self.removeNode}
                selectedNodes={self.state.classificationsListSelectMulti}
              />
            </div>
            <div className="modal-footer">
              <div className="flex-container">
                <div className="flex-container-left">
                  <p>
                    {self.props.Resources.ContentManagement.UselessPropertiesWillBeRemoveWarning}
                  </p>
                </div>
                <div className="flex-container-right">
                  <Button
                    variant="text"
                    className="btn-flat"
                    data-toggle="modal"
                    data-dismiss="modal"
                    onClick={self.clearSelectedNodes}
                  >
                    <span>{self.props.Resources.MetaResource.Cancel}</span>
                  </Button>
                  <Button
                    variant="contained"
                    className="btn-raised"
                    data-toggle="modal"
                    data-dismiss="modal"
                    onClick={self.addNodesToObjects}
                  >
                    <span>{self.props.Resources.MetaResource.Confirm}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default SelectClassificationsModal;