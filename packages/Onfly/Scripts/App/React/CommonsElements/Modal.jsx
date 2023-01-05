import React from 'react';
import styled from '@emotion/styled';
import CloseIcon from '@material-ui/icons/Close';

const Header = styled.div({ padding: '15px 15px 0 15px !important' });
const Body = styled.div({ padding: '0 15px 15px 15px !important' });

const Modal = ({ header, body, footer, hasCloseIcon = true }) => (
  <div className="modal fade" id="AddPropertyScreen" tabIndex="-1" role="dialog" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <Header className="modal-header">
          {header}
          {hasCloseIcon && <CloseIcon className="close" data-toggle="modal" data-dismiss="modal" />}
        </Header>
        <Body className="modal-body">{body}</Body>
        <div className="modal-footer">{footer}</div>
      </div>
    </div>
  </div>
);

export default Modal;