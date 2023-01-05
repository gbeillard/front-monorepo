import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core';
import moment from 'moment';
import { PropertyRequest as PropertyRequestType, Domain } from './definitions';
import RequestIcon from './RequestIcon';

const HoverableTableRow = withStyles({
  hover: {
    cursor: 'pointer',
  },
})(TableRow);

const DATE_FORMAT = 'dddd, DD MMMM YYYY';

const getDomainLabel = (request: PropertyRequestType, domains: Domain[]): string => {
  const domain = domains.find((domain) => domain.DomainId === request.DomainId);
  if (!domain) {
    return null;
  }

  return domain.DomainName;
};

type Props = {
  request: PropertyRequestType;
  domains: Domain[];
  onClick: (x: PropertyRequestType) => void;
};

const PropertyRequest: React.FC<Props> = ({ request, domains, onClick }) => {
  const domain = getDomainLabel(request, domains);
  const date = moment(request.RequestDate).format(DATE_FORMAT);

  return (
    <HoverableTableRow hover onClick={() => onClick(request)}>
      <TableCell>{request.Name}</TableCell>
      <TableCell>{domain}</TableCell>
      <TableCell>{request.RequesterName}</TableCell>
      <TableCell>{date}</TableCell>
      <TableCell>
        <RequestIcon status={request.RequestStatus} />
      </TableCell>
    </HoverableTableRow>
  );
};
export default PropertyRequest;