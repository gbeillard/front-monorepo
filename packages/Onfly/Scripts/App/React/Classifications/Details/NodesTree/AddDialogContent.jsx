import React, { useState } from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import {
  TextField,
  Button,
  Grid,
  DialogContent,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import { createStructuredSelector } from 'reselect';
import Languages from '../../_shared/Languages.jsx';
import { selectLanguageCode } from '../../../../Reducers/app/selectors.js';

const AddDialogContent = ({ parentId = -1, resources, onNodeAdded, onClose, languageCode }) => {
  const [node, setNode] = useState({
    Code: '',
    Name: '',
    LanguageCode: languageCode,
    Description: '',
    Children: [],
  });

  const onCodeChange = (event) => {
    setNode({ ...node, Code: event.target.value });
  };

  const onNameChange = (event) => {
    setNode({ ...node, Name: event.target.value });
  };

  const onLanguageChange = (languageCode) => {
    setNode({ ...node, LanguageCode: languageCode });
  };

  const onDefinitionChange = (event) => {
    setNode({ ...node, Description: event.target.value });
  };

  const onSubmit = () => {
    onNodeAdded(node);
  };

  const title =
    parentId === -1
      ? resources.ContentManagementClassif.AddRootNode
      : resources.ContentManagementClassif.AddNode;

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Wrapper>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label={resources.ContentManagementClassif.AddRootNodeCode}
                value={node.Code}
                onChange={onCodeChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label={resources.ContentManagementClassif.AddRootNodeName}
                value={node.Name}
                onChange={onNameChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <Languages selectedLanguageCode={node.LanguageCode} onChange={onLanguageChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={resources.ContentManagementClassif.NodeDefinition}
                value={node.Description}
                onChange={onDefinitionChange}
                fullWidth
                multiline
                rows="4"
                InputLabelProps={{
                  className: 'label-for-multiline',
                }}
              />
            </Grid>
          </Grid>
        </Wrapper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{resources.MetaResource.Cancel}</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmit}
          disabled={/^ *$/.test(node.Name)}
        >
          {resources.ContentManagementClassif.AddButton}
        </Button>
      </DialogActions>
    </>
  );
};

const Wrapper = styled.div`
  flex-grow: 1;
`;

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
});

export default connect(mapStateToProps)(AddDialogContent);