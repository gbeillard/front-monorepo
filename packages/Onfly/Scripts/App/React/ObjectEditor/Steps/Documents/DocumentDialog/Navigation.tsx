import React from 'react';
import { Tabs, Tab } from '@bim-co/componentui-foundation';
import { DocumentSource } from '../../../../../Reducers/BimObject/Documents/types';

type Props = {
  source: DocumentSource;
  setSource: (x: DocumentSource) => void;
  allowSourceChange?: boolean;
  resources: any;
};

const Navigation: React.FC<Props> = ({ source, setSource, allowSourceChange = true, resources }) =>
  allowSourceChange ? (
    <Tabs>
      <Tab selected={source === DocumentSource.File} onClick={() => setSource(DocumentSource.File)}>
        {resources.DocumentsDialog.NavFile}
      </Tab>
      <Tab selected={source === DocumentSource.Link} onClick={() => setSource(DocumentSource.Link)}>
        {resources.DocumentsDialog.NavURL}
      </Tab>
    </Tabs>
  ) : (
    <Tabs>
      <Tab selected>
        {source === DocumentSource.File
          ? resources.DocumentsDialog.NavFile
          : resources.DocumentsDialog.NavURL}
      </Tab>
    </Tabs>
  );

export default Navigation;