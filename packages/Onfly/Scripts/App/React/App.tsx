import React from 'react';
import { useRoutes } from 'react-router-dom';
// CSS
import './Login/Styles/Login.scss';

import { routes } from './Navigation/routes';
import { useCypressInjection } from './Navigation/useCypressInjection';

const App: React.FC = () => {
  useCypressInjection('cyRoutes', routes);

  const element = useRoutes(routes);

  return element;
};

export default App;
