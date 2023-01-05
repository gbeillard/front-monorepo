import React, { useState } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close.js';
import EditIcon from '@material-ui/icons/Edit.js';
import GroupEditModal from './GroupEditModal.jsx';

let GroupGrid = ({ check, group, Language, resources, RoleKey }) => {
  const [isEditModalOpen, setOpenModal] = useState(false);

  const url = `/${Language}/group/${group.Id}/bimobjects`;

  const style = {
    backgroundImage: `url(${group.Logo})`,
  };

  return (
    <div className="item locked">
      <Link to={url} data-cy="lien du projet">
        <button
          onClick={(e) => {
            e.preventDefault();
            check(e, group.Id);
          }}
          className="delete-group-button"
          data-cy="supprimer le projet"
          tabIndex="0"
          type="button"
        >
          <CloseIcon />
        </button>
        {RoleKey === 'admin' ? (
          <button
            onClick={(e) => {
              e.preventDefault();
              setOpenModal(true);
            }}
            className="edit-group-button"
            data-cy="editer un projet"
            tabIndex="0"
            type="button"
          >
            <EditIcon />
          </button>
        ) : null}

        <div className="admin-banner">ADMIN</div>
        <div className="group-banner" style={style} />
        <h2 className="group-name">{group.Name}</h2>
        <span className="users">
          {group.NbMembers} {resources.SearchResults.GroupUsers}
        </span>
        <span className="objects">
          {group.NbBimObjects} {resources.SearchResults.GroupBimObjects}
        </span>
      </Link>
      <GroupEditModal group={group} setOpenModal={setOpenModal} isOpenModal={isEditModalOpen} />
    </div>
  );
};

const mapStateToProps = ({ appState }) => ({
  Language: appState.Language,
  resources: appState.Resources[appState.Language],
  RoleKey: appState.RoleKey,
});

export default GroupGrid = connect(mapStateToProps)(GroupGrid);