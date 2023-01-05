import React from 'react';
import { useLocation, useMatch, useNavigate, useParams } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const withRouter = (Component) => {
  const ComponentWithRouterProp = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const match = useMatch(location.pathname);

    return (
      <Component {...props} location={location} navigate={navigate} params={params} match={match} />
    );
  };

  return ComponentWithRouterProp;
};
