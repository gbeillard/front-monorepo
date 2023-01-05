import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@bim-co/componentui-foundation';
import styled from '@emotion/styled';
import { removeHTMLIndexLoader } from '../../Utils/utils';
import {connect} from "react-redux";

const WrapperCenter = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ButtonReturn = styled(Button)({
  marginTop: '10px',
});

type Props = {
  ManagementCloudId: number;
}

const Page404: React.FC<Props> = ({ManagementCloudId}) => {
  useEffect(() => {
    removeHTMLIndexLoader();
  }, []);

  return (
    <WrapperCenter>
      <div data-test-id="404-view">
        <h1>BIM&CO - Onfly</h1>
        <p>Error 404 page not found</p>
        {
            ManagementCloudId > 0 && (
            <WrapperCenter>
              <Link to="/">
                <ButtonReturn variant="primary">Return to home</ButtonReturn>
              </Link>
            </WrapperCenter>)
        }
      </div>
    </WrapperCenter>
  );
};

const mapStateToProps = ({ appState }) => ({
    ManagementCloudId: appState.ManagementCloudId,
});

export default connect(mapStateToProps)(Page404);
