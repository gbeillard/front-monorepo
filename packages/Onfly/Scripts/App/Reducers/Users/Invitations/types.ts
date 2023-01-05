export const FETCH_INVITATIONS = 'USERS/INVITATIONS/FETCH_INVITATIONS';
export const FETCH_INVITATIONS_SUCCESS = 'USERS/INVITATIONS/FETCH_INVITATIONS_SUCCESS';
export const FETCH_INVITATIONS_ERROR = 'USERS/INVITATIONS/FETCH_INVITATIONS_ERROR';

/*
    Models
*/

export type Invitations = {
  Email: string;
};

export type InvitationDetails = {
  Id: number;
  Email: string;
  Role: InvitationRole;
  User?: InvitationUser;
};

export type InvitationUser = {
  Id: number;
  FirstName: string;
  LastName: string;
  Avatar: string;
  City: string;
  Job: string;
};

export type InvitationRole = {
  Id: number;
};

/*
    Actions
*/

export type FetchInvitationsAction = {
  type: typeof FETCH_INVITATIONS;
};

export type FetchInvitationsSuccessAction = {
  type: typeof FETCH_INVITATIONS_SUCCESS;
  invitations: InvitationDetails[];
};

export type FetchInvitationsErrorAction = {
  type: typeof FETCH_INVITATIONS_ERROR;
  error: string;
};