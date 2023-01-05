import React from 'react';
import createReactClass from 'create-react-class';

import { connect } from 'react-redux';
import toastr from 'toastr';
import _ from 'underscore';

// material UI
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';
import BugReportIcon from '@material-ui/icons/BugReport';
import InsertDriveFile from '@material-ui/icons/InsertDriveFile';
import VideoViewer from './Documents/VideoViewer';
import ImageViewer from './Documents/ImageViewer';
import PdfViewer from './Documents/PdfViewer';
import store from '../Store/Store';
import { API_URL } from '../Api/constants';
import { withRouter } from '../Utils/withRouter';

let BugTrackDetail = createReactClass({
  getInitialState() {
    return {
      issue: [],
      issueId: this.props.params.bugId,
      commentWriter: '',
      reponseMsg: '',
      pdfUrl: '',
      imageUrl: '',
      videoUrl: '',
    };
  },

  componentWillMount() {
    if (this.props.Settings.EnableBugtrack == true) {
      this.recoverIssue();
    }
  },

  recoverIssue() {
    const self = this;
    const { issueId } = this.state;

    const data = new FormData();
    data.append('IssueId', issueId);

    fetch(
      `${API_URL}/api/ws/v1/bugtrack/view/detail/contentmanagement/${self.props.managementCloudId}/action?token=${self.props.TemporaryToken}`,
      {
        method: 'POST',
        body: data,
      }
    )
      .then((response) => {
        store.dispatch({ type: 'LOADER', state: false });
        return response.json();
        // toastr.success("upload successfull");
      })
      .then((responseJson) => {
        self.setState({ issue: responseJson });
      });
  },

  commentChange(event) {
    this.setState({ commentWriter: event.target.value });
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

  sendComment() {
    if (this.state.commentWriter == '') {
      toastr.error(this.props.Resources.BugTracker.CommentFieldError);
    } else {
      const self = this;
      const { issueId } = this.state;
      const comment = this.state.commentWriter;

      fetch(
        `${API_URL}/api/ws/v1/bugtrack/view/detail/contentmanagement/${self.props.managementCloudId}/sendcomment/action?token=${self.props.TemporaryToken}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            IssueId: issueId,
            Comment: comment,
            UserCreatorId: self.state.issue.UserCreatorId,
          }),
        }
      )
        .then((response) => {
          store.dispatch({ type: 'LOADER', state: false });
          return response.json();
        })
        .then((lareponse) => {
          if (lareponse == 'Error') {
            toastr.error(self.props.Resources.BugTracker.CommentError);
          } else {
            self.setState({ responseMsg: lareponse }, () => {
              self.recoverIssue();
            });
            toastr.success(self.props.Resources.BugTracker.CommentAdded);
          }
        });
    }
  },

  userAvatar(event, item) {
    const self = this;
    if (event == 'infra_onfly') {
      event = (
        <Chip label={self.state.issue.UserName} avatar={<Avatar src={item.UserAvatarPath} />} />
      );
    } else {
      event = (
        <Chip
          label={event}
          color="primary"
          avatar={
            <Avatar src="https://cdn.bimandco.com/companies-images/ac-59-24-13-80-32-03-cd-3c-4b-fb-aa-3f-e7-07-0c-32-48-2b-8a.jpg?width=100&height=100&scale=both" />
          }
        />
      );
    }
    return event;
  },

  readingPdf(url, docName) {
    this.setState({ pdfUrl: url, selectedDocName: docName });
  },

  readingVideo(url, docName) {
    this.setState({ videoUrl: url, selectedDocName: docName });
  },

  readingImage(url, docName) {
    this.setState({ imageUrl: url, selectedDocName: docName });
  },

  exitViewer() {
    this.setState({ pdfUrl: '', imageUrl: '', videoUrl: '' });
  },

  render() {
    if (this.state.pdfUrl != '' || this.state.imageUrl != '' || this.state.videoUrl != '') {
      return (
        <div>
          <PdfViewer
            url={this.state.pdfUrl}
            exitViewer={this.exitViewer}
            docName={this.state.selectedDocName}
            resources={this.props.Resources}
          />
          <ImageViewer
            url={this.state.imageUrl}
            exitViewer={this.exitViewer}
            docName={this.state.selectedDocName}
          />
          <VideoViewer
            url={this.state.videoUrl}
            exitViewer={this.exitViewer}
            docName={this.state.selectedDocName}
          />
        </div>
      );
    }
    let classNameIsDeleted;
    const Date = moment(this.state.issue.Date, 'x').format('DD-MM-YYYY');
    const self = this;

    const displayFiles = _.map(this.state.issue.BugFiles, (item, i) => {
      switch (item.Extension.toLowerCase()) {
        case 'png':
          return (
            <li className={item.FileName}>
              <a
                key={`${item.Id}a`}
                onClick={() => self.readingImage(item.Path, item.FileName)}
                target="_blank"
              >
                <img src={item.Path} />
                {item.FileName}
              </a>
            </li>
          );
          break;

        case 'jpg':
          return (
            <li className={item.FileName}>
              <a
                key={`${item.Id}a`}
                onClick={() => self.readingImage(item.Path, item.FileName)}
                target="_blank"
              >
                <img src={item.Path} />
                {item.FileName}
              </a>
            </li>
          );
          break;

        case 'pdf':
          return (
            <li className={item.FileName}>
              <a
                key={`${item.Id}a`}
                onClick={() => self.readingPdf(item.Path, item.FileName)}
                target="_blank"
              >
                <InsertDriveFile />
                <span>{item.FileName}</span>
              </a>
            </li>
          );
          break;

        case 'mp4':
          return (
            <li className={item.FileName}>
              <a
                key={`${item.Id}a`}
                onClick={() => self.readingVideo(item.Path, item.FileName)}
                target="_blank"
              >
                <InsertDriveFile />
                {item.FileName}
              </a>
            </li>
          );
          break;

        default:
          return (
            <li className={item.FileName}>
              <a key={`${item.Id}a`} href={item.Path} target="_blank" rel="noreferrer">
                <InsertDriveFile />
                {item.FileName}
              </a>
            </li>
          );
          break;
      }
    });

    const displayComments = _.map(this.state.issue.Comments, (item, i) => (
      <TableRow key={item.Id}>
        <TableCell key={item.Id + item.Auteur}>
          <div className="comment-avatar">{self.userAvatar(item.Auteur, item)}</div>
          <div className="comment-date">{item.Date}</div>
        </TableCell>
        <TableCell key={item.Id + item.Id}>{item.Text}</TableCell>
      </TableRow>
    ));

    if (this.props.Settings.EnableBugtrack == true) {
      return (
        <section id="section-bugtrack" className="bugtrack-detail">
          <FormControl>
            <div className="row">
              <div className="col-sm-17 col-sm-offset-3">
                <div id="bug-infos" className="panel">
                  <div className="bug-id">
                    <h2>
                      <BugReportIcon />
                      {self.props.params.bugId}
                    </h2>
                    <span> /{self.state.issue.BugName}</span>
                    <br />
                    {self.setCriticality(self.state.issue.BugPriority)}
                  </div>
                  <ul className="bug-ul">
                    <li>
                      <span>
                        {this.props.Resources.BugTracker.BugDetailDate}
                        &nbsp;:
                      </span>
                      {Date}
                    </li>
                    <li>
                      <span>
                        {this.props.Resources.BugTracker.BugDetailAutor}
                        &nbsp;:
                      </span>
                      {self.state.issue.UserName}
                    </li>
                    <li>
                      <span>
                        {this.props.Resources.BugTracker.BugStateTitle}
                        &nbsp;:
                      </span>
                      <img src="/Content/images/check-green.png" alt="" />
                      {self.stateReturn(self.state.issue.BugState)}
                    </li>
                  </ul>

                  <div className="bug-discribe">
                    <h3>{this.props.Resources.BugTracker.BugDiscribe} :</h3>
                    <p>{self.state.issue.BugText}</p>
                  </div>
                  <ul className="bug-files">{displayFiles}</ul>
                </div>

                <div className="row">
                  <div className="panel">
                    <h3>
                      {this.props.Resources.BugTracker.BugDetailComment} :{' '}
                      {self.state.issue.NbComments}
                    </h3>
                    <Table className="table">
                      <TableBody>{displayComments}</TableBody>
                    </Table>

                    <div className="comment">
                      <TextField
                        id="commentwriter"
                        label={this.props.Resources.BugTracker.BugDetailCommentField}
                        multiline
                        fullWidth
                        placeholder=""
                        InputLabelProps={{
                          className: 'label-for-multiline',
                          shrink: true,
                        }}
                        rows={3}
                        rowsMax={10}
                        value={self.state.commentWriter}
                        onChange={this.commentChange}
                      />
                    </div>

                    <div className="btn-container text-right">
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={self.sendComment}
                        className="btnEnvoi"
                      >
                        {self.props.Resources.ContentManagement.SendInvitation}
                      </Button>
                    </div>
                  </div>
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

export default BugTrackDetail = withRouter(connect(mapStateToProps)(BugTrackDetail));