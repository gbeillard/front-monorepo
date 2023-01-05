import React from 'react';
import { CircularProgress } from '@material-ui/core';

type LoaderProps = {
  text?: string;
};

/**
 * A loader for Plugin components
 * @param {object}
 */
const Loader: React.FC<LoaderProps> = ({ text }) => (
  <div id="loader-spinner" className="loader-page-empty full-page">
    <CircularProgress />
    {text && <div className="left-10">{text}</div>}
  </div>
);

export default React.memo(Loader);