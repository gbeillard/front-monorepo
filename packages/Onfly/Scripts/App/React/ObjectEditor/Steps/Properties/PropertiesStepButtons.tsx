import React from 'react';
import { PrevButton, NextButton } from '../../Editor';
import { redirectOptions } from './utils/redirectOptions';

type Props = {
  resources: any;
  handleOpenRevisionModal: (redirectOption: string) => boolean;
};

export const PropertiesStepButtons = ({
  resources,
  handleOpenRevisionModal,
}: Props): React.ReactElement => {
  const handleClickPrev = () => {
    handleOpenRevisionModal(redirectOptions.Prev);
  };

  const handleClickNext = () => {
    handleOpenRevisionModal(redirectOptions.Next);
  };

  return (
    <>
      <PrevButton resources={resources} onClick={handleClickPrev} />
      <NextButton resources={resources} onClick={handleClickNext} />
    </>
  );
};