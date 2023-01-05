import React from 'react';
import { shallow } from 'enzyme';
import { FileLoader, CancelButton } from './FileLoader';

describe('<FileLoader />', () => {
  it('should render', () => {
    const resources = {
      MetaResource: {
        FileImport: 'Importing!',
        Wait: 'Wait!',
      },
    };
    const onCancel = jest.fn();
    const component = shallow(<FileLoader resources={resources} onCancel={onCancel} />);
    expect(component).toBeDefined();
  });

  it('should trigger onCancel when the button is clicked', () => {
    const resources = {
      MetaResource: {
        FileImport: 'Importing!',
        Wait: 'Wait!',
      },
    };
    const onCancel = jest.fn();
    const component = shallow(<FileLoader resources={resources} onCancel={onCancel} />);
    component.find(CancelButton).simulate('click');

    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});