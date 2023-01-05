import React, { useState } from 'react';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import {
  TextField,
  Button,
  Grid,
  DialogContent,
  DialogActions,
  DialogTitle,
} from '@material-ui/core';
import { IClassificationNode } from '../../../../Reducers/classifications/types';
import { selectTranslatedResources } from '../../../../Reducers/app/selectors';

type Props = {
  node: IClassificationNode;
  onSubmit: (node: IClassificationNode) => void;
  onClose: () => void;
  resources: any;
};
const EditDialogContent: React.FC<Props> = ({ node, onSubmit, onClose, resources }) => {
  const [localNode, setLocalNode] = useState(node);

  const onCodeChangedHandler = (event) => {
    setLocalNode({ ...node, Code: event.target.value });
  };

  const onNameChangedHandler = (event) => {
    setLocalNode({ ...node, Name: event.target.value });
  };

  const onDefinitionChangedHandler = (event) => {
    setLocalNode({ ...node, Description: event.target.value });
  };

  const onClickHandler = () => {
    onSubmit(removeChildrenFromLocalNode(localNode));
  };

  const removeChildrenFromLocalNode = (nodeWithChildren: IClassificationNode) => {
    const newNode = nodeWithChildren;
    delete newNode.Children;
    return newNode;
  };

  if (node === null) {
    return null;
  }

  return (
    <>
      <DialogTitle>
        Edit
        {node.Name}
      </DialogTitle>
      <DialogContent>
        <Wrapper>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label={resources.ContentManagementClassif.AddRootNodeCode}
                value={localNode.Code}
                onChange={onCodeChangedHandler}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                required
                label={resources.ContentManagementClassif.AddRootNodeName}
                value={localNode.Name}
                onChange={onNameChangedHandler}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={resources.ContentManagementClassif.NodeDefinition}
                value={localNode.Description}
                onChange={onDefinitionChangedHandler}
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
          onClick={onClickHandler}
          disabled={/^ *$/.test(localNode.Name)}
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
  resources: selectTranslatedResources,
});

export default connect(mapStateToProps)(EditDialogContent);