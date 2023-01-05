import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import SearchIcon from '@material-ui/icons/Search.js';
import * as Utils from '../../Utils/utils.js';

// material ui icons

const TreeView = createReactClass({
  getInitialState() {
    return {
      keyword: '',
      searchMode: false,
    };
  },

  searchOnClassification(event) {
    const self = this;
    const request = Utils.removeDiacritics(event.target.value).toLowerCase();
    this.setState({ keyword: request });

    setTimeout(() => {
      if (self.state.keyword === request && (request == null || request === '')) {
        self.setState({ searchMode: false });
      } else if (self.state.keyword === request) {
        self.setState({ searchMode: true, selectedNodes: [] });
      }
    }, 500);
  },

  searchNode(item, keyword, list) {
    if (Utils.removeDiacritics(item.text).toLowerCase().search(keyword) >= 0) {
      list.push(item);
    }
    if (item.children !== undefined) {
      for (const i in item.children) {
        if (this.searchNode(item.children[i], keyword, list)) {
          list.push(item);
        }
      }
    }
  },

  render() {
    const self = this;
    let content;
    let listItem = [];

    if (this.props.classificationList !== undefined) {
      if (this.state.searchMode) {
        _.each(this.props.classificationList, (item, i) => {
          self.searchNode(item, self.state.keyword, listItem);
        });
      } else {
        listItem = this.props.classificationList;
      }
      content = listItem.map((item, i) => (
        <TreeViewItem
          key={item.id}
          item={item}
          selectedItem={self.props.selectedItem}
          selectNode={self.props.selectNode}
          keyword={self.state.keyword}
        />
      ));
    } else {
      content = (
        <div className="classification-loading legende">
          {this.props.Resources.MetaResource.Loading}
        </div>
      );
    }

    let treeViewClass = 'treeview jqx-tree-dropdown-root jqx-tree-dropdown-root-metro';

    if (this.props.isOpen) {
      treeViewClass += ' open';
    }

    let searchInput;
    if (this.props.root) {
      treeViewClass += ' root';
      searchInput = (
        <div id="input-simple-search">
          <SearchIcon />
          <input
            type="text"
            placeholder={this.props.Resources.ContentManagementClassif.SearchNode}
            onChange={this.searchOnClassification}
          />
          <span className="underline" />
        </div>
      );
    }

    return (
      <div>
        {searchInput}
        <ul className={treeViewClass}>{content}</ul>
      </div>
    );
  },
});

const TreeViewItem = createReactClass({
  getInitialState() {
    return {
      isOpen: false,
    };
  },

  handleArrowClick(e) {
    e.stopPropagation();

    const self = this;

    this.setState({
      isOpen: !self.state.isOpen,
    });
  },

  handleSelect(event) {
    event.stopPropagation();

    this.props.selectNode(this.props.item);
  },

  isSelected(item) {
    return _.findWhere(this.props.selectedItem, { Id: parseInt(item.id, 10) }) != null;
  },

  render() {
    const self = this;
    let subItem;

    let arrowClass = 'arrow';
    let nameClass =
      'classification-name jqx-rc-all jqx-rc-all-metro jqx-tree-item jqx-tree-item-metro jqx-item jqx-item-metro';

    if (this.props.item.children !== undefined && this.props.item.children.length > 0) {
      if (this.state.isOpen) {
        arrowClass +=
          ' jqx-tree-item-arrow-expand jqx-tree-item-arrow-expand-metro jqx-icon-arrow-down jqx-icon-arrow-down-metro';

        subItem = this.props.item.children.map((item, i) => (
          <TreeView
            key={i}
            isOpen={self.state.isOpen}
            root={false}
            classificationList={[item]}
            loading={false}
            selectedItem={self.props.selectedItem}
            selectNode={self.props.selectNode}
            keyword={self.props.keyword}
          />
        ));
      } else {
        arrowClass +=
          ' jqx-tree-item-arrow-collapse jqx-tree-item-arrow-collapse-metro jqx-icon-arrow-right jqx-icon-arrow-right-metro';
      }
    }

    if (this.isSelected(this.props.item)) {
      nameClass += ' selected';
    }

    return (
      <li className="jqx-tree-item-li jqx-tree-item-li-metro">
        <span onClick={this.handleArrowClick} className={arrowClass} />
        <span onClick={this.handleSelect} className={nameClass}>
          {this.props.item.text}
        </span>
        {subItem}
      </li>
    );
  },
});

export default TreeView;