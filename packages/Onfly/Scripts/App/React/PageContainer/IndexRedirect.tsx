import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useParams } from 'react-router-dom';
import { selectIsBoostOffer } from '../../Reducers/app/selectors';

const IndexRedirect = () => {
  const isBoostOffer = useSelector(selectIsBoostOffer);
  const { groupId, collectionId } = useParams();

  if (isBoostOffer && !groupId && !collectionId) {
    return <Navigate replace to="files" />;
  }

  return <Navigate replace to="bimobjects" />;
};

export default IndexRedirect;
