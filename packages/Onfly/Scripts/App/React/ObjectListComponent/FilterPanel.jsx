import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';

import { connect } from 'react-redux';

// material ui
import Popper from '@material-ui/core/Popper';

// material ui icons
import CloseIcon from '@material-ui/icons/Close';
import store from '../../Store/Store';
import * as Utils from '../../Utils/utils.js';

let FilterPanel = createReactClass({
  getInitialState() {
    let label = null;
    let selectedItem = null;
    const currentValue = this.determineSelectedValue(this.props.currentValue);
    if (currentValue != null) {
      label = currentValue.Name;
      selectedItem = currentValue.Value;
    }

    return {
      isOpen: false,
      current: null,
      label,
      loader: false,
      selectedItem,
      titleIsOpen: this.props.isOpen,
      anchorPopperCLassification: null,
    };
  },

  determineSelectedValue(currentValue) {
    if (currentValue != null && currentValue.length > 0) {
      return _.find(currentValue, (value) => value.IsChecked == true);
    }
    return null;
  },

  componentWillReceiveProps(nextProps) {
    const currentValue = this.determineSelectedValue(nextProps.currentValue);

    if (
      nextProps.selectedClassificationNode != null &&
      this.state.selectedItem != nextProps.selectedClassificationNode.Id
    ) {
      this.setState({
        label: nextProps.selectedClassificationNode.Name,
        selectedItem: nextProps.selectedClassificationNode.Id,
        current: nextProps.selectedClassificationNode.ClassificationId,
      });
    }

    if (this.props.lang != nextProps.lang || nextProps.classifications.length == 0) {
      store.dispatch({
        type: 'GET_CLASSIFICATIONS_LIST',
        language: nextProps.lang,
        token: this.props.TemporaryToken,
        managementcloudId: this.props.ManagementCloudId,
      });
    }

    if (this.state.current == null && nextProps.classifications.length > 0) {
      let current = _.find(nextProps.classifications, (item) => item.Official);

      if (current === null || current === undefined) {
        current = nextProps.classifications[0];
      }

      this.state.current = current.Classification;
      this.getClassification(current.Classification);

      if (this.props.changeSelectedClassification != null) {
        const newClassificationNode = {
          ClassificationId: current.Classification,
        };

        this.props.changeSelectedClassification(newClassificationNode);
      }
    }

    if (this.props.lang != nextProps.lang) {
      this.getClassification(this.state.current);
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return (
      (nextState.isOpen != this.state.isOpen && nextState.isOpen != undefined) ||
      this.state.selectedItem != nextState.selectedItem ||
      this.state.current != nextState.current ||
      this.state.loader != nextState.loader ||
      this.props.lang != nextProps.lang ||
      this.props.classifications != nextProps.classifications ||
      this.props.classificationNodes != nextProps.classificationNodes
    );
  },

  componentDidMount() {
    document.addEventListener('click', this.closeClassifTree, false);
  },

  componentWillMount() {
    if (
      this.props.classifications == null ||
      (this.props.classifications != null && this.props.classifications.length == 0)
    ) {
      store.dispatch({
        type: 'GET_CLASSIFICATIONS_LIST',
        language: this.props.lang,
        token: this.props.TemporaryToken,
        managementcloudId: this.props.ManagementCloudId,
      });
    }

    if (this.state.current == null && this.props.selectedClassificationNode != null) {
      this.setState({
        label: this.props.selectedClassificationNode.Name,
        selectedItem: this.props.selectedClassificationNode.Id,
        current: this.props.selectedClassificationNode.ClassificationId,
      });
    }
  },

  componentWillUnmount() {
    document.removeEventListener('click', this.closeClassifTree, false);
  },

  getClassificationList(lang) {
    store.dispatch({
      type: 'GET_CLASSIFICATIONS_LIST',
      language: nextProps.lang,
      token: this.props.TemporaryToken,
      managementcloudId: this.props.ManagementCloudId,
    });
  },

  closeClassifTree(event) {
    if (this.state.isOpen && !event.defaultPrevented) {
      this.setState({ isOpen: false });
    }
  },

  handleModalButton(e) {
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen,
      anchorPopperCLassification: e.currentTarget,
    });
  },

  resetClassifications(event) {
    event.stopPropagation();
    this.handleRequest(event, null, null, this.state.current);
  },

  handleChangeClassification(id, e) {
    e.stopPropagation();
    e.preventDefault();

    this.getClassification(id);

    this.setState({
      current: id,
    });
  },

  getClassification(id) {
    store.dispatch({
      type: 'GET_CLASSIFICATION_NODES',
      language: this.props.lang,
      token: this.props.TemporaryToken,
      classificationId: id,
    });
  },

  handleRequest(event, id, name, classificationId) {
    event.stopPropagation();

    this.setState({
      label: name,
      selectedItem: id,
    });

    this.props.handleRequest(event, {
      id,
      name,
      classificationLeafs: this.props.classificationNodes[this.state.current][this.props.lang],
    });

    if (this.props.changeSelectedClassification != null) {
      const newClassificationNode = {
        Id: id,
        Name: name,
        ClassificationId: classificationId,
      };

      this.props.changeSelectedClassification(newClassificationNode);
    }
  },

  render() {
    const that = this;
    let content;
    let modalClass = 'modal-panel modal-classif-tree';

    if (this.props.classifications == null || this.props.classifications.length == 0) {
      return null;
    }

    if (this.state.selectedItem == null) {
      content = (
        <button className="btn-classification">
          {this.props.title}
          <hr aria-hidden="true" />
        </button>
      );
    } else if (this.state.current != null) {
      const classificationIndex = this.props.classifications.findIndex(
        (id) => id.Classification.toString() === this.state.current.toString()
      );
      const currentClassifColor =
        this.props.classifications[classificationIndex].ColorCode != null
          ? Utils.getClassificationColor(
            this.props.classifications[classificationIndex].ColorCode,
            true
          )
          : Utils.getClassificationColor(this.state.current, false);
      const tabClass = `classif ${currentClassifColor}`;

      content = (
        <div className="bimobject-classif">
          <span className={tabClass}>{this.state.label}</span>
          <CloseIcon
            className="cancel-classif"
            id="materialv1menu"
            data-property="Classifications.Id"
            data-value=""
            data-checked="false"
            onClick={this.resetClassifications}
          />
        </div>
      );
    }

    if (this.state.isOpen) {
      modalClass = 'modal-panel modal-classif-tree open';
    } else {
      modalClass = 'modal-panel modal-classif-tree';
    }

    const contentClass = 'category-content input-list';

    let classification;
    let classificationLeafs;

    if (this.props.classifications.length > 0) {
      if (
        this.props.classificationNodes[this.state.current] != null &&
        this.props.classificationNodes[this.state.current][this.props.lang] != null
      ) {
        classification = _.find(
          this.props.classifications,
          (c) => c.Classification == that.state.current
        );
        classificationLeafs = this.props.classificationNodes[this.state.current][this.props.lang];
      }
    }

    let contentModal = '';

    if (classification != null && classificationLeafs != null) {
      contentModal = (
        <div>
          <Nav
            classifications={this.props.classifications}
            current={this.state.current}
            changeClassification={this.handleChangeClassification}
            handleModalButton={this.handleModalButton}
          />
          <TreeView
            classification={classificationLeafs}
            classificationId={this.state.current}
            root
            isOpen
            loading={this.state.loader}
            property={this.props.property}
            handleRequest={this.handleRequest}
            selectedItem={this.state.selectedItem}
            valueWithResult={this.props.currentValue}
          />
        </div>
      );
    } else if (classificationLeafs == null) {
      contentModal = (
        <div>
          <Nav
            classifications={this.props.classifications}
            current={this.state.current}
            changeClassification={this.handleChangeClassification}
            handleModalButton={this.handleModalButton}
          />
          <div className="classification-loading legende">
            {this.props.Resources.MetaResource.Loading}
          </div>
        </div>
      );
    } else {
      contentModal = (
        <div className="classification-loading legende">
          {this.props.Resources.MetaResource.Loading}
        </div>
      );
    }

    return (
      <ul
        className={
          this.state.isOpen
            ? 'filters filters-classifications open'
            : 'filters filters-classifications'
        }
        onClick={this.handleModalButton}
      >
        <li className="filter-classification">
          <div className={contentClass}>{content}</div>
          <Popper
            className="popper-filter-classification"
            open={this.state.isOpen}
            anchorEl={this.state.anchorPopperCLassification}
            transition
            placement="bottom-start"
          >
            <div
              className={modalClass}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {contentModal}
            </div>
          </Popper>
        </li>
      </ul>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;
  const { classificationsState } = store;

  return {
    lang: appState.Language,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    classifications:
      classificationsState.ClassificationsList[appState.Language] != null
        ? _.filter(
          classificationsState.ClassificationsList[appState.Language],
          (item) => item.IsEnabled
        )
        : [],
    classificationNodes: classificationsState.ClassificationNodes,
    Resources: appState.Resources[appState.Language],
  };
};

export default FilterPanel = connect(mapStateToProps)(FilterPanel);

const TreeViewItem = createReactClass({
  getInitialState() {
    return {
      isOpen: false,
    };
  },

  handleArrowClick(e) {
    e.stopPropagation();
    e.preventDefault();

    const that = this;

    this.setState({
      isOpen: !that.state.isOpen,
    });
  },

  handleSelect(event) {
    event.stopPropagation();

    const that = this;

    let { id } = this.props.item;
    let { text } = this.props.item;

    if (this.props.selectedItem == this.props.item.id) {
      id = null;
      text = null;

      event.target.dataset.value = [];
      event.target.dataset.checked = false;
    } else {
      event.target.dataset.value = id;
      event.target.dataset.checked = true;
    }

    this.props.handleRequest(event, id, text, this.props.classificationId);
  },

  hasResultInNode(item) {
    if (_.find(this.props.valueWithResult, (value) => value.Value == item.id) != null) {
      return true;
    }
    if (item.children != undefined) {
      for (const i in item.children) {
        if (this.hasResultInNode(item.children[i])) {
          return true;
        }
      }
    }
    return false;
  },

  isSelected(item) {
    if (item.id == this.props.selectedItem) {
      return true;
    }
    if (item.children != undefined) {
      for (const i in item.children) {
        if (this.isSelected(item.children[i])) {
          return true;
        }
      }
    }
    return false;
  },

  render() {
    const that = this;
    let subItem;

    if (this.props.item.children != undefined && this.state.isOpen) {
      subItem = this.props.item.children.map((item, i) => (
        <TreeView
          key={i}
          isOpen={that.state.isOpen}
          root={false}
          classificationId={that.props.classificationId}
          classification={[item]}
          loading={false}
          property={that.props.property}
          handleRequest={that.props.handleRequest}
          selectedItem={that.props.selectedItem}
          valueWithResult={that.props.valueWithResult}
        />
      ));
    }

    let arrowClass = 'arrow';
    let nameClass = '';

    if (
      this.props.item.children != undefined &&
      this.props.item.children != null &&
      this.props.item.children.length > 0
    ) {
      if (this.state.isOpen) {
        arrowClass += ' jqx-tree-item-arrow-expand';
      } else {
        arrowClass += ' jqx-tree-item-arrow-collapse';
      }
    }

    if (this.isSelected(this.props.item)) {
      nameClass += ' selected';
    }

    // add information if the node has result or not
    const hasResults = this.hasResultInNode(that.props.item);
    // var resultInfo = null;

    if (hasResults) {
      nameClass += ' results';
    }

    return (
      <li className="jqx-tree-item-li">
        <span onClick={this.handleArrowClick} className={arrowClass} />
        <span
          onClick={this.handleSelect}
          data-value={this.props.item.id}
          data-property={this.props.property}
          data-checked
          className={nameClass}
        >
          {this.props.item.text}
        </span>
        {subItem}
      </li>
    );
  },
});

const TreeView = createReactClass({
  render() {
    const that = this;
    let content;

    if (this.props.loading) {
      content = <div className="classification-loading legende">Loading...</div>;
    } else if (this.props.classification != undefined) {
      content = this.props.classification.map((item, i) => (
        <TreeViewItem
          handleRequest={that.props.handleRequest}
          classificationId={that.props.classificationId}
          property={that.props.property}
          key={item.id}
          item={item}
          selectedItem={that.props.selectedItem}
          valueWithResult={that.props.valueWithResult}
        />
      ));
    }
    let treeViewClass = 'treeview';
    if (this.props.isOpen) {
      treeViewClass += ' open';
    }

    if (this.props.root) {
      treeViewClass += ' root';
    }
    return <ul className={treeViewClass}>{content}</ul>;
  },
});

const Nav = createReactClass({
  render() {
    const that = this;

    const items = this.props.classifications.map((value, i) => {
      let classifClass = '';

      if (value.ColorCode != null) {
        classifClass = Utils.getClassificationColor(value.ColorCode, true);
      } else {
        classifClass = Utils.getClassificationColor(value.Classification);
      }

      if (value.Classification == that.props.current) {
        classifClass += ' active';
      }

      return (
        <li key={i} className={classifClass}>
          <a
            data-id={value.Classification}
            onClick={that.props.changeClassification.bind(null, value.Classification)}
          >
            {value.Name}
          </a>
        </li>
      );
    });

    return (
      <nav className="navigation">
        <ul className="classification-tabs">{items}</ul>
      </nav>
    );
  },
});