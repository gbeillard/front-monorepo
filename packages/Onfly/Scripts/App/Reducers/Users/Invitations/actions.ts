import {
  InvitationDetails,
  FETCH_INVITATIONS,
  FETCH_INVITATIONS_SUCCESS,
  FETCH_INVITATIONS_ERROR,
  FetchInvitationsAction,
  FetchInvitationsSuccessAction,
  FetchInvitationsErrorAction,
} from './types';

export const fetchInvitations = (): FetchInvitationsAction => ({
  type: FETCH_INVITATIONS,
});

export const fetchInvitationsSuccess = (
  invitations: InvitationDetails[]
): FetchInvitationsSuccessAction => ({
  type: FETCH_INVITATIONS_SUCCESS,
  invitations,
});

export const fetchInvitationsError = (error: string): FetchInvitationsErrorAction => ({
  type: FETCH_INVITATIONS_ERROR,
  error,
});