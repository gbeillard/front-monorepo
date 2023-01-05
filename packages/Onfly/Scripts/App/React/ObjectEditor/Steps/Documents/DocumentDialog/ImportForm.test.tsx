import React from 'react';
import { shallow } from 'enzyme';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import ImportForm from './ImportForm';
import { DocumentWrite, DocumentSource } from '../../../../../Reducers/BimObject/Documents/types';
import { Validation } from '../utils';

describe('<ImportForm />', () => {
  let document: DocumentWrite;
  let onDocumentChange: (x: DocumentWrite) => void;
  let source: DocumentSource;
  let validation: Validation;
  beforeEach(() => {
    document = {
      Name: '',
      Variants: [],
      FileName: '',
      Subsets: [],
    };
    onDocumentChange = jest.fn();
    source = DocumentSource.File;
    validation = { name: true, file: true, link: true, isReady: true };
  });
  it('should render', () => {
    const component = shallow(
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ImportForm
                document={document}
                onDocumentChange={onDocumentChange}
                source={source}
                validation={validation}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    );
    expect(component).toBeDefined();
  });
});