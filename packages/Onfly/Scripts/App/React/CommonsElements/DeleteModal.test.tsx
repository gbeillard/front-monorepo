import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { Button } from '@bim-co/componentui-foundation';
import Dialog from '../../components/dialogs/Dialog';
import DialogTitle from '../../components/dialogs/DialogTitle';
import DialogContent from '../../components/dialogs/DialogContent';
import DeleteModal from './DeleteModal';

describe('<DeleteModal />', () => {
  let open: boolean;
  let title: string;
  let content: string;
  let close: string;
  let confirm: string;
  let onClose: () => void;
  let onConfirm: () => void;
  let component: ShallowWrapper;
  beforeEach(() => {
    open = true;
    title = 'title!';
    content = 'content!';
    close = 'close!';
    confirm = 'confirm!';
    onClose = jest.fn();
    onConfirm = jest.fn();
    component = shallow(
      <DeleteModal
        open={open}
        title={title}
        content={content}
        close={close}
        confirm={confirm}
        onClose={onClose}
        onConfirm={onConfirm}
      />
    );
  });
  it('should render the a Dialog with all needed elements', () => {
    const dialog = component.find(Dialog);
    expect(dialog.props().open).toBe(open); // open
    expect(component.find(DialogTitle).props().children).toBe(title); // title
    expect(component.find(DialogContent).props().children).toBe(content); // content

    const closeButton = component.find(Button).at(0);
    expect(closeButton.props().children).toBe(close); // close

    const confirmButton = component.find(Button).at(1);
    expect(confirmButton.props().children).toBe(confirm); // confirm
  });
  it('should trigger onClose when the backdrop is clicked', () => {
    component.find(Dialog).props().onClose({}, 'backdropClick');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it('should trigger onClose when the escape key is pressed', () => {
    component.find(Dialog).props().onClose({}, 'escapeKeyDown');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it('should trigger onClose when the cancel button is clicked', () => {
    const closeButton = component.find(Button).at(0);
    closeButton.simulate('click');
    expect(onClose).toHaveBeenCalledTimes(1);
  });
  it('should trigger onConfirm when the confirm button is clicked', () => {
    const confirmButton = component.find(Button).at(1);
    confirmButton.simulate('click');
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});