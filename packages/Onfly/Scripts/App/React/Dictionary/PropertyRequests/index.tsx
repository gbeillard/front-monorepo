import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { space, TextField, Button } from '@bim-co/componentui-foundation';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Dialog from '@material-ui/core/Dialog';
import { createStructuredSelector } from 'reselect';
import styled from '@emotion/styled';
import { withStyles } from '@material-ui/core';
import { API_URL } from '../../../Api/constants';
import PropertyRequest from './PropertyRequest';
import {
  PropertyRequest as IPropertyRequest,
  Domain,
  Unit,
  EditType,
  DataType,
  ParameterType,
  PropertyRequestResponse,
} from './definitions';
import {
  selectLanguageCode,
  selectManagementCloudId,
  selectToken,
  selectTranslatedResources,
  selectRole,
  selectEnableDictionary,
} from '../../../Reducers/app/selectors';
import Editor from './Editor';
import { openModalCreateProperty } from '../../../Actions/create-property-actions';
import { selectSendPropertyRequestIsSuccess } from '../../../Reducers/PropertyRequests/selectors';

type Props = {
  languageCode: string;
  onflyId: number;
  token: string;
  resources: any;
  role: any;
  sendPropertyRequestIsSuccess: boolean;
  openModalCreateProperty: () => void;
  enableDictionary: boolean;
};

const Wrapper = styled.div({
  backgroundColor: 'white',
  position: 'fixed',
  top: '59px',
  left: '51px',
  bottom: 0,
  right: 0,
  overflowY: 'auto',
});
const Header = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '16px',
  borderBottom: '1px solid #ededed',
});
const Content = styled.div({
  padding: '16px',
});

const SmallerDialog = withStyles({
  paper: {
    maxHeight: '80vh',
  },
})(Dialog);

const SearchBarContainer = styled.div`
  min-width: ${space[2000]};
  margin: 0 ${space[50]};
`;

const fetchProperties = async (
  languageCode: string,
  onflyId: number,
  token: string,
  callback: (x: IPropertyRequest[]) => void
) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/${languageCode}/contentmanagement/${onflyId}/property/request?token=${token}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const json: IPropertyRequest[] = await response.json();
  callback(json);
};

const fetchDomains = async (
  languageCode: string,
  token: string,
  callback: (x: Domain[]) => void
) => {
  const response = await fetch(`${API_URL}/api/ws/v1/domain/list/${languageCode}?token=${token}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const json: Domain[] = await response.json();
  callback(json);
};

const fetchUnits = async (languageCode: string, token: string, callback: (x: Unit[]) => void) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/property/unit/list/${languageCode}?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const json: Unit[] = await response.json();
  callback(json);
};

const fetchEditTypes = async (
  languageCode: string,
  token: string,
  callback: (x: EditType[]) => void
) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/property/edittype/list/${languageCode}?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const json: EditType[] = await response.json();
  callback(json);
};

const fetchDataTypes = async (
  languageCode: string,
  token: string,
  callback: (x: DataType[]) => void
) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/property/datatype/list/${languageCode}?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const json: DataType[] = await response.json();
  callback(json);
};

const fetchParametersTypes = async (
  languageCode: string,
  token: string,
  callback: (x: ParameterType[]) => void
) => {
  const response = await fetch(
    `${API_URL}/api/ws/v1/property/parametertype/list/${languageCode}?token=${token}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  const json: ParameterType[] = await response.json();
  callback(json);
};

const getFilteredRequests = (requests: IPropertyRequest[], filter: string): IPropertyRequest[] => {
  if (filter.length < 3) {
    return requests;
  }

  return requests.filter((request) => request.Name.toLowerCase().includes(filter.toLowerCase()));
};

const PropertyRequests: React.FC<Props> = ({
  languageCode,
  onflyId,
  token,
  resources,
  role,
  sendPropertyRequestIsSuccess,
  openModalCreateProperty,
  enableDictionary,
}) => {
  const [filter, setFilter] = useState('');
  const [requests, setRequests] = useState<IPropertyRequest[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [editTypes, setEditTypes] = useState<EditType[]>([]);
  const [dataTypes, setDataTypes] = useState<DataType[]>([]);
  const [parameterTypes, setParameterTypes] = useState<ParameterType[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<IPropertyRequest>(null);

  const onClickHandler = (request: IPropertyRequest) => {
    setSelectedRequest(request);
  };

  const close = () => {
    setSelectedRequest(null);
  };

  const sendResponseHandler = async (requestResponse: PropertyRequestResponse) => {
    const url = `${API_URL}/api/ws/v1/${languageCode}/contentmanagement/${onflyId}/property/request/update?token=${token}`;
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestResponse),
    };
    const response = await fetch(url, options);
    if (response.status === 200) {
      close();
      fetchProperties(languageCode, onflyId, token, setRequests);
    }
  };

  useEffect(() => {
    fetchProperties(languageCode, onflyId, token, setRequests);
    fetchUnits(languageCode, token, setUnits);
    fetchEditTypes(languageCode, token, setEditTypes);
    fetchDataTypes(languageCode, token, setDataTypes);
    fetchParametersTypes(languageCode, token, setParameterTypes);
  }, []);

  useEffect(() => {
    fetchDomains(languageCode, token, setDomains);
  }, [languageCode]);

  // Load property requests list after send a new property request
  useEffect(() => {
    if (sendPropertyRequestIsSuccess) {
      fetchProperties(languageCode, onflyId, token, setRequests);
    }
  }, [sendPropertyRequestIsSuccess]);

  const filteredRequests = getFilteredRequests(requests, filter);
  const propertyList = filteredRequests.map((request) => (
    <PropertyRequest
      key={request.Id}
      request={request}
      domains={domains}
      onClick={onClickHandler}
    />
  ));

  if (!enableDictionary) {
    return (
      <div className="text-center">
        <h1 className="loadingtext">BIM&CO - ONFLY</h1>
        <p>{resources.ContentManagement.Error403}</p>
      </div>
    );
  }

  return (
    <Wrapper>
      <Header>
        <SearchBarContainer>
          <TextField
            placeholder={resources.ContentManagement.PropertiesSearchPlaceholder}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            iconLeft="search"
          />
        </SearchBarContainer>
        {['validator', 'object_creator'].includes(role.key) && (
          <Button variant="secondary" onClick={openModalCreateProperty}>
            {resources.ContentManagement.PropertyRequestAskNewProperty}
          </Button>
        )}
      </Header>
      <Content>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{resources.ContentManagement.PropertiesRequestName}</TableCell>
              <TableCell>{resources.ContentManagement.PropertiesRequestDomain}</TableCell>
              <TableCell>{resources.ContentManagement.PropertiesRequestRequestedBy}</TableCell>
              <TableCell>{resources.ContentManagement.PropertiesRequestDate}</TableCell>
              <TableCell>{resources.ContentManagement.PropertiesRequestState}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{propertyList}</TableBody>
        </Table>
      </Content>
      <SmallerDialog
        open={selectedRequest !== null}
        onClose={close}
        style={{ zIndex: 3200 }}
        fullWidth
        maxWidth="md"
      >
        {selectedRequest !== null && (
          <Editor
            request={selectedRequest}
            domains={domains}
            units={units}
            editTypes={editTypes}
            dataTypes={dataTypes}
            parameterTypes={parameterTypes}
            sendResponse={sendResponseHandler}
          />
        )}
      </SmallerDialog>
    </Wrapper>
  );
};

const mapStateToProps = createStructuredSelector({
  languageCode: selectLanguageCode,
  onflyId: selectManagementCloudId,
  token: selectToken,
  resources: selectTranslatedResources,
  role: selectRole,
  sendPropertyRequestIsSuccess: selectSendPropertyRequestIsSuccess,
  enableDictionary: selectEnableDictionary,
});

const mapDispatchToProps = (dispatch) => ({
  openModalCreateProperty: () => dispatch(openModalCreateProperty()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PropertyRequests);