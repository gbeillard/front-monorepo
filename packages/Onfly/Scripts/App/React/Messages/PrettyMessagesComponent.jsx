import React from 'react';
import createReactClass from 'create-react-class';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'underscore';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

// material ui icons
import PersonIcon from '@material-ui/icons/Person.js';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight.js';
import SendIcon from '@material-ui/icons/Send.js';
import * as UtilitiesMessage from '../../Utils/utilitiesMessage.js';
import * as MessageApi from '../../Api/MessageApi.js';
import ElementSearchMessage from '../Autocomplete/ElementSearchUser.jsx';
import store from '../../Store/Store';
import { API_URL } from '../../Api/constants';
import { history } from '../../history';
import { withRouter } from '../../Utils/withRouter';

let PrettyMessagesComponent = createReactClass({
  getInitialState() {
    return {
      data: [],
      newElement: [],
      messages: [],
      user: [],
      receiverId: 0,
      receiverType: '',
      talkSelected: false,
      talkMessageId: 0,
      talkUserId: 0,
      talkUserName: '',
      talkSubject: '',
      nbPageMenu: 2,
      isInfiniteLoading: false,
      userProfilId: 0,
      height: $(window).height() - 59,
      createNewMessage: false,
      dataLoaded: false,
      isMessageContentRequest: false,
    };
  },

  updateSize() {
    const height = $(window).height() - 59;

    this.resizeChat();

    this.setState({ height });
  },

  resizeChat() {
    const height = $(window).height() - 59;

    const heightDivTop = $('.middle .message-detail div.top').outerHeight();
    const heightDivWrite = $('.middle .message-detail div.write').outerHeight();

    const heightDivSearchTop = $('.middle .new-message-search').outerHeight();

    const heightChat = height - heightDivTop - heightDivWrite - heightDivSearchTop;

    if ($('.middle .message-detail .chat').outerHeight() != heightChat) {
      $('.middle .message-detail .chat').outerHeight(heightChat);
    }

    $('.middle .message-detail #chat-write-container').outerHeight(heightChat + heightDivWrite);
  },

  componentWillMount() {
    store.dispatch({
      type: 'SET_TITLE_PAGE',
      data: this.props.resources.ContentManagement.MenuItemMessages,
    });
  },

  componentWillReceiveProps(nextProps) {
    if (this.props.Language != nextProps.Language) {
      store.dispatch({
        type: 'SET_TITLE_PAGE',
        data: nextProps.resources.ContentManagement.MenuItemMessages,
      });
    }
  },

  componentDidMount() {
    window.addEventListener('resize', this.updateSize);
    $('.btn-new-message').removeClass('hidden');
    $('body').on('click', '.main-menu-message', this.reset);
    $('body').on('click', '.btn-new-message', this.initNewMessage);

    if (this.props.params.talkId != undefined && this.props.params.talkId != 'new') {
      // this.updateMessages(1, true);
      if (this.userCanSeeConversation(this.props.params.talkId)) {
        this.openAndLoadConversation(this.props.params.talkId);
      }
    } else if (this.props.params.talkId == 'new') {
      this.setState({ createNewMessage: true });
      // this.updateMessages(1, false);
    } else {
      // this.updateMessages(1, false);
    }

    $(document).on('change keyup keydown paste cut', '#message-content-text', function (e) {
      UtilitiesMessage.resizeWriteArea(
        e,
        this,
        '#chat-write-container',
        '#write-message-conversation',
        '#list-message-conversation'
      );
    });
  },

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateSize);
    $('.btn-new-message').addClass('hidden');
    $('body').off('click', '.main-menu-message', this.reset);
  },

  initNewMessage() {
    if (this.props.params.groupId != null) {
      history.push(`/${this.props.Language}/group/${this.props.params.groupId}/messages/new`);
    } else {
      history.push(`/${this.props.Language}/messages/new`);
    }
    this.setState({
      createNewMessage: true,
      talkSelected: false,
      talkMessageId: 0,
      messages: [],
      talkUserId: 0,
      talkSubject: '',
      talkUserName: '',
      isMessageContentRequest: false,
    });
  },

  updateMessages(page, talkSelected) {
    const self = this;
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: `${API_URL}/api/ws/v1/en/messages/list/${page}?token=${this.props.TemporaryToken}&contentManagementId=${this.props.ManagementCloudId}`,
      contentType: 'application/json; charset=utf-8',
      async: true,
      success(data) {
        self.setState({ data, talkSelected, dataLoaded: true });
      },
    });
  },

  openAndLoadConversation(messageId) {
    if (messageId > 0) {
      this.setState({ talkMessageId: messageId, talkSelected: true, createNewMessage: false });
    }
  },

  loadUser(id) {
    const self = this;
    let userProfil;

    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: `${API_URL}/api/ws/v1/user/account/profil/${id}?token=${this.props.TemporaryToken}`,
      contentType: 'application/json; charset=utf-8',
      async: true,
      success(data) {
        userProfil = data;
        const userProfilId = id;
        self.setState({
          user: userProfil,
          userProfilId,
          talkUserName: `${userProfil.FirstName} ${userProfil.LastName}`,
        });
      },
    });
  },

  reset() {
    if (this.props.params.groupId != null) {
      history.push(`/${this.props.Language}/group/${this.props.params.groupId}/messages`);
    } else {
      history.push(`/${this.props.Language}/messages`);
    }

    this.setState({
      talkSelected: false,
      talkMessageId: 0,
      messages: [],
      talkUserId: 0,
      talkSubject: '',
      talkUserName: '',
      userProfilId: 0,
      createNewMessage: false,
      isMessageContentRequest: false,
    });
  },

  handleInfiniteLoad() {
    const self = this;
    this.setState({
      isInfiniteLoading: true,
    });
    setTimeout(() => {
      // self.loadTalks(self.state.nbPageMenu);

      const newElements = self.state.newElement;
      let stateNbPageMenu = self.state.nbPageMenu;

      if (newElements.length > 0) {
        stateNbPageMenu++;
      }

      self.setState({
        isInfiniteLoading: false,
        data: self.state.data.concat(newElements),
        newElement: [],
        nbPageMenu: stateNbPageMenu,
      });
    }, 1000);
  },

  elementInfiniteLoad() {
    return <div className="infinite-list-item">Loading...</div>;
  },

  selectNewUser(userId) {
    if (userId != 0) {
      this.loadUser(userId);
      $('#message-content-text').focus();
    } else {
      this.setState({ userProfilId: 0, user: [] });
    }
  },

  userCanSeeConversation(messageId) {
    const self = this;

    let canSee = false;

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: `${API_URL}/api/ws/v1/en/messages/${messageId}/usercanseeconversation?token=${this.props.TemporaryToken}`,
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        EntityType: self.props.EntityType,
        EntityId: self.props.EntityId,
        ManagementCloudId: self.props.ManagementCloudId,
      }),
      async: false,
      success(data) {
        canSee = true;
      },
    });
    return canSee;
  },

  render() {
    const self = this;

    let menu;
    let messageDetail;
    let userProfil;

    if (self.state.talkSelected == true) {
      menu = (
        <div className="left with-messages">
          <ConversationList
            resources={self.props.resources}
            receiverId={self.props.receiverId}
            senderId={self.props.SenderId}
            senderType={self.props.SenderType}
            openAndLoadConversation={self.openAndLoadConversation}
            talkMessageId={self.state.talkMessageId}
            temporaryToken={self.props.TemporaryToken}
            managementCloudId={self.props.ManagementCloudId}
            language={self.props.Language}
            initNewMessage={self.initNewMessage}
            createNewMessage={self.state.createNewMessage}
            entityType={self.props.EntityType}
            entityId={self.props.EntityId}
            groupId={self.props.params.groupId}
          />
        </div>
      );

      messageDetail = (
        <div className="middle">
          <MessageDetail
            resources={self.props.resources}
            language={self.props.Language}
            talkUserName={self.state.talkUserName}
            talkSubject={self.state.talkSubject}
            talkMessageId={self.state.talkMessageId}
            senderId={self.props.SenderId}
            messageId={self.state.talkMessageId}
            messages={self.state.messages}
            entityId={self.props.EntityId}
            entityType={self.props.EntityType}
            isMessageContentRequest={self.state.isMessageContentRequest}
            temporaryToken={this.props.TemporaryToken}
            managementCloudId={this.props.ManagementCloudId}
            userProfilId={this.state.userProfilId}
            updateMessages={this.updateMessages}
            openAndLoadConversation={this.openAndLoadConversation}
            resizeChat={this.resizeChat}
            loadUser={this.loadUser}
            groupId={this.props.params.groupId}
          />
        </div>
      );
      userProfil = (
        <div className="right" style={{ height: this.state.height }}>
          <UserProfil
            resources={self.props.resources}
            context={self.props.context}
            userProfilId={self.state.userProfilId}
            userId={self.props.SenderId}
            user={self.state.user}
          />
        </div>
      );
    } else if (!self.state.createNewMessage) {
      menu = (
        <div className="left">
          <ConversationList
            resources={self.props.resources}
            receiverId={self.props.receiverId}
            senderId={self.props.SenderId}
            senderType={self.props.SenderType}
            openAndLoadConversation={self.openAndLoadConversation}
            talkMessageId={self.state.talkMessageId}
            temporaryToken={self.props.TemporaryToken}
            managementCloudId={self.props.ManagementCloudId}
            language={self.props.Language}
            initNewMessage={self.initNewMessage}
            createNewMessage={self.state.createNewMessage}
            entityType={self.props.EntityType}
            entityId={self.props.EntityId}
            groupId={self.props.params.groupId}
          />
        </div>
      );
    } else {
      menu = (
        <div className="left with-messages">
          <ConversationList
            resources={self.props.resources}
            receiverId={self.props.receiverId}
            senderId={self.props.SenderId}
            senderType={self.props.SenderType}
            openAndLoadConversation={self.openAndLoadConversation}
            talkMessageId={self.state.talkMessageId}
            temporaryToken={self.props.TemporaryToken}
            managementCloudId={self.props.ManagementCloudId}
            language={self.props.Language}
            initNewMessage={self.initNewMessage}
            createNewMessage={self.state.createNewMessage}
            entityType={self.props.EntityType}
            entityId={self.props.EntityId}
            groupId={self.props.params.groupId}
          />
        </div>
      );

      messageDetail = (
        <div className="middle">
          <ElementSearchMessage
            TemporaryToken={this.props.TemporaryToken}
            ManagementCloudId={this.props.ManagementCloudId}
            selectNewUser={this.selectNewUser}
            Resources={this.props.resources}
          />
          <MessageDetail
            resources={self.props.resources}
            language={self.props.Language}
            talkUserName={self.state.talkUserName}
            talkSubject={self.state.talkSubject}
            talkMessageId={self.state.talkMessageId}
            senderId={self.props.SenderId}
            messageId={self.state.talkMessageId}
            messages={self.state.messages}
            entityId={self.props.EntityId}
            entityType={self.props.EntityType}
            isMessageContentRequest={self.state.isMessageContentRequest}
            managementCloudId={this.props.ManagementCloudId}
            userProfilId={this.state.userProfilId}
            updateMessages={this.updateMessages}
            temporaryToken={this.props.TemporaryToken}
            openAndLoadConversation={this.openAndLoadConversation}
            resizeChat={this.resizeChat}
            loadUser={this.loadUser}
            groupId={this.props.groupId}
          />
        </div>
      );

      if (this.state.userProfilId != 0) {
        userProfil = (
          <div className="right" style={{ height: this.state.height }}>
            <UserProfil
              resources={self.props.resources}
              context={self.props.context}
              userProfilId={self.state.userProfilId}
              userId={self.props.SenderId}
              user={self.state.user}
            />
          </div>
        );
      } else {
        userProfil = <div className="right" style={{ height: this.state.height }} />;
      }
    }

    return (
      <div className="messages-container">
        {menu}
        {messageDetail}
        {userProfil}
      </div>
    );
  },
});

const mapStateToProps = function (store) {
  const { appState } = store;

  return {
    Language: appState.Language,
    SenderId: appState.UserId,
    SenderType: 'user',
    RoleKey: appState.RoleKey,
    RoleName: appState.RoleName,
    ManagementCloudId: appState.ManagementCloudId,
    TemporaryToken: appState.TemporaryToken,
    resources: appState.Resources[appState.Language],
    EntityId: appState.EntityId,
    EntityType: appState.EntityType,
  };
};

export default PrettyMessagesComponent = withRouter(
  connect(mapStateToProps)(PrettyMessagesComponent)
);

const ConversationList = createReactClass({
  getInitialState() {
    return {
      conversationList: [],
      nbPageMenu: 2,
      scrollMessageIsActive: false,
    };
  },

  componentDidMount() {
    this.loadTalks(1);

    $('div.left').fadeTo(150, 1);

    this.loadTalks(this.state.nbPageMenu);
  },

  componentWillReceiveProps(newProps) {
    // Actualise la liste des conversations, lors de la création d'une conversation
    if (this.props.createNewMessage) {
      this.loadTalks(1, true);
    }
  },

  loadTalks(page, loadBefore = false) {
    const self = this;

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: `${API_URL}/api/ws/v1/en/messages/list/${page}?token=${self.props.temporaryToken}&contentManagementId=${self.props.managementCloudId}`,
      data: JSON.stringify({
        ReceiverId: self.props.receiverId,
        ManufacturerId: self.props.senderId,
        Context: self.props.senderType,
      }),
      contentType: 'application/json; charset=utf-8',
      async: true,
      success(data) {
        if (data.length > 0) {
          let newConversationList = self.state.conversationList;

          if (loadBefore) {
            const newMessagesList = [];

            $.each(data, (i, message) => {
              if (_.findIndex(newConversationList, { Id: message.Id }) == -1) {
                newMessagesList.push(message);
              }
            });

            newConversationList.push.apply(newMessagesList, newConversationList);
            newConversationList = newMessagesList;

            // Met a 0 le nombre de message non lu pour la nouvelle conversation
            $.each(newConversationList, (i, conversation) => {
              if (conversation.Id == self.props.talkMessageId) {
                conversation.NbUnreadMessages = 0;
                conversation.IsNew = false;
                return false;
              }
            });
          } else {
            newConversationList.push.apply(newConversationList, data);
          }

          self.setState({ conversationList: newConversationList, scrollMessageIsActive: true });
        }
      },
    });
  },

  scrollLoadListMessages() {
    const self = this;

    const $ulPeople = $('ul.people');

    const scrollConteneurListTop = $ulPeople.scrollTop();
    const scrollHeightConteneurList = $ulPeople.prop('scrollHeight');
    const heightConteneurList = $ulPeople.height();
    const totalConteneurListHeight = scrollHeightConteneurList - heightConteneurList - 200;

    if (scrollConteneurListTop >= totalConteneurListHeight && self.state.scrollMessageIsActive) {
      self.setState({ nbPageMenu: ++self.state.nbPageMenu, scrollMessageIsActive: false });
      self.loadTalks(self.state.nbPageMenu);
    }
  },

  render() {
    const self = this;

    const conversationList = this.state.conversationList.map((object, i) => {
      let contact;
      let contactEntity;
      const sender = object.Sender;
      const receiver = object.Receiver;

      if (sender.EntityType == 'user' && sender.EntityType == 'user') {
        if (sender.Id == self.props.senderId) {
          contact = receiver;
        } else {
          contact = sender;
        }
      } else if (sender.EntityType == self.props.entityType && sender.Id == self.props.entityId) {
        contact = receiver;
      } else {
        contact = sender;
      }

      return (
        <TalkItem
          resources={self.props.resources}
          key={object.Id}
          object={object}
          contact={contact}
          senderId={self.props.senderId}
          messageId={object.Id}
          openAndLoadConversation={self.props.openAndLoadConversation}
          talkMessageId={self.props.talkMessageId}
          language={self.props.language}
          contactEntity={contactEntity}
          groupId={self.props.groupId}
        />
      );
    });

    if (conversationList.length > 0) {
      return (
        <ul className="people" onScroll={self.scrollLoadListMessages}>
          {conversationList}
        </ul>
      );
    }

    let classHidden = '';

    if (self.props.createNewMessage) {
      classHidden = 'hidden';
    }

    return (
      <div className="messages-container">
        <div id="onfly-no-messages" className={classHidden}>
          <img src="/Content/images/rocket.svg" alt="" />

          <p>{self.props.resources.AnalyticsMails.NoMailYet}</p>
          <br />
          <a className="btn-new-message" onClick={self.props.initNewMessage}>
            {self.props.resources.ActivityPreference.MessageNewTitle}
          </a>
        </div>
      </div>
    );
  },
});

// Conversation
const TalkItem = createReactClass({
  getInitialState() {
    return {
      isHovered: false,
      newMessage: false,
    };
  },

  selectTalk() {
    if (this.props.groupId != null) {
      history.push(
        `/${this.props.language}/group/${this.props.groupId}/messages/${this.props.messageId}`
      );
    } else {
      history.push(`/${this.props.language}/messages/${this.props.messageId}`);
    }
    this.props.openAndLoadConversation(this.props.messageId);
    $(`#unread-message-${this.props.messageId}`).fadeOut('fast');
  },

  handleHover() {
    this.setState({
      isHovered: !this.state.isHovered,
    });
  },

  render() {
    const self = this;
    const { contact } = self.props;
    // var contactEntity = self.props.contactEntity;

    const classname = self.props.talkMessageId == self.props.object.Id ? 'person active' : 'person';

    const messageId = `message-item-${this.props.object.Id}`;

    let avatarUrl = '/Content/images/default-avatar.png';
    if (avatarUrl != null) {
      avatarUrl = `${contact.Avatar}?height=50&width=50&crop=both`;
    }

    let subject = self.props.object.Subject;

    if (subject == null || subject == '') {
      subject = self.props.object.Content;
    }

    let newMessage;

    let classHidden = '';

    if (self.props.object.Id == self.props.talkMessageId) {
      classHidden = ' hidden';
    }

    if (self.props.object.IsNew && self.props.object.NbTotalMessage > 0) {
      newMessage = (
        <span id={`unread-message-${self.props.object.Id}`} className={`newMessage${classHidden}`}>
          {self.props.object.NbTotalMessage}
        </span>
      );
    } else if (self.props.object.NbUnreadMessages > 0) {
      newMessage = (
        <span id={`unread-message-${self.props.object.Id}`} className={`newMessage${classHidden}`}>
          {self.props.object.NbUnreadMessages}
        </span>
      );
    }

    let fromToLabel;
    if (
      this.props.object.Sender.Id == self.props.senderId &&
      this.props.object.Sender.EntityType == 'user'
    ) {
      fromToLabel = this.props.resources.UserMessageDetails.ToLabel;
    } else {
      fromToLabel = this.props.resources.UserMessageDetails.FromLabel;
    }

    const subjectContent = $(`<p>${subject}</p>`).text();

    return (
      <li className={classname} id={messageId} onClick={self.selectTalk}>
        <img src={avatarUrl} width="50" height="50" alt="" />
        <span className="sender">
          <span className="">{fromToLabel}</span> {contact.DisplayName}
        </span>
        {newMessage}
        <span className="subject">{subjectContent}</span>
      </li>
    );
  },
});

// Liste des messages d'une conversation
const MessageDetail = createReactClass({
  getInitialState() {
    return {
      messagesList: [],
      scrollMessageIsActive: false,
      currentPage: 1,
      talkIsLoad: false,
      talkUserType: '',
      subject: '',
      usersTalkList: [],
      prevScrollHeight: 0,
    };
  },

  handleKeyPress(e) {
    if (e.key == 'Enter' && e.shiftKey) {
      e.preventDefault();
    } else if (e.key === 'Enter') {
      this.sendReply();
      e.preventDefault();
    }
  },

  sendReply() {
    const self = this;
    const inputMessageValue = document.getElementById('message-content-text').value.trim();

    if (inputMessageValue != '') {
      self.replyTalk(self.props.messageId, inputMessageValue, self.state.talkUserType);
      self.resetMessageText();
    }
  },
  componentWillReceiveProps(newProps) {
    if (newProps.messageId > 0 && newProps.messageId != this.props.messageId) {
      $('#list-message-conversation').css('opacity', 0);

      this.resetMessageText();
      // Init state
      this.setState({
        messagesList: [],
        scrollMessageIsActive: false,
        currentPage: 1,
        talkIsLoad: false,
        talkUserType: '',
        subject: '',
        usersTalkList: [],
      });

      this.loadUsersTalk(newProps.messageId); // Chargement des utilisateurs participant a la conversation
      this.loadTalk(newProps.messageId, 1, false); // Chargement de la conversation
    }
  },

  scrollMessageToBottom() {
    const $chat = $('#list-message-conversation');
    const scrollHeightChat = $chat.prop('scrollHeight');

    if (scrollHeightChat > 0) {
      $chat.scrollTop(scrollHeightChat).fadeTo(100, 1);
    }
  },

  componentDidMount() {
    if (this.props.messageId > 0) {
      this.loadUsersTalk(this.props.messageId); // Chargement des utilisateurs participant a la conversation
      this.loadTalk(this.props.messageId, 1, false); // Chargement de la conversation
    } else {
      this.props.resizeChat();
    }
  },

  resetMessageText() {
    document.getElementById('message-content-text').value = '';

    $('#write-message-conversation').removeAttr('style');
  },

  scrollLoadMessages() {
    const $chat = $('#list-message-conversation');
    const conversationId = $chat.attr('data-id');

    if (conversationId > 0) {
      const scrollConteneurListTop = $chat.scrollTop();
      const heightConteneurList = $chat.height();
      const totalConteneurListHeight = heightConteneurList * 2;

      if (
        ((scrollConteneurListTop + heightConteneurList <= totalConteneurListHeight &&
          this.state.scrollMessageIsActive) ||
          (scrollConteneurListTop == 0 && this.state.currentPage > 1)) &&
        !this.state.talkIsLoad
      ) {
        const newPage = this.state.currentPage + 1;

        const scrollHeight = $chat.prop('scrollHeight');
        this.setState({
          currentPage: newPage,
          scrollMessageIsActive: false,
          prevScrollHeight: scrollHeight,
        });

        this.loadTalk(conversationId, newPage, true);

        if (scrollConteneurListTop == 0 && !this.state.talkIsLoad) {
          $chat.scrollTop(1);
        }
      }
    }
  },

  loadTalk(id, page, isloadScroll) {
    const self = this;
    const conversationId = parseInt(id);

    if ((page == 1 && self.state.messagesList.length > 0) || !isloadScroll) {
      // Lecture des messages
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: `${API_URL}/api/ws/v1/en/messages/${id}/readLastMessage?token=${self.props.temporaryToken}`,
        contentType: 'application/json; charset=utf-8',
        async: false,
      });

      // Actualise le nombre de message non lu dans le menu "Message"
      MessageApi.getUnreadMessages(self.props.managementCloudId, self.props.temporaryToken);
    }

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: `${API_URL}/api/ws/v1/en/messages/${conversationId}/list/${page}?token=${self.props.temporaryToken}`,
      contentType: 'application/json; charset=utf-8',
      async: true,
      success(data) {
        if (data.length > 0) {
          let newMessagesList = [];

          if (page == 1 && self.state.messagesList.length > 0) {
            newMessagesList = self.state.messagesList;

            $.each(data.reverse(), (i, message) => {
              if (_.findIndex(self.state.messagesList, { Id: message.Id }) == -1) {
                newMessagesList.push(message);
              }
            });
          } else {
            $.each(data.reverse(), (i, message) => {
              if (_.findIndex(self.state.messagesList, { Id: message.Id }) == -1) {
                newMessagesList.push(message);
              }
            });

            newMessagesList.push.apply(newMessagesList, self.state.messagesList);
          }

          if (!isloadScroll) {
            let userType = '';
            let userProfilId = 0;

            const indiceMax = data.length - 1;
            const object = data[indiceMax];
            const subject = object.Subject;

            let sender = object.Sender;
            let receiver = object.Receiver;

            if (sender.EntityType == 'user' && sender.EntityType == 'user') {
              if (sender.Id == self.props.senderId) {
                userProfilId = receiver.Id;
                userType = receiver.EntityType;
              } else {
                userProfilId = sender.Id;
                userType = sender.EntityType;
              }
            } else if (
              sender.EntityType == self.props.entityType &&
              sender.Id == self.props.entityId
            ) {
              userType = receiver.EntityType;

              if (object.ReceiverUser != null) {
                receiver = object.ReceiverUser;
              }

              if (receiver.EntityType == 'user') {
                userProfilId = receiver.Id;
              }
            } else {
              userType = sender.EntityType;

              if (object.SenderUser != null) {
                sender = object.SenderUser;
              }

              if (sender.EntityType == 'user') {
                userProfilId = sender.Id;
              }
            }

            self.setState({ messagesList: newMessagesList, talkUserType: userType, subject });
            self.scrollMessageToBottom();
            self.props.resizeChat();

            if (userProfilId > 0) {
              self.props.loadUser(userProfilId);
            }

            // Active le chargement par le scroll après avoir scroller vers le bas
            self.setState({ scrollMessageIsActive: true });
          } else {
            const $chat = $('#list-message-conversation');
            const scrollTopChat = $chat.scrollTop();

            self.setState({ messagesList: newMessagesList, scrollMessageIsActive: true });

            const currentScrollHeight = $chat.prop('scrollHeight');

            const scrollPosition =
              currentScrollHeight - self.state.prevScrollHeight + scrollTopChat;

            $chat.scrollTop(scrollPosition);

            if (page == 1 && self.state.messagesList.length > 0) {
              self.scrollMessageToBottom();
            }
          }
        } else {
          self.setState({ talkIsLoad: true });
        }
      },
    });
  },

  replyTalk(id, content, userType) {
    const self = this;

    if (content != null && content != '') {
      // reply
      if (id > 0) {
        let ReplyVMData = {
          MessageId: id,
          Content: content,
        };

        if (userType == 'user') {
          ReplyVMData.SenderEntityId = self.props.senderId;
          ReplyVMData.SenderEntityType = userType;
          ReplyVMData.IsGroupConversation = false;
        } else {
          ReplyVMData.SenderEntityId = self.props.entityId;
          ReplyVMData.SenderEntityType = self.props.entityType;
          ReplyVMData.IsGroupConversation = true;
        }

        ReplyVMData = JSON.stringify(ReplyVMData);

        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: `${API_URL}/api/ws/v1/message/reply` + `?token=${self.props.temporaryToken}`,
          data: ReplyVMData,
          contentType: 'application/json; charset=utf-8',
          async: true,
          success(data) {
            self.loadUsersTalk(id);
            self.loadTalk(id, 1, true);
          },
        });
      } else {
        // create new message
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: `${API_URL}/api/ws/v1/message/new?token=${self.props.temporaryToken}&contentManagementId=${self.props.managementCloudId}`,
          data: JSON.stringify({
            Subject: '',
            Content: content,
            SenderId: self.props.senderId,
            SenderType: 'user',
            Receivers: [{ ReceiverId: self.props.userProfilId, ReceiverType: 'user' }],
            CreateNewConversation: false,
          }),
          contentType: 'application/json; charset=utf-8',
          async: false,
          success(data) {
            self.props.updateMessages(1, true);
            if (data.length > 0) {
              const messageId = data[0].MessageId;
              history.push(`/${self.props.language}/messages/${messageId}`);
              self.props.openAndLoadConversation(messageId);
            }
          },
        });
      }
    }
  },

  loadUsersTalk(conversationId) {
    const self = this;

    $.ajax({
      type: 'POST',
      dataType: 'json',
      url:
        `${API_URL}/api/ws/v1/en/messages/${conversationId}/listUserTalk` +
        `?token=${self.props.temporaryToken}`,
      contentType: 'application/json; charset=utf-8',
      async: true,
      success(apiMessageUserVMList) {
        if (apiMessageUserVMList.length > 0) {
          const usersList = [];

          $.each(apiMessageUserVMList, (i, user) => {
            if (user.Id != self.props.senderId && _.findIndex(usersList, { Id: user.Id }) == -1) {
              usersList.push(user);
            }
          });
          self.setState({ usersTalkList: usersList });
          self.props.resizeChat();
        }
      },
    });
  },

  rollUserTalkList(e) {
    $('#all-users-talk-list').slideToggle(350);
    $('#talk-with-title i.arrow-roll').toggleClass('rotate');
  },

  render() {
    const self = this;

    let talkWithUsers;

    if (self.state.usersTalkList.length > 0) {
      const AVATAR_SIZE = 32; // Taille de l'icon avatar en px

      const userTalkList = [];

      // range la liste
      _.each(self.state.usersTalkList, (userTalk, i) => {
        let entity = userTalk.EntityType;

        if (userTalk.EntityType != 'user') {
          entity += `-${userTalk.EntityId}`;
        }

        if (userTalkList[entity] == undefined) {
          userTalkList[entity] = [];
        }

        userTalkList[entity].push(userTalk);
      });

      const entityList = Object.keys(userTalkList).map((entityTalk, i) => (
        <UserTalk
          key={`entityTalk-${entityTalk}`}
          entityTalk={userTalkList[entityTalk]}
          loadUser={self.props.loadUser}
          senderId={self.props.senderId}
        />
      ));

      talkWithUsers = (
        <div id="talkWith">
          <p id="talk-with-title" onClick={self.rollUserTalkList}>
            {self.props.resources.AnalyticsMails.TalkWithLabel}
            <span className="number-talk-user">{self.state.usersTalkList.length}</span>
            <PersonIcon />
            <KeyboardArrowRightIcon className="arrow-roll" />
          </p>
          <div id="all-users-talk-list">{entityList}</div>
        </div>
      );
    }

    const messages = self.state.messagesList.map((object, i) => (
      <Message
        language={self.props.language}
        key={`message-${object.Id}`}
        senderId={self.props.senderId}
        object={object}
        entityId={self.props.entityId}
        loadUser={self.props.loadUser}
        resources={self.props.resources}
      />
    ));

    const messageDetailId = `message-detail-${self.props.messageId}`;

    return (
      <div id={messageDetailId} className="message-detail">
        <div className="top">
          <span className="name" title={self.state.subject}>
            {self.state.subject}
          </span>
          {talkWithUsers}
        </div>

        <div id="chat-write-container" className="message-detail">
          <div
            id="list-message-conversation"
            className="chat"
            onScroll={self.scrollLoadMessages}
            data-id={self.props.messageId}
          >
            {messages}
          </div>

          <div id="write-message-conversation" className="write">
            <div id="write-textarea-container">
              <textarea
                placeholder={this.props.resources.AnalyticsMails.PlaceHolderText}
                id="message-content-text"
                type="text"
                autoFocus
              />
            </div>
            <div className="write-link" onClick={self.sendReply}>
              <button className="write-link send btn-raised">
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

// Message d'une conversation
const Message = createReactClass({
  loadUserProfil() {
    const user = this.props.object.SenderUser;

    if (user != null) {
      if (user.Id > 0 && this.props.senderId != user.Id) {
        this.props.loadUser(user.Id);
      }
    }
  },

  render() {
    const self = this;
    const { language } = self.props;

    const content = this.props.object.Content;
    const date = moment(new Date(this.props.object.CreatedAt));

    let classname = '';
    const classNameDate = '';
    // var bubbleActive = false;
    const AVATAR_SIZE = 50; // Taille de l'icon avatar en px
    const AVATAR_READER_SIZE = 20;

    if (this.props.object.Sender.Id == self.props.entityId) {
      classname = 'me';
      // bubbleActive = true;
      // classNameDate = "bubble-date me";
    } else {
      classname = 'you';
      // classNameDate = "bubble-date you";
    }

    let dateFormat = date.format('Do, MMM YYYY');
    if (date.isSame(moment(), 'day')) {
      dateFormat = date.format('LT');
    }

    let senderUserAvatar = '';
    let senderUserName = '';

    if (this.props.object.SenderUser != null) {
      senderUserAvatar = `${this.props.object.SenderUser.Avatar}?width=${AVATAR_SIZE}&height=${AVATAR_SIZE}`;
      senderUserName = this.props.object.SenderUser.DisplayName;

      if (this.props.senderId == this.props.object.SenderUser.Id) {
        classname = 'me-user';
        // bubbleActive = true;
      }
    }

    const userReaderList = this.props.object.MessageReadList.map((messageRead, i) => {
      const userReader = $(`#user-reader-${messageRead.User.Id}`);

      if (userReader.length > 0 && userReader.attr('data-message') != self.props.object.Id) {
        userReader.fadeOut(500, function () {
          $(this).remove();
        });
      }

      if (self.props.object.SenderUser != null) {
        if (
          messageRead.User.Id != self.props.object.SenderUser.Id &&
          messageRead.User.Id != self.props.senderId
        ) {
          const readAt = moment(new Date(messageRead.ReadAt));
          const dateRead = readAt.format('Do, MMM YYYY');
          const timeRead = readAt.format('LT');

          let tooltip = self.props.resources.UserMessageDetails.ReadMessage;

          if (tooltip != null) {
            tooltip = tooltip
              .replace('[UserName]', messageRead.User.DisplayName)
              .replace('[Date]', dateRead)
              .replace('[Time]', timeRead);
          } else {
            tooltip = `${messageRead.User.DisplayName} - ${dateRead} ${timeRead}`;
          }

          return (
            <li
              id={`user-reader-${messageRead.User.Id}`}
              data-message={self.props.object.Id}
              key={`user-reader-${messageRead.User.Id}-message-${self.props.object.Id}`}
            >
              <img
                className="user-avatar reader"
                title={tooltip}
                src={`${messageRead.User.Avatar}?width=${AVATAR_READER_SIZE}&height=${AVATAR_READER_SIZE}`}
              />
            </li>
          );
        }
      }
    });

    return (
      <div className="bubble-line">
        <img
          className={`user-avatar ${classname}`}
          src={senderUserAvatar}
          onClick={self.loadUserProfil}
        />
        <div className={`bubble ${classname}`}>
          <div className="bubble-content">
            <h4 className="user-name" onClick={self.loadUserProfil}>
              {senderUserName}
            </h4>
            <div
              dangerouslySetInnerHTML={{ __html: $.trim(content, '\n').split('\n').join('<br/>') }}
            />
          </div>
          <div>
            <div className="bubble-date">{dateFormat}</div>
            <ul className="reader-users-list">{userReaderList}</ul>
          </div>
        </div>
      </div>
    );
  },
});

const UserTalk = createReactClass({
  loadUserProfil(event) {
    const userId = event.currentTarget.dataset.id;

    if (userId > 0 && this.props.senderId != userId) {
      this.props.loadUser(userId);
    }
  },

  render() {
    const self = this;

    const AVATAR_SIZE = 32; // Taille de l'icon avatar en px

    const { entityTalk } = self.props;

    if (entityTalk.length > 0) {
      // let entityId = entityTalk[0].EntityId;
      const entityType = entityTalk[0].EntityType;
      const entityName = entityTalk[0].EntityName;

      const usersTalk = entityTalk.map((user, i) => {
        const userAvatar = (
          <Avatar
            size={AVATAR_SIZE}
            src={`${user.Avatar}?width=${AVATAR_SIZE}&height=${AVATAR_SIZE}`}
          />
        );

        return (
          <Chip
            key={`usertalk-${user.Id}`}
            avatar={userAvatar}
            label={user.DisplayName}
            onClick={self.loadUserProfil}
            data-id={user.Id}
          />
        );
      });

      let entityTalkTitle;

      if (entityType != 'user') {
        const avatar = entityTalk[0].EntityAvatar;
        const entityAvatar = `${avatar}?width=${AVATAR_SIZE}&height=${AVATAR_SIZE}`;

        entityTalkTitle = (
          <h4 className={`talk-users-title ${entityType}`}>
            <img className="user-avatar" src={entityAvatar} />
            <span>{entityName}</span>
          </h4>
        );
      }

      return (
        <div>
          {entityTalkTitle}
          <div className={`talk-users-list ${entityType}`}>{usersTalk}</div>
        </div>
      );
    }

    return '';
  },
});

// Profil du user de la conversation
const UserProfil = createReactClass({
  render() {
    const self = this;

    const { user } = self.props;

    let avatarUrl = '/Content/images/default-avatar.png';
    if (user.AvatarAdress != null) {
      avatarUrl = `${user.AvatarAdress}?height=100&width=100&crop=both`;
    }

    return (
      <div className="message-content">
        <img src={avatarUrl} width="50" height="50" alt="" className="mess-avatar" />
        <span className="sender">
          {user.FirstName} {user.LastName}
        </span>
        <span className="about">{user.AboutUser}</span>

        <div className="field">
          <span className="label">{this.props.resources.AnalyticsMails.ProfilLanguageLabel}</span>
          <div className="center">
            <input
              id="Language"
              type="text"
              value={this.props.user.Language != null ? this.props.user.Language : ''}
              readOnly
            />
          </div>
        </div>
        <div className="field">
          <span className="label">{this.props.resources.AnalyticsMails.ProfilCompanyLabel}</span>
          <div className="center">
            <input
              id="CompanyName"
              type="text"
              value={this.props.user.Company != null ? this.props.user.Company : ''}
              readOnly
            />
          </div>
        </div>
        <div className="field">
          <span className="label">{this.props.resources.AnalyticsMails.ProfilJobLabel}</span>
          <div className="center">
            <input
              id="Job"
              type="text"
              value={this.props.user.Job != null ? this.props.user.Job : ''}
              readOnly
            />
          </div>
        </div>
        <div className="field">
          <span className="label">{this.props.resources.AnalyticsMails.ProfilCityLabel}</span>
          <div className="center">
            <input
              id="City"
              type="text"
              value={this.props.user.City != null ? this.props.user.City : ''}
              readOnly
            />
          </div>
        </div>
      </div>
    );
  },
});