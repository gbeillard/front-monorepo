import React from 'react';
import { connect } from 'react-redux';
import { Tabs, Tab } from '@material-ui/core';
import { CREATE_CLASSIFICATION_STEPS } from '../Home/constants';
import mapSelectToTranslatedResources from '../../../Reducers/utils/mapSelectToTranslatedResources';

const Navbar = ({ step, onStepChange, resources }) => {
  const onChangeHandler = (event, updatedStep) => {
    onStepChange(updatedStep);
  };

  return (
    <Tabs
      variant="fullWidth"
      textColor="primary"
      indicatorColor="primary"
      value={step}
      onChange={onChangeHandler}
    >
      <Tab
        label={resources.ContentManagement.NavbarNewClassification}
        value={CREATE_CLASSIFICATION_STEPS.NEW}
        wrapped={false}
      />
      <Tab
        label={resources.ContentManagement.NavbarCloneClassification}
        value={CREATE_CLASSIFICATION_STEPS.COPY}
        wrapped={false}
      />
    </Tabs>
  );
};

export default connect(mapSelectToTranslatedResources)(Navbar);