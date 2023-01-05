import React from 'react';
import createReactClass from 'create-react-class';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'underscore';
import * as moment from 'moment';

// material UI
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import VisibilityIcon from '@material-ui/icons/Visibility';
import store from '../Store/Store';
import { API_URL } from '../Api/constants';
import { history } from '../history';
import { withRouter } from '../Utils/withRouter';

let BugTrackUserReport = createReactClass({
  getInitialState() {
    return {
      textPage: '',
      theIssues: [],
      NbBugs: 0,
      issuesPage: 0,
      issuesSizePage: 10,
      selectedIssue: [],
    };
  },

  componentWillMount() {
    if (this.props.Settings.EnableBugtrack == true) {
      this.recoverIssue(this.state.issuesPage, this.state.issuesSizePage);
    }
  },

  recoverIssue(page, sizePage) {
    const self = this;

    store.dispatch({ type: 'LOADER', state: true });

    fetch(
      `${API_URL}/api/ws/v1/bugtrack/view/contentmanagement/${self.props.managementCloudId}/action?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ NbPage: page, SizePage: sizePage }),
      }
    )
      .then((response) => {
        store.dispatch({ type: 'LOADER', state: false });
        return response.json();
        // toastr.success("upload successfull");
      })
      .then((responseJson) => {
        self.setState({ theIssues: responseJson.Bugs, NbBugs: responseJson.NbBugs });
      });
  },

  setCriticality(criticality) {
    switch (criticality) {
      case 'Bloquant':
        return <span style={{ color: '#f44336' }}>{this.props.Resources.BugTracker.Critical}</span>;
        break;
      case 'Critique':
        return (
          <span style={{ color: '#ffa726' }}>{this.props.Resources.BugTracker.Important}</span>
        );
        break;
      case 'Majeur':
        return (
          <span style={{ color: '#4caf50' }}>
            {this.props.Resources.BugTracker.ModeratelySevere}
          </span>
        );
        break;
      default:
        return '';
    }
  },

  stateReturn(state) {
    switch (state) {
      case 'Soumis':
        return this.props.Resources.BugTracker.Submit;
        break;
      case 'Fermé':
        return this.props.Resources.BugTracker.Close;
        break;
      case 'A Tester' || 'A tester prod' || 'A tester preprod' || 'A testé PROD':
        return this.props.Resources.BugTracker.NeedTest;
        break;
      case 'En cours':
        return this.props.Resources.BugTracker.InProgress;
        break;
      case 'À discuter':
        return this.props.Resources.BugTracker.NeedDiscute;
        break;
      case 'Reproduction impossible':
        return this.props.Resources.BugTracker.ImpossibleReproduction;
        break;
      case 'Doublon':
        return this.props.Resources.BugTracker.Duplicate;
        break;
      case 'Ne sera pas corrigé':
        return this.props.Resources.BugTracker.WillNotBeCorrected;
        break;
      case 'Imcomplet':
        return this.props.Resources.BugTracker.Uncomplete;
        break;
      case 'Obsolète':
        return this.props.Resources.BugTracker.Obsolete;
        break;
      case 'Vérifié preprod':
        return this.props.Resources.BugTracker.CheckedPreprod;
        break;
      default:
        return '';
    }
  },

  handleBugChangePage(event, page) {
    this.state.issuesPage = page;
    this.recoverIssue(page, this.state.issuesSizePage);
  },
  handleBugChangeRowsPerPage(event, page) {
    this.state.issuesSizePage = event.target.value;
    this.recoverIssue(this.state.issuesPage, event.target.value);
  },
  goToAdd(event, page) {
    if (this.props.params.groupId !== undefined) {
      history.push(`/${this.props.Language}/group/${this.props.params.groupId}/bugtrack/`);
    } else {
      history.push(`/${this.props.Language}/bugtrack/`);
    }
  },

  render() {
    const { groupId } = this.props.params;
    const self = this;
    const display = _.map(this.state.theIssues, (item, i) => {
      const Date = moment(item.Date, 'x').format('DD-MM-YYYY');

      return (
        <TableRow key={item.BugId}>
          <TableCell key={item.BugId + item.BugName} scope="row">
            <Link
              to={
                groupId !== undefined
                  ? `/${self.props.Language}/group/${self.props.params.groupId}/bugtrack/view/${item.BugId}`
                  : `/${self.props.Language}/bugtrack/view/${item.BugId}`
              }
            >
              <span>
                <VisibilityIcon /> {item.BugId}
              </span>
              {item.BugName}
            </Link>
          </TableCell>
          <TableCell key={item.BugId + item.Date} scope="row">
            {Date}
          </TableCell>
          <TableCell key={item.BugId + item.BugState} scope="row">
            {self.stateReturn(item.BugState)}
          </TableCell>
          <TableCell key={`${item.BugId}criticity`} scope="row">
            {self.setCriticality(item.BugPriority)}
          </TableCell>
        </TableRow>
      );
    });

    let tablePaginationDisplay;
    const separatorResource = self.props.Resources.UsersManagement.MemberPaginationSeparator;
    tablePaginationDisplay = (
      <TablePagination
        colSpan={4}
        count={self.state.NbBugs}
        rowsPerPage={self.state.issuesSizePage}
        labelRowsPerPage={this.props.Resources.UsersManagement.UserListRowsLabel}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${separatorResource}  ${count}`}
        page={self.state.issuesPage}
        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
        onChangePage={self.handleBugChangePage}
        onChangeRowsPerPage={self.handleBugChangeRowsPerPage}
        className="issue-pagination"
      />
    );
    if (this.props.Settings.EnableBugtrack == true) {
      return (
        <section id="section-bugtrack" className="mainDisplay bugtrack-list">
          <FormControl>
            <div className="row">
              <div className="col-sm-17 col-sm-offset-3">
                <div className="panel">
                  {self.textpage}

                  <Table className="table">
                    <TableHead>
                      <TableRow>
                        <TableCell>{this.props.Resources.BugTracker.BugIdTitle}</TableCell>
                        <TableCell>{this.props.Resources.BugTracker.BugDetailDate}</TableCell>
                        <TableCell>{this.props.Resources.BugTracker.BugStateTitle}</TableCell>
                        <TableCell>Criticité</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>{display}</TableBody>
                    <TableFooter>
                      <TableRow>{tablePaginationDisplay}</TableRow>
                    </TableFooter>
                  </Table>
                </div>
                <div className="btn-container text-right">
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={self.goToAdd}
                    className="btnEnvoi"
                  >
                    {this.props.Resources.BugTracker.BugAddBtn}
                  </Button>
                </div>
              </div>
            </div>
          </FormControl>
        </section>
      );
    }

    return (
      <div className="text-center">
        <h1 className="loadingtext">BIM&CO - ONFLY</h1>
        <p>Error 403 Access Denied</p>
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Title: appState.Title,
    Language: appState.Language,
    Resources:
      appState.Resources[appState.Language] != null ? appState.Resources[appState.Language] : [],
    managementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    Settings: appState.Settings,
  };
};

export default BugTrackUserReport = withRouter(connect(mapStateToProps)(BugTrackUserReport));