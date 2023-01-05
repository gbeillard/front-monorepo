import React from 'react';
import createReactClass from 'create-react-class';

// material ui icons
import CloseIcon from '@material-ui/icons/Close';
import { API_URL } from '../../Api/constants';

const DirectoryTreeView = createReactClass({
  getInitialState() {
    return {
      selectedId: -1,
    };
  },

  componentDidUpdate() {
    const self = this;
  },

  componentDidMount() {
    this.refreshTreeView();
    const self = this;
    $('#move-document-modal').on('show.bs.modal', () => {
      self.refreshTreeView();
    });
  },

  moveDocument() {
    this.props.confirmMove(this.state.selectedId);
  },

  buildTree(dataSource) {
    const self = this;

    const source = {
      datatype: 'json',
      datafields: [{ name: 'Id' }, { name: 'ParentId' }, { name: 'Value' }],
      id: 'id',
      localdata: dataSource,
    };

    const dataAdapter = new $.jqx.dataAdapter(source);

    dataAdapter.dataBind();

    const dataRoot = dataAdapter.getRecordsHierarchy('Id', 'ParentId', 'items', [
      { name: 'Value', map: 'label' },
      { name: 'Id', map: 'id' },
    ]);

    if ($('#jqxtree-directorytree').length > 0) {
      $('#jqxtree-directorytree').jqxTree('destroy');
    }

    $('#jqxtree-directorytree-container').append("<div id='jqxtree-directorytree'></div>");
    $('#jqxtree-directorytree').jqxTree({
      source: dataRoot,
      width: '100%',
      height: '400px',
      allowDrag: false,
      allowDrop: false,
      theme: 'metro',
    });

    $('#jqxtree-directorytree').on('select', (event) => {
      const { args } = event;
      const item = $('#jqxtree-directorytree').jqxTree('getItem', args.element);

      if (item != null && item != undefined) {
        self.setState({ selectedId: item.id });
      }
    });
  },

  refreshTreeView() {
    const self = this;

    let url = `/api/ws/v1/contentmanagement/${this.props.managementCloudId}/document/tree?token=${this.props.TemporaryToken}`;
    if (this.props.groupId != null) {
      url = `/api/ws/v1/contentmanagement/${this.props.managementCloudId}/group/${this.props.groupId}/document/tree?token=${this.props.TemporaryToken}`;
    }

    fetch(API_URL + url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        self.buildTree(data);
      });
  },

  render() {
    let buttonMove;
    if (this.state.selectedId !== -1) {
      buttonMove = (
        <button
          type="button"
          className="btn-second btn-blue disabled"
          data-dismiss="modal"
          onClick={this.moveDocument}
        >
          {this.props.resources.ContentManagement.DocumentActionMove}
        </button>
      );
    }

    return (
      <div
        className="modal fade"
        id="move-document-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <CloseIcon />
              </button>
              <h4 id="modal-move-title-folder" className="modal-title hidden">
                {this.props.resources.ContentManagement.MoveFolderModalTitle}
              </h4>
              <h4 id="modal-move-title-doc" className="modal-title">
                {this.props.resources.ContentManagement.MoveDocumentModalTitle}
              </h4>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                <div className="col-sm-23">
                  <div id="jqxtree-directorytree-container" />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {buttonMove}
              <button type="button" className="btn-second btn-grey" data-dismiss="modal">
                {this.props.resources.MetaResource.Close}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

export default DirectoryTreeView;