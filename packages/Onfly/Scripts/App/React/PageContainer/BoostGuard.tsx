import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { selectIsBoostOffer, selectLanguageCode } from '../../Reducers/app/selectors';

type Props = {
  children: JSX.Element;
};

const BoostGuard = ({ children }: Props) => {
  const isBoostOffer = useSelector(selectIsBoostOffer);
  const languageCode = useSelector(selectLanguageCode);
  const { groupId, collectionId } = useParams();
  const location = useLocation();

  if (isBoostOffer && !groupId && !collectionId) {
    return <Navigate to={`/${languageCode}/files`} state={{ from: location }} replace />;
  }

  return children;
};

export default BoostGuard;
